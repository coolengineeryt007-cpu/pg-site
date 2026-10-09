import React from 'react';
import { 
  Home as HomeIcon,
  GraduationCap, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  MapPin, 
  PhoneCall, 
  ShieldCheck, 
  Sparkles,
  Zap,
  Crown,
  Compass,
  PlusCircle,
  HelpCircle,
  Users
} from 'lucide-react';

export default function MainGateway({ onSelectStudent, onSelectOwner }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      background: 'var(--bg-primary)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Ambient Radial Glows */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '20%',
        width: '650px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(14, 116, 237, 0.22) 0%, transparent 65%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '5%',
        right: '15%',
        width: '650px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.16) 0%, transparent 65%)',
        pointerEvents: 'none'
      }} />

      {/* 1. Header with Brand Emblem */}
      <header style={{
        padding: '24px 0',
        borderBottom: '1px solid rgba(14, 116, 237, 0.2)',
        background: 'rgba(4, 13, 33, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        position: 'relative',
        zIndex: 10
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          {/* Brand Logo - Only Logo, No Extra Text */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src="/logo.png" 
              alt="Vrundavan Ventures" 
              style={{ 
                height: '74px', 
                width: '74px', 
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2.5px solid rgba(212, 175, 55, 0.85)',
                boxShadow: '0 0 22px rgba(212, 175, 55, 0.55)',
                display: 'block'
              }} 
            />
          </div>

          {/* Quick Concierge Support Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            <PhoneCall size={15} style={{ color: 'var(--gold-primary)' }} />
            <span>Toll-Free Concierge: <strong style={{ color: '#fff' }}>+91 1800 212 9999</strong></span>
          </div>
        </div>
      </header>

      {/* 2. Main Center Content: ONLY THE TWO OPTIONS */}
      <main className="container" style={{
        paddingTop: '50px',
        paddingBottom: '60px',
        position: 'relative',
        zIndex: 5,
        textAlign: 'center',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        {/* Prestige Badge */}
        <div style={{ marginBottom: '16px' }}>
          <span className="badge badge-gold" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
            <Crown size={14} /> Official Rental Residences & Housing Access Portal
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="font-serif" style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
          fontWeight: 900,
          color: '#ffffff',
          lineHeight: 1.2,
          marginBottom: '16px'
        }}>
          Find PGs, Rental Rooms & Houses <br />
          <span className="gold-gradient-text">Choose Your Portal to Continue</span>
        </h1>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          maxWidth: '740px',
          margin: '0 auto 46px auto',
          lineHeight: 1.6
        }}>
          India's trusted 0% brokerage rental platform connecting tenants, families, working professionals, and students directly with verified property owners.
        </p>

        {/* The TWO Interactive Portal Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          maxWidth: '960px',
          margin: '0 auto',
          width: '100%'
        }}>
          {/* OPTION 1: FOR TENANTS & HOME SEEKERS (PGs, Rooms, Houses) */}
          <div 
            onClick={onSelectStudent}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') onSelectStudent(); }}
            className="gateway-card gateway-card-student"
            style={{
              background: 'linear-gradient(180deg, rgba(7, 23, 57, 0.95) 0%, rgba(4, 13, 33, 0.98) 100%)',
              border: '2px solid rgba(14, 116, 237, 0.5)',
              borderRadius: 'var(--radius-lg)',
              padding: '40px 32px',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 20px 45px -10px rgba(14, 116, 237, 0.25)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              position: 'relative'
            }}
          >
            <div>
              {/* Card Top Icon & Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '18px',
                  background: 'linear-gradient(135deg, rgba(14, 116, 237, 0.3) 0%, rgba(0, 210, 180, 0.25) 100%)',
                  border: '1px solid rgba(14, 116, 237, 0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#60A5FA',
                  boxShadow: '0 4px 20px rgba(14, 116, 237, 0.4)'
                }}>
                  <HomeIcon size={38} />
                </div>
                <span className="badge badge-peacock" style={{ fontSize: '0.78rem', padding: '6px 14px' }}>
                  <Zap size={12} /> Instant Access • Zero Login
                </span>
              </div>

              {/* Title & Description */}
              <h2 className="font-serif" style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', marginBottom: '10px' }}>
                For Tenants & Home Seekers
              </h2>
              <p style={{ color: '#CBD5E1', fontSize: '0.96rem', lineHeight: 1.6, marginBottom: '26px' }}>
                Find verified PGs, private rental rooms (1RK), and rental houses/flats (1BHK/2BHK/3BHK) for families, working professionals, and students.
              </p>

              {/* Bullet Points */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', color: '#E2E8F0' }}>
                  <CheckCircle2 size={17} style={{ color: '#00D2B4', flexShrink: 0 }} />
                  <span><strong>Zero Login Required:</strong> Browse rooms & houses instantly</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', color: '#E2E8F0' }}>
                  <CheckCircle2 size={17} style={{ color: '#00D2B4', flexShrink: 0 }} />
                  <span><strong>All Rental Categories:</strong> PGs, 1RK Rooms, Flats & Houses</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', color: '#E2E8F0' }}>
                  <CheckCircle2 size={17} style={{ color: '#00D2B4', flexShrink: 0 }} />
                  <span><strong>For Everyone:</strong> Families, Working Bachelors & Students</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', color: '#E2E8F0' }}>
                  <CheckCircle2 size={17} style={{ color: '#00D2B4', flexShrink: 0 }} />
                  <span><strong>Direct Owner Contact:</strong> 100% Free WhatsApp & Phone Calling</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', color: '#E2E8F0' }}>
                  <CheckCircle2 size={17} style={{ color: '#00D2B4', flexShrink: 0 }} />
                  <span><strong>0% Brokerage:</strong> No middleman commission or hidden charges</span>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <button 
              type="button"
              className="btn btn-primary btn-lg"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                fontSize: '1.05rem',
                fontWeight: 700
              }}
            >
              <Compass size={20} />
              <span>Explore PGs, Rooms & Houses</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* OPTION 2: FOR PROPERTY OWNERS & HOSTS */}
          <div 
            onClick={onSelectOwner}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') onSelectOwner(); }}
            className="gateway-card gateway-card-owner"
            style={{
              background: 'linear-gradient(180deg, rgba(7, 23, 57, 0.95) 0%, rgba(4, 13, 33, 0.98) 100%)',
              border: '2px solid rgba(212, 175, 55, 0.5)',
              borderRadius: 'var(--radius-lg)',
              padding: '40px 32px',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 20px 45px -10px rgba(212, 175, 55, 0.25)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              position: 'relative'
            }}
          >
            <div>
              {/* Card Top Icon & Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '18px',
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(245, 197, 66, 0.2) 100%)',
                  border: '1px solid rgba(212, 175, 55, 0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FDE68A',
                  boxShadow: '0 4px 20px rgba(212, 175, 55, 0.4)'
                }}>
                  <Building2 size={38} />
                </div>
                <span className="badge badge-gold" style={{ fontSize: '0.78rem', padding: '6px 14px' }}>
                  <Sparkles size={12} /> Host Portal • 0% Commission
                </span>
              </div>

              {/* Title & Description */}
              <h2 className="font-serif" style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', marginBottom: '10px' }}>
                For Property Owners & Hosts
              </h2>
              <p style={{ color: '#CBD5E1', fontSize: '0.96rem', lineHeight: 1.6, marginBottom: '26px' }}>
                List your PG, rental room, flat, or independent house. Connect with verified tenants, fill vacancies fast, and keep 100% rental income.
              </p>

              {/* Bullet Points */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', color: '#E2E8F0' }}>
                  <CheckCircle2 size={17} style={{ color: '#D4AF37', flexShrink: 0 }} />
                  <span><strong>0% Commission:</strong> Zero brokerage, keep 100% rental revenue</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', color: '#D4AF37', flexShrink: 0 }}>
                  <CheckCircle2 size={17} style={{ color: '#D4AF37', flexShrink: 0 }} />
                  <span><strong>List Any Property:</strong> PGs, 1RK rooms, flats, houses & villas</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', color: '#D4AF37', flexShrink: 0 }}>
                  <CheckCircle2 size={17} style={{ color: '#D4AF37', flexShrink: 0 }} />
                  <span><strong>Google Maps Auto-fill:</strong> Instant address & pin detection</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', color: '#E2E8F0' }}>
                  <CheckCircle2 size={17} style={{ color: '#D4AF37', flexShrink: 0 }} />
                  <span><strong>Direct Tenant Calls:</strong> Inquiries delivered straight to WhatsApp</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', color: '#E2E8F0' }}>
                  <CheckCircle2 size={17} style={{ color: '#D4AF37', flexShrink: 0 }} />
                  <span><strong>Host Control Panel:</strong> Manage photos, rent, deposits & status</span>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <button 
              type="button"
              className="btn btn-gold btn-lg"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                fontSize: '1.05rem',
                fontWeight: 700
              }}
            >
              <PlusCircle size={20} />
              <span>Enter Owner Portal / List Property</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </main>

      {/* 3. Footer */}
      <footer style={{
        padding: '24px 0',
        borderTop: '1px solid rgba(14, 116, 237, 0.2)',
        background: 'rgba(3, 10, 28, 0.85)',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          fontSize: '0.86rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © 2026 Vrundavan Ventures Residences. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '18px' }}>
            <span>Verified Luxury Accommodations</span>
            <span>•</span>
            <span>Zero Brokerage Network</span>
          </div>
        </div>
      </footer>

      {/* Hover Micro-interactions & Mobile Responsiveness */}
      <style>{`
        .gateway-card-student:hover {
          transform: translateY(-8px);
          border-color: #3B82F6 !important;
          box-shadow: 0 25px 60px -12px rgba(14, 116, 237, 0.45) !important;
        }
        .gateway-card-owner:hover {
          transform: translateY(-8px);
          border-color: #F5C542 !important;
          box-shadow: 0 25px 60px -12px rgba(212, 175, 55, 0.45) !important;
        }
        @media (max-width: 640px) {
          .gateway-card {
            padding: 24px 18px !important;
          }
        }
      `}</style>
    </div>
  );
}
