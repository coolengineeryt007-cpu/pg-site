# VRUNDAVAN VENTURES — RENTAL MARKETPLACE & UPI AUTOPAY SUBSCRIPTION PLATFORM

**Vrundavan Ventures** is an Indian PG, private room, flat, apartment, and house rental marketplace featuring a **₹99.00 INR / month recurring UPI AutoPay owner subscription model**.

Tenants search and discover properties with **100% free access** and direct owner contact. Property owners subscribe via **UPI AutoPay e-Mandate** (Google Pay, PhonePe, Paytm, BHIM) to activate and publish verified listings.

---

## 🏗️ Architecture & Technology Stack

* **Frontend**: React 19, Vite, responsive vanilla CSS tokens, Lucide icons.
* **Backend**: Node.js, Express.js REST APIs with rawBody preservation for cryptographic HMAC webhook verification, prepared statements, and rate limiting.
* **Database**: MySQL (`mysql2` connection pooling), versioned SQL migrations (`001_initial_schema.sql`), 12 normalized tables with foreign keys and unique constraints.
* **Payment Integration**: UPI AutoPay provider architecture (Razorpay / Cashfree) strictly enforcing **₹99.00 INR (9900 paise)** monthly recurring debits. Cards and card-based checkout are strictly disallowed.
* **Deployment Target**: Compatible GoDaddy Node.js + MySQL hosting environment (cPanel / CloudLinux / VPS).

---

## 📋 Business Model & Rules

1. **Tenants & Seekers (100% Free)**:
   - Full public access to search, filter by city, rent budget, property type, amenities, and gender rules.
   - Direct phone and WhatsApp communication with verified hosts without paying any subscription.
2. **Property Owners & Hosts (₹99.00 / month)**:
   - ₹99.00 INR per 30-day billing cycle.
   - Billed exclusively via **UPI AutoPay**. Supported UPI applications: **Google Pay, PhonePe, Paytm, BHIM**.
   - Credit cards and debit cards are **not accepted** for subscriptions.
   - The owner explicitly accepts recurring terms before authorization.
   - 1-click cancellation anytime from the Owner Dashboard or directly within their UPI app. Existing properties remain active until the billing period concludes; property data is **never deleted**.

---

## 🗄️ MySQL Database Schema (12 Normalized Tables)

All schema definitions and seeds are version-controlled in [`server/migrations/001_initial_schema.sql`](file:///j:/PG%20WEBSITE/server/migrations/001_initial_schema.sql):

1. **`subscription_plans`**: Master plan definitions (`plan_vv_owner_99`, `owner_autopay_99`, 9900 paise, monthly).
2. **`users`**: User identities, roles (`tenant`, `owner`, `superadmin`), contact details, and password hashes.
3. **`owner_profiles`**: Owner business metadata, cities, contact preferences, and profile status.
4. **`properties`**: Property listings with title, slug, rent, deposit, maintenance, address, facilities, rules, and status (`draft`, `pending_review`, `approved`).
5. **`property_images`**: Normalized property gallery with ordering and alt text.
6. **`subscriptions`**: Recurring subscription records with internal status (`PENDING_AUTHORIZATION`, `ACTIVE`, `CANCELLED`, etc.), provider references, and next billing timestamps.
7. **`payments`**: Auditable ledger of recurring debits and initial activations in integer paise (9900 paise).
8. **`payment_webhook_events`**: Idempotent event store preventing duplicate event processing.
9. **`enquiries`**: Tenant leads and visit inquiries for properties.
10. **`favorites`**: Saved properties per user.
11. **`notifications`**: System notifications for renewals, mandate changes, and inquiries.
12. **`audit_logs`**: Administrative audit trail for compliance.

---

## 🧪 Automated Test Suite (38 Tests Passing)

The project includes an end-to-end automated test suite verifying all critical business flows:

```bash
cd server
node tests/run_tests.js
```

### Verified Test Groups:
1. **Health & MySQL Engine**: Verifies connection pool to `luxury_pg_db` on port 3306.
2. **Tenant Discovery**: Verifies free public search without subscription, approved listing isolation.
3. **₹99 UPI AutoPay Enforcement**: Verifies strict ₹99 fee, 9900 paise, UPI AutoPay only notice, and rejection of cards.
4. **Owner Authentication**: Tests registration, hashing, and login credentials.
5. **Mandate Creation**: Validates NPCI UMRN reference generation and GPay deep link generation.
6. **Mandate Authorization & Activation**: Tests status transition to `ACTIVE`, invoice generation, and entitlement confirmation.
7. **Property Creation**: Confirms active subscribers can publish listings.
8. **Subscription Cancellation**: Verifies cancellation stops future debits and preserves existing listings.
9. **HMAC Webhook Verification & Idempotency**: Tests SHA-256 signature verification and rejection of duplicates.
10. **Super Admin Ledger**: Confirms revenue calculations and audited invoice directory.
11. **SQL Injection Resistance**: Verifies prepared statements protect against SQL injection.

---

## 🌐 Running Locally

### 1. Database Configuration
Ensure MySQL is running on `localhost:3306`. Configure credentials in `server/.env`:

```env
PORT=5050
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=luxury_pg_db
PAYMENT_PROVIDER=razorpay
PAYMENT_ENVIRONMENT=sandbox
PAYMENT_API_KEY=rzp_test_vrundavan_autopay
PAYMENT_API_SECRET=sandbox_secret_vrundavan_99
PAYMENT_WEBHOOK_SECRET=whsec_vrundavan_autopay_webhook_99
```

### 2. Start Backend Server
```bash
cd server
node server.js
```
Runs on `http://localhost:5050` (API base: `http://localhost:5050/api`).

### 3. Start Frontend Client
```bash
cd client
npm run dev
```
Runs on `http://localhost:3050`.

---

## 🚀 GoDaddy Hosting Deployment Guide

### Prerequisites on GoDaddy:
1. **Hosting Plan**: GoDaddy cPanel Web Hosting with Node.js support (Setup Node.js App via CloudLinux / Phusion Passenger) or GoDaddy VPS.
2. **MySQL Database**: Create database `luxury_pg_db` via cPanel MySQL Database Wizard.

### Step-by-Step Deployment:
1. **Import MySQL Schema**:
   - Open cPanel -> **phpMyAdmin**.
   - Select your database and import [`server/migrations/001_initial_schema.sql`](file:///j:/PG%20WEBSITE/server/migrations/001_initial_schema.sql).
2. **Deploy Backend**:
   - Upload `server/` directory to your hosting document root (e.g., `~/backend` or `/home/user/backend`).
   - In cPanel, click **"Setup Node.js App"**:
     - Node.js Version: 20.x or 22.x LTS.
     - Application Root: `/backend`.
     - Application Startup File: `server.js`.
     - Environment Variables: Set `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `PORT`, `PAYMENT_API_KEY`, `PAYMENT_API_SECRET`, `PAYMENT_WEBHOOK_SECRET`.
   - Run `npm install --production` from the cPanel Node.js interface.
   - Click **Restart Application**.
3. **Build & Deploy Frontend**:
   - Run `cmd.exe /c npm run build` locally in `client/`.
   - Upload contents of `client/dist/` directly to `public_html/`.
   - Include the `.htaccess` file for Single Page Application URL routing and reverse proxy to `/api/`.
4. **Configure Payment Gateway Webhook**:
   - In your Razorpay / Cashfree Merchant Dashboard, navigate to **Webhooks**.
   - Set Webhook URL: `https://yourdomain.com/api/webhooks/payment-provider`.
   - Secret: Match `PAYMENT_WEBHOOK_SECRET` in `.env`.
   - Subscribed Events: `subscription.activated`, `subscription.charged`, `subscription.halted`, `subscription.cancelled`, `payment.failed`.

---

## 🔑 Pre-Configured Test Accounts

| Role | Email | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `superadmin@luxurypg.com` | `Super@123` | Platform KPIs, Listing Approvals, Subscriptions & Revenue Ledger |
| **PG Owner 1** | `rajesh@royalpg.com` | `Owner@123` | Manage Listings, Inquiries, Active Autopay Mandate |
| **PG Owner 2** | `priya@elitepg.com` | `Owner@123` | Bangalore/Mumbai Listings, Mandate Management |
| **Tenant** | `aakash@gmail.com` | `User@123` | Free Property Search, Direct Host Connect |

---

## ⚖️ Legal & Policy Disclosures
* **Terms & Conditions**: [`/terms`](http://localhost:3050/terms)
* **Privacy Policy**: [`/privacy`](http://localhost:3050/privacy)
* **Cancellation & Refund Policy**: [`/refund-policy`](http://localhost:3050/refund-policy)
* **Listing Policy**: [`/listing-policy`](http://localhost:3050/listing-policy)
* **Safety Guidelines**: [`/safety-guidelines`](http://localhost:3050/safety-guidelines)
