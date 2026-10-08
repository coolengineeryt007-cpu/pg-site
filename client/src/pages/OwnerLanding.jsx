import React from 'react';
import { 
  Building2, 
  PlusCircle, 
  LogIn, 
  MapPin, 
  PhoneCall, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock, 
  ArrowRight,
  GraduationCap,
  Layers
} from 'lucide-react';

export default function OwnerLanding({ onOpenLogin, onOpenRegister, onDemoLogin, onSwitchToStudent }) {
  const benefits = [
    {
      icon: <DollarSign size={24} style={{ color: 'var(--gold-primary)' }} />,
      title: "0% Brokerage & Direct Income",
      desc: "Zero commission cuts. Keep 100% of your room rental fees and deposits directly from tenants."
    },
    {
      icon: <PhoneCall size={24} style={{ color: 'var(--blue-light)' }} />,
      title: "Direct WhatsApp & Phone Leads",
      desc: "Every student inquiry connects directly to your phone or WhatsApp number with verified room preferences."
    },
    {
      icon: <MapPin size={24} style={{ color: 'var(--blue-cyan)' }} />,
      title: "Live Google Maps Integration",
      desc: "Our interactive map locator and GPS proximity engine places your PG in front of nearby students and professionals."
    },
    {
      icon: <Layers size={24} style={{ color: 'var(--gold-light)' }} />,
      title: "Single, Double & Triple Sharing Control",
      desc: "Easily update room types, available beds, monthly rent, security deposits, and rules in real-time."
    },
    {
      icon: <ShieldCheck size={24} style={{ color: 'var(--blue-light)' }} />,
      title: "Verified Host Prestige Badge",
      desc: "Earn the Vrundavan Ventures Verified Shield to boost student trust, inquiries, and booking velocity."
    },
    {
      icon: <TrendingUp size={24} style={{ color: 'var(--gold-primary)' }} />,
      title: "Higher Occupancy Year-Round",
      desc: "Target college students, university freshers, and corporate IT executives across major education & tech hubs."
    }
  ];

  return (
    <div style={{ paddingTop: '20px', paddingBottom: '80px' }}>
      {/* Top Notice Pill */}
      <div className="container" style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 18px',
          background: 'rgba(212, 175, 55, 0.12)',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.88rem'
        }}>
          <span style={{ color: 'var(--gold-light)', fontWeight: 700 }}>🏢 Dedicated Portal for PG & Coliving Owners</span>
          <span style={{ color: '#64748B' }}>•</span>
          <button 
            onClick={onSwitchToStudent}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--blue-light)',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: 0
            }}
          >
            <GraduationCap size={15} /> Looking for a PG? Switch to Student View
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="container" style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{
          maxWidth: '850px',
          margin: '0 auto',
          background: 'linear-gradient(180deg, rgba(7, 23, 57, 0.95) 0%, rgba(4, 13, 33, 0.98) 100%)',
          border: '1px solid var(--blue-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '50px 30px',
          boxShadow: 'var(--shadow-luxury)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle Ambient Radial */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '350px',
            background: 'radial-gradient(ellipse, rgba(212, 175, 55, 0.18) 0%, rgba(14, 116, 237, 0.1) 50%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ position: 'relative', zIndex: 2 }}>
            <span className="badge badge-gold" style={{ marginBottom: '16px' }}>
              <Sparkles size={14} /> 100% Zero Brokerage Listing
            </span>

            <h1 className="font-serif" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)', lineHeight: 1.2, marginBottom: '18px', fontWeight: 900, color: '#ffffff' }}>
              Fill Your Rooms Faster & <br />
              <span className="gold-gradient-text">Manage Your PG Properties</span>
            </h1>

            <p style={{
              color: 'var(--text-secondary)',
              fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
              maxWidth: '680px',
              margin: '0 auto 36px auto',
              lineHeight: 1.6
            }}>
              Join hundreds of successful PG hosts on Vrundavan Ventures. List your property in minutes with Google Maps autofill, receive instant tenant calls, and maximize occupancy.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '30px' }}>
              <button 
                onClick={onOpenLogin}
                className="btn btn-gold btn-lg"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', minWidth: '190px' }}
              >
                <LogIn size={20} /> Sign In as Owner
              </button>

              <button 
                onClick={onOpenRegister}
                className="btn btn-primary btn-lg"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', minWidth: '190px' }}
              >
                <PlusCircle size={20} /> Register New Host
              </button>
            </div>

            {/* Quick Demo Access Button */}
            <div style={{
              background: 'rgba(14, 116, 237, 0.1)',
              border: '1px dashed rgba(14, 116, 237, 0.4)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 20px',
              maxWidth: '460px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '0.8rem', color: '#93C5FD', fontWeight: 700, display: 'block' }}>
                  ⚡ Quick Test / Evaluation:
                </span>
                <span style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>
                  Instant 1-click login as Demo PG Owner
                </span>
              </div>
              <button 
                onClick={onDemoLogin}
                className="btn btn-sm btn-outline-gold"
                style={{ whiteSpace: 'nowrap', fontSize: '0.8rem', padding: '6px 14px' }}
              >
                Demo Host Access →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features & Benefits */}
      <section className="container" style={{ marginBottom: '60px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 className="font-serif" style={{ fontSize: '2rem', marginBottom: '10px', color: '#ffffff' }}>
            Why Leading PG Owners Choose <span className="blue-gradient-text">Vrundavan Ventures</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
            A purpose-built host management platform designed to make property listing simple, transparent, and profitable.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {benefits.map((b, idx) => (
            <div 
              key={idx}
              className="card"
              style={{
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                background: 'rgba(7, 23, 57, 0.8)',
                border: '1px solid rgba(14, 116, 237, 0.25)',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(14, 116, 237, 0.15)',
                border: '1px solid rgba(14, 116, 237, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {b.icon}
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>
                {b.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works for Owners */}
      <section className="container">
        <div style={{
          background: 'rgba(7, 23, 57, 0.65)',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          borderRadius: 'var(--radius-lg)',
          padding: '40px 30px',
          textAlign: 'center'
        }}>
          <h2 className="font-serif" style={{ fontSize: '1.8rem', marginBottom: '30px', color: '#ffffff' }}>
            List Your PG in 3 Simple Steps
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '30px',
            marginBottom: '35px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'var(--blue-gradient)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem'
              }}>
                1
              </div>
              <h4 style={{ color: '#fff', fontSize: '1.1rem' }}>Create Host Account</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                Sign up with your phone number and email to access your private Host Dashboard.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'var(--gold-gradient)',
                color: '#080808',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem'
              }}>
                2
              </div>
              <h4 style={{ color: '#fff', fontSize: '1.1rem' }}>Add Property & Address</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                Enter your PG details. Our Google Maps locator automatically pins your location and address.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00D2B4, #0E74ED)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem'
              }}>
                3
              </div>
              <h4 style={{ color: '#fff', fontSize: '1.1rem' }}>Receive Direct Inquiries</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                Start getting verified student inquiries, WhatsApp messages, and phone calls directly.
              </p>
            </div>
          </div>

          <button 
            onClick={onOpenRegister}
            className="btn btn-gold"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            Get Started Now — Register Free <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
