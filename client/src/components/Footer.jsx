import React from 'react';
import { Crown, Mail, Phone, MapPin, Shield, Heart, ArrowUpRight } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer style={{
      background: '#040404',
      borderTop: '1px solid rgba(212, 175, 55, 0.25)',
      padding: '70px 0 30px 0',
      marginTop: '80px',
      position: 'relative'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '40px',
          marginBottom: '50px'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '32px', height: '32px', background: 'var(--gold-gradient)',
                borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#080808'
              }}>
                <Crown size={18} />
              </div>
              <span className="gold-gradient-text font-serif" style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                AURELIA
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.7', marginBottom: '20px' }}>
              Redefining student and professional living across India. Handpicked luxury Paying Guest residences with chef-crafted nutrition, biometric safety, and high-speed workspaces.
            </p>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span className="badge badge-gold">Verified Residences</span>
              <span className="badge badge-crimson">Zero Brokerage</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '18px', letterSpacing: '0.04em' }}>
              EXPLORE RESIDENCES
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li>
                <a href="#explore" onClick={(e) => { e.preventDefault(); onNavigate('explore'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} className="nav-link">
                  All Approved PGs
                </a>
              </li>
              <li>
                <a href="#nearme" onClick={(e) => { e.preventDefault(); onNavigate('nearme'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} className="nav-link">
                  Find Near My Location
                </a>
              </li>
              <li>
                <a href="#explore" onClick={(e) => { e.preventDefault(); onNavigate('explore', { gender: 'Girls' }); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} className="nav-link">
                  Luxury Ladies PGs
                </a>
              </li>
              <li>
                <a href="#explore" onClick={(e) => { e.preventDefault(); onNavigate('explore', { gender: 'Boys' }); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} className="nav-link">
                  Executive Gents PGs
                </a>
              </li>
              <li>
                <a href="#explore" onClick={(e) => { e.preventDefault(); onNavigate('explore', { gender: 'Co-ed' }); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} className="nav-link">
                  Modern Co-ed Suites
                </a>
              </li>
            </ul>
          </div>

          {/* Company & Leadership */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '18px', letterSpacing: '0.04em' }}>
              COMPANY & POLICIES
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li>
                <a href="#about" onClick={(e) => { e.preventDefault(); onNavigate('about'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} className="nav-link">
                  About Founders & Vision
                </a>
              </li>
              <li>
                <a href="#blogs" onClick={(e) => { e.preventDefault(); onNavigate('blogs'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} className="nav-link">
                  Coliving Blog & Guides
                </a>
              </li>
              <li>
                <a href="#contact" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} className="nav-link">
                  Contact Support & Helpdesk
                </a>
              </li>
              <li>
                <a href="#terms" onClick={(e) => { e.preventDefault(); onNavigate('terms'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} className="nav-link">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#privacy" onClick={(e) => { e.preventDefault(); onNavigate('privacy'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} className="nav-link">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Concierge & Contact */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '18px', letterSpacing: '0.04em' }}>
              PRESTIGE CONCIERGE
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} style={{ color: 'var(--gold-primary)' }} />
                <span>+91 1800 212 9999 (Toll Free)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} style={{ color: 'var(--gold-primary)' }} />
                <span>concierge@aureliapg.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={16} style={{ color: 'var(--red-crimson)', marginTop: '4px' }} />
                <span>Aurelia Towers, 8th Floor, Koramangala 4th Block, Bengaluru, KA 560034</span>
              </div>
              <div style={{ marginTop: '10px' }}>
                <a 
                  href="/sitemap.xml" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ color: 'var(--gold-primary)', fontSize: '0.8rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  View XML Sitemap <ArrowUpRight size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '25px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px',
          fontSize: '0.85rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} AURELIA Luxury Residences Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>Theme: <strong>Black + Red + Gold 👑</strong></span>
            <span>•</span>
            <span>100% On-Page SEO Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
