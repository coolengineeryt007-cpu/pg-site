import React from 'react';
import { Mail, Phone, MapPin, MessageCircle, ShieldCheck } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer({ onNavigate }) {
  return (
    <footer style={{
      background: '#F8FAFC',
      borderTop: '1px solid #E2E8F0',
      padding: '60px 0 30px 0',
      marginTop: 0,
      position: 'relative'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '40px',
          marginBottom: '45px'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <span className="brand-logo-badge">
                <img 
                  src="/logo.png" 
                  alt="Vrundavan Ventures" 
                  style={{ 
                    height: '46px', 
                    width: 'auto', 
                    maxHeight: '48px',
                    maxWidth: '240px',
                    objectFit: 'contain',
                    display: 'block'
                  }} 
                />
              </span>
            </div>
            <p style={{ color: '#475569', fontSize: '0.90rem', lineHeight: '1.65', marginBottom: '18px' }}>
              Find verified PGs, rooms, and flats across India directly from property owners. Zero brokers, genuine photos, and transparent pricing.
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 13px',
              borderRadius: '20px',
              background: '#FEF3C7',
              border: '1px solid #FCD34D',
              color: '#92400E',
              fontSize: '0.78rem',
              fontWeight: 700
            }}>
              <ShieldCheck size={14} color="#D97706" />
              <span>100% Free for Students & Tenants</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 style={{ color: '#0F172A', fontSize: '0.96rem', fontWeight: 700, marginBottom: '18px', letterSpacing: '0.04em' }}>
              EXPLORE RENTALS
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '11px', fontSize: '0.88rem' }}>
              <li>
                <a href="/explore" onClick={(e) => { e.preventDefault(); onNavigate('explore'); }} style={{ color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }} className="nav-link">
                  All Rental Properties
                </a>
              </li>
              <li>
                <a href="/explore" onClick={(e) => { e.preventDefault(); onNavigate('explore', { propertyType: 'pg' }); }} style={{ color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }} className="nav-link">
                  Student PGs & Hostels
                </a>
              </li>
              <li>
                <a href="/explore" onClick={(e) => { e.preventDefault(); onNavigate('explore', { propertyType: 'room' }); }} style={{ color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }} className="nav-link">
                  Private Rooms & 1RK
                </a>
              </li>
              <li>
                <a href="/explore" onClick={(e) => { e.preventDefault(); onNavigate('explore', { propertyType: 'house' }); }} style={{ color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }} className="nav-link">
                  Flats & Apartments
                </a>
              </li>
              <li>
                <a href="/nearme" onClick={(e) => { e.preventDefault(); onNavigate('nearme'); }} style={{ color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }} className="nav-link">
                  Find Near My Location (GPS)
                </a>
              </li>
            </ul>
          </div>

          {/* Company & Policies */}
          <div>
            <h4 style={{ color: '#0F172A', fontSize: '0.96rem', fontWeight: 700, marginBottom: '18px', letterSpacing: '0.04em' }}>
              QUICK LINKS
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '11px', fontSize: '0.88rem' }}>
              <li>
                <a href="/about" onClick={(e) => { e.preventDefault(); onNavigate('about'); }} style={{ color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }} className="nav-link">
                  About Us
                </a>
              </li>

              <li>
                <a href="/contact" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }} style={{ color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }} className="nav-link">
                  Contact Support
                </a>
              </li>
              <li>
                <a href="/owner" onClick={(e) => { e.preventDefault(); onNavigate('owner-portal'); }} style={{ color: '#B45309', textDecoration: 'none', fontWeight: 700, transition: 'color 0.2s' }} className="nav-link">
                  Host Portal (List Your Room)
                </a>
              </li>
              <li>
                <a href="/terms" onClick={(e) => { e.preventDefault(); onNavigate('terms'); }} style={{ color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }} className="nav-link">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/privacy" onClick={(e) => { e.preventDefault(); onNavigate('privacy'); }} style={{ color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }} className="nav-link">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 style={{ color: '#0F172A', fontSize: '0.96rem', fontWeight: 700, marginBottom: '18px', letterSpacing: '0.04em' }}>
              HELP & CONTACT
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '13px', fontSize: '0.88rem', color: '#475569' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} style={{ color: '#0052CC', flexShrink: 0 }} />
                <span>+91 1800 212 9999 (Toll Free)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} style={{ color: '#0284C7', flexShrink: 0 }} />
                <span>support@vrundavanventures.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={16} style={{ color: '#B45309', marginTop: '3px', flexShrink: 0 }} />
                <span>Rajkot, Gujarat 360005, India</span>
              </div>

              <div style={{ marginTop: '8px' }}>
                <a 
                  href="https://wa.me/919999999999" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '8px 14px',
                    borderRadius: '12px',
                    background: '#DCFCE7',
                    border: '1px solid #86EFAC',
                    color: '#15803D',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <MessageCircle size={15} /> WhatsApp Helpline
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #E2E8F0',
          paddingTop: '22px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          fontSize: '0.84rem',
          color: '#64748B'
        }}>
          <div>
            © {CURRENT_YEAR} Vrundavan Ventures. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <a href="/privacy" onClick={(e) => { e.preventDefault(); onNavigate('privacy'); }} style={{ color: '#64748B', textDecoration: 'none' }}>Privacy Policy</a>
            <span>•</span>
            <a href="/terms" onClick={(e) => { e.preventDefault(); onNavigate('terms'); }} style={{ color: '#64748B', textDecoration: 'none' }}>Terms of Service</a>
            <span>•</span>
            <span style={{ color: '#0052CC', fontWeight: 600 }}>Built for India 🇮🇳</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
