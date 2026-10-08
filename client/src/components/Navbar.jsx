import React, { useState } from 'react';
import { 
  Crown, 
  MapPin, 
  Search, 
  PlusCircle, 
  ShieldCheck, 
  User, 
  LogOut, 
  Menu, 
  X,
  Compass, 
  BookOpen, 
  PhoneCall, 
  Info,
  Sparkles
} from 'lucide-react';

export default function Navbar({ activePage, setActivePage, currentUser, onLoginClick, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="navbar">
      <div className="container nav-inner">
        {/* Brand Logo with Vrundavan Ventures Emblem */}
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

        {/* Desktop Navigation Links */}
        <nav className="nav-links">
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
        </nav>

        {/* Right CTA / Auth controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {currentUser.role === 'superadmin' && (
                <button 
                  onClick={() => handleNav('superadmin')} 
                  className={`btn btn-sm ${activePage === 'superadmin' ? 'btn-primary' : 'btn-outline-blue'}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <ShieldCheck size={15} /> Super Admin
                </button>
              )}

              {currentUser.role === 'owner' && (
                <button 
                  onClick={() => handleNav('owner')} 
                  className={`btn btn-sm ${activePage === 'owner' ? 'btn-gold' : 'btn-outline-gold'}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <PlusCircle size={15} /> Host Panel
                </button>
              )}

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
                onClick={onLoginClick} 
                className="btn btn-ghost btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <User size={15} /> Sign In
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

          {/* Mobile hamburger toggle */}
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
          {currentUser?.role === 'superadmin' && (
            <a href="#superadmin" onClick={() => handleNav('superadmin')} className="nav-link" style={{ color: 'var(--blue-light)', fontWeight: 600 }}>
              <ShieldCheck size={18} /> Super Admin Panel
            </a>
          )}
          {currentUser?.role === 'owner' && (
            <a href="#owner" onClick={() => handleNav('owner')} className="nav-link" style={{ color: 'var(--gold-light)', fontWeight: 600 }}>
              <PlusCircle size={18} /> Owner Panel
            </a>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 960px) {
          .nav-links { display: none !important; }
          .mobile-toggle-btn { display: flex !important; align-items: center; justify-content: center; }
        }
      `}</style>
    </header>
  );
}
