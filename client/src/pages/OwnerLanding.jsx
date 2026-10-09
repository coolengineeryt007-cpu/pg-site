import React, { useState } from 'react';
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
  Layers,
  Eye,
  LayoutDashboard,
  Star,
  Navigation,
  Zap,
  Award,
  CheckCircle
} from 'lucide-react';
import PgCard from '../components/PgCard';
import OwnerPanel from './OwnerPanel';

export default function OwnerLanding({ 
  pgs = [], 
  currentUser,
  onSelectPg,
  onOpenLogin, 
  onOpenRegister, 
  onDemoLogin, 
  onSwitchToStudent,
  onLogout 
}) {
  // Two Preview Perspectives:
  // 1. 'frontend': How students browse & discover PGs (Motivates host to list!)
  // 2. 'admin': How hosts track bookings, occupancy, and leads
  const [activeViewMode, setActiveViewMode] = useState('frontend');
  const [selectedPropertyType, setSelectedPropertyType] = useState('all');

  const filteredPgs = pgs.filter((p) => {
    if (selectedPropertyType === 'all') return true;
    return (p.propertyType || 'pg') === selectedPropertyType;
  });

  const displayPgs = filteredPgs.length > 0 ? filteredPgs.slice(0, 6) : pgs.slice(0, 6);

  const benefits = [
    {
      icon: <DollarSign size={26} style={{ color: 'var(--gold-primary)' }} />,
      title: "0% Brokerage & 100% Direct Income",
      desc: "Zero commission cuts. Keep 100% of your room rental fees and deposits directly from tenants with no middleman."
    },
    {
      icon: <PhoneCall size={26} style={{ color: 'var(--blue-light)' }} />,
      title: "Direct WhatsApp & Phone Leads",
      desc: "Every student inquiry connects directly to your personal phone or WhatsApp number with verified preferences."
    },
    {
      icon: <MapPin size={26} style={{ color: 'var(--blue-cyan)' }} />,
      title: "Google Maps Turn-by-Turn GPS",
      desc: "Our interactive GPS locator guides students directly to your building entrance from university campuses and IT hubs."
    },
    {
      icon: <Layers size={26} style={{ color: 'var(--gold-light)' }} />,
      title: "Complete Inventory Control",
      desc: "Easily manage Single, Twin, and Triple sharing beds, flats, monthly rent, deposits, and house rules in real-time."
    },
    {
      icon: <ShieldCheck size={26} style={{ color: 'var(--blue-light)' }} />,
      title: "Verified Host Prestige Badge",
      desc: "Earn the Vrundavan Ventures Verified Shield to boost student trust, inquiries, and booking velocity by 3.5x."
    },
    {
      icon: <TrendingUp size={26} style={{ color: 'var(--gold-primary)' }} />,
      title: "98% Occupancy Year-Round",
      desc: "Target college students, university freshers, and corporate IT executives looking for quality accommodation."
    }
  ];

  return (
    <div style={{ paddingTop: '16px', paddingBottom: '90px' }}>
      {/* 1. TOP NOTICE & AUDIENCE SWITCHER */}
      <div className="container" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 20px',
          background: 'rgba(212, 175, 55, 0.12)',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.88rem',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <span style={{ color: 'var(--gold-light)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span>🏢</span> Dedicated Portal for PG Owners, Flat & House Landlords
          </span>
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
              gap: '5px',
              padding: 0
            }}
          >
            <GraduationCap size={15} /> Looking to rent a room or house? Switch to Tenant View →
          </button>
        </div>
      </div>

      {/* 2. PERSPECTIVE TOGGLE BAR: FRONTEND STUDENT SHOWCASE VS HOST ADMIN */}
      <div className="container" style={{ marginBottom: '32px' }}>
        <div style={{
          background: 'linear-gradient(180deg, rgba(7, 23, 57, 0.95) 0%, rgba(4, 13, 33, 0.98) 100%)',
          border: '1.5px solid rgba(212, 175, 55, 0.4)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--gold-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, display: 'block', marginBottom: '2px' }}>
              Host Experience Switcher
            </span>
            <h3 style={{ color: '#fff', fontSize: '1.15rem', margin: 0, fontWeight: 800 }}>
              {activeViewMode === 'frontend' ? '🌟 Live Frontend Showcase (How Students See Your PG)' : '📊 Host Admin Dashboard Preview'}
            </h3>
          </div>

          <div style={{ display: 'flex', gap: '8px', background: 'rgba(2, 6, 23, 0.7)', padding: '4px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(14, 116, 237, 0.3)' }}>
            <button
              onClick={() => setActiveViewMode('frontend')}
              className={`btn btn-sm ${activeViewMode === 'frontend' ? 'btn-gold' : 'btn-ghost'}`}
              style={{
                borderRadius: 'var(--radius-full)',
                padding: '8px 18px',
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Eye size={15} />
              <span>Student Frontend View</span>
            </button>

            <button
              onClick={() => setActiveViewMode('admin')}
              className={`btn btn-sm ${activeViewMode === 'admin' ? 'btn-gold' : 'btn-ghost'}`}
              style={{
                borderRadius: 'var(--radius-full)',
                padding: '8px 18px',
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <LayoutDashboard size={15} />
              <span>Host Admin Panel</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. VIEW MODE A: FRONTEND STUDENT SHOWCASE (MOTIVATING THE HOST TO LIST!) */}
      {activeViewMode === 'frontend' && (
        <>
          {/* Hero Motivation Banner */}
          <section className="container" style={{ textAlign: 'center', marginBottom: '50px' }}>
            <div style={{
              maxWidth: '920px',
              margin: '0 auto',
              background: 'linear-gradient(180deg, rgba(7, 23, 57, 0.95) 0%, rgba(4, 13, 33, 0.98) 100%)',
              border: '1px solid var(--blue-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '48px 32px',
              boxShadow: 'var(--shadow-luxury)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Gold/Blue Ambient Glow */}
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '650px',
                height: '350px',
                background: 'radial-gradient(ellipse, rgba(212, 175, 55, 0.22) 0%, rgba(14, 116, 237, 0.12) 50%, transparent 70%)',
                pointerEvents: 'none'
              }} />

              <div style={{ position: 'relative', zIndex: 2 }}>
                <span className="badge badge-gold" style={{ marginBottom: '18px', fontSize: '0.85rem', padding: '6px 16px' }}>
                  <Sparkles size={14} /> 0% Brokerage • 50,000+ Student & Renter Searches
                </span>

                <h1 className="font-serif" style={{ fontSize: 'clamp(1.9rem, 4.2vw, 3.2rem)', lineHeight: 1.2, marginBottom: '18px', fontWeight: 900, color: '#ffffff' }}>
                  See How Students Discover <br />
                  <span className="gold-gradient-text">Your PG, Room & House Listings</span>
                </h1>

                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
                  maxWidth: '720px',
                  margin: '0 auto 32px auto',
                  lineHeight: 1.65
                }}>
                  Below is the exact luxury presentation that students, scholars, and working professionals experience when searching for accommodations on Vrundavan Ventures. Join over 450+ verified hosts and start receiving direct inquiries today!
                </p>

                {/* Primary Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '28px' }}>
                  <button 
                    onClick={onOpenRegister}
                    className="btn btn-gold btn-lg"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', minWidth: '220px', fontWeight: 800 }}
                  >
                    <PlusCircle size={20} /> Enter Your PG With Us Free
                  </button>

                  <button 
                    onClick={onOpenLogin}
                    className="btn btn-primary btn-lg"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', minWidth: '190px' }}
                  >
                    <LogIn size={20} /> Host Sign In
                  </button>
                </div>

                {/* Quick 1-Click Demo Evaluation */}
                <div style={{
                  background: 'rgba(14, 116, 237, 0.08)',
                  border: '1px dashed rgba(14, 116, 237, 0.35)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 20px',
                  maxWidth: '480px',
                  margin: '0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}>
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ fontSize: '0.8rem', color: '#93C5FD', fontWeight: 700, display: 'block' }}>
                      ⚡ Instant Evaluation:
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>
                      Experience the live Host Portal as a verified demo landlord
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

          {/* Key Host Motivation Metric Highlights */}
          <section className="container" style={{ marginBottom: '50px' }}>
            <div className="grid-4">
              <div className="luxury-card" style={{ padding: '24px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monthly Reach</span>
                <h3 className="gold-gradient-text" style={{ fontSize: '2.2rem', fontWeight: 900, margin: '6px 0' }}>50,000+</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', margin: 0 }}>Active students & professionals seeking accommodation</p>
              </div>

              <div className="luxury-card" style={{ padding: '24px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Brokerage Cut</span>
                <h3 style={{ color: '#34D399', fontSize: '2.2rem', fontWeight: 900, margin: '6px 0' }}>0%</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', margin: 0 }}>You keep 100% of rent fees & deposits</p>
              </div>

              <div className="luxury-card" style={{ padding: '24px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lead Inquiries</span>
                <h3 style={{ color: '#60A5FA', fontSize: '2.2rem', fontWeight: 900, margin: '6px 0' }}>18+ / mo</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', margin: 0 }}>Average student visits & calls per listed PG</p>
              </div>

              <div className="luxury-card" style={{ padding: '24px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Approval Speed</span>
                <h3 className="gold-gradient-text" style={{ fontSize: '2.2rem', fontWeight: 900, margin: '6px 0' }}>&lt; 24 Hrs</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', margin: 0 }}>Fast Super Admin vetting & public launch</p>
              </div>
            </div>
          </section>

          {/* REAL PG LISTINGS SHOWCASE: "HOW STUDENTS SEE YOUR PROPERTY" */}
          <section className="container" style={{ marginBottom: '70px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '20px',
              marginBottom: '28px',
              borderBottom: '1px solid rgba(14, 116, 237, 0.25)',
              paddingBottom: '20px'
            }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span className="badge badge-gold">
                    <Eye size={13} /> Live Student Frontend Presentation
                  </span>
                  <span className="badge badge-peacock">
                    Interactive Preview
                  </span>
                </div>
                <h2 className="font-serif gold-gradient-text" style={{ fontSize: 'clamp(1.7rem, 3.2vw, 2.3rem)', margin: '0 0 6px 0' }}>
                  How Your Property Appears on the Public Site
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: 0 }}>
                  High-converting card layout featuring real-time GPS proximity, verified host badges, and direct call/WhatsApp buttons.
                </p>
              </div>

              {/* Property Type Category Filter */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { id: 'all', label: `🌟 All (${pgs.length})` },
                  { id: 'pg', label: '🏢 PGs & Coliving' },
                  { id: 'room', label: '🛏️ Private Rooms' },
                  { id: 'house', label: '🏠 Houses & Flats' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedPropertyType(tab.id)}
                    className={`btn btn-sm ${selectedPropertyType === tab.id ? 'btn-gold' : 'btn-ghost'}`}
                    style={{ fontSize: '0.82rem', padding: '6px 14px', borderRadius: 'var(--radius-full)' }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of Real Property Cards */}
            <div className="grid-3" style={{ marginBottom: '36px' }}>
              {displayPgs.map((pg) => (
                <div key={pg.id} style={{ position: 'relative' }}>
                  {/* Motivator Banner Badge on Top of Card */}
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '16px',
                    zIndex: 10,
                    background: 'var(--gold-gradient)',
                    color: '#080808',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    boxShadow: '0 4px 12px rgba(212,175,55,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Star size={11} fill="#080808" />
                    <span>Host Preview Format</span>
                  </div>

                  <PgCard 
                    pg={pg} 
                    onSelect={onSelectPg} 
                    currentUser={currentUser}
                    onOpenLogin={onOpenLogin}
                  />
                </div>
              ))}
            </div>

            {/* Motivational Call to Action directly below listings */}
            <div style={{
              background: 'linear-gradient(90deg, rgba(14, 116, 237, 0.16) 0%, rgba(212, 175, 55, 0.16) 100%)',
              border: '1.5px solid rgba(212, 175, 55, 0.4)',
              borderRadius: 'var(--radius-lg)',
              padding: '28px 32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '20px',
              textAlign: 'left'
            }}>
              <div>
                <h3 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 800, margin: '0 0 6px 0' }}>
                  Want your property to be featured here in front of 50,000+ students?
                </h3>
                <p style={{ color: '#CBD5E1', fontSize: '0.9rem', margin: 0 }}>
                  Listing takes less than 3 minutes. Enter your location, set your rent, and start receiving direct inquiries.
                </p>
              </div>

              <button
                onClick={onOpenRegister}
                className="btn btn-gold btn-lg"
                style={{ padding: '12px 28px', fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <PlusCircle size={18} /> Enter Your PG With Us Now
              </button>
            </div>
          </section>

          {/* 6 KEY BENEFITS FOR PROPERTY OWNERS */}
          <section className="container" style={{ marginBottom: '70px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div className="badge-wrap">
                <span className="badge badge-gold">Host Advantages</span>
              </div>
              <h2 className="font-serif gold-gradient-text" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', margin: '0 0 10px 0' }}>
                Why Top Landlords Choose Vrundavan Ventures
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', maxWidth: '620px', margin: '0 auto' }}>
                Eliminate broker commissions, attract respectful tenants, and maximize your property's monthly rental yield.
              </p>
            </div>

            <div className="grid-3">
              {benefits.map((b, idx) => (
                <div 
                  key={idx}
                  className="luxury-card"
                  style={{
                    padding: '30px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px'
                  }}
                >
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '12px',
                    background: 'rgba(14, 116, 237, 0.12)',
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
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 3 SIMPLE STEPS TO LIST */}
          <section className="container" style={{ marginBottom: '60px' }}>
            <div style={{
              background: 'linear-gradient(180deg, rgba(7, 23, 57, 0.85) 0%, rgba(4, 13, 33, 0.95) 100%)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: 'var(--radius-xl)',
              padding: '48px 36px',
              textAlign: 'center'
            }}>
              <h2 className="font-serif gold-gradient-text" style={{ fontSize: 'clamp(1.7rem, 3.2vw, 2.2rem)', marginBottom: '32px' }}>
                List Your Property in 3 Simple Steps
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '32px',
                marginBottom: '40px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'var(--blue-gradient)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.2rem'
                  }}>
                    1
                  </div>
                  <h4 style={{ color: '#fff', fontSize: '1.15rem', margin: 0 }}>Create Host Account</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                    Sign up with your phone number and email to access your private Host Dashboard.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'var(--gold-gradient)',
                    color: '#080808',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.2rem'
                  }}>
                    2
                  </div>
                  <h4 style={{ color: '#fff', fontSize: '1.15rem', margin: 0 }}>Add Property & Address</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                    Enter room details. Our Google Maps locator automatically pins your exact GPS entrance.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00D2B4, #0E74ED)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.2rem'
                  }}>
                    3
                  </div>
                  <h4 style={{ color: '#fff', fontSize: '1.15rem', margin: 0 }}>Receive Direct Inquiries</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                    Start getting verified student inquiries, WhatsApp messages, and physical visit bookings.
                  </p>
                </div>
              </div>

              <button 
                onClick={onOpenRegister}
                className="btn btn-gold btn-lg"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 34px', fontSize: '1rem', fontWeight: 800 }}
              >
                Get Started Free — Register Property <ArrowRight size={18} />
              </button>
            </div>
          </section>
        </>
      )}

      {/* 4. VIEW MODE B: HOST ADMIN PANEL PREVIEW */}
      {activeViewMode === 'admin' && (
        <div className="container">
          <div style={{
            background: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.2rem' }}>📊</span>
              <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>
                You are viewing the <strong>Host Admin & Leads Management Dashboard Preview</strong>.
              </span>
            </div>
            <button
              onClick={() => setActiveViewMode('frontend')}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--gold-light)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Eye size={14} /> Switch back to Student Frontend View
            </button>
          </div>

          {/* Renders the full OwnerPanel component */}
          <OwnerPanel 
            currentUser={currentUser}
            isGuestPreview={!currentUser || currentUser?.role !== 'owner'}
            onSelectPg={onSelectPg}
            onNavigateHome={() => setActiveViewMode('frontend')}
            onLogout={onLogout}
            onOpenLogin={onOpenLogin}
          />
        </div>
      )}
    </div>
  );
}
