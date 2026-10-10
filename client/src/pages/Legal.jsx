import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  CreditCard, 
  Lock, 
  CheckCircle2, 
  Scale, 
  Mail, 
  MapPin, 
  Clock 
} from 'lucide-react';

export default function Legal({ initialTab = 'terms' }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'terms', 'subscription', 'privacy', 'grievance'

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '90px', maxWidth: '1020px' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '999px',
          background: 'rgba(212, 175, 55, 0.12)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          color: 'var(--gold-primary)',
          fontSize: '0.82rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '14px'
        }}>
          <Scale size={15} />
          <span>Statutory Compliance & Legal Governance</span>
        </div>

        <h1 className="font-serif gold-gradient-text" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginBottom: '12px' }}>
          Terms of Service & Regulatory Policies
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem', maxWidth: '780px', margin: '0 auto', lineHeight: 1.6 }}>
          Standardized frameworks formulated in strict accordance with the Information Technology Act 2000, 
          Consumer Protection (E-Commerce) Rules 2020, and Reserve Bank of India (RBI) e-Mandate Regulations.
        </p>

        {/* Tab Selection Row */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '10px', 
          marginTop: '26px',
          flexWrap: 'wrap'
        }}>
          <button 
            type="button"
            onClick={() => setActiveTab('terms')}
            className={`btn btn-sm ${activeTab === 'terms' ? 'btn-gold' : 'btn-ghost'}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <FileText size={15} />
            <span>Terms of Service</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('subscription')}
            className={`btn btn-sm ${activeTab === 'subscription' ? 'btn-gold' : 'btn-ghost'}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <CreditCard size={15} />
            <span>Host ₹99 Autopay Policy</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`btn btn-sm ${activeTab === 'privacy' ? 'btn-gold' : 'btn-ghost'}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Lock size={15} />
            <span>Privacy & Geolocation</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('grievance')}
            className={`btn btn-sm ${activeTab === 'grievance' ? 'btn-crimson' : 'btn-ghost'}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <ShieldCheck size={15} />
            <span>Grievance Redressal</span>
          </button>
        </div>
      </div>

      {/* Main Content Luxury Card */}
      <div className="luxury-card" style={{ padding: '42px 48px', lineHeight: 1.85, color: '#CBD5E1', fontSize: '0.94rem' }}>
        
        {/* TAB 1: GENERAL TERMS OF SERVICE */}
        {activeTab === 'terms' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px', marginBottom: '24px' }}>
              <div>
                <h2 className="font-serif" style={{ color: '#fff', fontSize: '1.65rem', margin: '0 0 6px 0' }}>
                  Platform Terms of Service
                </h2>
                <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                  Effective Date: October 2026 • Electronic Record under Information Technology Act, 2000 & Rule 3(1) of IT Intermediary Rules, 2021
                </div>
              </div>
              <span className="badge badge-gold" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                Legal Intermediary
              </span>
            </div>

            <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.15rem', marginTop: '22px', marginBottom: '8px' }}>
              1. Platform Nature & Intermediary Classification
            </h3>
            <p>
              Vrundavan Ventures ("Platform", "We", "Us") operates strictly as an electronic technology platform and intermediary as defined under Section 2(1)(w) of the Information Technology Act, 2000. 
              The Platform facilitates discovery and direct interaction between prospective tenants (students, working bachelors, corporate professionals, families) and property hosts/landlords. 
              Vrundavan Ventures does not act as a real estate broker, leasing agent, landlord, or guarantor for any rental premises.
            </p>

            <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.15rem', marginTop: '22px', marginBottom: '8px' }}>
              2. User Tier Separation & Fee Exemption for Students/Tenants
            </h3>
            <p>
              In compliance with consumer transparency standards:
            </p>
            <ul style={{ paddingLeft: '22px', margin: '8px 0 16px 0' }}>
              <li>
                <strong>Students & Home Seekers:</strong> Access to accommodation exploration, interactive Google Maps GPS proximity calculation, property inspection requests, and direct communication with verified hosts is <strong>100% Free</strong>. Students and tenants are never charged any recurring fees, commissions, or platform subscriptions.
              </li>
              <li>
                <strong>Property Hosts & Landlords:</strong> Property hosts must maintain an active <strong>Host Partnership Subscription</strong> (₹99 initial activation for 30 days + ₹99 recurring autopay every 30 days) to list properties, access verified tenant leads, and display the Verified Host badge.
              </li>
            </ul>

            <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.15rem', marginTop: '22px', marginBottom: '8px' }}>
              3. Independent Tenancy & Security Deposit Agreements
            </h3>
            <p>
              All rental terms—including monthly rent, security deposit amounts, maintenance dues, move-in notice periods (standard 30-day notice), and house rules—are entered into directly between the property owner and the tenant. 
              Property hosts are obligated under Indian Law to execute formal rental agreements and complete local police verification for all tenants as mandated by the relevant municipal and state authorities (e.g. Model Tenancy Act provisions).
            </p>

            <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.15rem', marginTop: '22px', marginBottom: '8px' }}>
              4. Prohibited Content & Listing Authenticity
            </h3>
            <p>
              Under Rule 3(1)(b) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, users and hosts are strictly prohibited from publishing listings or information that is false, misleading, defamatory, obscene, infringing on third-party intellectual property, or violative of Indian law. 
              Vrundavan Ventures reserves the unconditional right to suspend or remove any non-compliant listing without liability.
            </p>

            <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.15rem', marginTop: '22px', marginBottom: '8px' }}>
              5. Limitation of Liability & Safe Harbor
            </h3>
            <p>
              Under Section 79 of the Information Technology Act, 2000, Vrundavan Ventures shall not be liable for any third-party content, actions, tenancy disputes, damages, or breaches committed by landlords or tenants. 
              Users agree to conduct their own due diligence, visit premises physically, and verify documentation prior to transferring rental deposits.
            </p>
          </div>
        )}

        {/* TAB 2: HOST SUBSCRIPTION & RECURRING AUTOPAY POLICY */}
        {activeTab === 'subscription' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px', marginBottom: '24px' }}>
              <div>
                <h2 className="font-serif" style={{ color: '#fff', fontSize: '1.65rem', margin: '0 0 6px 0' }}>
                  Host Partnership Subscription & Autopay Terms
                </h2>
                <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                  Formulated under RBI Circular on e-Mandates for Recurring Transactions (RBI/2020-21/74) & Consumer Protection (E-Commerce) Rules, 2020
                </div>
              </div>
              <span className="badge badge-gold" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                ₹99 / 30 Days Autopay
              </span>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.1) 0%, rgba(15, 23, 42, 0.6) 100%)',
              border: '1px solid rgba(234, 179, 8, 0.3)',
              borderRadius: '12px',
              padding: '18px 22px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#facc15', fontWeight: 800, fontSize: '1.05rem', marginBottom: '6px' }}>
                <CheckCircle2 size={18} />
                <span>Host Pricing Model Summary</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '10px', fontSize: '0.88rem' }}>
                <div><strong>Initial Activation:</strong> ₹99 (30-day listing & lead access)</div>
                <div><strong>Recurring Autopay:</strong> ₹99 every 30 days (Auto-deducted)</div>
                <div><strong>Autopay Mode:</strong> NPCI UPI Autopay / Card e-Mandate</div>
                <div><strong>Cancellation:</strong> 1-Click anytime in Dashboard</div>
              </div>
            </div>

            <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.15rem', marginTop: '22px', marginBottom: '8px' }}>
              1. Scope & Applicability
            </h3>
            <p>
              The ₹99 subscription is exclusively mandatory for <strong>Property Owners and Landlords</strong> who register to list properties, manage vacancies, and receive verified student and professional tenant leads on the Platform. 
              Students and tenants browsing listings are completely exempt from any subscription or payment requirement.
            </p>

            <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.15rem', marginTop: '22px', marginBottom: '8px' }}>
              2. Explicit Electronic Mandate Authorization (RBI Compliance)
            </h3>
            <p>
              In accordance with Reserve Bank of India directives regarding e-mandates on cards and Unified Payments Interface (UPI) for recurring transactions:
            </p>
            <ul style={{ paddingLeft: '22px', margin: '8px 0 16px 0' }}>
              <li>
                <strong>Initial Consent:</strong> The initial authorization of ₹99 requires explicit, multi-factor authentication by the host via NPCI-approved UPI apps (Google Pay, PhonePe, Paytm, BHIM) or bank-issued debit/credit card.
              </li>
              <li>
                <strong>Mandate Registration:</strong> An e-mandate (NPCI Mandate ID) is registered for ₹99 recurring deduction with a fixed billing cycle frequency of 30 days.
              </li>
              <li>
                <strong>Pre-Debit & Transaction Receipts:</strong> Property hosts receive pre-transaction alerts and electronic Tax Invoices detailing the Mandate ID, Transaction Reference, and timestamp upon every successful renewal.
              </li>
            </ul>

            <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.15rem', marginTop: '22px', marginBottom: '8px' }}>
              3. Right to Revoke / 1-Click Mandate Cancellation
            </h3>
            <p>
              In adherence to RBI circular guidelines guaranteeing consumer control over recurring payments, the property host reserves the unconditional statutory right to cancel, revoke, or pause their recurring autopay mandate at any time directly through the Owner Dashboard. 
              Upon cancellation:
            </p>
            <ul style={{ paddingLeft: '22px', margin: '8px 0 16px 0' }}>
              <li>No further automatic deductions of ₹99 will occur.</li>
              <li>Existing listing benefits and verified partner badges remain active until the end of the currently active 30-day cycle.</li>
              <li>No cancellation fees, penalties, or hidden charges apply.</li>
            </ul>

            <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.15rem', marginTop: '22px', marginBottom: '8px' }}>
              4. Invoicing & Digital Tax Receipts
            </h3>
            <p>
              In compliance with the Consumer Protection (E-Commerce) Rules, 2020, every host payment—including the initial ₹99 activation and subsequent ₹99 recurring debits—generates an official, printable Tax Invoice with a unique invoice number (e.g. INV-1001), transaction reference, and host identification details, stored permanently in the host portal.
            </p>

            <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.15rem', marginTop: '22px', marginBottom: '8px' }}>
              5. Refund & Chargeback Policy
            </h3>
            <p>
              The ₹99 subscription is a digital service fee for platform hosting, listing promotion, and lead generation. Once the host listing portal is activated for a 30-day cycle, the subscription fee for that cycle is non-refundable. 
              However, in the event of an erroneous technical duplicate deduction, the extra amount will be automatically reversed to the host's original payment method within 5–7 banking days upon notifying support.
            </p>
          </div>
        )}

        {/* TAB 3: PRIVACY & GEOLOCATION POLICY */}
        {activeTab === 'privacy' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px', marginBottom: '24px' }}>
              <div>
                <h2 className="font-serif" style={{ color: '#fff', fontSize: '1.65rem', margin: '0 0 6px 0' }}>
                  Privacy & Geolocation Policy
                </h2>
                <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                  Compliant with Information Technology (Reasonable Security Practices and Procedures) Rules, 2011 & DPDP Act Framework
                </div>
              </div>
              <span className="badge badge-blue" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                Encrypted & Protected
              </span>
            </div>

            <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.15rem', marginTop: '22px', marginBottom: '8px' }}>
              1. Information We Collect
            </h3>
            <p>
              We collect minimal personal data strictly necessary to facilitate verified accommodations:
            </p>
            <ul style={{ paddingLeft: '22px', margin: '8px 0 16px 0' }}>
              <li><strong>Contact Credentials:</strong> Full name, verified mobile phone number, email address.</li>
              <li><strong>Host Property Metadata:</strong> Property address, geolocation coordinates, room configurations, amenities, pricing, and bank payout details for deposit escrow tracking.</li>
              <li><strong>Payment Mandate Data:</strong> Tokenized mandate IDs and transaction references processed via PCI-DSS and RBI-compliant gateways. We do NOT store card CVVs or bank passwords.</li>
            </ul>

            <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.15rem', marginTop: '22px', marginBottom: '8px' }}>
              2. Real-Time GPS & Google Maps Proximity
            </h3>
            <p>
              When a user activates the "Near Me" feature, device GPS coordinates (latitude and longitude) are accessed strictly in real-time on the client device to compute road distance to nearby verified residences via Google Maps API. 
              We do NOT store continuous historical GPS trails or transmit location telemetry to third-party ad networks.
            </p>

            <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.15rem', marginTop: '22px', marginBottom: '8px' }}>
              3. Data Sharing & Direct Tenant-Host Connection
            </h3>
            <p>
              Your contact details are shared exclusively between the verified student/tenant and the specific property host when an inquiry or visit is submitted. 
              We do not sell, rent, or monetize user data to telemarketers or third-party advertising brokers.
            </p>
          </div>
        )}

        {/* TAB 4: STATUTORY GRIEVANCE REDRESSAL */}
        {activeTab === 'grievance' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px', marginBottom: '24px' }}>
              <div>
                <h2 className="font-serif" style={{ color: '#fff', fontSize: '1.65rem', margin: '0 0 6px 0' }}>
                  Statutory Grievance Redressal Mechanism
                </h2>
                <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                  Mandatory Disclosure under Rule 3(2) of Information Technology (Intermediary Guidelines) Rules, 2021 & Consumer Protection Rules, 2020
                </div>
              </div>
              <span className="badge badge-crimson" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                Official Redressal
              </span>
            </div>

            <p>
              In compliance with the Information Technology Act, 2000 and the Consumer Protection (E-Commerce) Rules, 2020, 
              the details of the designated <strong>Grievance Officer</strong> for Vrundavan Ventures are published below:
            </p>

            {/* Officer Details Card */}
            <div style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1.5px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '16px',
              padding: '24px 28px',
              marginTop: '20px',
              marginBottom: '26px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Designated Grievance Officer</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                    Adv. R. K. Vaghela
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#F87171', fontWeight: 600 }}>
                    Directorate of Legal & Compliance
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Official Grievance Email</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fde047', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={16} />
                    <span>grievance@vrundavanventures.com</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                    Direct Escrow Desk: support@luxurypg.com
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Jurisdiction & Registered Office</div>
                  <div style={{ fontSize: '0.9rem', color: '#fff', marginTop: '4px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                    <MapPin size={16} style={{ flexShrink: 0, marginTop: '3px', color: '#F87171' }} />
                    <span>
                      Vrundavan Ventures Luxury Accommodations, Kalawad Road / 150 Feet Ring Road, Rajkot, Gujarat - 360005, India
                    </span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Statutory Timelines</div>
                  <div style={{ fontSize: '0.9rem', color: '#fff', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={16} style={{ color: '#34D399' }} />
                    <span>Acknowledgment: Within <strong>48 Hours</strong></span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    Final Resolution: Within <strong>30 Days</strong>
                  </div>
                </div>
              </div>
            </div>

            <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.15rem', marginTop: '22px', marginBottom: '8px' }}>
              Grievance Filing Procedure
            </h3>
            <ol style={{ paddingLeft: '22px', margin: '8px 0 16px 0', lineHeight: 1.8 }}>
              <li>
                <strong>Submission:</strong> Email your complaint to <code style={{ color: '#fde047' }}>grievance@vrundavanventures.com</code> detailing the user email, property ID, transaction reference / mandate ID (if billing related), and specific issue.
              </li>
              <li>
                <strong>Acknowledgment:</strong> You will receive an official ticket acknowledgment with reference tracking within 48 hours.
              </li>
              <li>
                <strong>Investigation & Resolution:</strong> The compliance team will investigate the facts, contact both parties if a dispute exists, and provide a reasoned resolution within 30 days as prescribed under the IT Rules, 2021.
              </li>
            </ol>

            <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.15rem', marginTop: '22px', marginBottom: '8px' }}>
              Governing Law & Dispute Jurisdiction
            </h3>
            <p>
              These Terms, policies, and all transactions shall be governed by and interpreted in accordance with the laws of the Republic of India. 
              Subject to applicable alternative dispute resolution procedures, the Courts at <strong>Rajkot, Gujarat, India</strong> shall possess exclusive jurisdiction over any legal proceedings arising hereunder.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
