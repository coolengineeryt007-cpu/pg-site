import React from 'react';
import { 
  Users,
  Home as HomeIcon, 
  ArrowRight
} from 'lucide-react';

export default function MainGateway({ onSelectStudent, onSelectOwner }) {
  return (
    <div className="gateway-page-container">
      {/* Background Ambient Radial Glows */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '20%',
        width: '500px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(14, 116, 237, 0.16) 0%, transparent 65%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '5%',
        right: '15%',
        width: '500px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, transparent 65%)',
        pointerEvents: 'none'
      }} />

      {/* 1. Header: Big Centered Brand Logo */}
      <header style={{
        padding: '10px 0',
        borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
        background: 'rgba(4, 13, 33, 0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        position: 'relative',
        zIndex: 10
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Centered Grand Brand Logo */}
          <img 
            src="/logo.png" 
            alt="Vrundavan Ventures" 
            style={{ 
              height: '95px', 
              width: 'auto', 
              maxHeight: '100px',
              maxWidth: '460px',
              objectFit: 'contain',
              display: 'block',
              filter: 'drop-shadow(0 6px 20px rgba(0, 0, 0, 0.75))'
            }} 
          />
        </div>
      </header>

      {/* 2. Main Center Section: Title, Description, and The 2 Cards */}
      <main className="container" style={{
        position: 'relative',
        zIndex: 5,
        textAlign: 'center',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px 20px'
      }}>
        {/* Title */}
        <h1 className="font-serif" style={{
          fontSize: 'clamp(1.7rem, 3.2vw, 2.5rem)',
          fontWeight: 900,
          color: '#ffffff',
          lineHeight: 1.25,
          marginBottom: '8px'
        }}>
          Find PGs, Rental Rooms & Houses <br />
          <span className="gold-gradient-text">Choose Your Portal to Continue</span>
        </h1>

        {/* Description */}
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: 'clamp(0.9rem, 1.3vw, 1.05rem)',
          maxWidth: '640px',
          margin: '0 auto 28px auto',
          lineHeight: 1.5
        }}>
          Directly connect students and working professionals with verified property owners. Zero brokers and zero extra fees.
        </p>

        {/* The TWO Clean Cards: Logo + Title Only */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          maxWidth: '780px',
          width: '100%'
        }}>
          {/* Card 1: Tenants / Students & Renters (Logo + Title) */}
          <div 
            onClick={onSelectStudent}
            role="button"
            tabIndex={0}
            aria-label="For Students & Renters - Find PGs, Rooms & Houses"
            onKeyDown={(e) => { if (e.key === 'Enter') onSelectStudent(); }}
            className="gateway-card gateway-card-student"
            style={{
              background: 'linear-gradient(180deg, rgba(7, 23, 57, 0.95) 0%, rgba(4, 13, 33, 0.98) 100%)',
              border: '2px solid rgba(14, 116, 237, 0.45)',
              borderRadius: '20px',
              padding: '36px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              boxShadow: '0 16px 40px -10px rgba(14, 116, 237, 0.25)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              position: 'relative'
            }}
          >
            {/* Logo / Icon */}
            <div style={{
              width: '74px',
              height: '74px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(14, 116, 237, 0.28) 0%, rgba(0, 210, 180, 0.22) 100%)',
              border: '1.5px solid rgba(14, 116, 237, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#60A5FA',
              boxShadow: '0 8px 24px rgba(14, 116, 237, 0.35)'
            }}>
              <Users size={38} />
            </div>

            {/* Title */}
            <div>
              <h2 className="font-serif" style={{ 
                fontSize: '1.5rem', 
                fontWeight: 800, 
                color: '#ffffff', 
                marginBottom: '6px' 
              }}>
                For Students & Renters
              </h2>
              <span style={{ 
                fontSize: '0.86rem', 
                color: '#94A3B8',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                Find PGs, Rooms & Houses <ArrowRight size={14} style={{ color: '#60A5FA' }} />
              </span>
            </div>
          </div>

          {/* Card 2: Property Owners & Hosts (Logo + Title) */}
          <div 
            onClick={onSelectOwner}
            role="button"
            tabIndex={0}
            aria-label="For Property Owners & Hosts - Enter Owner Portal / List Property"
            onKeyDown={(e) => { if (e.key === 'Enter') onSelectOwner(); }}
            className="gateway-card gateway-card-owner"
            style={{
              background: 'linear-gradient(180deg, rgba(7, 23, 57, 0.95) 0%, rgba(4, 13, 33, 0.98) 100%)',
              border: '2px solid rgba(212, 175, 55, 0.45)',
              borderRadius: '20px',
              padding: '36px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              boxShadow: '0 16px 40px -10px rgba(212, 175, 55, 0.25)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              position: 'relative'
            }}
          >
            {/* Logo / Icon */}
            <div style={{
              width: '74px',
              height: '74px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.28) 0%, rgba(245, 197, 66, 0.2) 100%)',
              border: '1.5px solid rgba(212, 175, 55, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FDE68A',
              boxShadow: '0 8px 24px rgba(212, 175, 55, 0.35)'
            }}>
              <HomeIcon size={38} />
            </div>

            {/* Title */}
            <div>
              <h2 className="font-serif" style={{ 
                fontSize: '1.5rem', 
                fontWeight: 800, 
                color: '#ffffff', 
                marginBottom: '6px' 
              }}>
                For Property Owners & Hosts
              </h2>
              <span style={{ 
                fontSize: '0.86rem', 
                color: '#94A3B8',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                Enter Owner Portal / List Property <ArrowRight size={14} style={{ color: 'var(--gold-primary)' }} />
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Footer: Centered Big Text */}
      <footer style={{
        padding: '14px 0',
        borderTop: '1px solid rgba(14, 116, 237, 0.18)',
        background: 'rgba(3, 10, 28, 0.9)',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        <div className="container" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '1.05rem',
            fontWeight: 600,
            color: '#E2E8F0',
            letterSpacing: '0.2px'
          }}>
            © 2026 Vrundavan Ventures. All rights reserved.
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.92rem',
            color: 'var(--text-muted)'
          }}>
            <span>Verified PGs, Rooms & Flats</span>
            <span style={{ color: 'var(--gold-primary)' }}>•</span>
            <span>Direct Owner Contact • Zero Brokerage</span>
          </div>
        </div>
      </footer>

      {/* 100vh Fit & Hover Styles */}
      <style>{`
        .gateway-page-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justifyContent: space-between;
          background: var(--bg-primary);
          position: relative;
          overflow-x: hidden;
        }

        /* Desktop: fits strictly inside 100vh screen */
        @media (min-width: 769px) and (min-height: 520px) {
          .gateway-page-container {
            height: 100vh;
            overflow: hidden;
          }
        }

        /* Mobile or tight landscape: natural scrolling */
        @media (max-width: 768px), (max-height: 519px) {
          .gateway-page-container {
            height: auto;
            overflow-y: auto;
            padding-bottom: 20px;
          }
          .gateway-card {
            padding: 28px 20px !important;
          }
        }

        .gateway-card-student:hover {
          transform: translateY(-6px);
          border-color: #3B82F6 !important;
          box-shadow: 0 24px 50px -10px rgba(14, 116, 237, 0.45) !important;
        }
        .gateway-card-owner:hover {
          transform: translateY(-6px);
          border-color: #F5C542 !important;
          box-shadow: 0 24px 50px -10px rgba(212, 175, 55, 0.45) !important;
        }
      `}</style>
    </div>
  );
}
