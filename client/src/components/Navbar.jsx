import React, { useState } from 'react';
import { 
  MapPin, 
  Compass, 
  BookOpen, 
  PhoneCall, 
  Info,
  Building2,
  GraduationCap,
  PlusCircle,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  LayoutDashboard,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function Navbar({ 
  activePage, 
  setActivePage, 
  userRoleMode = 'student', 
  currentUser, 
  onLoginClick, 
  onLogout 
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
        {/* Left Side: Brand Logo - Only Logo, No Extra Text */}
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
            style={{ 
              height: '48px', 
              width: 'auto', 
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 8px rgba(14, 116, 237, 0.5))'
            }} 
          />
        </a>

        {/* Center: Nicer, Luxury Desktop Navigation Menu */}
        <nav className="nav-links">
          {userRoleMode === 'student' ? (
            /* STUDENT PAGE MENU: 100% Student-Centric, Zero Login */
            <>
              <a 
                href="/explore" 
                onClick={(e) => { e.preventDefault(); handleNav('explore'); }}
                className={`luxury-menu-link ${activePage === 'explore' ? 'active' : ''}`}
              >
                <Compass size={17} style={{ color: 'var(--gold-primary)' }} />
                <span>Explore PGs</span>
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

        {/* Right Side: CTAs & Separate Page Switcher Links (NO TAB SWITCHER) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {userRoleMode === 'student' ? (
            /* Student Page Actions */
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button 
                onClick={() => handleNav('explore')}
                className="btn btn-gold btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Compass size={15} />
                <span>Find Rooms</span>
              </button>

              {/* Clean link to the separate PG Owner page */}
              <a 
                href="/owner" 
                onClick={(e) => { e.preventDefault(); handleNav('owner-portal'); }}
                className="portal-switch-link"
                title="Switch to PG Owner Portal"
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button 
                    onClick={() => handleNav('owner')} 
                    className={`btn btn-sm ${activePage === 'owner' ? 'btn-gold' : 'btn-outline-gold'}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <LayoutDashboard size={15} /> Dashboard
                  </button>

                  <div 
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
                    title="Switch to Student Portal"
                  >
                    <GraduationCap size={14} />
                    <span>Student View</span>
                  </a>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button 
                    onClick={() => onLoginClick('owner')} 
                    className="btn btn-ghost btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <User size={15} /> Host Sign In
                  </button>

                  <button 
                    onClick={() => onLoginClick('owner')} 
                    className="btn btn-gold btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <PlusCircle size={15} /> List Your PG
                  </button>

                  {/* Clean link to the separate Student page */}
                  <a 
                    href="/student" 
                    onClick={(e) => { e.preventDefault(); handleNav('home'); }}
                    className="portal-switch-link"
                    title="Switch to Student Portal"
                  >
                    <GraduationCap size={14} />
                    <span>Students</span>
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
            style={{
              background: 'rgba(14, 116, 237, 0.15)',
              border: '1px solid rgba(14, 116, 237, 0.35)',
              color: '#fff',
              padding: '8px 10px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              display: 'none'
            }}
            className="mobile-toggle-btn"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: 'rgba(4, 13, 33, 0.98)',
          borderBottom: '1px solid var(--blue-border)',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {userRoleMode === 'student' ? (
            /* Mobile Student Navigation */
            <>
              <a href="/explore" onClick={(e) => { e.preventDefault(); handleNav('explore'); }} className="mobile-nav-item">
                <Compass size={20} style={{ color: 'var(--gold-primary)' }} />
                <span>Explore PGs</span>
              </a>
              <a href="/nearme" onClick={(e) => { e.preventDefault(); handleNav('nearme'); }} className="mobile-nav-item">
                <MapPin size={20} style={{ color: 'var(--blue-light)' }} />
                <span>Find Near Me (GPS)</span>
              </a>
              <a href="/blogs" onClick={(e) => { e.preventDefault(); handleNav('blogs'); }} className="mobile-nav-item">
                <BookOpen size={20} style={{ color: '#00D2B4' }} />
                <span>Guides & Blogs</span>
              </a>
              <a href="/about" onClick={(e) => { e.preventDefault(); handleNav('about'); }} className="mobile-nav-item">
                <Info size={20} style={{ color: '#94A3B8' }} />
                <span>About Us</span>
              </a>
              <a href="/contact" onClick={(e) => { e.preventDefault(); handleNav('contact'); }} className="mobile-nav-item">
                <PhoneCall size={20} style={{ color: 'var(--gold-light)' }} />
                <span>Contact Concierge</span>
              </a>

              <div style={{ borderTop: '1px solid rgba(14, 116, 237, 0.2)', paddingTop: '16px', marginTop: '6px' }}>
                <a 
                  href="/owner" 
                  onClick={(e) => { e.preventDefault(); handleNav('owner-portal'); }} 
                  className="mobile-nav-item"
                  style={{ color: 'var(--gold-light)', fontWeight: 700 }}
                >
                  <Building2 size={20} />
                  <span>Go to PG Owner Portal →</span>
                </a>
              </div>
            </>
          ) : (
            /* Mobile Owner Navigation */
            <>
              {currentUser && currentUser.role === 'owner' ? (
                <>
                  <a href="/owner" onClick={(e) => { e.preventDefault(); handleNav('owner'); }} className="mobile-nav-item" style={{ color: 'var(--gold-light)', fontWeight: 700 }}>
                    <LayoutDashboard size={20} />
                    <span>Host Dashboard</span>
                  </a>
                  <button 
                    onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                    className="btn btn-ghost btn-sm"
                    style={{ justifyContent: 'flex-start', color: '#f87171', width: '100%', padding: '12px' }}
                  >
                    <LogOut size={16} /> Logout ({currentUser.name})
                  </button>
                </>
              ) : (
                <>
                  <a href="/owner" onClick={(e) => { e.preventDefault(); handleNav('owner-portal'); }} className="mobile-nav-item" style={{ color: 'var(--gold-light)', fontWeight: 700 }}>
                    <Building2 size={20} />
                    <span>Host Benefits & Portal</span>
                  </a>
                  <button 
                    onClick={() => { onLoginClick('owner'); setMobileMenuOpen(false); }}
                    className="btn btn-ghost"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <User size={16} /> Host Sign In
                  </button>
                  <button 
                    onClick={() => { onLoginClick('owner'); setMobileMenuOpen(false); }}
                    className="btn btn-gold"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <PlusCircle size={16} /> List Your PG Free
                  </button>
                </>
              )}

              <div style={{ borderTop: '1px solid rgba(14, 116, 237, 0.2)', paddingTop: '16px', marginTop: '6px' }}>
                <a 
                  href="/student" 
                  onClick={(e) => { e.preventDefault(); handleNav('home'); }} 
                  className="mobile-nav-item"
                  style={{ color: 'var(--blue-light)', fontWeight: 700 }}
                >
                  <GraduationCap size={20} />
                  <span>Go to Student Residences →</span>
                </a>
              </div>
            </>
          )}
        </div>
      )}

      {/* Luxury Menu Link & Mobile Styles */}
      <style>{`
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

        .mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.05rem;
          color: #E2E8F0;
          text-decoration: none;
          padding: 10px 8px;
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
          .mobile-toggle-btn { display: flex !important; align-items: center; justify-content: center; }
        }

        @media (max-width: 480px) {
          .brand-logo img {
            height: 36px !important;
          }
          .brand-logo span:first-of-type {
            font-size: 1.15rem !important;
          }
          .brand-logo span:last-of-type {
            font-size: 0.58rem !important;
          }
          .nav-inner {
            gap: 8px !important;
          }
        }
      `}</style>
    </header>
  );
}
