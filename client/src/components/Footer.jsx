import React from 'react';
import { Mail, Phone, MapPin, MessageCircle, ShieldCheck } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer({ onNavigate }) {
  return (
    <footer style={{
      background: '#020716',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
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
              <img 
                src="/logo.png" 
                alt="Vrundavan Ventures" 
                style={{ 
                  height: '56px', 
                  width: 'auto', 
                  maxHeight: '56px',
                  maxWidth: '260px',
                  objectFit: 'contain',
                  display: 'block',
                  filter: 'drop-shadow(0 2px 10px rgba(0, 0, 0, 0.45))'
                }} 
              />
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.90rem', lineHeight: '1.65', marginBottom: '18px' }}>
              Find verified PGs, rooms, and flats across India directly from property owners. Zero brokers, genuine photos, and transparent pricing.
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 13px',
              borderRadius: '20px',
              background: 'rgba(212, 175, 55, 0.10)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              color: '#FDE68A',
              fontSize: '0.78rem',
              fontWeight: 700
            }}>
              <ShieldCheck size={14} color="#F59E0B" />
              <span>100% Free for Students & Tenants</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.96rem', fontWeight: 700, marginBottom: '18px', letterSpacing: '0.04em' }}>
              EXPLORE RENTALS
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '11px', fontSize: '0.88rem' }}>
              <li>
                <a href="/explore" onClick={(e) => { e.preventDefault(); onNavigate('explore'); }} style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }} className="nav-link">
                  All Rental Properties
                </a>
              </li>
              <li>
                <a href="/explore" onClick={(e) => { e.preventDefault(); onNavigate('explore', { propertyType: 'pg' }); }} style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }} className="nav-link">
                  Student PGs & Hostels
                </a>
              </li>
              <li>
                <a href="/explore" onClick={(e) => { e.preventDefault(); onNavigate('explore', { propertyType: 'room' }); }} style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }} className="nav-link">
                  Private Rooms & 1RK
                </a>
              </li>
              <li>
                <a href="/explore" onClick={(e) => { e.preventDefault(); onNavigate('explore', { propertyType: 'house' }); }} style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }} className="nav-link">
                  Flats & Apartments
                </a>
              </li>
              <li>
                <a href="/nearme" onClick={(e) => { e.preventDefault(); onNavigate('nearme'); }} style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }} className="nav-link">
                  Find Near My Location (GPS)
                </a>
              </li>
            </ul>
          </div>

          {/* Company & Policies */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.96rem', fontWeight: 700, marginBottom: '18px', letterSpacing: '0.04em' }}>
              QUICK LINKS
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '11px', fontSize: '0.88rem' }}>
              <li>
                <a href="/about" onClick={(e) => { e.preventDefault(); onNavigate('about'); }} style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }} className="nav-link">
                  About Us
                </a>
              </li>
              <li>
                <a href="/blogs" onClick={(e) => { e.preventDefault(); onNavigate('blogs'); }} style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }} className="nav-link">
                  Guides & Blogs
                </a>
              </li>
              <li>
                <a href="/contact" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }} style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }} className="nav-link">
                  Contact Support
                </a>
              </li>
              <li>
                <a href="/owner" onClick={(e) => { e.preventDefault(); onNavigate('owner-portal'); }} style={{ color: '#FDE68A', textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s' }} className="nav-link">
                  Host Portal (List Your Room)
                </a>
              </li>
              <li>
                <a href="/terms" onClick={(e) => { e.preventDefault(); onNavigate('terms'); }} style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }} className="nav-link">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/privacy" onClick={(e) => { e.preventDefault(); onNavigate('privacy'); }} style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }} className="nav-link">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.96rem', fontWeight: 700, marginBottom: '18px', letterSpacing: '0.04em' }}>
              HELP & CONTACT
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '13px', fontSize: '0.88rem', color: '#94A3B8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} style={{ color: '#F59E0B', flexShrink: 0 }} />
                <span>+91 1800 212 9999 (Toll Free)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} style={{ color: '#38BDF8', flexShrink: 0 }} />
                <span>support@vrundavanventures.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={16} style={{ color: '#F59E0B', marginTop: '3px', flexShrink: 0 }} />
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
                    background: 'rgba(34, 197, 94, 0.12)',
                    border: '1px solid rgba(34, 197, 94, 0.35)',
                    color: '#86EFAC',
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
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
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
            <span style={{ color: '#94A3B8' }}>Built for India 🇮🇳</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
