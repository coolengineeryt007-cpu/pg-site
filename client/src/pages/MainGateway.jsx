import React from 'react';
import { 
  GraduationCap, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  BadgePercent, 
  MapPin 
} from 'lucide-react';

export default function MainGateway({ onSelectStudent, onSelectOwner }) {
  return (
    <div className="gateway-page-container">
      {/* Background Soft Glow Elements */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '20%',
        width: '500px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(0, 82, 204, 0.08) 0%, transparent 65%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '5%',
        right: '15%',
        width: '500px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(13, 148, 136, 0.06) 0%, transparent 65%)',
        pointerEvents: 'none'
      }} />

      {/* 1. Header: Seamless Prestigious Royal Navy Brand Header */}
      <header style={{
        padding: '16px 0',
        background: 'linear-gradient(135deg, #040D21 0%, #071739 50%, #0A2558 100%)',
        borderBottom: '2px solid rgba(212, 175, 55, 0.4)',
        position: 'relative',
        zIndex: 20,
        boxShadow: '0 4px 20px rgba(7, 23, 57, 0.25)'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Logo sits naturally on the navy background with full clarity */}
          <img 
            src="/logo.png" 
            alt="Vrundavan Ventures" 
            style={{ 
              height: '62px', 
              width: 'auto', 
              maxHeight: '68px',
              maxWidth: '320px',
              objectFit: 'contain',
              display: 'block',
              filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4))'
            }} 
          />
        </div>
      </header>

      {/* 2. Main Center Section: Title, Description, and The 2 Interactive Choice Cards */}
      <main className="container" style={{
        position: 'relative',
        zIndex: 5,
        textAlign: 'center',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '36px 20px'
      }}>
        {/* Network Pill Badge */}
        <div style={{ marginBottom: '14px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 16px',
            borderRadius: '999px',
            background: '#DBEAFE',
            border: '1px solid rgba(0, 82, 204, 0.25)',
            color: '#0052CC',
            fontSize: '0.80rem',
            fontWeight: 700,
            letterSpacing: '0.4px',
            boxShadow: '0 2px 8px rgba(0, 82, 204, 0.08)'
          }}>
            <Sparkles size={14} color="#0052CC" />
            <span>INDIA'S ZERO BROKERAGE HOUSING NETWORK</span>
          </span>
        </div>

        {/* Modern Sans-Serif Headline */}
        <h1 style={{
          fontSize: 'clamp(1.9rem, 3.2vw, 2.7rem)',
          fontWeight: 800,
          color: '#0F172A',
          lineHeight: 1.25,
          marginBottom: '10px',
          letterSpacing: '-0.5px'
        }}>
          Find Verified Rentals or List Your Property <br />
          <span style={{
            background: 'linear-gradient(135deg, #0052CC 0%, #0D9488 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}>
            Choose Your Portal to Continue
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{
          color: '#475569',
          fontSize: 'clamp(0.92rem, 1.3vw, 1.05rem)',
          maxWidth: '640px',
          margin: '0 auto 34px auto',
          lineHeight: 1.55
        }}>
          Directly connect students and working professionals with genuine property owners across India. Zero brokers and zero extra fees.
        </p>

        {/* The 2 Feature-Rich Interactive Decision Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '28px',
          maxWidth: '860px',
          width: '100%'
        }}>
          {/* Card 1: Students & Renters */}
          <div 
            onClick={onSelectStudent}
            role="button"
            tabIndex={0}
            aria-label="For Students & Renters - Find PGs, Rooms & Houses"
            onKeyDown={(e) => { if (e.key === 'Enter') onSelectStudent(); }}
            className="gateway-card gateway-card-student"
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '0 0 28px 0',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 12px 35px -5px rgba(0, 82, 204, 0.12), 0 4px 10px -2px rgba(15, 23, 42, 0.05)',
              border: '1.5px solid rgba(0, 82, 204, 0.18)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Top Accent Stripe */}
            <div style={{ height: '6px', width: '100%', background: 'linear-gradient(90deg, #0052CC 0%, #0D9488 100%)' }} />

            <div style={{ padding: '28px 26px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              {/* Top Row: Icon Emblem + Role Tag */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div style={{
                  width: '58px',
                  height: '58px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 100%)',
                  border: '1.5px solid #BFDBFE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0052CC',
                  boxShadow: '0 4px 14px rgba(0, 82, 204, 0.15)'
                }}>
                  <GraduationCap size={30} />
                </div>

                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.4px',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  background: '#DBEAFE',
                  color: '#0052CC',
                  border: '1px solid #BFDBFE'
                }}>
                  TENANTS & STUDENTS
                </span>
              </div>

              {/* Title & Description */}
              <h2 style={{ 
                fontSize: '1.4rem', 
                fontWeight: 800, 
                color: '#0F172A', 
                marginBottom: '6px' 
              }}>
                I Want to Rent a Home
              </h2>
              <p style={{ color: '#64748B', fontSize: '0.88rem', margin: '0 0 18px 0', lineHeight: 1.5 }}>
                Search student PGs, private rooms, and flats with transparent rents and zero broker fees.
              </p>

              {/* Feature Checkmarks */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: '#334155' }}>
                  <CheckCircle2 size={16} color="#0052CC" style={{ flexShrink: 0 }} />
                  <span><strong>100% Free</strong> — Zero Brokerage Commission</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: '#334155' }}>
                  <CheckCircle2 size={16} color="#0052CC" style={{ flexShrink: 0 }} />
                  <span><strong>Live GPS</strong> & Walking Distance Maps</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: '#334155' }}>
                  <CheckCircle2 size={16} color="#0052CC" style={{ flexShrink: 0 }} />
                  <span><strong>Direct Contact</strong> with Verified Hosts</span>
                </div>
              </div>

              {/* Action Button */}
              <div style={{ marginTop: 'auto' }}>
                <div 
                  className="btn btn-primary"
                  style={{ 
                    width: '100%', 
                    borderRadius: '12px', 
                    padding: '13px 20px', 
                    fontSize: '0.96rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <span>Enter Student Portal</span>
                  <ArrowRight size={17} />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Property Owners & Hosts */}
          <div 
            onClick={onSelectOwner}
            role="button"
            tabIndex={0}
            aria-label="For Property Owners & Hosts - List Your Property"
            onKeyDown={(e) => { if (e.key === 'Enter') onSelectOwner(); }}
            className="gateway-card gateway-card-owner"
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '0 0 28px 0',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 12px 35px -5px rgba(212, 175, 55, 0.15), 0 4px 10px -2px rgba(15, 23, 42, 0.05)',
              border: '1.5px solid rgba(212, 175, 55, 0.35)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Top Accent Stripe */}
            <div style={{ height: '6px', width: '100%', background: 'linear-gradient(90deg, #D4AF37 0%, #F59E0B 100%)' }} />

            <div style={{ padding: '28px 26px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              {/* Top Row: Icon Emblem + Role Tag */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div style={{
                  width: '58px',
                  height: '58px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #FEF3C7 0%, #FFFBEB 100%)',
                  border: '1.5px solid #FDE68A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#B45309',
                  boxShadow: '0 4px 14px rgba(212, 175, 55, 0.2)'
                }}>
                  <Building2 size={30} />
                </div>

                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.4px',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  background: '#FEF3C7',
                  color: '#92400E',
                  border: '1px solid #FDE68A'
                }}>
                  HOSTS & LANDLORDS
                </span>
              </div>

              {/* Title & Description */}
              <h2 style={{ 
                fontSize: '1.4rem', 
                fontWeight: 800, 
                color: '#0F172A', 
                marginBottom: '6px' 
              }}>
                I Want to List a Property
              </h2>
              <p style={{ color: '#64748B', fontSize: '0.88rem', margin: '0 0 18px 0', lineHeight: 1.5 }}>
                List your rooms, flats, or PGs. Get direct calls & WhatsApp inquiries from verified tenants.
              </p>

              {/* Feature Checkmarks */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: '#334155' }}>
                  <CheckCircle2 size={16} color="#B45309" style={{ flexShrink: 0 }} />
                  <span><strong>Keep 100% of Rent</strong> — Zero Commission</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: '#334155' }}>
                  <CheckCircle2 size={16} color="#B45309" style={{ flexShrink: 0 }} />
                  <span><strong>Reach 50,000+</strong> Students & Renters</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: '#334155' }}>
                  <CheckCircle2 size={16} color="#B45309" style={{ flexShrink: 0 }} />
                  <span><strong>Simple Host Plan</strong> — Only ₹99/month</span>
                </div>
              </div>

              {/* Action Button */}
              <div style={{ marginTop: 'auto' }}>
                <div 
                  className="btn btn-gold"
                  style={{ 
                    width: '100%', 
                    borderRadius: '12px', 
                    padding: '13px 20px', 
                    fontSize: '0.96rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <span>Enter Host Portal</span>
                  <ArrowRight size={17} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Trust & Confidence Strip */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          flexWrap: 'wrap',
          marginTop: '32px',
          fontSize: '0.86rem',
          color: '#475569',
          fontWeight: 600
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} color="#0D9488" />
            <span>100% Verified Properties</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BadgePercent size={16} color="#0052CC" />
            <span>Zero Brokerage Guaranteed</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={16} color="#B45309" />
            <span>Live GPS Maps Pan-India</span>
          </div>
        </div>
      </main>

      {/* 4. Footer: Clean Grounded Bottom Bar */}
      <footer style={{
        padding: '18px 0',
        borderTop: '1px solid rgba(14, 116, 237, 0.12)',
        background: '#FFFFFF',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.84rem',
          color: '#64748B'
        }}>
          <div>
            © 2026 Vrundavan Ventures. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>Zero Brokerage Rental Network</span>
            <span>•</span>
            <span style={{ color: '#0052CC', fontWeight: 600 }}>Built for India 🇮🇳</span>
          </div>
        </div>
      </footer>

      {/* Styles & Interactive Lift Animations */}
      <style>{`
        .gateway-page-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justifyContent: space-between;
          background: linear-gradient(180deg, #F0F6FF 0%, #E8F1FC 45%, #EDF4FD 100%);
          position: relative;
          overflow-x: hidden;
        }

        .gateway-card-student:hover {
          transform: translateY(-8px);
          border-color: #0052CC !important;
          box-shadow: 0 20px 45px -8px rgba(0, 82, 204, 0.22), 0 8px 16px -4px rgba(15, 23, 42, 0.08) !important;
        }

        .gateway-card-owner:hover {
          transform: translateY(-8px);
          border-color: #D4AF37 !important;
          box-shadow: 0 20px 45px -8px rgba(212, 175, 55, 0.25), 0 8px 16px -4px rgba(15, 23, 42, 0.08) !important;
        }
      `}</style>
    </div>
  );
}
