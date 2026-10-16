import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'luxury_pg_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true
};

let pool = null;
let isConnected = false;

export const safeJsonParse = (val, fallback = null) => {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
};

export const safeJsonStringify = (val) => {
  if (val === null || val === undefined) return null;
  if (typeof val === 'string') return val;
  try {
    return JSON.stringify(val);
  } catch {
    return null;
  }
};

// Transform DB row to API object
export const normalizeUser = (row) => {
  if (!row) return null;
  return {
    ...row,
    name: row.full_name || row.name || 'User',
    phone: row.mobile || row.phone || '',
    subscription: safeJsonParse(row.subscription, null)
  };
};

export const normalizePg = (row) => {
  if (!row) return null;
  return {
    ...row,
    featured: Boolean(row.featured),
    rating: Number(row.rating || 5.0),
    reviewsCount: Number(row.reviewsCount || 0),
    rent: Number(row.rent || 0),
    deposit: Number(row.deposit || 0),
    noticePeriodDays: Number(row.noticePeriodDays || 30),
    photos: safeJsonParse(row.photos, []),
    address: safeJsonParse(row.address, {}),
    rooms: safeJsonParse(row.rooms, []),
    facilities: safeJsonParse(row.facilities, []),
    rules: safeJsonParse(row.rules, []),
    propertyType: row.propertyType || 'pg',
    propertyTypeLabel: row.propertyTypeLabel || 'Paying Guest',
    bhk: row.bhk || '',
    furnishing: row.furnishing || 'Furnished',
    suitableFor: row.suitableFor || 'All'
  };
};

export const normalizeBlog = (row) => {
  if (!row) return null;
  return {
    ...row,
    tags: safeJsonParse(row.tags, [])
  };
};

export const normalizeSubscription = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    ownerUserId: row.owner_user_id,
    planCode: row.plan_code,
    amountPaise: Number(row.amount_paise || 9900),
    amountInr: Number((row.amount_paise || 9900) / 100),
    currency: row.currency || 'INR',
    billingInterval: row.billing_interval || 'monthly',
    provider: row.provider || 'razorpay',
    providerCustomerId: row.provider_customer_id,
    providerSubscriptionId: row.provider_subscription_id,
    providerMandateReference: row.provider_mandate_reference,
    internalStatus: row.internal_status, // PENDING_AUTHORIZATION, AUTHORIZED, ACTIVE, PAYMENT_PENDING, PAYMENT_FAILED, PAST_DUE, CANCELLED, EXPIRED, SUSPENDED
    providerStatus: row.provider_status,
    startedAt: row.started_at,
    currentPeriodStart: row.current_period_start,
    currentPeriodEnd: row.current_period_end,
    nextBillingAt: row.next_billing_at,
    cancellationRequestedAt: row.cancellation_requested_at,
    cancelledAt: row.cancelled_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

export const normalizePayment = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    subscriptionId: row.subscription_id,
    ownerUserId: row.owner_user_id,
    provider: row.provider || 'razorpay',
    providerPaymentId: row.provider_payment_id,
    providerOrderId: row.provider_order_id,
    amountPaise: Number(row.amount_paise || 9900),
    amountInr: Number((row.amount_paise || 9900) / 100),
    currency: row.currency || 'INR',
    paymentMethod: row.payment_method || 'upi_autopay',
    paymentStatus: row.payment_status,
    billingPeriodStart: row.billing_period_start,
    billingPeriodEnd: row.billing_period_end,
    failureCode: row.failure_code,
    failureReason: row.failure_reason,
    paidAt: row.paid_at,
    createdAt: row.created_at
  };
};

// ========================================================
// MIGRATIONS & SCHEMA RUNNER
// ========================================================
async function runMigrations(dbPool) {
  const migrationsDir = path.join(__dirname, '..', 'migrations');
  if (!fs.existsSync(migrationsDir)) return;

  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  const [appliedRows] = await dbPool.query('SELECT filename FROM _migrations');
  const appliedSet = new Set(appliedRows.map(r => r.filename));

  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
  for (const file of files) {
    if (!appliedSet.has(file)) {
      console.log(`⚡ Running database migration: ${file}...`);
      const sqlContent = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      await dbPool.query(sqlContent);
      await dbPool.query('INSERT INTO _migrations (filename) VALUES (?)', [file]);
      console.log(`✅ Applied migration: ${file}`);
    }
  }
}


async function ensureUsersTableCompatibility(dbPool) {
  try {
    const [cols] = await dbPool.query('SHOW COLUMNS FROM users');
    const existing = new Set(cols.map(c => c.Field));
    if (!existing.has('full_name')) {
      await dbPool.query('ALTER TABLE users ADD COLUMN full_name VARCHAR(255) DEFAULT "" AFTER id');
      await dbPool.query('UPDATE users SET full_name = name WHERE (full_name IS NULL OR full_name = "") AND name IS NOT NULL');
    }
    if (!existing.has('password_hash')) {
      await dbPool.query('ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) DEFAULT "" AFTER email');
      await dbPool.query('UPDATE users SET password_hash = password WHERE (password_hash IS NULL OR password_hash = "") AND password IS NOT NULL');
    }
    if (!existing.has('mobile')) {
      await dbPool.query('ALTER TABLE users ADD COLUMN mobile VARCHAR(50) DEFAULT "" AFTER password_hash');
      await dbPool.query('UPDATE users SET mobile = phone WHERE (mobile IS NULL OR mobile = "") AND phone IS NOT NULL');
    }
    if (!existing.has('status')) {
      await dbPool.query('ALTER TABLE users ADD COLUMN status VARCHAR(50) DEFAULT "active" AFTER mobile');
    }
    if (!existing.has('email_verified_at')) {
      await dbPool.query('ALTER TABLE users ADD COLUMN email_verified_at TIMESTAMP NULL DEFAULT NULL');
    }
    if (!existing.has('mobile_verified_at')) {
      await dbPool.query('ALTER TABLE users ADD COLUMN mobile_verified_at TIMESTAMP NULL DEFAULT NULL');
    }
    if (!existing.has('createdAt')) {
      await dbPool.query('ALTER TABLE users ADD COLUMN createdAt VARCHAR(100) DEFAULT NULL');
    }
    if (!existing.has('subscription')) {
      await dbPool.query('ALTER TABLE users ADD COLUMN subscription JSON DEFAULT NULL');
    }
  } catch (err) {
    console.warn('ensureUsersTableCompatibility note:', err.message);
  }
}

// Initialize database, tables and seed data
export async function initMySQL() {
  if (process.env.VERCEL) {
    console.log('ℹ️ Running in Vercel environment: MySQL bypassed unless configured.');
    return false;
  }

  try {
    // 1. Check server and create database if not exists
    const adminConn = await mysql.createConnection({
      host: DB_CONFIG.host,
      port: DB_CONFIG.port,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password
    });

    await adminConn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await adminConn.end();

    // 2. Create connection pool to the database
    pool = mysql.createPool(DB_CONFIG);

    // 3. Run versioned migrations (Creates 12 normalized tables with constraints)
    await runMigrations(pool);

    // Ensure users table compatibility
    await ensureUsersTableCompatibility(pool);

    // 4. Ensure backward-compatibility tables (pgs, blogs, inquiries, reviews)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pgs (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        ownerId VARCHAR(100) NOT NULL,
        ownerName VARCHAR(255),
        ownerPhone VARCHAR(50),
        ownerWhatsapp VARCHAR(50),
        gender VARCHAR(50) DEFAULT 'Co-ed',
        status VARCHAR(50) DEFAULT 'pending_review',
        statusReason TEXT,
        statusUpdatedAt VARCHAR(100),
        featured TINYINT(1) DEFAULT 0,
        rating DECIMAL(3, 2) DEFAULT 5.0,
        reviewsCount INT DEFAULT 0,
        rent DECIMAL(10, 2) NOT NULL,
        deposit DECIMAL(10, 2),
        noticePeriodDays INT DEFAULT 30,
        description LONGTEXT,
        photos JSON,
        address JSON,
        rooms JSON,
        facilities JSON,
        rules JSON,
        propertyType VARCHAR(50) DEFAULT 'pg',
        propertyTypeLabel VARCHAR(100),
        bhk VARCHAR(50),
        furnishing VARCHAR(100) DEFAULT 'Furnished',
        suitableFor VARCHAR(100) DEFAULT 'All',
        createdAt VARCHAR(100),
        updatedAt VARCHAR(100)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id VARCHAR(100) PRIMARY KEY,
        slug VARCHAR(255) NOT NULL UNIQUE,
        title VARCHAR(255) NOT NULL,
        excerpt TEXT,
        content LONGTEXT,
        coverImage TEXT,
        author VARCHAR(255),
        authorRole VARCHAR(255),
        readTime VARCHAR(50),
        tags JSON,
        publishedAt VARCHAR(100)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id VARCHAR(100) PRIMARY KEY,
        pgId VARCHAR(100) NOT NULL,
        pgName VARCHAR(255),
        ownerId VARCHAR(100),
        userName VARCHAR(255) NOT NULL,
        userPhone VARCHAR(50) NOT NULL,
        userEmail VARCHAR(255) DEFAULT '',
        sharingType VARCHAR(100) DEFAULT 'Any',
        visitDate VARCHAR(50) DEFAULT '',
        message TEXT,
        status VARCHAR(50) DEFAULT 'new',
        createdAt VARCHAR(100)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id VARCHAR(100) PRIMARY KEY,
        pgId VARCHAR(100) NOT NULL,
        userName VARCHAR(255) NOT NULL,
        userAvatar TEXT,
        rating INT NOT NULL DEFAULT 5,
        date VARCHAR(100),
        role VARCHAR(255),
        comment TEXT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 5. Seed legacy tables if empty from db.json
    await seedTablesIfEmpty();

    isConnected = true;
    console.log(`✅ MySQL Connected successfully to database: "${DB_CONFIG.database}" on ${DB_CONFIG.host}:${DB_CONFIG.port}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ MySQL initialization failed (${error.message}). Falling back to JSON storage.`);
    isConnected = false;
    return false;
  }
}

async function seedTablesIfEmpty() {
  const dbJsonPath = path.join(__dirname, 'db.json');
  if (!fs.existsSync(dbJsonPath)) return;

  let seedData;
  try {
    seedData = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));
  } catch (e) {
    console.error('Failed to parse db.json for seed:', e);
    return;
  }

  // Seed Users
  const [userCount] = await pool.query('SELECT COUNT(*) as cnt FROM users');
  if (userCount[0].cnt === 0 && Array.isArray(seedData.users)) {
    console.log(`🌱 Seeding ${seedData.users.length} users into MySQL...`);
    for (const u of seedData.users) {
      await pool.query(
        'INSERT INTO users (id, full_name, name, email, password_hash, password, role, mobile, phone, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [u.id, u.name, u.name, u.email, u.password, u.password, u.role, u.phone || '', u.phone || '', u.createdAt || new Date().toISOString()]
      );
    }
  }

  // Seed PGs
  const [pgCount] = await pool.query('SELECT COUNT(*) as cnt FROM pgs');
  if (pgCount[0].cnt === 0 && Array.isArray(seedData.pgs)) {
    console.log(`🌱 Seeding ${seedData.pgs.length} PGs into MySQL...`);
    for (const p of seedData.pgs) {
      await pool.query(
        `INSERT INTO pgs (
          id, name, ownerId, ownerName, ownerPhone, ownerWhatsapp, gender, status, statusReason,
          statusUpdatedAt, featured, rating, reviewsCount, rent, deposit, noticePeriodDays,
          description, photos, address, rooms, facilities, rules, propertyType,
          propertyTypeLabel, bhk, furnishing, suitableFor, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          p.id, p.name, p.ownerId, p.ownerName || '', p.ownerPhone || '', p.ownerWhatsapp || '',
          p.gender || 'Co-ed', p.status || 'approved', p.statusReason || null,
          p.statusUpdatedAt || null, p.featured ? 1 : 0, p.rating || 5.0, p.reviewsCount || 0,
          p.rent, p.deposit || p.rent * 1.5, p.noticePeriodDays || 30,
          p.description || '', safeJsonStringify(p.photos || []), safeJsonStringify(p.address || {}),
          safeJsonStringify(p.rooms || []), safeJsonStringify(p.facilities || []), safeJsonStringify(p.rules || []),
          p.propertyType || 'pg', p.propertyTypeLabel || 'Paying Guest', p.bhk || '',
          p.furnishing || 'Furnished', p.suitableFor || 'All',
          p.createdAt || new Date().toISOString(), p.updatedAt || null
        ]
      );
    }
  }

  // Seed Blogs
  const [blogCount] = await pool.query('SELECT COUNT(*) as cnt FROM blogs');
  if (blogCount[0].cnt === 0 && Array.isArray(seedData.blogs)) {
    console.log(`🌱 Seeding ${seedData.blogs.length} blogs into MySQL...`);
    for (const b of seedData.blogs) {
      await pool.query(
        `INSERT INTO blogs (id, slug, title, excerpt, content, coverImage, author, authorRole, readTime, tags, publishedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          b.id, b.slug, b.title, b.excerpt || '', b.content || '', b.coverImage || '',
          b.author || '', b.authorRole || '', b.readTime || '', safeJsonStringify(b.tags || []),
          b.publishedAt || new Date().toISOString()
        ]
      );
    }
  }

  // Seed Inquiries
  const [inqCount] = await pool.query('SELECT COUNT(*) as cnt FROM inquiries');
  if (inqCount[0].cnt === 0 && Array.isArray(seedData.inquiries)) {
    console.log(`🌱 Seeding ${seedData.inquiries.length} inquiries into MySQL...`);
    for (const i of seedData.inquiries) {
      await pool.query(
        `INSERT INTO inquiries (id, pgId, pgName, ownerId, userName, userPhone, userEmail, sharingType, visitDate, message, status, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          i.id, i.pgId, i.pgName || '', i.ownerId || '', i.userName, i.userPhone,
          i.userEmail || '', i.sharingType || 'Any', i.visitDate || '', i.message || '',
          i.status || 'new', i.createdAt || new Date().toISOString()
        ]
      );
    }
  }

  // Seed Reviews
  const [revCount] = await pool.query('SELECT COUNT(*) as cnt FROM reviews');
  if (revCount[0].cnt === 0 && Array.isArray(seedData.reviews)) {
    console.log(`🌱 Seeding ${seedData.reviews.length} reviews into MySQL...`);
    for (const r of seedData.reviews) {
      await pool.query(
        `INSERT INTO reviews (id, pgId, userName, userAvatar, rating, date, role, comment)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          r.id, r.pgId, r.userName, r.userAvatar || '', r.rating || 5,
          r.date || '', r.role || '', r.comment || ''
        ]
      );
    }
  }
}

export function isMySQLReady() {
  return isConnected && pool !== null;
}

export function getPool() {
  return pool;
}

// Full Snapshot for store/export
export async function getFullDbFromMySQL() {
  if (!isMySQLReady()) return null;

  try {
    const [users] = await pool.query('SELECT * FROM users ORDER BY createdAt DESC');
    const [pgRows] = await pool.query('SELECT * FROM pgs ORDER BY createdAt DESC');
    const [blogRows] = await pool.query('SELECT * FROM blogs ORDER BY publishedAt DESC');
    const [inquiries] = await pool.query('SELECT * FROM inquiries ORDER BY createdAt DESC');
    const [reviews] = await pool.query('SELECT * FROM reviews');

    return {
      users: users.map(normalizeUser),
      pgs: pgRows.map(normalizePg),
      blogs: blogRows.map(normalizeBlog),
      inquiries,
      reviews
    };
  } catch (err) {
    console.error('Error querying full DB from MySQL:', err);
    return null;
  }
}

// ========================================================
// USER CRUD
// ========================================================
export async function mySqlFindUserByEmail(email) {
  if (!isMySQLReady()) return null;
  const [rows] = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1', [email.trim()]);
  return rows.length > 0 ? normalizeUser(rows[0]) : null;
}

export async function mySqlFindUserById(id) {
  if (!isMySQLReady()) return null;
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
  return rows.length > 0 ? normalizeUser(rows[0]) : null;
}

export async function mySqlCreateUser(user) {
  if (!isMySQLReady()) return null;
  await pool.query(
    'INSERT INTO users (id, full_name, name, email, password_hash, password, role, mobile, phone, createdAt, subscription) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      user.id,
      user.name || user.full_name || '',
      user.name || user.full_name || '',
      user.email,
      user.password || user.password_hash || '',
      user.password || user.password_hash || '',
      user.role || 'tenant',
      user.phone || user.mobile || '',
      user.phone || user.mobile || '',
      user.createdAt || new Date().toISOString(),
      safeJsonStringify(user.subscription || null)
    ]
  );
  return user;
}

export async function mySqlUpdateUserSubscription(userId, subscription) {
  if (!isMySQLReady()) return null;
  await pool.query('UPDATE users SET subscription = ? WHERE id = ?', [
    safeJsonStringify(subscription),
    userId
  ]);
  return subscription;
}

// ========================================================
// SUBSCRIPTIONS (₹99 Monthly UPI AutoPay Architecture)
// ========================================================
export async function mySqlCreateSubscriptionRecord({
  id,
  ownerUserId,
  planCode = 'owner_autopay_99',
  amountPaise = 9900,
  provider = 'razorpay',
  providerSubscriptionId,
  providerMandateReference = null,
  internalStatus = 'PENDING_AUTHORIZATION',
  providerStatus = 'created',
  startedAt = null,
  currentPeriodStart = null,
  currentPeriodEnd = null,
  nextBillingAt = null
}) {
  if (!isMySQLReady()) return null;
  await pool.query(
    `INSERT INTO subscriptions (
      id, owner_user_id, plan_code, amount_paise, currency, billing_interval,
      provider, provider_subscription_id, provider_mandate_reference,
      internal_status, provider_status, started_at, current_period_start,
      current_period_end, next_billing_at
    ) VALUES (?, ?, ?, ?, 'INR', 'monthly', ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      internal_status = VALUES(internal_status),
      provider_status = VALUES(provider_status),
      provider_mandate_reference = VALUES(provider_mandate_reference),
      next_billing_at = VALUES(next_billing_at),
      updated_at = CURRENT_TIMESTAMP`,
    [
      id, ownerUserId, planCode, amountPaise, provider,
      providerSubscriptionId, providerMandateReference,
      internalStatus, providerStatus, startedAt, currentPeriodStart,
      currentPeriodEnd, nextBillingAt
    ]
  );
  return mySqlGetSubscriptionByOwner(ownerUserId);
}

export async function mySqlGetSubscriptionByOwner(ownerUserId) {
  if (!isMySQLReady()) return null;
  const [rows] = await pool.query(
    'SELECT * FROM subscriptions WHERE owner_user_id = ? ORDER BY created_at DESC LIMIT 1',
    [ownerUserId]
  );
  return rows.length > 0 ? normalizeSubscription(rows[0]) : null;
}

export async function mySqlGetSubscriptionByProviderId(providerSubId) {
  if (!isMySQLReady()) return null;
  const [rows] = await pool.query(
    'SELECT * FROM subscriptions WHERE provider_subscription_id = ? LIMIT 1',
    [providerSubId]
  );
  return rows.length > 0 ? normalizeSubscription(rows[0]) : null;
}

export async function mySqlUpdateSubscriptionStatus(id, {
  internalStatus,
  providerStatus,
  providerMandateReference,
  currentPeriodStart,
  currentPeriodEnd,
  nextBillingAt,
  cancellationRequestedAt,
  cancelledAt
}) {
  if (!isMySQLReady()) return null;
  const updates = [];
  const params = [];

  if (internalStatus) { updates.push('internal_status = ?'); params.push(internalStatus); }
  if (providerStatus) { updates.push('provider_status = ?'); params.push(providerStatus); }
  if (providerMandateReference) { updates.push('provider_mandate_reference = ?'); params.push(providerMandateReference); }
  if (currentPeriodStart) { updates.push('current_period_start = ?'); params.push(currentPeriodStart); }
  if (currentPeriodEnd) { updates.push('current_period_end = ?'); params.push(currentPeriodEnd); }
  if (nextBillingAt) { updates.push('next_billing_at = ?'); params.push(nextBillingAt); }
  if (cancellationRequestedAt) { updates.push('cancellation_requested_at = ?'); params.push(cancellationRequestedAt); }
  if (cancelledAt) { updates.push('cancelled_at = ?'); params.push(cancelledAt); }

  if (updates.length === 0) return null;
  params.push(id);

  await pool.query(`UPDATE subscriptions SET ${updates.join(', ')} WHERE id = ?`, params);
  const [rows] = await pool.query('SELECT * FROM subscriptions WHERE id = ?', [id]);
  return rows.length > 0 ? normalizeSubscription(rows[0]) : null;
}

export async function mySqlCancelSubscription(id) {
  if (!isMySQLReady()) return null;
  const now = new Date();
  await pool.query(
    `UPDATE subscriptions SET
      internal_status = 'CANCELLED',
      provider_status = 'cancelled',
      cancellation_requested_at = ?,
      cancelled_at = ?
    WHERE id = ?`,
    [now, now, id]
  );
  const [rows] = await pool.query('SELECT * FROM subscriptions WHERE id = ?', [id]);
  return rows.length > 0 ? normalizeSubscription(rows[0]) : null;
}

export async function mySqlGetAllSubscriptionsAdmin() {
  if (!isMySQLReady()) return [];
  const [rows] = await pool.query(`
    SELECT s.*, u.full_name as owner_name, u.email as owner_email, u.mobile as owner_mobile
    FROM subscriptions s
    LEFT JOIN users u ON s.owner_user_id = u.id
    ORDER BY s.created_at DESC
  `);
  return rows.map(r => ({
    ...normalizeSubscription(r),
    ownerName: r.owner_name,
    ownerEmail: r.owner_email,
    ownerMobile: r.owner_mobile
  }));
}

// ========================================================
// PAYMENTS TABLE
// ========================================================
export async function mySqlRecordPayment({
  id,
  subscriptionId,
  ownerUserId,
  provider = 'razorpay',
  providerPaymentId,
  providerOrderId = null,
  amountPaise = 9900,
  paymentMethod = 'upi_autopay',
  paymentStatus = 'captured',
  billingPeriodStart = null,
  billingPeriodEnd = null,
  failureCode = null,
  failureReason = null,
  paidAt = new Date()
}) {
  if (!isMySQLReady()) return null;
  await pool.query(
    `INSERT INTO payments (
      id, subscription_id, owner_user_id, provider, provider_payment_id,
      provider_order_id, amount_paise, currency, payment_method, payment_status,
      billing_period_start, billing_period_end, failure_code, failure_reason, paid_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'INR', ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      payment_status = VALUES(payment_status),
      paid_at = VALUES(paid_at),
      failure_code = VALUES(failure_code),
      failure_reason = VALUES(failure_reason),
      updated_at = CURRENT_TIMESTAMP`,
    [
      id, subscriptionId, ownerUserId, provider, providerPaymentId,
      providerOrderId, amountPaise, paymentMethod, paymentStatus,
      billingPeriodStart, billingPeriodEnd, failureCode, failureReason, paidAt
    ]
  );
  const [rows] = await pool.query('SELECT * FROM payments WHERE id = ?', [id]);
  return rows.length > 0 ? normalizePayment(rows[0]) : null;
}

export async function mySqlGetPaymentsByOwner(ownerUserId) {
  if (!isMySQLReady()) return [];
  const [rows] = await pool.query(
    'SELECT * FROM payments WHERE owner_user_id = ? ORDER BY paid_at DESC',
    [ownerUserId]
  );
  return rows.map(normalizePayment);
}

export async function mySqlGetAllPaymentsAdmin() {
  if (!isMySQLReady()) return [];
  const [rows] = await pool.query(`
    SELECT p.*, u.full_name as owner_name, u.email as owner_email
    FROM payments p
    LEFT JOIN users u ON p.owner_user_id = u.id
    ORDER BY p.paid_at DESC
  `);
  return rows.map(r => ({
    ...normalizePayment(r),
    ownerName: r.owner_name,
    ownerEmail: r.owner_email
  }));
}

// ========================================================
// PAYMENT WEBHOOK EVENTS (Idempotent processing)
// ========================================================
export async function mySqlHasWebhookBeenProcessed(provider, providerEventId) {
  if (!isMySQLReady()) return false;
  const [rows] = await pool.query(
    'SELECT id FROM payment_webhook_events WHERE provider = ? AND provider_event_id = ? LIMIT 1',
    [provider, providerEventId]
  );
  return rows.length > 0;
}

export async function mySqlRecordWebhookEvent({
  id,
  provider = 'razorpay',
  providerEventId,
  eventType,
  payloadJson,
  processingStatus = 'processed'
}) {
  if (!isMySQLReady()) return null;
  await pool.query(
    `INSERT INTO payment_webhook_events (
      id, provider, provider_event_id, event_type, payload_json, processing_status, processed_at
    ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [id, provider, providerEventId, eventType, safeJsonStringify(payloadJson), processingStatus]
  );
  return true;
}

// ========================================================
// PG / PROPERTY CRUD
// ========================================================
export async function mySqlGetAllPgs() {
  if (!isMySQLReady()) return null;
  const [rows] = await pool.query('SELECT * FROM pgs ORDER BY createdAt DESC');
  return rows.map(normalizePg);
}

export async function mySqlGetPgById(id) {
  if (!isMySQLReady()) return null;
  const [rows] = await pool.query('SELECT * FROM pgs WHERE id = ? LIMIT 1', [id]);
  return rows.length > 0 ? normalizePg(rows[0]) : null;
}

export async function mySqlCreatePg(p) {
  if (!isMySQLReady()) return null;
  await pool.query(
    `INSERT INTO pgs (
      id, name, ownerId, ownerName, ownerPhone, ownerWhatsapp, gender, status, statusReason,
      statusUpdatedAt, featured, rating, reviewsCount, rent, deposit, noticePeriodDays,
      description, photos, address, rooms, facilities, rules, propertyType,
      propertyTypeLabel, bhk, furnishing, suitableFor, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      p.id, p.name, p.ownerId, p.ownerName || '', p.ownerPhone || '', p.ownerWhatsapp || '',
      p.gender || 'Co-ed', p.status || 'pending_review', p.statusReason || null,
      p.statusUpdatedAt || null, p.featured ? 1 : 0, p.rating || 5.0, p.reviewsCount || 0,
      p.rent, p.deposit || p.rent * 1.5, p.noticePeriodDays || 30,
      p.description || '', safeJsonStringify(p.photos || []), safeJsonStringify(p.address || {}),
      safeJsonStringify(p.rooms || []), safeJsonStringify(p.facilities || []), safeJsonStringify(p.rules || []),
      p.propertyType || 'pg', p.propertyTypeLabel || 'Paying Guest', p.bhk || '',
      p.furnishing || 'Furnished', p.suitableFor || 'All',
      p.createdAt || new Date().toISOString(), p.updatedAt || null
    ]
  );
  return p;
}

export async function mySqlUpdatePg(id, updated) {
  if (!isMySQLReady()) return null;
  await pool.query(
    `UPDATE pgs SET
      name = ?, ownerId = ?, ownerName = ?, ownerPhone = ?, ownerWhatsapp = ?, gender = ?,
      status = ?, statusReason = ?, statusUpdatedAt = ?, featured = ?, rating = ?, reviewsCount = ?,
      rent = ?, deposit = ?, noticePeriodDays = ?, description = ?, photos = ?, address = ?,
      rooms = ?, facilities = ?, rules = ?, propertyType = ?, propertyTypeLabel = ?, bhk = ?,
      furnishing = ?, suitableFor = ?, updatedAt = ?
     WHERE id = ?`,
    [
      updated.name, updated.ownerId, updated.ownerName || '', updated.ownerPhone || '', updated.ownerWhatsapp || '',
      updated.gender || 'Co-ed', updated.status || 'approved', updated.statusReason || null,
      updated.statusUpdatedAt || null, updated.featured ? 1 : 0, updated.rating || 5.0, updated.reviewsCount || 0,
      updated.rent, updated.deposit || updated.rent * 1.5, updated.noticePeriodDays || 30,
      updated.description || '', safeJsonStringify(updated.photos || []), safeJsonStringify(updated.address || {}),
      safeJsonStringify(updated.rooms || []), safeJsonStringify(updated.facilities || []), safeJsonStringify(updated.rules || []),
      updated.propertyType || 'pg', updated.propertyTypeLabel || 'Paying Guest', updated.bhk || '',
      updated.furnishing || 'Furnished', updated.suitableFor || 'All',
      new Date().toISOString(), id
    ]
  );
  return updated;
}

export async function mySqlUpdatePgStatus(id, status, statusReason = null) {
  if (!isMySQLReady()) return null;
  const now = new Date().toISOString();
  await pool.query(
    'UPDATE pgs SET status = ?, statusReason = ?, statusUpdatedAt = ? WHERE id = ?',
    [status, statusReason, now, id]
  );
  return mySqlGetPgById(id);
}

export async function mySqlDeletePg(id) {
  if (!isMySQLReady()) return false;
  await pool.query('DELETE FROM pgs WHERE id = ?', [id]);
  return true;
}

// ========================================================
// INQUIRIES & REVIEWS & BLOGS
// ========================================================
export async function mySqlCreateInquiry(inquiry) {
  if (!isMySQLReady()) return null;
  await pool.query(
    `INSERT INTO inquiries (id, pgId, pgName, ownerId, userName, userPhone, userEmail, sharingType, visitDate, message, status, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      inquiry.id, inquiry.pgId, inquiry.pgName || '', inquiry.ownerId || '', inquiry.userName, inquiry.userPhone,
      inquiry.userEmail || '', inquiry.sharingType || 'Any', inquiry.visitDate || '', inquiry.message || '',
      inquiry.status || 'new', inquiry.createdAt || new Date().toISOString()
    ]
  );
  return inquiry;
}

export async function mySqlGetInquiries(ownerId = null) {
  if (!isMySQLReady()) return null;
  if (ownerId) {
    const [rows] = await pool.query('SELECT * FROM inquiries WHERE ownerId = ? ORDER BY createdAt DESC', [ownerId]);
    return rows;
  }
  const [rows] = await pool.query('SELECT * FROM inquiries ORDER BY createdAt DESC');
  return rows;
}



export async function mySqlGetReviews(pgId = null) {
  if (!isMySQLReady()) return null;
  if (pgId) {
    const [rows] = await pool.query('SELECT * FROM reviews WHERE pgId = ?', [pgId]);
    return rows;
  }
  const [rows] = await pool.query('SELECT * FROM reviews');
  return rows;
}
