import React from 'react';
import { Crown, ShieldCheck, Heart, Award, Users, CheckCircle2, Globe, Share2 } from 'lucide-react';

export default function AboutUs() {
  const LEADERSHIP = [
    {
      name: "Vikramaditya Singhania",
      role: "Founder & Chief Executive Officer",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      bio: "Former McKinsey principal & IIM-A alumnus with over a decade of real estate innovation. Founded Aurelia to permanently eliminate unhygienic, overpriced paying guest living.",
      badge: "Founder & CEO"
    },
    {
      name: "Priya Malhotra",
      role: "Co-Founder & Chief Operations Officer",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      bio: "12-year hospitality veteran previously with The Oberoi Group. Pioneer of Aurelia's 3-tier security architecture and dietitian-crafted meal standard.",
      badge: "Co-Founder & COO"
    },
    {
      name: "Sameer Kulkarni",
      role: "Chief Technology Officer & Maps Lead",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      bio: "Ex-Google Maps engineering specialist who architected our proprietary Haversine distance engine and automated Places reverse-geocoding system.",
      badge: "CTO"
    }
  ];

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '90px' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 60px auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
          <span className="badge badge-gold">
            👑 The Vrundavan Legacy
          </span>
        </div>
        <h1 className="font-serif gold-gradient-text" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', marginBottom: '18px' }}>
          Transforming Student & Corporate Living into a Royal Experience
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8 }}>
          We believe where you live shapes who you become. Vrundavan Ventures was born out of a mission to replace subpar hostels with 5-star, biometric-secured, gourmet-serviced living sanctuaries across India.
        </p>
      </div>

      {/* Metric Counters */}
      <div className="grid-4" style={{ marginBottom: '70px' }}>
        <div className="luxury-card" style={{ padding: '26px', textAlign: 'center' }}>
          <h2 className="gold-gradient-text font-serif" style={{ fontSize: '2.5rem', fontWeight: 900 }}>50,000+</h2>
          <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Happy Residents Housed</span>
        </div>
        <div className="luxury-card" style={{ padding: '26px', textAlign: 'center' }}>
          <h2 className="gold-gradient-text font-serif" style={{ fontSize: '2.5rem', fontWeight: 900 }}>1,200+</h2>
          <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Verified Luxury Suites</span>
        </div>
        <div className="luxury-card" style={{ padding: '26px', textAlign: 'center' }}>
          <h2 className="gold-gradient-text font-serif" style={{ fontSize: '2.5rem', fontWeight: 900 }}>99.8%</h2>
          <span style={{ color: '#aaa', fontSize: '0.9rem' }}>On-Time Deposit Refund</span>
        </div>
        <div className="luxury-card" style={{ padding: '26px', textAlign: 'center' }}>
          <h2 className="gold-gradient-text font-serif" style={{ fontSize: '2.5rem', fontWeight: 900 }}>4.92 ★</h2>
          <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Average Student Rating</span>
        </div>
      </div>

      {/* FOUNDER & CO-FOUNDER LEADERSHIP SECTION */}
      <section style={{ marginBottom: '80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '45px' }}>
          <span className="badge badge-crimson" style={{ marginBottom: '10px' }}>Executive Leadership</span>
          <h2 className="font-serif gold-gradient-text" style={{ fontSize: '2.4rem' }}>
            Meet the Founders & Leadership Team
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            The visionary minds building India's premier luxury coliving infrastructure.
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
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                <span className="badge badge-gold" style={{ fontSize: '0.7rem', marginBottom: '8px' }}>
                  {leader.badge}
                </span>
                <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '4px' }}>{leader.name}</h3>
                <span style={{ color: 'var(--gold-light)', fontSize: '0.85rem', fontWeight: 600 }}>{leader.role}</span>
              </div>

              <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: 1.7, textAlign: 'center', marginBottom: '20px', flex: 1 }}>
                {leader.bio}
              </p>

              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '12px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                paddingTop: '16px'
              }}>
                <a href="#profile" style={{ color: 'var(--gold-primary)' }} title="Executive Profile">
                  <Globe size={18} />
                </a>
                <a href="#share" style={{ color: 'var(--gold-primary)' }} title="Share Profile">
                  <Share2 size={18} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CORE PILLARS & MISSION */}
      <section className="luxury-card" style={{ padding: '50px 40px', background: 'linear-gradient(135deg, rgba(18,18,18,0.95) 0%, rgba(20,10,10,0.95) 100%)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <Crown size={36} style={{ color: 'var(--gold-primary)', margin: '0 auto 16px auto', display: 'block' }} />
          <h2 className="font-serif gold-gradient-text" style={{ fontSize: '2rem', marginBottom: '16px' }}>
            Our Golden Guarantee to Every Resident
          </h2>
          <p style={{ color: '#bbb', fontSize: '1rem', lineHeight: 1.8, marginBottom: '30px' }}>
            We strictly decline over 70% of property applications that fail to meet our rigorous standards for ventilation, acoustic insulation, sanitary kitchens, and high-speed fiber infrastructure.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
              <CheckCircle2 size={18} style={{ color: 'var(--gold-primary)' }} />
              <span>Full Security Deposit Escrow Protection</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
              <CheckCircle2 size={18} style={{ color: 'var(--gold-primary)' }} />
              <span>Dedicated Female Wardens for Girls PGs</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
              <CheckCircle2 size={18} style={{ color: 'var(--gold-primary)' }} />
              <span>24x7 Power Backup with Inverter</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
              <CheckCircle2 size={18} style={{ color: 'var(--gold-primary)' }} />
              <span>Instant WhatsApp Host Connectivity</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
