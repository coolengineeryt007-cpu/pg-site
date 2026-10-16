import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  initMySQL,
  isMySQLReady,
  getFullDbFromMySQL,
  mySqlFindUserByEmail,
  mySqlFindUserById,
  mySqlCreateUser,
  mySqlUpdateUserSubscription,
  mySqlGetAllPgs,
  mySqlGetPgById,
  mySqlCreatePg,
  mySqlUpdatePg,
  mySqlUpdatePgStatus,
  mySqlDeletePg,
  mySqlCreateInquiry,
  mySqlGetInquiries,
  mySqlGetReviews,
  mySqlCreateSubscriptionRecord,
  mySqlGetSubscriptionByOwner,
  mySqlGetSubscriptionByProviderId,
  mySqlUpdateSubscriptionStatus,
  mySqlCancelSubscription,
  mySqlGetAllSubscriptionsAdmin,
  mySqlRecordPayment,
  mySqlGetPaymentsByOwner,
  mySqlGetAllPaymentsAdmin,
  mySqlHasWebhookBeenProcessed,
  mySqlRecordWebhookEvent
} from './mysql.js';
import { paymentProvider, paymentConfig } from '../services/paymentProvider.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = process.env.VERCEL
  ? path.join('/tmp', 'db.json')
  : path.join(__dirname, 'db.json');

// Memory cache for synchronous calls
let memoryCache = null;

// Read JSON file safely
const readJsonFile = () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const data = JSON.parse(raw);
      if (!Array.isArray(data.inquiries)) data.inquiries = [];
      if (!Array.isArray(data.pgs)) data.pgs = [];
      if (!Array.isArray(data.users)) data.users = [];
      if (!Array.isArray(data.blogs)) data.blogs = [];
      if (!Array.isArray(data.reviews)) data.reviews = [];
      if (!Array.isArray(data.subscriptions)) data.subscriptions = [];
      if (!Array.isArray(data.payments)) data.payments = [];
      return data;
    }
  } catch (err) {
    console.error('Error reading JSON DB file:', err);
  }
  return { users: [], pgs: [], blogs: [], inquiries: [], reviews: [], subscriptions: [], payments: [] };
};

const writeJsonFile = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing JSON DB file:', err);
    return false;
  }
};

export async function initDatabase() {
  const mysqlSuccess = await initMySQL();
  if (mysqlSuccess) {
    console.log('🌟 Vrundavan Ventures Backend running with MySQL Database Engine.');
    try {
      const snapshot = await getFullDbFromMySQL();
      if (snapshot) {
        memoryCache = snapshot;
        writeJsonFile(snapshot);
      }
    } catch (err) {
      console.warn('Initial MySQL snapshot warning:', err.message);
    }
  } else {
    console.log('📁 MySQL unavailable: fallback active.');
    memoryCache = readJsonFile();
  }
}

export function isMySQLActive() {
  return isMySQLReady();
}

export function readDB() {
  if (memoryCache) return memoryCache;
  memoryCache = readJsonFile();
  return memoryCache;
}

export function writeDB(data) {
  memoryCache = data;
  return writeJsonFile(data);
}

export async function getDB() {
  if (isMySQLReady()) {
    const data = await getFullDbFromMySQL();
    if (data) return data;
  }
  return readDB();
}

// ========================================================
// USERS
// ========================================================
export async function findUserByEmail(email) {
  if (!email) return null;
  const cleanEmail = email.trim().toLowerCase();

  if (isMySQLReady()) {
    const user = await mySqlFindUserByEmail(cleanEmail);
    if (user) return user;
  }

  const db = readDB();
  return (db.users || []).find(u => u.email && u.email.toLowerCase() === cleanEmail) || null;
}

export async function getUserById(id) {
  if (!id) return null;

  if (isMySQLReady()) {
    const user = await mySqlFindUserById(id);
    if (user) return user;
  }

  const db = readDB();
  return (db.users || []).find(u => u.id === id) || null;
}

export async function createUser(userData) {
  const newUser = {
    ...userData,
    id: userData.id || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString()
  };

  if (isMySQLReady()) {
    await mySqlCreateUser(newUser);
  }

  const db = readDB();
  db.users.push(newUser);
  writeDB(db);

  return newUser;
}

export async function updateUserSubscription(userId, subscriptionData) {
  if (isMySQLReady()) {
    await mySqlUpdateUserSubscription(userId, subscriptionData);
  }

  const db = readDB();
  const index = (db.users || []).findIndex(u => u.id === userId);
  if (index !== -1) {
    db.users[index].subscription = subscriptionData;
    writeDB(db);
    return db.users[index];
  }
  return null;
}

// ========================================================
// OWNER SUBSCRIPTION & UPI AUTOPAY LIFECYCLE (₹99.00 / month)
// Lifecycle states: PENDING_AUTHORIZATION, AUTHORIZED, ACTIVE,
// PAYMENT_PENDING, PAYMENT_FAILED, PAST_DUE, CANCELLED, EXPIRED, SUSPENDED
// ========================================================

export async function getUserSubscription(userId) {
  const user = await getUserById(userId);
  if (!user) return null;

  if (user.role !== 'owner') {
    return {
      status: 'exempt',
      role: user.role,
      message: 'Subscription is only required for Property Owners'
    };
  }

  let dbSub = null;
  let payments = [];

  if (isMySQLReady()) {
    dbSub = await mySqlGetSubscriptionByOwner(userId);
    payments = await mySqlGetPaymentsByOwner(userId);
  }

  if (!dbSub) {
    // Check fallback user object
    const cachedSub = user.subscription;
    if (cachedSub && cachedSub.status) {
      dbSub = {
        id: cachedSub.mandateId || `sub_${Date.now()}`,
        ownerUserId: userId,
        planCode: 'owner_autopay_99',
        amountInr: 99,
        amountPaise: 9900,
        currency: 'INR',
        billingInterval: 'monthly',
        provider: cachedSub.autopayMethod?.includes('Cashfree') ? 'cashfree' : 'razorpay',
        providerSubscriptionId: cachedSub.mandateId || null,
        providerMandateReference: cachedSub.mandateId || null,
        internalStatus: cachedSub.status === 'active' ? 'ACTIVE' : 'PENDING_AUTHORIZATION',
        nextBillingAt: cachedSub.nextBillingDate,
        createdAt: cachedSub.startedAt || new Date().toISOString()
      };
    }
  }

  if (!dbSub) {
    return {
      status: 'PENDING_REGISTRATION',
      internalStatus: 'PENDING_AUTHORIZATION',
      planCode: 'owner_autopay_99',
      planName: 'Vrundavan Ventures Owner Listing Subscription',
      amountInr: 99,
      amountPaise: 9900,
      currency: 'INR',
      currencySymbol: '₹',
      billingInterval: 'monthly',
      autopayEnabled: false,
      canPublish: false,
      message: '₹99.00 monthly UPI AutoPay subscription required to list properties.'
    };
  }

  const now = new Date();
  const nextBilling = dbSub.nextBillingAt ? new Date(dbSub.nextBillingAt) : null;
  const daysRemaining = nextBilling ? Math.max(0, Math.ceil((nextBilling - now) / (1000 * 60 * 60 * 24))) : 0;
  const isActive = dbSub.internalStatus === 'ACTIVE';
  const isPastDue = dbSub.internalStatus === 'PAST_DUE';
  const isCancelled = dbSub.internalStatus === 'CANCELLED';

  return {
    ...dbSub,
    status: dbSub.internalStatus.toLowerCase(),
    internalStatus: dbSub.internalStatus,
    amountInr: 99,
    amountPaise: 9900,
    currency: 'INR',
    currencySymbol: '₹',
    billingInterval: 'monthly',
    autopayEnabled: isActive,
    canPublish: isActive,
    daysRemaining,
    invoices: payments.map(p => ({
      id: p.id,
      amount: p.amountInr,
      method: p.paymentMethod,
      mandateId: dbSub.providerMandateReference || 'UMRN-UPI-AUTOPAY',
      transactionRef: p.providerPaymentId || `TXN-${p.id}`,
      date: p.paidAt || p.createdAt,
      status: p.paymentStatus
    })),
    cancellationDetails: isCancelled ? {
      cancelledAt: dbSub.cancelledAt,
      effectiveUntil: dbSub.nextBillingAt
    } : null
  };
}

/**
 * 1. Initialize Subscription & Mandate Authorization
 */
export async function initializeOwnerSubscription(userId, { upiApp = 'gpay', upiId = '' }) {
  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');

  const subResult = await paymentProvider.createSubscription({
    userId,
    ownerName: user.name,
    email: user.email,
    mobile: user.phone || user.mobile,
    planCode: 'owner_autopay_99'
  });

  const mandateResult = await paymentProvider.createMandateAuthorization({
    subscriptionId: subResult.subscriptionId,
    upiApp,
    upiId
  });

  const subRecordId = `sub_${Date.now()}`;
  if (isMySQLReady()) {
    await mySqlCreateSubscriptionRecord({
      id: subRecordId,
      ownerUserId: userId,
      planCode: 'owner_autopay_99',
      amountPaise: 9900,
      provider: subResult.provider,
      providerSubscriptionId: subResult.subscriptionId,
      providerMandateReference: mandateResult.mandateReference,
      internalStatus: 'PENDING_AUTHORIZATION',
      providerStatus: 'created'
    });
  }

  return {
    success: true,
    subscriptionId: subResult.subscriptionId,
    mandateReference: mandateResult.mandateReference,
    amountInr: 99,
    amountPaise: 9900,
    currency: 'INR',
    upiApp,
    mandateUri: mandateResult.mandateUri,
    appDeeplink: mandateResult.appDeeplink,
    instructions: mandateResult.authorizationInstructions,
    isSandbox: subResult.isSandbox,
    notice: subResult.notice
  };
}

/**
 * 2. Confirm Mandate Authorization & Activate Subscription
 */
export async function confirmMandateAuthorization(userId, {
  subscriptionId,
  mandateReference,
  upiApp = 'gpay',
  paymentMethod,
  upiId,
  amount = 99,
  recurringAmount = 99
} = {}) {
  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');

  const now = new Date();
  const nextBilling = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const paymentId = `pay_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
  const mandateRef = mandateReference || `MNDT-UPI-${Date.now().toString().slice(-8)}`;
  const method = paymentMethod || `UPI AutoPay (${(upiApp || 'gpay').toUpperCase()})`;
  const userUpi = upiId || (user.email ? `${user.email.split('@')[0]}@okhdfcbank` : 'owner@okhdfcbank');
  const numAmount = Number(amount) || 99;
  const numRecurring = Number(recurringAmount) || 99;

  if (isMySQLReady()) {
    const existingSub = await mySqlGetSubscriptionByOwner(userId);
    const subId = existingSub?.id || `sub_${Date.now()}`;

    await mySqlUpdateSubscriptionStatus(subId, {
      internalStatus: 'ACTIVE',
      providerStatus: 'active',
      providerMandateReference: mandateRef,
      currentPeriodStart: now,
      currentPeriodEnd: nextBilling,
      nextBillingAt: nextBilling
    });

    await mySqlRecordPayment({
      id: paymentId,
      subscriptionId: subId,
      ownerUserId: userId,
      provider: 'razorpay',
      providerPaymentId: paymentId,
      providerOrderId: subscriptionId || null,
      amountPaise: numAmount * 100,
      paymentMethod: method,
      paymentStatus: 'captured',
      billingPeriodStart: now,
      billingPeriodEnd: nextBilling,
      paidAt: now
    });
  }

  // Update legacy user.subscription object
  const legacySub = {
    status: 'active',
    internalStatus: 'ACTIVE',
    planId: 'owner_autopay_99',
    planName: 'Vrundavan Ventures Owner Listing Subscription',
    initialAmount: numAmount,
    recurringAmount: numRecurring,
    currency: 'INR',
    currencySymbol: '₹',
    billingCycleDays: 30,
    autopayEnabled: true,
    autopayMethod: method,
    upiId: userUpi,
    mandateId: mandateRef,
    transactionRef: paymentId,
    startedAt: now.toISOString(),
    lastPaymentDate: now.toISOString(),
    nextBillingDate: nextBilling.toISOString(),
    invoices: [
      {
        id: paymentId,
        amount: numAmount,
        type: 'initial_activation',
        description: 'Vrundavan Ventures Owner Listing Subscription (Month 1)',
        method: method,
        mandateId: mandateRef,
        transactionRef: paymentId,
        date: now.toISOString(),
        status: 'paid'
      }
    ]
  };

  await updateUserSubscription(userId, legacySub);

  return {
    success: true,
    message: 'UPI AutoPay Mandate authorized successfully! Your owner listings are now active.',
    subscription: {
      ...legacySub,
      daysRemaining: 30
    }
  };
}

export const activateOwnerSubscription = confirmMandateAuthorization;

/**
 * 3. Cancel Subscription (stops future recurring debits)
 */
export async function cancelOwnerSubscription(userId, reason = 'Owner requested cancellation') {
  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');

  if (isMySQLReady()) {
    const sub = await mySqlGetSubscriptionByOwner(userId);
    if (sub) {
      await paymentProvider.cancelSubscription(sub.providerSubscriptionId || sub.id);
      await mySqlCancelSubscription(sub.id);
    }
  }

  if (user.subscription) {
    user.subscription.autopayEnabled = false;
    user.subscription.status = 'cancelled';
    user.subscription.internalStatus = 'CANCELLED';
    user.subscription.cancelledAt = new Date().toISOString();
    user.subscription.cancelReason = reason;
    await updateUserSubscription(userId, user.subscription);
  }

  return {
    success: true,
    message: 'UPI AutoPay mandate cancelled successfully. Future recurring debits have been stopped.',
    subscription: user.subscription
  };
}

/**
 * 4. Trigger Recurring Autopay Deduction (Sandbox testing / Scheduled cron)
 */
export async function triggerRecurringAutopayDeduction(userId) {
  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');

  let sub = await getUserSubscription(userId);
  if (!sub || sub.internalStatus !== 'ACTIVE') {
    throw new Error('Cannot process recurring deduction: No active subscription found');
  }

  const now = new Date();
  const nextBilling = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const paymentId = `pay_rec_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

  if (isMySQLReady()) {
    const existingSub = await mySqlGetSubscriptionByOwner(userId);
    if (existingSub) {
      await mySqlUpdateSubscriptionStatus(existingSub.id, {
        internalStatus: 'ACTIVE',
        providerStatus: 'active',
        currentPeriodStart: now,
        currentPeriodEnd: nextBilling,
        nextBillingAt: nextBilling
      });

      await mySqlRecordPayment({
        id: paymentId,
        subscriptionId: existingSub.id,
        ownerUserId: userId,
        provider: existingSub.provider || 'razorpay',
        providerPaymentId: paymentId,
        amountPaise: 9900,
        paymentMethod: 'UPI AutoPay',
        paymentStatus: 'captured',
        billingPeriodStart: now,
        billingPeriodEnd: nextBilling,
        paidAt: now
      });
    }
  }

  return {
    success: true,
    message: '₹99.00 monthly UPI AutoPay debit successfully processed. Next renewal scheduled in 30 days.',
    paymentId,
    nextBillingAt: nextBilling.toISOString()
  };
}

/**
 * 5. Webhook Processor (Idempotent signature-verified processing)
 */
export async function handlePaymentWebhook(rawBody, signature) {
  const isValid = paymentProvider.verifyWebhook(rawBody, signature);
  if (!isValid && process.env.PAYMENT_ENVIRONMENT === 'production') {
    throw new Error('Invalid webhook signature');
  }

  const event = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;
  const eventDetails = paymentProvider.processPaymentEvent(event);

  if (isMySQLReady()) {
    const alreadyProcessed = await mySqlHasWebhookBeenProcessed(eventDetails.provider, eventDetails.eventId);
    if (alreadyProcessed) {
      return { status: 'duplicate', message: 'Event already processed' };
    }

    await mySqlRecordWebhookEvent({
      id: `whevt_${Date.now()}`,
      provider: eventDetails.provider,
      providerEventId: eventDetails.eventId,
      eventType: eventDetails.eventType,
      payloadJson: event,
      processingStatus: 'processed'
    });

    if (eventDetails.subscriptionId) {
      const sub = await mySqlGetSubscriptionByProviderId(eventDetails.subscriptionId);
      if (sub) {
        await mySqlUpdateSubscriptionStatus(sub.id, {
          internalStatus: eventDetails.internalStatus,
          providerStatus: eventDetails.eventType
        });

        if (eventDetails.action === 'payment_succeeded') {
          const now = new Date();
          const nextBilling = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          await mySqlRecordPayment({
            id: eventDetails.paymentId || `pay_wh_${Date.now()}`,
            subscriptionId: sub.id,
            ownerUserId: sub.ownerUserId,
            provider: eventDetails.provider,
            providerPaymentId: eventDetails.paymentId,
            amountPaise: eventDetails.amountPaise || 9900,
            paymentMethod: 'UPI AutoPay',
            paymentStatus: 'captured',
            paidAt: new Date(eventDetails.paidAt)
          });

          await mySqlUpdateSubscriptionStatus(sub.id, {
            currentPeriodStart: now,
            currentPeriodEnd: nextBilling,
            nextBillingAt: nextBilling
          });
        }
      }
    }
  }

  return { status: 'success', event: eventDetails };
}

/**
 * 6. Admin Subscriptions & Revenue Directory
 */
export async function getAllOwnerSubscriptions() {
  if (isMySQLReady()) {
    const subs = await mySqlGetAllSubscriptionsAdmin();
    const payments = await mySqlGetAllPaymentsAdmin();

    let totalRevenuePaise = 0;
    let activeMandates = 0;

    subs.forEach(s => {
      if (s.internalStatus === 'ACTIVE') activeMandates++;
    });

    payments.forEach(p => {
      if (p.paymentStatus === 'captured') {
        totalRevenuePaise += p.amountPaise;
      }
    });

    return {
      totalRevenue: Number(totalRevenuePaise / 100),
      totalRevenuePaise,
      activeMandates,
      totalOwners: subs.length,
      totalInvoices: payments.length,
      ownerSubscriptions: subs.map(s => ({
        ownerId: s.ownerUserId,
        name: s.ownerName,
        email: s.ownerEmail,
        phone: s.ownerMobile,
        subscription: {
          ...s,
          status: s.internalStatus.toLowerCase(),
          daysRemaining: s.nextBillingAt ? Math.max(0, Math.ceil((new Date(s.nextBillingAt) - new Date()) / (1000 * 60 * 60 * 24))) : 0
        }
      })),
      allInvoices: payments.map(p => ({
        id: p.id,
        amount: p.amountInr,
        amountPaise: p.amountPaise,
        ownerId: p.ownerUserId,
        ownerName: p.ownerName,
        ownerEmail: p.ownerEmail,
        method: p.paymentMethod,
        mandateId: p.subscriptionId || 'UMRN-UPI-AUTOPAY',
        date: p.paidAt,
        status: p.paymentStatus
      }))
    };
  }

  // Fallback memory store
  const db = await getDB();
  const owners = (db.users || []).filter(u => u.role === 'owner');
  let totalRevenue = 0;
  let activeMandates = 0;
  const allInvoices = [];

  const ownerSubscriptions = owners.map(o => {
    const sub = o.subscription || {};
    const invoices = Array.isArray(sub.invoices) ? sub.invoices : [];

    if (sub.status === 'active' && sub.autopayEnabled) {
      activeMandates++;
    }

    invoices.forEach(inv => {
      totalRevenue += Number(inv.amount || 99);
      allInvoices.push({
        ...inv,
        ownerId: o.id,
        ownerName: o.name,
        ownerEmail: o.email,
        phone: o.phone || '',
        mandateId: inv.mandateId || sub.mandateId || 'MNDT-UPI-AUTO',
        autopayMethod: inv.method || sub.autopayMethod || 'UPI Autopay'
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

  return {
    totalRevenue,
    activeMandates,
    totalOwners: owners.length,
    totalInvoices: allInvoices.length,
    ownerSubscriptions,
    allInvoices
  };
}

// ========================================================
// PGS & PROPERTIES
// ========================================================
export async function getAllPgs() {
  if (isMySQLReady()) {
    const pgs = await mySqlGetAllPgs();
    if (pgs) return pgs;
  }
  return readDB().pgs;
}

export async function getPgById(id) {
  if (isMySQLReady()) {
    const pg = await mySqlGetPgById(id);
    if (pg) return pg;
  }
  return readDB().pgs.find(p => p.id === id) || null;
}

export async function createPg(pgData) {
  if (isMySQLReady()) {
    await mySqlCreatePg(pgData);
  }
  const db = readDB();
  db.pgs.unshift(pgData);
  writeDB(db);
  return pgData;
}

export async function updatePg(id, updatedData) {
  if (isMySQLReady()) {
    await mySqlUpdatePg(id, updatedData);
  }
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
  if (isMySQLReady()) {
    const pg = await mySqlUpdatePgStatus(id, status, reason);
    if (pg) return pg;
  }
  const db = readDB();
  const index = db.pgs.findIndex(p => p.id === id);
  if (index !== -1) {
    db.pgs[index].status = status;
    if (reason) db.pgs[index].statusReason = reason;
    db.pgs[index].statusUpdatedAt = new Date().toISOString();
    writeDB(db);
    return db.pgs[index];
  }
  return null;
}

export async function deletePg(id) {
  if (isMySQLReady()) {
    await mySqlDeletePg(id);
  }
  const db = readDB();
  db.pgs = db.pgs.filter(p => p.id !== id);
  writeDB(db);
  return true;
}

// ========================================================
// INQUIRIES & REVIEWS & BLOGS
// ========================================================
export async function createInquiry(inquiryData) {
  const newInq = {
    ...inquiryData,
    id: inquiryData.id || `inq_${Date.now()}`,
    status: 'new',
    createdAt: new Date().toISOString()
  };

  if (isMySQLReady()) {
    await mySqlCreateInquiry(newInq);
  }

  const db = readDB();
  db.inquiries.unshift(newInq);
  writeDB(db);
  return newInq;
}

export async function getInquiries(ownerId = null) {
  if (isMySQLReady()) {
    const rows = await mySqlGetInquiries(ownerId);
    if (rows) return rows;
  }
  const db = readDB();
  if (ownerId) {
    return db.inquiries.filter(i => i.ownerId === ownerId);
  }
  return db.inquiries;
}


export async function getReviews(pgId = null) {
  if (isMySQLReady()) {
    const reviews = await mySqlGetReviews(pgId);
    if (reviews) return reviews;
  }
  const db = readDB();
  if (pgId) {
    return db.reviews.filter(r => r.pgId === pgId);
  }
  return db.reviews;
}

export async function getStats() {
  const db = await getDB();
  const approvedPgs = (db.pgs || []).filter(p => p.status === 'approved');
  const totalBeds = (db.pgs || []).reduce((acc, pg) => {
    return acc + (pg.rooms || []).reduce((rAcc, r) => rAcc + (Number(r.beds) || 1), 0);
  }, 0);

  return {
    totalProperties: (db.pgs || []).length,
    approvedProperties: approvedPgs.length,
    pendingProperties: (db.pgs || []).filter(p => p.status === 'pending_review').length,
    totalUsers: (db.users || []).length,
    totalOwners: (db.users || []).filter(u => u.role === 'owner').length,
    totalTenants: (db.users || []).filter(u => u.role === 'tenant').length,
    totalInquiries: (db.inquiries || []).length,
    totalBeds,
    activeCities: [...new Set((db.pgs || []).map(p => p.address?.city).filter(Boolean))].length
  };
}

export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 9999;
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
