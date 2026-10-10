import React, { useState } from 'react';
import { 
  MapPin, 
  Compass, 
  BookOpen, 
  PhoneCall, 
  Info,
  Building2,
  Home as HomeIcon,
  PlusCircle,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  LayoutDashboard,
  ArrowRight,
  LogIn
} from 'lucide-react';

export default function Navbar({ 
  activePage, 
  setActivePage, 
  userRoleMode = 'student', 
  currentUser, 
  onLoginClick, 
  onLogout,
  onOpenAiConcierge
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="navbar">
      <div className="container nav-inner">
        {/* Left Side: Brand Logo */}
        <a 
          href="/" 
          onClick={(e) => { e.preventDefault(); handleNav('portal'); }} 
          className="brand-logo"
          title="Return to Main Portal Selection"
          style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
        >
          <img 
            src="/logo.png" 
            alt="Vrundavan Ventures" 
            className="navbar-brand-img"
          />
        </a>

        {/* Center: Luxury Desktop Navigation Menu */}
        <nav className="nav-links">
          {userRoleMode === 'student' ? (
            /* TENANT & HOME SEEKER PAGE MENU: Zero Login */
            <>
              <a 
                href="/explore" 
                onClick={(e) => { e.preventDefault(); handleNav('explore'); }}
                className={`luxury-menu-link ${activePage === 'explore' ? 'active' : ''}`}
              >
                <Compass size={17} style={{ color: 'var(--gold-primary)' }} />
                <span>Explore Rentals</span>
              </a>

              <a 
                href="/nearme" 
                onClick={(e) => { e.preventDefault(); handleNav('nearme'); }}
                className={`luxury-menu-link ${activePage === 'nearme' ? 'active' : ''}`}
              >
                <MapPin size={17} style={{ color: 'var(--blue-light)' }} />
                <span>Near Me</span>
              </a>

              <a 
                href="/blogs" 
                onClick={(e) => { e.preventDefault(); handleNav('blogs'); }}
                className={`luxury-menu-link ${activePage === 'blogs' ? 'active' : ''}`}
              >
                <BookOpen size={17} style={{ color: '#00D2B4' }} />
                <span>Guides & Blog</span>
              </a>

              <a 
                href="/about" 
                onClick={(e) => { e.preventDefault(); handleNav('about'); }}
                className={`luxury-menu-link ${activePage === 'about' ? 'active' : ''}`}
              >
                <Info size={17} style={{ color: '#94A3B8' }} />
                <span>About Us</span>
              </a>

              <a 
                href="/contact" 
                onClick={(e) => { e.preventDefault(); handleNav('contact'); }}
                className={`luxury-menu-link ${activePage === 'contact' ? 'active' : ''}`}
              >
                <PhoneCall size={17} style={{ color: 'var(--gold-light)' }} />
                <span>Contact</span>
              </a>
            </>
          ) : (
            /* OWNER PAGE MENU: 100% Host-Centric */
            <>
              {currentUser && currentUser.role === 'owner' ? (
                <>
                  <a 
                    href="/owner" 
                    onClick={(e) => { e.preventDefault(); handleNav('owner'); }}
                    className={`luxury-menu-link ${activePage === 'owner' ? 'active' : ''}`}
                  >
                    <LayoutDashboard size={17} style={{ color: 'var(--gold-primary)' }} />
                    <span>Host Dashboard</span>
                  </a>
                  <a 
                    href="/owner" 
                    onClick={(e) => { e.preventDefault(); handleNav('owner'); }}
                    className="luxury-menu-link"
                  >
                    <Building2 size={17} style={{ color: 'var(--blue-light)' }} />
                    <span>My Properties</span>
                  </a>
                </>
              ) : (
                <>
                  <a 
                    href="/owner" 
                    onClick={(e) => { e.preventDefault(); handleNav('owner-portal'); }}
                    className={`luxury-menu-link ${activePage === 'owner-portal' ? 'active' : ''}`}
                  >
                    <Building2 size={17} style={{ color: 'var(--gold-primary)' }} />
                    <span>Host Overview</span>
                  </a>
                  <a 
                    href="/contact" 
                    onClick={(e) => { e.preventDefault(); handleNav('contact'); }}
                    className="luxury-menu-link"
                  >
                    <PhoneCall size={17} style={{ color: 'var(--blue-light)' }} />
                    <span>Host Support</span>
                  </a>
                </>
              )}
            </>
          )}
        </nav>

        {/* Right Side: CTAs & Mobile Responsive Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {userRoleMode === 'student' ? (
            /* Tenant Page Actions */
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {currentUser ? (
                <div 
                  className="nav-user-pill"
                  style={{
                    background: 'rgba(14, 116, 237, 0.12)',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    border: '1px solid rgba(14, 116, 237, 0.3)'
                  }}
                >
                  <span style={{ color: 'var(--gold-light)', fontWeight: 600 }}>{currentUser.name}</span>
                  <button 
                    onClick={onLogout} 
                    title="Logout" 
                    style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 0 }}
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => onLoginClick('student')}
                  className="btn btn-outline-gold btn-sm nav-desktop-auth-btn"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <LogIn size={15} />
                  <span>Student Sign In</span>
                </button>
              )}

              {onOpenAiConcierge && (
                <button 
                  onClick={onOpenAiConcierge}
                  className="btn btn-sm nav-ai-match-btn"
                  style={{
                    background: 'linear-gradient(135deg, rgba(14, 116, 237, 0.25), rgba(212, 175, 55, 0.25))',
                    border: '1px solid rgba(212, 175, 55, 0.5)',
                    color: 'var(--gold-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    borderRadius: '20px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 0 12px rgba(212, 175, 55, 0.2)'
                  }}
                  title="Launch Vrundavan AI Concierge"
                >
                  <Sparkles size={14} />
                  <span className="nav-ai-text">AI Match</span>
                </button>
              )}

              {/* Clean link to the separate PG Owner page */}
              <a 
                href="/owner" 
                onClick={(e) => { e.preventDefault(); handleNav('owner-portal'); }}
                className="portal-switch-link"
                title="Switch to Property Owner Portal"
              >
                <Building2 size={14} />
                <span>Host Portal</span>
                <ArrowRight size={13} />
              </a>
            </div>
          ) : (
            /* Owner Page Actions */
            <>
              {currentUser && currentUser.role === 'owner' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button 
                    onClick={() => handleNav('owner')} 
                    className={`btn btn-sm ${activePage === 'owner' ? 'btn-gold' : 'btn-outline-gold'} nav-desktop-auth-btn`}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <LayoutDashboard size={15} /> Dashboard
                  </button>

                  <div 
                    className="nav-user-pill"
                    style={{
                      background: 'rgba(14, 116, 237, 0.12)',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      border: '1px solid rgba(14, 116, 237, 0.3)'
                    }}
                  >
                    <span style={{ color: 'var(--gold-light)', fontWeight: 600 }}>{currentUser.name}</span>
                    <button 
                      onClick={onLogout} 
                      title="Logout" 
                      style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 0 }}
                    >
                      <LogOut size={15} />
                    </button>
                  </div>

                  <a 
                    href="/student" 
                    onClick={(e) => { e.preventDefault(); handleNav('home'); }}
                    className="portal-switch-link"
                    title="Switch to Tenant Rental Search"
                  >
                    <HomeIcon size={14} />
                    <span>Rentals View</span>
                  </a>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button 
                    onClick={() => onLoginClick('owner')} 
                    className="btn btn-ghost btn-sm nav-desktop-auth-btn"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <User size={15} /> Host Sign In
                  </button>

                  <button 
                    onClick={() => onLoginClick('owner')} 
                    className="btn btn-gold btn-sm nav-desktop-auth-btn"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <PlusCircle size={15} /> List Property
                  </button>

                  <a 
                    href="/student" 
                    onClick={(e) => { e.preventDefault(); handleNav('home'); }}
                    className="portal-switch-link"
                    title="Switch to Tenant Rental Search"
                  >
                    <HomeIcon size={14} />
                    <span>Find Rentals</span>
                    <ArrowRight size={13} />
                  </a>
                </div>
              )}
            </>
          )}

          {/* Mobile Hamburger Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            aria-label="Toggle navigation menu"
            className="mobile-toggle-btn"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay & Content */}
      {mobileMenuOpen && (
        <>
          <div 
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              top: '70px',
              background: 'rgba(2, 6, 23, 0.75)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              zIndex: 99980
            }} 
          />
          <div className="mobile-drawer-container">
            {/* VIP Status or Login Card in Drawer */}
            {currentUser ? (
              <div style={{
                background: 'rgba(14, 116, 237, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Logged In As
                  </div>
                  <div style={{ color: 'var(--gold-light)', fontWeight: 700, fontSize: '1rem' }}>
                    {currentUser.name}
                  </div>
                  <span className="badge badge-gold" style={{ fontSize: '0.68rem', marginTop: '4px' }}>
                    {currentUser.role === 'owner' ? '🏢 Verified Host' : '🎓 Seeker / Student'}
                  </span>
                </div>
                <button 
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                  className="btn btn-ghost btn-sm"
                  style={{ color: '#f87171', padding: '6px 12px' }}
                >
                  <LogOut size={15} /> Logout
                </button>
              </div>
            ) : (
              <div style={{
                background: 'rgba(7, 23, 57, 0.95)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                textAlign: 'center'
              }}>
                <p style={{ color: '#E2E8F0', fontSize: '0.88rem', marginBottom: '12px', lineHeight: 1.5 }}>
                  Access locked street addresses, owner direct phone/WhatsApp, and live route navigation.
                </p>
                <button 
                  onClick={() => { onLoginClick(userRoleMode); setMobileMenuOpen(false); }}
                  className="btn btn-gold"
                  style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
                >
                  <LogIn size={16} />
                  <span>{userRoleMode === 'owner' ? 'Host Sign In' : 'Sign In / Register'}</span>
                </button>
              </div>
            )}

            {/* AI Concierge Drawer CTA */}
            {onOpenAiConcierge && (
              <button 
                onClick={() => { onOpenAiConcierge(); setMobileMenuOpen(false); }}
                className="btn btn-sm"
                style={{
                  background: 'linear-gradient(135deg, rgba(14, 116, 237, 0.3) 0%, rgba(212, 175, 55, 0.3) 100%)',
                  border: '1px solid rgba(212, 175, 55, 0.6)',
                  color: '#fff',
                  width: '100%',
                  justifyContent: 'center',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  boxShadow: '0 4px 15px rgba(212, 175, 55, 0.15)'
                }}
              >
                <Sparkles size={16} style={{ color: 'var(--gold-primary)' }} />
                <span>Launch AI Room & PG Concierge</span>
              </button>
            )}

            {/* Navigation Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {userRoleMode === 'student' ? (
                <>
                  <a href="/explore" onClick={(e) => { e.preventDefault(); handleNav('explore'); }} className="mobile-nav-item">
                    <Compass size={18} style={{ color: 'var(--gold-primary)' }} />
                    <span>Explore Rentals (PGs, Rooms, Flats)</span>
                  </a>
                  <a href="/nearme" onClick={(e) => { e.preventDefault(); handleNav('nearme'); }} className="mobile-nav-item">
                    <MapPin size={18} style={{ color: 'var(--blue-light)' }} />
                    <span>Find Near Me (GPS Live)</span>
                  </a>
                  <a href="/blogs" onClick={(e) => { e.preventDefault(); handleNav('blogs'); }} className="mobile-nav-item">
                    <BookOpen size={18} style={{ color: '#00D2B4' }} />
                    <span>Guides & Rental Advice</span>
                  </a>
                  <a href="/about" onClick={(e) => { e.preventDefault(); handleNav('about'); }} className="mobile-nav-item">
                    <Info size={18} style={{ color: '#94A3B8' }} />
                    <span>About Founders & Vision</span>
                  </a>
                  <a href="/contact" onClick={(e) => { e.preventDefault(); handleNav('contact'); }} className="mobile-nav-item">
                    <PhoneCall size={18} style={{ color: 'var(--gold-light)' }} />
                    <span>Contact Concierge Desk</span>
                  </a>
                </>
              ) : (
                <>
                  <a href="/owner" onClick={(e) => { e.preventDefault(); handleNav('owner'); }} className="mobile-nav-item">
                    <LayoutDashboard size={18} style={{ color: 'var(--gold-primary)' }} />
                    <span>Host Dashboard</span>
                  </a>
                  <a href="/contact" onClick={(e) => { e.preventDefault(); handleNav('contact'); }} className="mobile-nav-item">
                    <PhoneCall size={18} style={{ color: 'var(--blue-light)' }} />
                    <span>Host Support</span>
                  </a>
                </>
              )}
            </div>

            {/* Portal Switcher at Drawer Footer */}
            <div style={{ borderTop: '1px solid rgba(14, 116, 237, 0.2)', paddingTop: '16px', marginTop: '6px' }}>
              {userRoleMode === 'student' ? (
                <a 
                  href="/owner" 
                  onClick={(e) => { e.preventDefault(); handleNav('owner-portal'); }} 
                  className="mobile-nav-item"
                  style={{ color: 'var(--gold-light)', fontWeight: 700, background: 'rgba(212, 175, 55, 0.08)', border: '1px solid rgba(212, 175, 55, 0.3)' }}
                >
                  <Building2 size={18} />
                  <span>Switch to Property Owner Portal →</span>
                </a>
              ) : (
                <a 
                  href="/student" 
                  onClick={(e) => { e.preventDefault(); handleNav('home'); }} 
                  className="mobile-nav-item" 
                  style={{ color: 'var(--blue-light)', fontWeight: 700, background: 'rgba(14, 116, 237, 0.08)', border: '1px solid rgba(14, 116, 237, 0.3)' }}
                >
                  <HomeIcon size={18} />
                  <span>Switch to Tenant Search →</span>
                </a>
              )}
            </div>
          </div>
        </>
      )}

      {/* Luxury Menu Link & Mobile Styles */}
      <style>{`
        .navbar-brand-img {
          height: 64px;
          width: 64px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(212, 175, 55, 0.85);
          box-shadow: 0 0 16px rgba(212, 175, 55, 0.5), 0 4px 10px rgba(0, 0, 0, 0.5);
          display: block;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .navbar-brand-img:hover {
          transform: scale(1.05);
          box-shadow: 0 0 22px rgba(212, 175, 55, 0.7);
        }

        .luxury-menu-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #CBD5E1;
          text-decoration: none;
          font-size: 0.94rem;
          font-weight: 500;
          padding: 8px 14px;
          border-radius: var(--radius-sm);
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }
        .luxury-menu-link:hover {
          color: #ffffff;
          background: rgba(14, 116, 237, 0.12);
          border-color: rgba(14, 116, 237, 0.25);
        }
        .luxury-menu-link.active {
          color: #ffffff;
          background: rgba(14, 116, 237, 0.18);
          border-color: rgba(14, 116, 237, 0.45);
          font-weight: 700;
          box-shadow: 0 4px 15px rgba(2, 6, 23, 0.5);
        }

        .portal-switch-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--gold-light);
          padding: 6px 12px;
          border: 1px solid rgba(212, 175, 55, 0.35);
          border-radius: var(--radius-full);
          text-decoration: none;
          transition: all 0.2s ease;
          background: rgba(212, 175, 55, 0.08);
        }
        .portal-switch-link:hover {
          background: rgba(212, 175, 55, 0.18);
          border-color: var(--gold-primary);
          color: #fff;
          transform: translateY(-1px);
        }

        .mobile-toggle-btn {
          background: rgba(14, 116, 237, 0.15);
          border: 1px solid rgba(14, 116, 237, 0.35);
          color: #fff;
          padding: 8px 10px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          display: none;
          align-items: center;
          justify-content: center;
        }

        .mobile-drawer-container {
          position: fixed;
          top: 72px;
          left: 0;
          right: 0;
          background: rgba(4, 13, 33, 0.98);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 2px solid rgba(212, 175, 55, 0.35);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
          padding: 20px 16px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-height: calc(100vh - 72px);
          overflow-y: auto;
          z-index: 99990;
          animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.98rem;
          color: #E2E8F0;
          text-decoration: none;
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          transition: background 0.15s ease;
        }
        .mobile-nav-item:hover {
          background: rgba(14, 116, 237, 0.15);
          color: #fff;
        }

        @media (max-width: 1040px) {
          .nav-links { display: none !important; }
          .portal-switch-link { display: none !important; }
          .mobile-toggle-btn { display: flex !important; }
        }

        @media (max-width: 768px) {
          .nav-desktop-auth-btn { display: none !important; }
          .navbar-brand-img {
            height: 52px !important;
            width: 52px !important;
          }
          .nav-inner {
            gap: 10px !important;
          }
        }

        @media (max-width: 480px) {
          .navbar-brand-img {
            height: 46px !important;
            width: 46px !important;
          }
          .nav-ai-match-btn {
            padding: 5px 9px !important;
            font-size: 0.78rem !important;
          }
          .nav-user-pill {
            padding: 4px 8px !important;
            font-size: 0.78rem !important;
          }
        }
      `}</style>
    </header>
  );
}
