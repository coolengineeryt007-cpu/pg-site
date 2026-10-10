import React from 'react';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer({ onNavigate }) {
  return (
    <footer style={{
      background: '#030A1C',
      borderTop: '1px solid rgba(14, 116, 237, 0.25)',
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
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <img 
                src="/logo.png" 
                alt="Vrundavan Ventures" 
                style={{ 
                  height: '68px', 
                  width: '68px', 
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid rgba(212, 175, 55, 0.85)',
                  boxShadow: '0 0 18px rgba(212, 175, 55, 0.5)',
                  display: 'block'
                }} 
              />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.7', marginBottom: '20px' }}>
              Vrundavan Ventures is your premier rental discovery platform across India. Handpicked verified rental houses, flats, private rooms, and PGs for families, working professionals, bachelors, and students with direct owner connect.
            </p>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="badge badge-gold">Verified Properties</span>
              <span className="badge badge-blue">Direct Host Connect</span>
              <span className="badge badge-peacock">Instant Communication</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '18px', letterSpacing: '0.04em' }}>
              EXPLORE RENTALS & HOMES
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li>
                <a href="/explore" onClick={(e) => { e.preventDefault(); onNavigate('explore'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} className="nav-link">
                  All Rental Properties
                </a>
              </li>
              <li>
                <a href="/explore" onClick={(e) => { e.preventDefault(); onNavigate('explore', { propertyType: 'house' }); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} className="nav-link">
                  🏠 Houses & Flats for Rent
                </a>
              </li>
              <li>
                <a href="/explore" onClick={(e) => { e.preventDefault(); onNavigate('explore', { propertyType: 'room' }); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} className="nav-link">
                  🛏️ Private Rental Rooms & Studios
                </a>
              </li>
              <li>
                <a href="/explore" onClick={(e) => { e.preventDefault(); onNavigate('explore', { propertyType: 'pg' }); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} className="nav-link">
                  🏢 PGs & Coliving Spaces
                </a>
              </li>
              <li>
                <a href="/nearme" onClick={(e) => { e.preventDefault(); onNavigate('nearme'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} className="nav-link">
                  📍 Find Near My Location (GPS)
                </a>
              </li>
            </ul>
          </div>

          {/* Company & Policies */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '18px', letterSpacing: '0.04em' }}>
              COMPANY & POLICIES
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li>
                <a href="/about" onClick={(e) => { e.preventDefault(); onNavigate('about'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} className="nav-link">
                  About Founders & Vision
                </a>
              </li>
              <li>
                <a href="/blogs" onClick={(e) => { e.preventDefault(); onNavigate('blogs'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} className="nav-link">
                  Rental & Coliving Guides
                </a>
              </li>
              <li>
                <a href="/contact" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} className="nav-link">
                  Contact Support & Helpdesk
                </a>
              </li>
              <li>
                <a href="/owner" onClick={(e) => { e.preventDefault(); onNavigate('owner-portal'); }} style={{ color: 'var(--gold-light)', textDecoration: 'none', fontWeight: 600 }} className="nav-link">
                  🏢 For Property Owners & Landlords
                </a>
              </li>
              <li>
                <a href="/terms" onClick={(e) => { e.preventDefault(); onNavigate('terms'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} className="nav-link">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/privacy" onClick={(e) => { e.preventDefault(); onNavigate('privacy'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} className="nav-link">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/superadmin" onClick={(e) => { e.preventDefault(); onNavigate('superadmin'); }} style={{ color: '#F87171', textDecoration: 'none', fontWeight: 600, fontSize: '0.82rem' }} className="nav-link">
                  🔒 Super Admin Portal
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
                <Mail size={16} style={{ color: 'var(--blue-light)' }} />
                <span>concierge@vrundavanventures.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={16} style={{ color: 'var(--gold-primary)', marginTop: '4px' }} />
                <span>Pride Classic, Yogi Nagar Main Road, Rajkot, Gujarat 360005</span>
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
            © {CURRENT_YEAR} VRUNDAVAN VENTURES. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>Theme: <strong>Sapphire Blue + Imperial Gold 🦚</strong></span>
            <span>•</span>
            <span>100% Mobile Responsive</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
