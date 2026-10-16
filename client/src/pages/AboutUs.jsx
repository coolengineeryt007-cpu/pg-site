import React from 'react';
import { Crown, CheckCircle2, Globe, Share2 } from 'lucide-react';

export default function AboutUs() {
  const LEADERSHIP = [
    {
      name: "Vikramaditya Singhania",
      role: "Founder & Chief Executive Officer",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      bio: "Passionate about simplifying real estate and helping people. Founded Vrundavan Ventures to help students and families find clean, comfortable homes without paying high broker fees.",
      badge: "Founder & CEO"
    },
    {
      name: "Priya Malhotra",
      role: "Co-Founder & Head of Operations",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      bio: "Over 12 years of experience in hospitality and customer care. Dedicated to ensuring 24x7 security, clean kitchens, and healthy home-style meals in every verified PG.",
      badge: "Co-Founder & COO"
    },
    {
      name: "Sameer Kulkarni",
      role: "Head of Technology & Maps",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      bio: "Maps and software specialist who built our live GPS search so you can find rooms within walking distance of your college or office.",
      badge: "Head of Tech"
    }
  ];

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '90px' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 60px auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
          <span className="badge badge-gold">
            👑 The Vrundavan Story
          </span>
        </div>
        <h1 className="font-serif gold-gradient-text" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', marginBottom: '18px' }}>
          Making Rental Living Simple, Honest & Comfortable
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8 }}>
          We believe where you live matters. Vrundavan Ventures was built with one clear mission: to help students, working professionals, and families find verified rental flats, private rooms, and PGs across India with 100% honesty and direct owner contact.
        </p>
      </div>

      {/* Metric Counters */}
      <div className="grid-4" style={{ marginBottom: '70px' }}>
        <div className="luxury-card" style={{ padding: '26px', textAlign: 'center' }}>
          <h2 className="gold-gradient-text font-serif" style={{ fontSize: '2.5rem', fontWeight: 900 }}>50,000+</h2>
          <span style={{ color: '#64748B', fontSize: '0.9rem' }}>Happy Tenants Housed</span>
        </div>
        <div className="luxury-card" style={{ padding: '26px', textAlign: 'center' }}>
          <h2 className="gold-gradient-text font-serif" style={{ fontSize: '2.5rem', fontWeight: 900 }}>1,200+</h2>
          <span style={{ color: '#64748B', fontSize: '0.9rem' }}>Verified Rental Properties</span>
        </div>
        <div className="luxury-card" style={{ padding: '26px', textAlign: 'center' }}>
          <h2 className="gold-gradient-text font-serif" style={{ fontSize: '2.5rem', fontWeight: 900 }}>99.8%</h2>
          <span style={{ color: '#64748B', fontSize: '0.9rem' }}>Safe Deposit Return Rate</span>
        </div>
        <div className="luxury-card" style={{ padding: '26px', textAlign: 'center' }}>
          <h2 className="gold-gradient-text font-serif" style={{ fontSize: '2.5rem', fontWeight: 900 }}>4.9 ★</h2>
          <span style={{ color: '#64748B', fontSize: '0.9rem' }}>Average Tenant Rating</span>
        </div>
      </div>

      {/* FOUNDER & CO-FOUNDER LEADERSHIP SECTION */}
      <section style={{ marginBottom: '80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '45px' }}>
          <span className="badge badge-crimson" style={{ marginBottom: '10px' }}>Our Team</span>
          <h2 className="font-serif gold-gradient-text" style={{ fontSize: '2.4rem' }}>
            Meet the Founders & Team
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            The dedicated team working every day to make renting simple and tension-free across India.
          </p>
        </div>

        <div className="grid-3">
          {LEADERSHIP.map((leader, idx) => (
            <div key={idx} className="luxury-card" style={{ padding: '30px', display: 'flex', flexDirection: 'column' }}>
              <div style={{
                position: 'relative',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                overflow: 'hidden',
                margin: '0 auto 20px auto',
                border: '2px solid var(--gold-primary)',
                boxShadow: 'var(--shadow-luxury)'
              }}>
                <img 
                  src={leader.photo} 
                  alt={leader.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                <span className="badge badge-gold" style={{ fontSize: '0.7rem', marginBottom: '8px' }}>
                  {leader.badge}
                </span>
                <h3 style={{ color: '#0F172A', fontSize: '1.3rem', marginBottom: '4px' }}>{leader.name}</h3>
                <span style={{ color: '#B45309', fontSize: '0.85rem', fontWeight: 600 }}>{leader.role}</span>
              </div>

              <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.7, textAlign: 'center', marginBottom: '20px', flex: 1 }}>
                {leader.bio}
              </p>

              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '12px',
                borderTop: '1px solid #E2E8F0',
                paddingTop: '16px'
              }}>
                <button type="button" onClick={(e) => e.preventDefault()} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gold-primary)' }} title="Team Profile">
                  <Globe size={18} />
                </button>
                <button type="button" onClick={(e) => e.preventDefault()} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gold-primary)' }} title="Share Profile">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CORE PILLARS & MISSION */}
      <section className="luxury-card" style={{ padding: '50px 40px', background: '#FFFFFF', border: '1px solid #CBD5E1', boxShadow: '0 15px 40px rgba(0, 82, 204, 0.08)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <Crown size={36} style={{ color: 'var(--gold-primary)', margin: '0 auto 16px auto', display: 'block' }} />
          <h2 className="font-serif gold-gradient-text" style={{ fontSize: '2rem', marginBottom: '16px' }}>
            Our Simple Promise to Every Tenant
          </h2>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.8, marginBottom: '30px' }}>
            We inspect every property carefully. If a room has poor ventilation, dirty facilities, or hidden extra costs, we do not list it. We only list clean, safe, and honest homes.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#0F172A' }}>
              <CheckCircle2 size={18} style={{ color: 'var(--blue-primary)' }} />
              <span>Safe & Secure Deposit Return</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#0F172A' }}>
              <CheckCircle2 size={18} style={{ color: 'var(--blue-primary)' }} />
              <span>Female Wardens in Girls PGs</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#0F172A' }}>
              <CheckCircle2 size={18} style={{ color: 'var(--blue-primary)' }} />
              <span>24x7 Power Backup & Fast WiFi</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#0F172A' }}>
              <CheckCircle2 size={18} style={{ color: 'var(--blue-primary)' }} />
              <span>Direct WhatsApp & Call with Owners</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
