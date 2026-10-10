import React, { useState } from 'react';

export default function Legal({ initialTab = 'terms' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '90px', maxWidth: '920px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="font-serif gold-gradient-text" style={{ fontSize: '2.5rem', marginBottom: '12px' }}>
          Legal Policies & Compliance
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Standardized frameworks ensuring tenant safety, transparent security deposits, and privacy protection.
        </p>

        <div style={{ display: 'inline-flex', gap: '12px', marginTop: '20px' }}>
          <button 
            onClick={() => setActiveTab('terms')}
            className={`btn btn-sm ${activeTab === 'terms' ? 'btn-gold' : 'btn-ghost'}`}
          >
            Terms & Conditions
          </button>
          <button 
            onClick={() => setActiveTab('privacy')}
            className={`btn btn-sm ${activeTab === 'privacy' ? 'btn-crimson' : 'btn-ghost'}`}
          >
            Privacy Policy
          </button>
        </div>
      </div>

      <div className="luxury-card" style={{ padding: '45px', lineHeight: 1.85, color: 'var(--text-secondary)' }}>
        {activeTab === 'terms' ? (
          <div>
            <h2 className="font-serif" style={{ color: '#fff', fontSize: '1.6rem', marginBottom: '16px' }}>
              Terms & Conditions of Accommodation
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '24px' }}>
              Effective Date: January 1, 2025 • Governed under the Model Tenancy Act & Indian Contract Act
            </p>

            <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.2rem', marginTop: '20px', marginBottom: '8px' }}>
              1. Platform Relationship & Zero Brokerage
            </h3>
            <p style={{ marginBottom: '16px' }}>
              Vrundavan Ventures operates as a curated discovery and verification platform connecting students/tenants directly with vetted Paying Guest hosts. Vrundavan Ventures charges ₹0 brokerage fee from students for exploring, scheduling visits, or reserving properties.
            </p>

            <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.2rem', marginTop: '20px', marginBottom: '8px' }}>
              2. Security Deposit Refund Guarantee
            </h3>
            <p style={{ marginBottom: '16px' }}>
              Property Owners listed on Vrundavan Ventures agree to a maximum 30-day departure notice standard. Upon standard key handover and deduction of agreed utility/maintenance dues, all security deposits must be refunded via bank transfer or UPI within 7 business days.
            </p>

            <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.2rem', marginTop: '20px', marginBottom: '8px' }}>
              3. Safety & Biometric Access
            </h3>
            <p style={{ marginBottom: '16px' }}>
              Residents must respect fellow inhabitants and observe safety protocols. Any illegal substance possession or breach of biometric entry gates will lead to immediate cancellation of tenancy without refund.
            </p>
          </div>
        ) : (
          <div>
            <h2 className="font-serif" style={{ color: '#fff', fontSize: '1.6rem', marginBottom: '16px' }}>
              Privacy & Geolocation Policy
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '24px' }}>
              Effective Date: January 1, 2025 • Compliant with Information Technology Rules, 2021
            </p>

            <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.2rem', marginTop: '20px', marginBottom: '8px' }}>
              1. Location Data & Google Maps Integration
            </h3>
            <p style={{ marginBottom: '16px' }}>
              When you permit location access on Vrundavan Ventures, we utilize your device coordinates exclusively in real-time to compute proximity distance to nearby verified residences via Google Maps API. We do NOT store your continuous GPS location history or share device telemetry with third-party advertisers.
            </p>

            <h3 style={{ color: 'var(--gold-primary)', fontSize: '1.2rem', marginTop: '20px', marginBottom: '8px' }}>
              2. Protection of Student & Host Contact Details
            </h3>
            <p style={{ marginBottom: '16px' }}>
              Your phone number and inquiry details are shared strictly with the host of the specific property for which you submit a visit request or inquiry. We enforce strict zero-spam protocols.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
