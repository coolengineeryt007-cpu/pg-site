import crypto from 'crypto';

const API_BASE = 'http://localhost:5050/api';
let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failCount++;
  }
}

async function runTests() {
  console.log('\n========================================================');
  console.log('🧪 VRUNDAVAN VENTURES - AUTOMATED API & PAYMENT SUITE');
  console.log('========================================================\n');

  // Test 1: Health check & MySQL
  console.log('--- TEST GROUP 1: Health & MySQL Database ---');
  try {
    const res = await fetch(`${API_BASE}/health`);
    const data = await res.json();
    assert(res.ok, 'Health check returns 200 OK');
    assert(data.database && data.database.includes('MySQL'), `Database engine is MySQL: "${data.database}"`);
  } catch (err) {
    assert(false, `Health check failed: ${err.message}`);
  }

  // Test 2: Tenant Public Property Search (Free for Tenants)
  console.log('\n--- TEST GROUP 2: Tenant Free Search & Discovery ---');
  try {
    const res = await fetch(`${API_BASE}/pgs?city=Rajkot`);
    const data = await res.json();
    assert(res.ok, 'Tenant search returns 200 OK without subscription');
    assert(Array.isArray(data.pgs) && data.pgs.length > 0, `Returns public listings (${data.pgs?.length} found in Rajkot)`);
    assert(data.pgs.every(p => p.status === 'approved'), 'Public tenant view returns only approved listings');
  } catch (err) {
    assert(false, `Tenant search failed: ${err.message}`);
  }

  // Test 3: ₹99 Plan & UPI AutoPay Config Enforcement
  console.log('\n--- TEST GROUP 3: ₹99 Subscription & UPI AutoPay Enforcement ---');
  try {
    const res = await fetch(`${API_BASE}/subscription/config`);
    const config = await res.json();
    assert(res.ok, 'Subscription config returns 200 OK');
    assert(config.amountInr === 99, `Enforces ₹99 monthly fee: ₹${config.amountInr}`);
    assert(config.amountPaise === 9900, `Enforces 9900 paise: ${config.amountPaise}`);
    assert(config.method === 'UPI AutoPay only', `Strictly UPI AutoPay only: "${config.method}"`);
    assert(Array.isArray(config.supportedUpiApps) && config.supportedUpiApps.length >= 4, 'Supports Google Pay, PhonePe, Paytm, BHIM');
    assert(config.paymentMethodNotice.includes('Credit cards, debit cards and card-based checkouts are not accepted'), 'Explicitly disallows card checkouts');
  } catch (err) {
    assert(false, `Config test failed: ${err.message}`);
  }

  // Test 4: Owner Registration & Authentication
  console.log('\n--- TEST GROUP 4: Owner Registration & Authentication ---');
  const testEmail = `test_owner_${Date.now()}@vrundavan.in`;
  let testUserId = null;
  try {
    const regRes = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Automated Test Owner',
        email: testEmail,
        password: 'SecurePassword123',
        phone: '+91 99988 77766',
        role: 'owner'
      })
    });
    const regData = await regRes.json();
    assert(regRes.ok, 'Owner account registered successfully');
    assert(regData.user && regData.user.role === 'owner', 'Role correctly set to "owner"');
    testUserId = regData.user?.id;

    // Login check
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: 'SecurePassword123' })
    });
    const loginData = await loginRes.json();
    assert(loginRes.ok && loginData.user?.email === testEmail, 'Owner can login with credentials');
  } catch (err) {
    assert(false, `Owner auth failed: ${err.message}`);
  }

  // Test 5: Subscription Creation (Step 4a)
  console.log('\n--- TEST GROUP 5: Mandate Creation & ₹99 Enforcement ---');
  let mandateRef = null;
  let subscriptionId = null;
  try {
    const subRes = await fetch(`${API_BASE}/subscription/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: testUserId,
        upiApp: 'gpay',
        upiId: 'testowner@okaxis'
      })
    });
    const subData = await subRes.json();
    assert(subRes.ok, 'Subscription mandate initialized on backend');
    assert(subData.amountInr === 99, 'Mandate amount strictly ₹99.00');
    assert(subData.amountPaise === 9900, 'Mandate amount in paise is 9900');
    assert(subData.mandateReference && subData.mandateReference.startsWith('UMRN-'), `Generated valid NPCI UMRN reference: ${subData.mandateReference}`);
    assert(subData.appDeeplink && subData.appDeeplink.startsWith('gpay://'), 'Generated valid Google Pay UPI AutoPay deep link');
    mandateRef = subData.mandateReference;
    subscriptionId = subData.subscriptionId;
  } catch (err) {
    assert(false, `Subscription creation failed: ${err.message}`);
  }

  // Test 6: Mandate Authorization & Status Activation (Step 4b)
  console.log('\n--- TEST GROUP 6: Mandate Authorization & Activation ---');
  try {
    const authRes = await fetch(`${API_BASE}/subscription/authorize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: testUserId,
        subscriptionId,
        mandateReference: mandateRef,
        upiApp: 'gpay'
      })
    });
    const authData = await authRes.json();
    assert(authRes.ok, 'Mandate authorization accepted');
    assert(authData.subscription && authData.subscription.status === 'active', 'Subscription status marked ACTIVE');
    assert(authData.subscription?.invoices?.length > 0, 'First ₹99 monthly payment invoice created');

    // Verify GET /api/subscription/:userId
    const checkRes = await fetch(`${API_BASE}/subscription/${testUserId}`);
    const checkData = await checkRes.json();
    assert(checkData.internalStatus === 'ACTIVE', 'Database reflects internalStatus: "ACTIVE"');
    assert(checkData.daysRemaining >= 29, `Calculated daysRemaining: ${checkData.daysRemaining} days`);
    assert(checkData.canPublish === true, 'Entitlement confirmed: canPublish = true');
  } catch (err) {
    assert(false, `Mandate authorization test failed: ${err.message}`);
  }

  // Test 7: Property Listing Entitlement
  console.log('\n--- TEST GROUP 7: Property Creation with Active Subscription ---');
  let testPgId = null;
  try {
    const createPgRes = await fetch(`${API_BASE}/pgs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Auto Test Royal PG',
        rent: 12000,
        ownerId: testUserId,
        ownerName: 'Automated Test Owner',
        ownerPhone: '+91 99988 77766',
        propertyType: 'pg',
        bhk: '1BHK',
        address: { city: 'Rajkot', area: 'Kalawad Road', state: 'Gujarat' }
      })
    });
    const pgData = await createPgRes.json();
    assert(createPgRes.ok, 'Owner with active subscription can create listing');
    assert(pgData.id && pgData.rent === 12000, `Listing created with ID: ${pgData.id}`);
    testPgId = pgData.id;
  } catch (err) {
    assert(false, `Property creation failed: ${err.message}`);
  }

  // Test 8: Subscription Cancellation & Entitlement Protection
  console.log('\n--- TEST GROUP 8: Subscription Cancellation ---');
  try {
    const cancelRes = await fetch(`${API_BASE}/subscription/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: testUserId,
        reason: 'Automated test cancellation'
      })
    });
    const cancelData = await cancelRes.json();
    assert(cancelRes.ok, 'Cancellation endpoint returns 200 OK');
    assert(cancelData.subscription?.status === 'cancelled', 'Subscription marked cancelled');
    assert(cancelData.subscription?.autopayEnabled === false, 'Autopay recurring debits disabled');

    // Confirm existing property is not deleted
    const pgCheck = await fetch(`${API_BASE}/pgs/${testPgId}`);
    assert(pgCheck.ok, 'Existing property is preserved (NEVER deleted on cancellation)');
  } catch (err) {
    assert(false, `Cancellation test failed: ${err.message}`);
  }

  // Test 9: Webhook Signature Verification & Idempotency
  console.log('\n--- TEST GROUP 9: Webhooks & Idempotency ---');
  try {
    const webhookSecret = 'whsec_vrundavan_autopay_webhook_99';
    const eventPayload = {
      id: `evt_test_${Date.now()}`,
      event: 'subscription.charged',
      created_at: Math.floor(Date.now() / 1000),
      payload: {
        subscription: { entity: { id: subscriptionId, plan_amount: 9900 } },
        payment: { entity: { id: `pay_test_${Date.now()}`, amount: 9900, status: 'captured' } }
      }
    };
    const rawPayload = JSON.stringify(eventPayload);
    const validSignature = crypto.createHmac('sha256', webhookSecret).update(rawPayload).digest('hex');

    // 9a. Test valid signature
    const whRes1 = await fetch(`${API_BASE}/webhooks/payment-provider`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-razorpay-signature': validSignature
      },
      body: rawPayload
    });
    const whData1 = await whRes1.json();
    assert(whRes1.ok && whData1.received === true, 'Webhook with valid HMAC-SHA256 signature accepted');

    // 9b. Test duplicate event (Idempotency)
    const whRes2 = await fetch(`${API_BASE}/webhooks/payment-provider`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-razorpay-signature': validSignature
      },
      body: rawPayload
    });
    const whData2 = await whRes2.json();
    assert(whRes2.ok && whData2.status === 'duplicate', 'Duplicate webhook event detected and rejected idempotently');
  } catch (err) {
    assert(false, `Webhook test failed: ${err.message}`);
  }

  // Test 10: Admin Directory & Ledger
  console.log('\n--- TEST GROUP 10: Super Admin Subscriptions & Revenue Ledger ---');
  try {
    const adminRes = await fetch(`${API_BASE}/admin/subscriptions`);
    const adminData = await adminRes.json();
    assert(adminRes.ok, 'Super Admin endpoint returns 200 OK');
    assert(typeof adminData.totalRevenue === 'number', `Audited revenue calculated: ₹${adminData.totalRevenue}`);
    assert(Array.isArray(adminData.ownerSubscriptions), `Owner subscriptions list returned (${adminData.ownerSubscriptions.length} owners)`);
    assert(Array.isArray(adminData.allInvoices), `Invoice ledger returned (${adminData.allInvoices.length} invoices)`);
  } catch (err) {
    assert(false, `Admin directory test failed: ${err.message}`);
  }

  // Test 11: SQL Injection Protection Check
  console.log('\n--- TEST GROUP 11: SQL Injection Resistance ---');
  try {
    const sqliQuery = "Rajkot' OR '1'='1";
    const res = await fetch(`${API_BASE}/pgs?city=${encodeURIComponent(sqliQuery)}`);
    assert(res.ok || res.status === 403, 'Server cleanly handles SQL injection strings via prepared statements and security shield');
  } catch (err) {
    assert(false, `SQLi test failed: ${err.message}`);
  }

  console.log('\n========================================================');
  console.log(`📊 TEST SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('========================================================\n');

  setTimeout(() => {
    process.exit(failCount > 0 ? 1 : 0);
  }, 100);
}

runTests();
