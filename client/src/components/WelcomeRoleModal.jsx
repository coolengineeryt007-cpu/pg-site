import React from 'react';
import { 
  GraduationCap, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Zap
} from 'lucide-react';

export default function WelcomeRoleModal({ isOpen, onSelectRole }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      background: 'rgba(2, 6, 23, 0.94)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      overflowY: 'auto'
    }}>
      {/* Dynamic Background Ambient Glows */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '25%',
        width: '500px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(14, 116, 237, 0.22) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '25%',
        width: '500px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.18) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%',
        maxWidth: '920px',
        position: 'relative',
        zIndex: 2,
        margin: 'auto',
        animation: 'fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '16px' }}>
            <img 
              src="/logo.png" 
              alt="Vrundavan Ventures" 
              style={{ 
                height: '62px', 
                width: '62px', 
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid rgba(212, 175, 55, 0.75)',
                boxShadow: '0 0 18px rgba(212, 175, 55, 0.45)',
                display: 'block'
              }} 
            />
          </div>

          <h1 className="font-serif" style={{ 
            fontSize: 'clamp(1.8rem, 3.8vw, 2.7rem)', 
            fontWeight: 800, 
            color: '#ffffff', 
            marginBottom: '10px' 
          }}>
            Welcome! <span className="gold-gradient-text">How would you like to continue?</span>
          </h1>
          <p style={{ color: '#94A3B8', fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)', maxWidth: '580px', margin: '0 auto' }}>
            Select your role to personalize your experience. You can switch at any time from the top menu.
          </p>
        </div>

        {/* The Two Main Selection Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '26px'
        }}>
          {/* OPTION 1: FOR STUDENTS */}
          <div 
            onClick={() => onSelectRole('student')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') onSelectRole('student'); }}
            style={{
              background: 'linear-gradient(180deg, rgba(7, 23, 57, 0.95) 0%, rgba(4, 13, 33, 0.98) 100%)',
              border: '2px solid rgba(14, 116, 237, 0.45)',
              borderRadius: 'var(--radius-lg)',
              padding: '36px 30px',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 12px 35px -8px rgba(14, 116, 237, 0.25)'
            }}
            className="welcome-card-student"
          >
            {/* Top highlight badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(14, 116, 237, 0.3) 0%, rgba(0, 210, 180, 0.25) 100%)',
                border: '1px solid rgba(14, 116, 237, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#60A5FA',
                boxShadow: '0 4px 18px rgba(14, 116, 237, 0.4)'
              }}>
                <GraduationCap size={36} />
              </div>
              <span className="badge badge-peacock" style={{ fontSize: '0.75rem', padding: '5px 12px' }}>
                <Zap size={12} /> Instant Access
              </span>
            </div>

            <div>
              <h2 className="font-serif" style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                For Students / Tenants
              </h2>
              <p style={{ color: '#CBD5E1', fontSize: '0.94rem', lineHeight: 1.55, marginBottom: '22px' }}>
                Looking for a Paying Guest, hostel, or coliving room. 100% friction-free with zero login required.
              </p>

              {/* Bullet highlights */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#E2E8F0' }}>
                  <CheckCircle2 size={16} style={{ color: '#00D2B4', flexShrink: 0 }} />
                  <span><strong>Zero Login Needed:</strong> Instant room search</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#E2E8F0' }}>
                  <CheckCircle2 size={16} style={{ color: '#00D2B4', flexShrink: 0 }} />
                  <span><strong>GPS Near Me:</strong> Find PGs around your location</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#E2E8F0' }}>
                  <CheckCircle2 size={16} style={{ color: '#00D2B4', flexShrink: 0 }} />
                  <span><strong>Direct WhatsApp & Call:</strong> Connect with host directly</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#E2E8F0' }}>
                  <CheckCircle2 size={16} style={{ color: '#00D2B4', flexShrink: 0 }} />
                  <span><strong>Direct Connect:</strong> 100% transparent pricing</span>
                </div>
              </div>
            </div>

            <button 
              type="button"
              className="btn btn-primary btn-lg"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: 700,
                fontSize: '1rem'
              }}
            >
              <span>Explore PGs as Student</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* OPTION 2: FOR PG OWNERS */}
          <div 
            onClick={() => onSelectRole('owner')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') onSelectRole('owner'); }}
            style={{
              background: 'linear-gradient(180deg, rgba(7, 23, 57, 0.95) 0%, rgba(4, 13, 33, 0.98) 100%)',
              border: '2px solid rgba(212, 175, 55, 0.45)',
              borderRadius: 'var(--radius-lg)',
              padding: '36px 30px',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 12px 35px -8px rgba(212, 175, 55, 0.25)'
            }}
            className="welcome-card-owner"
          >
            {/* Top highlight badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(245, 197, 66, 0.2) 100%)',
                border: '1px solid rgba(212, 175, 55, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FDE68A',
                boxShadow: '0 4px 18px rgba(212, 175, 55, 0.4)'
              }}>
                <Building2 size={36} />
              </div>
              <span className="badge badge-gold" style={{ fontSize: '0.75rem', padding: '5px 12px' }}>
                <Sparkles size={12} /> Host Portal
              </span>
            </div>

            <div>
              <h2 className="font-serif" style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                For PG Owners / Hosts
              </h2>
              <p style={{ color: '#CBD5E1', fontSize: '0.94rem', lineHeight: 1.55, marginBottom: '22px' }}>
                Manage your properties, fill vacant beds faster, and receive direct student leads.
              </p>

              {/* Bullet highlights */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#E2E8F0' }}>
                  <CheckCircle2 size={16} style={{ color: '#D4AF37', flexShrink: 0 }} />
                  <span><strong>Direct Tenant Rent:</strong> Keep 100% of your rent income</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#D4AF37', flexShrink: 0 }}>
                  <CheckCircle2 size={16} style={{ color: '#D4AF37', flexShrink: 0 }} />
                  <span><strong>Google Maps Auto-fill:</strong> Instant address & pin detection</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#E2E8F0' }}>
                  <CheckCircle2 size={16} style={{ color: '#D4AF37', flexShrink: 0 }} />
                  <span><strong>Direct Leads:</strong> Receive verified tenant calls & WhatsApp</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#E2E8F0' }}>
                  <CheckCircle2 size={16} style={{ color: '#D4AF37', flexShrink: 0 }} />
                  <span><strong>Host Dashboard:</strong> Manage sharing types, pricing & rooms</span>
                </div>
              </div>
            </div>

            <button 
              type="button"
              className="btn btn-gold btn-lg"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: 700,
                fontSize: '1rem'
              }}
            >
              <span>Enter as PG Owner / Host</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Footer info note */}
        <div style={{ textAlign: 'center', color: '#64748B', fontSize: '0.82rem' }}>
          💡 Tip: You can switch between Student and Owner mode at any time using the toggle pill at the top of the website.
        </div>
      </div>

      <style>{`
        .welcome-card-student:hover {
          transform: translateY(-6px);
          border-color: #3B82F6 !important;
          box-shadow: 0 20px 45px -10px rgba(14, 116, 237, 0.45) !important;
        }
        .welcome-card-owner:hover {
          transform: translateY(-6px);
          border-color: #F5C542 !important;
          box-shadow: 0 20px 45px -10px rgba(212, 175, 55, 0.45) !important;
        }
      `}</style>
    </div>
  );
}
