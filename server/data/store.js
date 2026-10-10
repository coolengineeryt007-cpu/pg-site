import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In Vercel serverless environment, the filesystem is read-only except /tmp
const DB_FILE = process.env.VERCEL
  ? path.join('/tmp', 'db.json')
  : path.join(__dirname, 'db.json');

const BUNDLED_DB = path.join(__dirname, 'db.json');

// Memory cache for fast response times in serverless executions
let memoryCache = null;

// Read JSON file safely
const readJsonFile = () => {
  try {
    // If running in Vercel and /tmp/db.json doesn't exist yet, seed it from bundled db.json
    if (process.env.VERCEL && !fs.existsSync(DB_FILE)) {
      if (fs.existsSync(BUNDLED_DB)) {
        try {
          const dir = path.dirname(DB_FILE);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          fs.copyFileSync(BUNDLED_DB, DB_FILE);
        } catch (copyErr) {
          console.warn('Could not copy to /tmp/db.json:', copyErr.message);
        }
      }
    }

    const targetFile = fs.existsSync(DB_FILE) ? DB_FILE : BUNDLED_DB;
    if (fs.existsSync(targetFile)) {
      const raw = fs.readFileSync(targetFile, 'utf-8');
      const data = JSON.parse(raw);
      if (!Array.isArray(data.inquiries)) data.inquiries = [];
      if (!Array.isArray(data.pgs)) data.pgs = [];
      if (!Array.isArray(data.users)) data.users = [];
      if (!Array.isArray(data.blogs)) data.blogs = [];
      if (!Array.isArray(data.reviews)) data.reviews = [];
      return data;
    }
  } catch (err) {
    console.error('Error reading JSON DB file:', err);
  }
  return { users: [], pgs: [], blogs: [], inquiries: [], reviews: [] };
};

const writeJsonFile = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing to JSON DB file:', err);
    return false;
  }
};

// Initialize Database
export async function initDatabase() {
  memoryCache = readJsonFile();
  console.log(`📄 Vercel JSON Store initialized with ${memoryCache.pgs?.length || 0} listings, ${memoryCache.blogs?.length || 0} blogs.`);
  return true;
}

// Immediate eager initialization attempt
try {
  memoryCache = readJsonFile();
} catch (err) {
  console.warn('Initial DB read warning:', err.message);
}

export const isMySQLActive = () => false;

export const readDB = () => {
  if (memoryCache) {
    return memoryCache;
  }
  memoryCache = readJsonFile();
  return memoryCache;
};

export const getDB = async () => {
  return readDB();
};

export const writeDB = (data) => {
  memoryCache = data;
  writeJsonFile(data);
  return true;
};

// Haversine formula to compute distance between two lat/lng in kilometers
export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) return null;
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // Round to 1 decimal place (e.g. 1.4 km)
};

// 1. Users
export async function findUserByEmail(email) {
  if (!email) return null;
  const cleanEmail = email.trim().toLowerCase();
  const db = readDB();
  return db.users.find(u => u.email.toLowerCase() === cleanEmail) || null;
}

export async function createUser(user) {
  const db = readDB();
  db.users.push(user);
  writeDB(db);
  return user;
}

export async function getUserById(id) {
  if (!id) return null;
  const db = readDB();
  return db.users.find(u => u.id === id) || null;
}

export async function updateUserSubscription(userId, subscription) {
  if (!userId) return null;
  const db = readDB();
  const u = db.users.find(user => user.id === userId);
  if (u) {
    u.subscription = subscription;
    writeDB(db);
  }
  return subscription;
}

export async function getUserSubscription(userId) {
  const user = await getUserById(userId);
  if (!user) return null;

  if (user.role !== 'owner') {
    return {
      status: 'exempt',
      role: user.role,
      message: 'Subscription is only required for Property Hosts/Owners'
    };
  }

  let sub = user.subscription;
  if (!sub || !sub.status) {
    return {
      status: 'pending_payment',
      planId: 'owner_partner_autopay',
      initialAmount: 99,
      recurringAmount: 99,
      currency: 'INR',
      currencySymbol: '₹',
      billingCycleDays: 30,
      autopayEnabled: false,
      message: 'Initial Host Partner Activation of ₹99 required with 30-day recurring autopay (₹99).'
    };
  }

  // Check 30-day autopay auto-cut condition
  const now = new Date();
  if (sub.status === 'active' && sub.autopayEnabled && sub.nextBillingDate) {
    const nextDate = new Date(sub.nextBillingDate);
    if (now >= nextDate) {
      console.log(`⚡ [AUTOPAY] 30 days elapsed for owner ${userId}. Auto-cutting ₹${sub.recurringAmount || 99} via ${sub.autopayMethod || 'UPI Autopay'}...`);
      const invId = `INV-${Date.now().toString().slice(-4)}`;
      const recurringInvoice = {
        id: invId,
        amount: sub.recurringAmount || 99,
        type: 'recurring_autopay',
        description: '30-Day Coliving Listing Maintenance (Autopay)',
        method: sub.autopayMethod || 'UPI Autopay',
        mandateId: sub.mandateId || 'MNDT-UPI-AUTO',
        transactionRef: `TXN-REC-${Date.now().toString().slice(-6)}`,
        date: now.toISOString(),
        status: 'paid'
      };

      sub.invoices = [recurringInvoice, ...(sub.invoices || [])];
      sub.lastPaymentDate = now.toISOString();
      sub.nextBillingDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
      await updateUserSubscription(userId, sub);
    }
  }

  const daysRemaining = sub.nextBillingDate
    ? Math.max(0, Math.ceil((new Date(sub.nextBillingDate) - now) / (1000 * 60 * 60 * 24)))
    : 0;

  return {
    ...sub,
    daysRemaining
  };
}

export async function activateOwnerSubscription(userId, details = {}) {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const now = new Date();
  const nextBilling = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const mandateId = `MNDT-UPI-${Date.now().toString().slice(-6)}`;
  const transactionRef = `TXN-ACT-${Date.now().toString().slice(-6)}`;
  const invoiceId = `INV-${Date.now().toString().slice(-4)}`;
  const initialAmount = Number(details.amount || 99);
  const recurringAmount = Number(details.recurringAmount || 99);
  const method = details.paymentMethod || 'UPI Autopay';

  const subscription = {
    status: 'active',
    planId: 'owner_partner_autopay',
    planName: 'Prestige Host Partner Plan',
    initialAmount,
    recurringAmount,
    currency: 'INR',
    currencySymbol: '₹',
    billingCycleDays: 30,
    autopayEnabled: true,
    autopayMethod: method,
    upiId: details.upiId || 'owner@okhdfcbank',
    mandateId,
    transactionRef,
    startedAt: now.toISOString(),
    lastPaymentDate: now.toISOString(),
    nextBillingDate: nextBilling.toISOString(),
    invoices: [
      {
        id: invoiceId,
        amount: initialAmount,
        type: 'initial_activation',
        description: 'Host Partner Initial Activation + 30-Day Pass',
        method,
        mandateId,
        transactionRef,
        date: now.toISOString(),
        status: 'paid'
      }
    ]
  };

  await updateUserSubscription(userId, subscription);

  return {
    success: true,
    message: '₹99 Initial Payment & ₹30/month Autopay Mandate Authorized Successfully!',
    subscription: {
      ...subscription,
      daysRemaining: 30
    }
  };
}

export async function triggerRecurringAutopayDeduction(userId) {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  let sub = user.subscription;
  if (!sub || sub.status !== 'active') {
    throw new Error('Cannot process recurring deduction: No active subscription found');
  }

  const now = new Date();
  const invId = `INV-${Date.now().toString().slice(-4)}`;
  const recurringAmount = sub.recurringAmount || 99;
  const recurringInvoice = {
    id: invId,
    amount: recurringAmount,
    type: 'recurring_autopay',
    description: '30-Day Coliving Listing Maintenance (Autopay)',
    method: sub.autopayMethod || 'UPI Autopay',
    mandateId: sub.mandateId || `MNDT-UPI-${Date.now().toString().slice(-6)}`,
    transactionRef: `TXN-REC-${Date.now().toString().slice(-6)}`,
    date: now.toISOString(),
    status: 'paid'
  };

  sub.invoices = [recurringInvoice, ...(sub.invoices || [])];
  sub.lastPaymentDate = now.toISOString();
  const baseDate = sub.nextBillingDate && new Date(sub.nextBillingDate) > now
    ? new Date(sub.nextBillingDate)
    : now;
  sub.nextBillingDate = new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
  sub.status = 'active';

  await updateUserSubscription(userId, sub);

  const daysRemaining = Math.max(0, Math.ceil((new Date(sub.nextBillingDate) - now) / (1000 * 60 * 60 * 24)));

  return {
    success: true,
    message: `₹${recurringAmount} recurring autopay payment successfully deducted! Next deduction scheduled in 30 days.`,
    subscription: {
      ...sub,
      daysRemaining
    }
  };
}

export async function cancelOwnerSubscription(userId) {
  const user = await getUserById(userId);
  if (!user || !user.subscription) {
    throw new Error('Subscription not found');
  }

  user.subscription.autopayEnabled = false;
  user.subscription.status = 'cancelled';
  user.subscription.cancelledAt = new Date().toISOString();

  await updateUserSubscription(userId, user.subscription);

  return {
    success: true,
    message: 'Autopay mandate cancelled. Your access will remain active until the end of your current 30-day billing cycle.',
    subscription: user.subscription
  };
}

export async function getAllOwnerSubscriptions() {
  const db = await getDB();
  const owners = (db.users || []).filter(u => u.role === 'owner');

  let totalRevenue = 0;
  let activeMandates = 0;
  let totalInvoices = 0;
  const allInvoices = [];

  const ownerSubscriptions = owners.map(o => {
    const sub = o.subscription || {};
    const invoices = Array.isArray(sub.invoices) ? sub.invoices : [];

    if (sub.status === 'active' && sub.autopayEnabled) {
      activeMandates++;
    }

    invoices.forEach(inv => {
      totalRevenue += Number(inv.amount || 99);
      totalInvoices++;
      allInvoices.push({
        ...inv,
        ownerId: o.id,
        ownerName: o.name,
        ownerEmail: o.email,
        ownerPhone: o.phone || '',
        mandateId: inv.mandateId || sub.mandateId || 'MNDT-UPI-AUTO',
        autopayMethod: inv.method || sub.autopayMethod || 'UPI Autopay',
        planName: sub.planName || 'Prestige Host Partner Plan'
      });
    });

    const now = new Date();
    const daysRemaining = sub.nextBillingDate
      ? Math.max(0, Math.ceil((new Date(sub.nextBillingDate) - now) / (1000 * 60 * 60 * 24)))
      : 0;

    return {
      ownerId: o.id,
      name: o.name,
      email: o.email,
      phone: o.phone,
      joinedAt: o.createdAt,
      subscription: {
        ...sub,
        daysRemaining
      }
    };
  });

  allInvoices.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  return {
    totalRevenue,
    activeMandates,
    totalOwners: owners.length,
    totalInvoices,
    ownerSubscriptions,
    allInvoices
  };
}

// 2. PGs
export async function getAllPgs() {
  return readDB().pgs;
}

export async function getPgById(id) {
  return readDB().pgs.find(p => p.id === id) || null;
}

export async function createPg(pgData) {
  const db = readDB();
  db.pgs.unshift(pgData);
  writeDB(db);
  return pgData;
}

export async function updatePg(id, updatedData) {
  const db = readDB();
  const index = db.pgs.findIndex(p => p.id === id);
  if (index !== -1) {
    db.pgs[index] = { ...db.pgs[index], ...updatedData };
    writeDB(db);
    return db.pgs[index];
  }
  return updatedData;
}

export async function updatePgStatus(id, status, reason = null) {
  const db = readDB();
  const pg = db.pgs.find(p => p.id === id);
  if (pg) {
    pg.status = status;
    if (reason !== undefined) pg.statusReason = reason;
    pg.statusUpdatedAt = new Date().toISOString();
    writeDB(db);
    return pg;
  }
  return null;
}

export async function deletePg(id) {
  const db = readDB();
  const index = db.pgs.findIndex(p => p.id === id);
  if (index !== -1) {
    db.pgs.splice(index, 1);
    writeDB(db);
    return true;
  }
  return false;
}

// 3. Blogs
export async function getAllBlogs() {
  return readDB().blogs;
}

export async function getBlogBySlug(slug) {
  return readDB().blogs.find(b => b.slug === slug || b.id === slug) || null;
}

// 4. Inquiries
export async function createInquiry(inquiry) {
  const db = readDB();
  db.inquiries.unshift(inquiry);
  writeDB(db);
  return inquiry;
}

export async function getInquiries(ownerId = null) {
  let list = readDB().inquiries;
  if (ownerId) {
    list = list.filter(i => i.ownerId === ownerId);
  }
  return list;
}

// 5. Reviews
export async function getReviews(pgId = null) {
  let list = readDB().reviews || [];
  if (pgId) {
    list = list.filter(r => r.pgId === pgId);
  }
  return list;
}

// 6. Stats
export async function getStats() {
  const pgs = await getAllPgs();
  const db = await getDB();
  const users = db.users || [];
  const inquiries = db.inquiries || [];
  const blogs = db.blogs || [];

  const owners = users.filter(u => u.role === 'owner');
  let totalRevenue = 0;
  let activeMandates = 0;

  owners.forEach(o => {
    const sub = o.subscription || {};
    if (sub.status === 'active' && sub.autopayEnabled) activeMandates++;
    (sub.invoices || []).forEach(inv => {
      totalRevenue += Number(inv.amount || 99);
    });
  });

  return {
    totalPgs: pgs.length,
    approvedPgs: pgs.filter(p => p.status === 'approved').length,
    pendingApprovals: pgs.filter(p => p.status === 'pending_review').length,
    draftPgs: pgs.filter(p => p.status === 'draft').length,
    totalOwners: owners.length,
    activeMandates,
    totalRevenue,
    totalInquiries: inquiries.length,
    totalBlogs: blogs.length,
    databaseEngine: 'JSON Store (Vercel Serverless Ready)'
  };
}
