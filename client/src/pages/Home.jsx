import React, { useState } from 'react';
import { 
  Crown, 
  MapPin, 
  Search, 
  Navigation, 
  ShieldCheck, 
  Utensils, 
  Wifi, 
  Star, 
  ArrowRight, 
  CheckCircle, 
  HelpCircle,
  Building,
  Sparkles,
  BedDouble
} from 'lucide-react';
import LocationSearchBar from '../components/LocationSearchBar';
import PgCard from '../components/PgCard';
import GoogleMapView from '../components/GoogleMapView';

export default function Home({ pgs, onSelectPg, onNavigate }) {
  const [activeFaq, setActiveFaq] = useState(null);

  const featuredPgs = pgs.filter(p => p.featured || p.rating >= 4.8).slice(0, 3);
  const sampleMarkers = pgs.slice(0, 6);

  const handleHeroLocationSelect = (parsed) => {
    // Navigate to explore with the selected location and coordinates
    onNavigate('explore', {
      lat: parsed.lat,
      lng: parsed.lng,
      search: parsed.area || parsed.city
    });
  };

  const FAQS = [
    {
      q: "How does the 'Near Me' GPS feature find the closest PG accommodations?",
      a: "When you tap the 'Near Me' button, Vrundavan Ventures utilizes high-accuracy browser satellite geolocation combined with our backend Haversine distance engine. We instantly sort available verified properties based on exact road proximity (e.g. 0.8 km away) and provide turn-by-turn Google Maps navigation."
    },
    {
      q: "Are the PG photos and pricing 100% verified?",
      a: "Yes. Every property undergoes strict multi-step vetting by our quality verification team before being approved. All room configurations, starting rents, deposit terms, and amenities are verified against physical site inspections."
    },
    {
      q: "Is there any brokerage or hidden agent commission?",
      a: "Absolutely zero brokerage. You connect directly with the verified property host via Phone or WhatsApp with 100% transparent pricing and guaranteed security deposit refund rules."
    },
    {
      q: "What food and dining options are provided in luxury PGs?",
      a: "Most listed residences provide dietitian-approved 3-time buffet meals (North and South Indian options), along with evening high-tea and 24x7 access to RO water dispensers and refrigerators."
    },
    {
      q: "How can PG property owners list their properties?",
      a: "Property hosts can select the 'For PG Owners' option at the top to access the dedicated Host Portal. Our integrated Google Maps API automatically populates building name, street line, pincode, state, and coordinates for lightning-fast onboarding."
    }
  ];

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section style={{
        position: 'relative',
        padding: '90px 0 100px 0',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(14, 116, 237, 0.25)'
      }}>
        {/* Ambient Glows */}
        <div style={{
          position: 'absolute', top: '-15%', left: '50%', transform: 'translateX(-50%)',
          width: '800px', height: '420px',
          background: 'radial-gradient(ellipse, rgba(14, 116, 237, 0.25) 0%, rgba(212, 175, 55, 0.12) 45%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          {/* Prestige Tag */}
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '22px' }}>
            <span className="badge badge-gold animate-pulse-gold">
              <Crown size={14} /> Vrundavan Ventures • Luxury PG & Coliving Portal
            </span>
          </div>

          {/* Main H1 */}
          <h1 className="font-serif" style={{ fontSize: 'clamp(1.85rem, 5vw, 4.2rem)', lineHeight: 1.15, marginBottom: '20px', fontWeight: 900, color: '#ffffff' }}>
            Live Like Royalty in <br />
            <span className="gold-gradient-text">Curated Coliving Suites</span>
          </h1>

          <p style={{
            color: 'var(--text-secondary)',
            fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
            maxWidth: '720px',
            margin: '0 auto 40px auto',
            lineHeight: 1.7
          }}>
            Chef-crafted gourmet buffets, ergonomic high-speed workspaces, biometric safety, and prime locations next to top universities & IT parks.
          </p>

          {/* Luxury Search & Near Me Bar */}
          <div style={{
            maxWidth: '680px',
            margin: '0 auto 30px auto'
          }}>
            <LocationSearchBar 
              onLocationSelect={handleHeroLocationSelect}
              placeholder="Search area, landmark, Rajkot, or university..."
              showCurrentLocationBtn={true}
            />
          </div>

          {/* Quick Hub Pills */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: '#8E9DB2' }}>Popular Hubs:</span>
            {['Rajkot (Pride Classic)', 'Koramangala', 'Hitech City', 'Hinjewadi', 'Bandra', 'DLF Cyber City'].map((city) => (
              <button
                key={city}
                onClick={() => onNavigate('explore', { search: city.includes('Rajkot') ? 'Rajkot' : city })}
                className="btn btn-ghost btn-sm"
                style={{ borderRadius: 'var(--radius-full)', padding: '5px 14px', fontSize: '0.8rem', borderColor: 'rgba(14, 116, 237, 0.3)' }}
              >
                📍 {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container">
          <div className="section-header-center">
            <div className="badge-wrap">
              <span className="badge badge-peacock">The Vrundavan Standard</span>
            </div>
            <h2 className="font-serif gold-gradient-text" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)' }}>
              Why Students & Professionals Choose Us
            </h2>
            <p>
              Curated 5-star living standards, zero broker commissions, and verified property quality.
            </p>
          </div>

          <div className="grid-4">
            <div className="luxury-card" style={{ padding: '30px' }}>
              <div style={{
                width: '54px', height: '54px', borderRadius: '12px', background: 'rgba(212,175,55,0.15)',
                border: '1px solid var(--gold-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--gold-primary)', marginBottom: '20px'
              }}>
                <ShieldCheck size={28} />
              </div>
              <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '10px' }}>100% Quality Vetted</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Every PG is rigorously inspected and verified before going live. Zero catfishing.
              </p>
            </div>

            <div className="luxury-card" style={{ padding: '30px' }}>
              <div style={{
                width: '54px', height: '54px', borderRadius: '12px', background: 'rgba(14, 116, 237, 0.15)',
                border: '1px solid var(--blue-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--blue-light)', marginBottom: '20px'
              }}>
                <Navigation size={28} />
              </div>
              <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '10px' }}>Google GPS Proximity</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Real-time distance calculations and instant turn-by-turn live navigation links straight to your building entrance.
              </p>
            </div>

            <div className="luxury-card" style={{ padding: '30px' }}>
              <div style={{
                width: '54px', height: '54px', borderRadius: '12px', background: 'rgba(212,175,55,0.15)',
                border: '1px solid var(--gold-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--gold-primary)', marginBottom: '20px'
              }}>
                <Utensils size={28} />
              </div>
              <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '10px' }}>Chef-Curated Dining</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Wholesome 3-course breakfast, lunch, and dinner buffets prepared by culinary experts under clean ISO standards.
              </p>
            </div>

            <div className="luxury-card" style={{ padding: '30px' }}>
              <div style={{
                width: '54px', height: '54px', borderRadius: '12px', background: 'rgba(0, 210, 180, 0.15)',
                border: '1px solid var(--blue-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--blue-cyan)', marginBottom: '20px'
              }}>
                <CheckCircle size={28} />
              </div>
              <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '10px' }}>Zero Brokerage Direct</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Direct contact buttons for calling and WhatsApp messaging property hosts with standardized deposit refunds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED VIP LUXURY RESIDENCES */}
      <section style={{ padding: '90px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: '40px'
          }}>
            <div>
              <div style={{ marginBottom: '10px' }}>
                <span className="badge badge-gold">
                  Handpicked Collection
                </span>
              </div>
              <h2 className="font-serif gold-gradient-text" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', margin: '0 0 8px 0' }}>
                Featured Prime Residences
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
                The highest rated coliving spaces with single and shared luxury suites.
              </p>
            </div>

            <button 
              onClick={() => onNavigate('explore')}
              className="btn btn-outline-gold"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <span>View All Verified PGs</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid-3">
            {featuredPgs.map((pg) => (
              <PgCard key={pg.id} pg={pg} onSelect={onSelectPg} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. SATELLITE GOOGLE MAP LIVE SHOWCASE */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container">
          <div className="section-header-center">
            <div className="badge-wrap">
              <span className="badge badge-blue">
                Live GPS Proximity Engine
              </span>
            </div>
            <h2 className="font-serif gold-gradient-text" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)' }}>
              Explore Verified PGs on Official Google Maps
            </h2>
            <p>
              Browse properties dynamically across major tech corridors with interactive luxury pins and direct road navigation.
            </p>
          </div>

          <GoogleMapView 
            markers={sampleMarkers}
            height="460px"
            onSelectPg={onSelectPg}
          />
        </div>
      </section>

      {/* 5. RESIDENT TESTIMONIALS */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container">
          <div className="section-header-center">
            <div className="badge-wrap">
              <span className="badge badge-gold">Verified Experiences</span>
            </div>
            <h2 className="font-serif gold-gradient-text" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)' }}>
              Loved by 50,000+ Scholars & Innovators
            </h2>
          </div>

          <div className="grid-3">
            <div className="luxury-card" style={{ padding: '30px' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#D4AF37" color="#D4AF37" />
                ))}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontStyle: 'italic', marginBottom: '20px', lineHeight: 1.7 }}>
                "Living at Vrundavan Ventures residences eliminated every headache. 300 Mbps fiber internet for my remote deployments, delicious hot food daily, and complete peace of mind."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gold-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 700 }}>
                  SR
                </div>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '0.95rem' }}>Siddharth Rao</h4>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Lead Engineer at Amazon</span>
                </div>
              </div>
            </div>

            <div className="luxury-card" style={{ padding: '30px' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#D4AF37" color="#D4AF37" />
                ))}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontStyle: 'italic', marginBottom: '20px', lineHeight: 1.7 }}>
                "As a woman moving to Bengaluru alone for college, safety was my family's top priority. The 24/7 biometric surveillance, courteous security, and lovely study deck are incomparable."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--blue-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>
                  SS
                </div>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '0.95rem' }}>Shruti Sen</h4>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>MBA Scholar, IIM-B</span>
                </div>
              </div>
            </div>

            <div className="luxury-card" style={{ padding: '30px' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#D4AF37" color="#D4AF37" />
                ))}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontStyle: 'italic', marginBottom: '20px', lineHeight: 1.7 }}>
                "The Google Maps autofill on the owner panel made listing our newly furnished Pride Classic property effortless. We received verified student inquiries within 24 hours of Super Admin approval!"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gold-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 700 }}>
                  RS
                </div>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '0.95rem' }}>Rajesh Sharma</h4>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Verified Property Owner</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. COMPREHENSIVE FAQS (SEO SCHEMAPAGE) */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          <div className="section-header-center">
            <div className="badge-wrap">
              <span className="badge badge-blue">All You Need To Know</span>
            </div>
            <h2 className="font-serif gold-gradient-text" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)' }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {FAQS.map((faq, idx) => (
              <div 
                key={idx} 
                className="luxury-card"
                style={{ padding: '20px 24px', cursor: 'pointer' }}
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 600 }}>{faq.q}</h4>
                  <span style={{ color: 'var(--gold-primary)', fontSize: '1.4rem', fontWeight: 700 }}>
                    {activeFaq === idx ? '−' : '+'}
                  </span>
                </div>
                {activeFaq === idx && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '14px', lineHeight: 1.7, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA FOR PG OWNERS */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="luxury-card" style={{
            padding: '50px 30px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(7, 23, 57, 0.95) 0%, rgba(4, 13, 33, 0.98) 100%)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            boxShadow: '0 20px 50px rgba(2, 6, 23, 0.9), 0 0 25px rgba(14, 116, 237, 0.25)'
          }}>
            <Crown size={36} style={{ color: 'var(--gold-primary)', margin: '0 auto 16px auto', display: 'block' }} />
            <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '14px' }}>
              Are You a Luxury Property Owner?
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 25px auto', fontSize: '1rem', lineHeight: 1.7 }}>
              List your PG with Vrundavan Ventures. Benefit from Google Maps instant address autofill, zero brokerage charges, and high-intent corporate and student tenants.
            </p>
            <button 
              onClick={() => onNavigate('owner')}
              className="btn btn-gold btn-lg"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <span>Access Owner Admin Panel</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
