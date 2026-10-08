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
  CheckCircle2
} from 'lucide-react';

export default function Navbar({ 
  activePage, 
  setActivePage, 
  userRoleMode = 'student', 
  onChangeRoleMode, 
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

  const handleRoleSwitch = (mode) => {
    if (onChangeRoleMode) {
      onChangeRoleMode(mode);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container nav-inner">
        {/* Left Side: Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a 
            href="#home" 
            onClick={(e) => { e.preventDefault(); handleNav('home'); }} 
            className="brand-logo"
            style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
          >
            <img 
              src="/logo.png" 
              alt="Vrundavan Ventures" 
              style={{ 
                height: '42px', 
                width: 'auto', 
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 8px rgba(14, 116, 237, 0.45))'
              }} 
            />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ 
                background: 'linear-gradient(135deg, #93C5FD 0%, #3B82F6 40%, #00D2B4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '1.25rem',
                fontWeight: 900,
                letterSpacing: '0.06em',
                fontFamily: 'var(--font-serif)'
              }}>
                VRUNDAVAN
              </span>
              <span style={{ 
                background: 'linear-gradient(135deg, #FFDF70 0%, #D4AF37 60%, #B45309 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '0.62rem',
                letterSpacing: '0.28em',
                fontWeight: 800,
                paddingLeft: '1px'
              }}>
                VENTURES
              </span>
            </div>
          </a>

          {/* Prominent Two-Option Mode Pill (Student vs PG Owner) */}
          <div className="role-mode-pill-desktop">
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'rgba(7, 23, 57, 0.95)',
              border: '1px solid rgba(14, 116, 237, 0.4)',
              borderRadius: 'var(--radius-full)',
              padding: '3px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.35)'
            }}>
              <button
                type="button"
                onClick={() => handleRoleSwitch('student')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: userRoleMode === 'student' ? 800 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  background: userRoleMode === 'student' 
                    ? 'linear-gradient(135deg, #1D68F2 0%, #0E74ED 60%, #00D2B4 100%)' 
                    : 'transparent',
                  color: userRoleMode === 'student' ? '#ffffff' : '#94A3B8',
                  boxShadow: userRoleMode === 'student' ? '0 2px 10px rgba(14, 116, 237, 0.5)' : 'none'
                }}
              >
                <GraduationCap size={15} />
                <span>For Students</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSwitch('owner')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: userRoleMode === 'owner' ? 800 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  background: userRoleMode === 'owner' 
                    ? 'linear-gradient(135deg, #FFF2B2 0%, #F5C542 40%, #D4AF37 100%)' 
                    : 'transparent',
                  color: userRoleMode === 'owner' ? '#040D21' : '#94A3B8',
                  boxShadow: userRoleMode === 'owner' ? '0 2px 10px rgba(212, 175, 55, 0.5)' : 'none'
                }}
              >
                <Building2 size={15} />
                <span>For PG Owners</span>
              </button>
            </div>
          </div>
        </div>

        {/* Center / Desktop Navigation Links */}
        <nav className="nav-links">
          {userRoleMode === 'student' ? (
            /* STUDENT MODE: Frictionless navigation, ZERO login required */
            <>
              <a 
                href="#explore" 
                onClick={(e) => { e.preventDefault(); handleNav('explore'); }}
                className={`nav-link ${activePage === 'explore' ? 'active' : ''}`}
              >
                <Compass size={16} /> Explore PGs
              </a>

              <a 
                href="#nearme" 
                onClick={(e) => { e.preventDefault(); handleNav('nearme'); }}
                className={`nav-link ${activePage === 'nearme' ? 'active' : ''}`}
              >
                <MapPin size={16} style={{ color: 'var(--blue-light)' }} /> Near Me
              </a>

              <a 
                href="#blogs" 
                onClick={(e) => { e.preventDefault(); handleNav('blogs'); }}
                className={`nav-link ${activePage === 'blogs' ? 'active' : ''}`}
              >
                <BookOpen size={16} /> Guides & Blog
              </a>

              <a 
                href="#about" 
                onClick={(e) => { e.preventDefault(); handleNav('about'); }}
                className={`nav-link ${activePage === 'about' ? 'active' : ''}`}
              >
                <Info size={16} /> About Us
              </a>

              <a 
                href="#contact" 
                onClick={(e) => { e.preventDefault(); handleNav('contact'); }}
                className={`nav-link ${activePage === 'contact' ? 'active' : ''}`}
              >
                <PhoneCall size={16} /> Contact
              </a>
            </>
          ) : (
            /* OWNER MODE: Host navigation */
            <>
              {currentUser && currentUser.role === 'owner' ? (
                <>
                  <a 
                    href="#owner" 
                    onClick={(e) => { e.preventDefault(); handleNav('owner'); }}
                    className={`nav-link ${activePage === 'owner' ? 'active' : ''}`}
                  >
                    <LayoutDashboard size={16} /> Host Dashboard
                  </a>
                  <a 
                    href="#owner-listings" 
                    onClick={(e) => { e.preventDefault(); handleNav('owner'); }}
                    className="nav-link"
                  >
                    <Building2 size={16} /> My Listings
                  </a>
                </>
              ) : (
                <>
                  <a 
                    href="#owner-portal" 
                    onClick={(e) => { e.preventDefault(); handleNav('owner-portal'); }}
                    className={`nav-link ${activePage === 'owner-portal' ? 'active' : ''}`}
                  >
                    <Building2 size={16} /> Host Benefits
                  </a>
                  <a 
                    href="#contact" 
                    onClick={(e) => { e.preventDefault(); handleNav('contact'); }}
                    className="nav-link"
                  >
                    <PhoneCall size={16} /> Owner Support
                  </a>
                </>
              )}
            </>
          )}
        </nav>

        {/* Right CTA Area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {userRoleMode === 'student' ? (
            /* STUDENT MODE: Direct call to action, ZERO auth clutter */
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div 
                className="student-zero-badge"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(0, 210, 180, 0.1)',
                  border: '1px solid rgba(0, 210, 180, 0.35)',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  color: '#5EEAD4',
                  fontWeight: 600
                }}
              >
                <CheckCircle2 size={13} />
                <span>Zero Login Needed</span>
              </div>

              <button 
                onClick={() => handleNav('explore')}
                className="btn btn-outline-gold btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Compass size={14} /> Find Rooms
              </button>
            </div>
          ) : (
            /* OWNER MODE: Host controls */
            <>
              {currentUser && currentUser.role === 'owner' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                </div>
              )}
            </>
          )}

          {/* Mobile Hamburger Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            aria-label="Toggle navigation menu"
            style={{
              background: 'rgba(14, 116, 237, 0.15)',
              border: '1px solid rgba(14, 116, 237, 0.35)',
              color: '#fff',
              padding: '8px',
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
          padding: '20px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {/* Mobile Role Switcher Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(7, 23, 57, 0.95)',
            border: '1px solid rgba(14, 116, 237, 0.4)',
            borderRadius: 'var(--radius-full)',
            padding: '3px',
            marginBottom: '6px'
          }}>
            <button
              type="button"
              onClick={() => handleRoleSwitch('student')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                fontSize: '0.85rem',
                fontWeight: userRoleMode === 'student' ? 800 : 600,
                cursor: 'pointer',
                background: userRoleMode === 'student' 
                  ? 'linear-gradient(135deg, #1D68F2 0%, #0E74ED 60%, #00D2B4 100%)' 
                  : 'transparent',
                color: userRoleMode === 'student' ? '#ffffff' : '#94A3B8'
              }}
            >
              <GraduationCap size={16} /> For Students
            </button>

            <button
              type="button"
              onClick={() => handleRoleSwitch('owner')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                fontSize: '0.85rem',
                fontWeight: userRoleMode === 'owner' ? 800 : 600,
                cursor: 'pointer',
                background: userRoleMode === 'owner' 
                  ? 'linear-gradient(135deg, #FFF2B2 0%, #F5C542 40%, #D4AF37 100%)' 
                  : 'transparent',
                color: userRoleMode === 'owner' ? '#040D21' : '#94A3B8'
              }}
            >
              <Building2 size={16} /> For PG Owners
            </button>
          </div>

          {userRoleMode === 'student' ? (
            /* Mobile Student Links - zero login */
            <>
              <a href="#explore" onClick={() => handleNav('explore')} className="nav-link" style={{ fontSize: '1rem', padding: '6px 0' }}>
                <Compass size={18} /> Explore PGs
              </a>
              <a href="#nearme" onClick={() => handleNav('nearme')} className="nav-link" style={{ fontSize: '1rem', padding: '6px 0', color: 'var(--blue-light)' }}>
                <MapPin size={18} /> Find Near Me
              </a>
              <a href="#blogs" onClick={() => handleNav('blogs')} className="nav-link" style={{ fontSize: '1rem', padding: '6px 0' }}>
                <BookOpen size={18} /> Guides & Blogs
              </a>
              <a href="#about" onClick={() => handleNav('about')} className="nav-link" style={{ fontSize: '1rem', padding: '6px 0' }}>
                <Info size={18} /> About Us
              </a>
              <a href="#contact" onClick={() => handleNav('contact')} className="nav-link" style={{ fontSize: '1rem', padding: '6px 0' }}>
                <PhoneCall size={18} /> Contact Us
              </a>
            </>
          ) : (
            /* Mobile Owner Links */
            <>
              {currentUser && currentUser.role === 'owner' ? (
                <>
                  <a href="#owner" onClick={() => handleNav('owner')} className="nav-link" style={{ color: 'var(--gold-light)', fontWeight: 600 }}>
                    <LayoutDashboard size={18} /> Host Dashboard
                  </a>
                  <button 
                    onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                    className="btn btn-ghost btn-sm"
                    style={{ justifyContent: 'flex-start', color: '#f87171' }}
                  >
                    <LogOut size={16} /> Logout ({currentUser.name})
                  </button>
                </>
              ) : (
                <>
                  <a href="#owner-portal" onClick={() => handleNav('owner-portal')} className="nav-link" style={{ color: 'var(--gold-light)', fontWeight: 600 }}>
                    <Building2 size={18} /> Host Benefits & Portal
                  </a>
                  <button 
                    onClick={() => { onLoginClick('owner'); setMobileMenuOpen(false); }}
                    className="btn btn-ghost btn-sm"
                    style={{ justifyContent: 'center' }}
                  >
                    <User size={16} /> Sign In as Owner
                  </button>
                  <button 
                    onClick={() => { onLoginClick('owner'); setMobileMenuOpen(false); }}
                    className="btn btn-gold btn-sm"
                    style={{ justifyContent: 'center' }}
                  >
                    <PlusCircle size={16} /> List Your PG
                  </button>
                </>
              )}
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 960px) {
          .nav-links { display: none !important; }
          .role-mode-pill-desktop { display: none !important; }
          .student-zero-badge { display: none !important; }
          .mobile-toggle-btn { display: flex !important; align-items: center; justify-content: center; }
        }
      `}</style>
    </header>
  );
}
