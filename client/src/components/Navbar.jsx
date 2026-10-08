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
  Info
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
        {/* Brand Logo */}
        <a 
          href="#home" 
          onClick={(e) => { e.preventDefault(); handleNav('home'); }} 
          className="brand-logo"
        >
          <div className="brand-icon">
            <Crown size={20} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span className="gold-gradient-text" style={{ fontSize: '1.45rem', letterSpacing: '0.12em' }}>
              AURELIA
            </span>
            <span style={{ fontSize: '0.55rem', letterSpacing: '0.25em', color: '#888', fontWeight: 600 }}>
              LUXURY RESIDENCES
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
            <MapPin size={16} style={{ color: 'var(--red-crimson)' }} /> Near Me
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {currentUser.role === 'superadmin' && (
                <button 
                  onClick={() => handleNav('superadmin')} 
                  className={`btn btn-sm ${activePage === 'superadmin' ? 'btn-crimson' : 'btn-outline-gold'}`}
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
                  <PlusCircle size={15} /> Owner Dashboard
                </button>
              )}

              <div 
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: '1px solid rgba(212, 175, 55, 0.2)'
                }}
              >
                <span style={{ color: 'var(--gold-primary)', fontWeight: 600 }}>{currentUser.name}</span>
                <button 
                  onClick={onLogout}
                  title="Logout"
                  style={{ background: 'transparent', border: 'none', color: '#999', cursor: 'pointer', padding: 0 }}
                >
                  <LogOut size={15} />
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button 
                onClick={onLoginClick}
                className="btn btn-ghost btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <User size={15} /> Sign In
              </button>

              <button 
                onClick={() => {
                  onLoginClick('owner');
                }}
                className="btn btn-gold btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <PlusCircle size={15} /> List Your PG
              </button>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              display: 'none',
              cursor: 'pointer'
            }}
            className="mobile-toggle-btn"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: 'rgba(10,10,10,0.98)',
          borderBottom: '1px solid var(--gold-border)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          <a href="#explore" onClick={() => handleNav('explore')} className="nav-link">Explore PGs</a>
          <a href="#nearme" onClick={() => handleNav('nearme')} className="nav-link">Find Near Me</a>
          <a href="#blogs" onClick={() => handleNav('blogs')} className="nav-link">Guides & Blogs</a>
          <a href="#about" onClick={() => handleNav('about')} className="nav-link">About Us</a>
          <a href="#contact" onClick={() => handleNav('contact')} className="nav-link">Contact Us</a>
          {currentUser?.role === 'superadmin' && (
            <a href="#superadmin" onClick={() => handleNav('superadmin')} className="nav-link" style={{ color: 'var(--red-crimson)' }}>Super Admin Panel</a>
          )}
          {currentUser?.role === 'owner' && (
            <a href="#owner" onClick={() => handleNav('owner')} className="nav-link" style={{ color: 'var(--gold-primary)' }}>Owner Panel</a>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .nav-links { display: none !important; }
          .mobile-toggle-btn { display: block !important; }
        }
      `}</style>
    </header>
  );
}
