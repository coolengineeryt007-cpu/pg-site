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
          <span>Simple Rules & Legal Terms</span>
        </div>

        <h1 className="font-serif gold-gradient-text" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginBottom: '12px' }}>
          Terms of Service & Policies
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem', maxWidth: '780px', margin: '0 auto', lineHeight: 1.6 }}>
          Clear, honest, and simple rules for students, renters, and property owners. Formulated in compliance with Indian cyber laws and RBI guidelines.
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
            <span>Host ₹99 Autopay Terms</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`btn btn-sm ${activeTab === 'privacy' ? 'btn-gold' : 'btn-ghost'}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Lock size={15} />
            <span>Privacy & GPS Policy</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('grievance')}
            className={`btn btn-sm ${activeTab === 'grievance' ? 'btn-crimson' : 'btn-ghost'}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <ShieldCheck size={15} />
            <span>Help & Grievance Support</span>
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
                  Updated: October 2026 • Governed under the Information Technology Act, 2000 & Intermediary Rules
                </div>
              </div>
              <span className="badge badge-gold" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                Simple & Clear
              </span>
            </div>

            <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.15rem', marginTop: '22px', marginBottom: '8px' }}>
              1. How Vrundavan Ventures Works
            </h3>
            <p>
              Vrundavan Ventures is an online platform that connects people searching for accommodation (students, working bachelors, corporate professionals, families) directly with verified property owners and landlords. We do not act as a broker or middleman, and we do not take commissions on rent.
            </p>

            <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.15rem', marginTop: '22px', marginBottom: '8px' }}>
              2. Free for Students and Tenants
            </h3>
            <p>
              We believe in complete transparency:
            </p>
            <ul style={{ paddingLeft: '22px', margin: '8px 0 16px 0' }}>
              <li>
                <strong>Students & Tenants:</strong> Searching properties, checking real photos, viewing live GPS map distances, and calling or messaging owners on WhatsApp is <strong>100% Free</strong> forever. Tenants are never asked to pay any fee or brokerage to our website.
              </li>
              <li>
                <strong>Property Owners & Landlords:</strong> Owners pay a simple ₹99 per month plan to keep their listings active, display the Verified Host shield, and receive direct tenant leads.
              </li>
            </ul>

            <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.15rem', marginTop: '22px', marginBottom: '8px' }}>
              3. Direct Rent & Deposit Agreements
            </h3>
            <p>
              All rental details—including monthly rent, security deposit, notice period (standard 30 days), and house rules—are agreed upon directly between the property owner and the tenant. Both parties should sign a standard rental agreement and complete local police verification as required by law.
            </p>

            <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.15rem', marginTop: '22px', marginBottom: '8px' }}>
              4. Honest Listings & Real Photos
            </h3>
            <p>
              All property owners must provide honest descriptions and genuine room photos. Fake photos, misleading rent prices, or abusive behavior are strictly banned. Any listing violating these standards is removed immediately.
            </p>

            <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.15rem', marginTop: '22px', marginBottom: '8px' }}>
              5. Safe Renting Advice
            </h3>
            <p>
              We always advise every tenant to visit the room in person or take a live WhatsApp video tour before transferring any deposit money. Never transfer funds without confirming property details directly with the landlord.
            </p>
          </div>
        )}

        {/* TAB 2: HOST SUBSCRIPTION & RECURRING AUTOPAY POLICY */}
        {activeTab === 'subscription' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px', marginBottom: '24px' }}>
              <div>
                <h2 className="font-serif" style={{ color: '#fff', fontSize: '1.65rem', margin: '0 0 6px 0' }}>
                  Host ₹99 Monthly Plan & Autopay Terms
                </h2>
                <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                  Formulated under RBI e-Mandate Guidelines & Consumer Protection Rules
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
                <span>Host Plan Summary</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '10px', fontSize: '0.88rem' }}>
                <div><strong>Activation Fee:</strong> ₹99 for 30 days</div>
                <div><strong>Monthly Renewal:</strong> ₹99 every 30 days (Auto-deducted)</div>
                <div><strong>Payment Method:</strong> UPI Autopay (GPay, PhonePe, Paytm, BHIM)</div>
                <div><strong>Cancellation:</strong> 1-Click anytime in your Dashboard</div>
              </div>
            </div>

            <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.15rem', marginTop: '22px', marginBottom: '8px' }}>
              1. Who Pays the ₹99 Plan?
            </h3>
            <p>
              The ₹99 monthly plan is only for <strong>Property Owners and Landlords</strong> who want to publish their PGs, flats, and rooms, manage leads, and display verified badges. It is always 100% free for students and tenants looking for a stay.
            </p>

            <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.15rem', marginTop: '22px', marginBottom: '8px' }}>
              2. Safe & Transparent UPI Autopay
            </h3>
            <p>
              In line with Reserve Bank of India (RBI) rules:
            </p>
            <ul style={{ paddingLeft: '22px', margin: '8px 0 16px 0' }}>
              <li>
                <strong>Your Approval:</strong> You approve the ₹99 monthly plan once using your preferred UPI app (Google Pay, PhonePe, Paytm, BHIM) with your secure UPI PIN.
              </li>
              <li>
                <strong>30-Day Cycle:</strong> ₹99 is deducted automatically every 30 days to keep your listings active.
              </li>
              <li>
                <strong>Instant Receipts:</strong> You receive an instant digital invoice and SMS/UPI alert every time a renewal occurs.
              </li>
            </ul>

            <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.15rem', marginTop: '22px', marginBottom: '8px' }}>
              3. Cancel Anytime with 1 Click
            </h3>
            <p>
              You have full control. You can cancel your ₹99 autopay plan at any time directly from your Host Dashboard:
            </p>
            <ul style={{ paddingLeft: '22px', margin: '8px 0 16px 0' }}>
              <li>No cancellation fees, no hidden charges, and no long-term contracts.</li>
              <li>Your listings remain active and visible until your current 30-day period ends.</li>
              <li>No further deductions will happen after cancellation.</li>
            </ul>

            <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.15rem', marginTop: '22px', marginBottom: '8px' }}>
              4. Invoices & Receipts
            </h3>
            <p>
              Every payment generates an official, printable invoice with a unique invoice number (e.g., INV-1001). You can view and download all your past receipts in your dashboard whenever needed.
            </p>

            <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.15rem', marginTop: '22px', marginBottom: '8px' }}>
              5. Fair Refund Policy
            </h3>
            <p>
              The ₹99 subscription is an active listing fee and is non-refundable once activated for a 30-day period. However, if there is any accidental double charge due to a bank technical error, the extra amount is automatically refunded to your original bank account within 5–7 working days.
            </p>
          </div>
        )}

        {/* TAB 3: PRIVACY & GEOLOCATION POLICY */}
        {activeTab === 'privacy' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px', marginBottom: '24px' }}>
              <div>
                <h2 className="font-serif" style={{ color: '#fff', fontSize: '1.65rem', margin: '0 0 6px 0' }}>
                  Privacy & GPS Policy
                </h2>
                <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                  Protected under Indian Information Technology and Data Privacy Rules
                </div>
              </div>
              <span className="badge badge-blue" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                Safe & Private
              </span>
            </div>

            <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.15rem', marginTop: '22px', marginBottom: '8px' }}>
              1. What Information We Collect
            </h3>
            <p>
              We collect only the basic information required to help you rent safely:
            </p>
            <ul style={{ paddingLeft: '22px', margin: '8px 0 16px 0' }}>
              <li><strong>Contact Info:</strong> Your name, mobile number, and email.</li>
              <li><strong>Property Details (For Owners):</strong> Address, room pictures, rent prices, and house rules.</li>
              <li><strong>Secure Payments:</strong> Payments are processed through RBI-approved UPI gateways. We never see or store your bank passwords or card CVVs.</li>
            </ul>

            <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.15rem', marginTop: '22px', marginBottom: '8px' }}>
              2. How the "Near Me" GPS Feature Works
            </h3>
            <p>
              When you click "Near Me", we only use your phone or browser location in real-time to calculate walking and driving distances to nearby properties. We do not track where you go, and we do not store your location history.
            </p>

            <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.15rem', marginTop: '22px', marginBottom: '8px' }}>
              3. Zero Spam Guarantee
            </h3>
            <p>
              Your contact details are shared only with the specific landlord when you choose to inquire about a property. We never sell, rent, or share your phone number with telemarketers or advertisers.
            </p>
          </div>
        )}

        {/* TAB 4: STATUTORY GRIEVANCE REDRESSAL */}
        {activeTab === 'grievance' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px', marginBottom: '24px' }}>
              <div>
                <h2 className="font-serif" style={{ color: '#fff', fontSize: '1.65rem', margin: '0 0 6px 0' }}>
                  Help & Grievance Support
                </h2>
                <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                  Official Grievance Redressal under IT Rules 2021 & Consumer Protection Rules
                </div>
              </div>
              <span className="badge badge-crimson" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                We Are Here to Help
              </span>
            </div>

            <p>
              If you have any complaint, billing doubt, or need help regarding a property listing, you can contact our Grievance Officer directly:
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
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Grievance Officer</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                    Adv. R. K. Vaghela
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#F87171', fontWeight: 600 }}>
                    Legal & Support Department
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Support Email</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fde047', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={16} />
                    <span>grievance@vrundavanventures.com</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                    Customer Desk: support@vrundavanventures.com
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Registered Office</div>
                  <div style={{ fontSize: '0.9rem', color: '#fff', marginTop: '4px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                    <MapPin size={16} style={{ flexShrink: 0, marginTop: '3px', color: '#F87171' }} />
                    <span>
                      Vrundavan Ventures, Kalawad Road / 150 Feet Ring Road, Rajkot, Gujarat - 360005, India
                    </span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Our Response Promise</div>
                  <div style={{ fontSize: '0.9rem', color: '#fff', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={16} style={{ color: '#34D399' }} />
                    <span>First Reply: Within <strong>48 Hours</strong></span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    Full Resolution: Within <strong>7–15 Days</strong>
                  </div>
                </div>
              </div>
            </div>

            <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.15rem', marginTop: '22px', marginBottom: '8px' }}>
              How to Submit a Complaint
            </h3>
            <ol style={{ paddingLeft: '22px', margin: '8px 0 16px 0', lineHeight: 1.8 }}>
              <li>
                <strong>Send an Email:</strong> Email us at <code style={{ color: '#fde047' }}>grievance@vrundavanventures.com</code> with your name, phone number, and issue details.
              </li>
              <li>
                <strong>Ticket Created:</strong> You will get an acknowledgment within 48 hours with a support ticket number.
              </li>
              <li>
                <strong>Quick Resolution:</strong> Our team will review the issue, speak with both parties if needed, and resolve it quickly and fairly.
              </li>
            </ol>

            <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.15rem', marginTop: '22px', marginBottom: '8px' }}>
              Governing Law
            </h3>
            <p>
              These terms are governed by the laws of India. Any legal dispute shall fall under the jurisdiction of the courts in <strong>Rajkot, Gujarat, India</strong>.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
