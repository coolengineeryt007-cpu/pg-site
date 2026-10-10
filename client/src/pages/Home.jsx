import React, { useState } from 'react';
import { 
  Crown, 
  Navigation, 
  ShieldCheck, 
  Utensils, 
  Star, 
  ArrowRight, 
  CheckCircle 
} from 'lucide-react';
import LocationSearchBar from '../components/LocationSearchBar';
import PgCard from '../components/PgCard';
import GoogleMapView from '../components/GoogleMapView';

export default function Home({ pgs, onSelectPg, onNavigate, currentUser, onOpenLogin }) {
  const [activeFaq, setActiveFaq] = useState(null);

  // Show exactly 6 listings on the Home page
  const featuredPgs = pgs.slice(0, 6);
  const sampleMarkers = pgs.slice(0, 6);

  const handleProtectedNavigate = (page, filter = {}) => {
    if (!currentUser) {
      if (onOpenLogin) onOpenLogin('student');
      return;
    }
    onNavigate(page, filter);
  };

  const handleHeroLocationSelect = (parsed) => {
    handleProtectedNavigate('explore', {
      lat: parsed.lat,
      lng: parsed.lng,
      search: parsed.area || parsed.city
    });
  };

  const FAQS = [
    {
      q: "What types of rental properties can I find on Vrundavan Ventures?",
      a: "Our platform features 3 verified rental categories: (1) PGs & Coliving for students and single professionals, (2) Private Rental Rooms (1RK / single rooms) for budget-friendly independent living, and (3) Rental Houses & Flats (1BHK, 2BHK, 3BHK, and independent houses) for families and corporate executives."
    },
    {
      q: "Is this platform only for students, or can families and professionals also rent?",
      a: "Vrundavan Ventures is built for everyone looking for a rental home: families searching for 2BHK/3BHK flats, working professionals seeking executive coliving or 1RK rooms, and students seeking verified hostels & PGs."
    },
    {
      q: "Is there any brokerage or hidden agent commission?",
      a: "Absolutely zero brokerage. You connect directly with the verified property owner or host via Phone or WhatsApp with 100% transparent pricing and direct deposit agreements."
    },
    {
      q: "How does the 'Near Me' GPS feature find the closest rental properties?",
      a: "When you tap 'Near Me', Vrundavan Ventures calculates road distance between your current location and all verified listings. You can immediately sort by distance and open turn-by-turn Google Maps navigation to visit the property."
    },
    {
      q: "How can property owners (PGs, rooms, flats, houses) list their property?",
      a: "Landlords and PG owners can click the 'Host Portal' button to list properties in minutes. With our automated address geocoder, entering your landmark auto-populates coordinates, area, city, and pincode."
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
              <Crown size={14} /> Vrundavan Ventures • PGs, Rental Rooms & Houses
            </span>
          </div>

          {/* Main H1 */}
          <h1 style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3.6rem)', lineHeight: 1.2, marginBottom: '18px', fontWeight: 800, color: '#ffffff' }}>
            Find Your Ideal Rental Space: <br />
            <span className="gold-gradient-text">PGs, Private Rooms & Houses</span>
          </h1>

          <p style={{
            color: 'var(--text-secondary)',
            fontSize: 'clamp(0.95rem, 1.6vw, 1.15rem)',
            maxWidth: '720px',
            margin: '0 auto 28px auto',
            lineHeight: 1.65
          }}>
            Explore verified paying guest coliving, 1RK furnished rental rooms, flats, and family houses across India. Zero brokerage, transparent deposits, and direct owner WhatsApp & phone connections.
          </p>

          {/* Quick Property Type Category Selector - Smooth Touch Scroll on Mobile */}
          <div className="horizontal-scroll-row no-scrollbar" style={{
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '22px',
            padding: '4px 0'
          }}>
            <button
              onClick={() => handleProtectedNavigate('explore', { propertyType: 'all' })}
              className="btn btn-gold btn-sm"
              style={{ borderRadius: 'var(--radius-full)', padding: '8px 18px', fontWeight: 700 }}
            >
              🌟 All Rentals
            </button>
            <button
              onClick={() => handleProtectedNavigate('explore', { propertyType: 'house' })}
              className="btn btn-outline-gold btn-sm"
              style={{ borderRadius: 'var(--radius-full)', padding: '8px 18px', fontWeight: 600 }}
            >
              🏠 Houses & Flats
            </button>
            <button
              onClick={() => handleProtectedNavigate('explore', { propertyType: 'room' })}
              className="btn btn-outline-gold btn-sm"
              style={{ borderRadius: 'var(--radius-full)', padding: '8px 18px', fontWeight: 600 }}
            >
              🛏️ Rental Rooms
            </button>
            <button
              onClick={() => handleProtectedNavigate('explore', { propertyType: 'pg' })}
              className="btn btn-outline-gold btn-sm"
              style={{ borderRadius: 'var(--radius-full)', padding: '8px 18px', fontWeight: 600 }}
            >
              🏢 PGs & Coliving
            </button>
          </div>

          {/* Luxury Search & Near Me Bar */}
          <div style={{
            maxWidth: '640px',
            margin: '0 auto 20px auto'
          }}>
            <LocationSearchBar 
              onLocationSelect={handleHeroLocationSelect}
              placeholder="Search area, landmark, Rajkot, or university..."
              showCurrentLocationBtn={true}
            />
          </div>

          {/* Tenant Category Preferences */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ideal For:</span>
            <button
              onClick={() => handleProtectedNavigate('explore', { suitableFor: 'Family' })}
              className="btn btn-ghost btn-sm"
              style={{ borderRadius: 'var(--radius-full)', padding: '4px 12px', fontSize: '0.8rem', color: '#FCD34D' }}
            >
              👨‍👩‍👧 Families
            </button>
            <button
              onClick={() => handleProtectedNavigate('explore', { suitableFor: 'Working Professionals' })}
              className="btn btn-ghost btn-sm"
              style={{ borderRadius: 'var(--radius-full)', padding: '4px 12px', fontSize: '0.8rem', color: '#60A5FA' }}
            >
              💼 Professionals
            </button>
            <button
              onClick={() => handleProtectedNavigate('explore', { suitableFor: 'Students' })}
              className="btn btn-ghost btn-sm"
              style={{ borderRadius: 'var(--radius-full)', padding: '4px 12px', fontSize: '0.8rem', color: '#34D399' }}
            >
              🎓 Students
            </button>
            <button
              onClick={() => handleProtectedNavigate('explore', { suitableFor: 'All' })}
              className="btn btn-ghost btn-sm"
              style={{ borderRadius: 'var(--radius-full)', padding: '4px 12px', fontSize: '0.8rem', color: '#E2E8F0' }}
            >
              ✨ All Welcome
            </button>
          </div>

          {/* Quick Hub Pills - Clean Horizontal Scroll on Mobile */}
          <div className="horizontal-scroll-row no-scrollbar" style={{ justifyContent: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600, paddingRight: '4px' }}>Popular:</span>
            {['Rajkot', 'Bengaluru', 'Hyderabad', 'Pune', 'Mumbai', 'Gurugram'].map((city) => (
              <button
                key={city}
                onClick={() => handleProtectedNavigate('explore', { search: city })}
                className="btn btn-ghost btn-sm"
                style={{ borderRadius: 'var(--radius-full)', padding: '4px 12px', fontSize: '0.78rem', borderColor: 'rgba(14, 116, 237, 0.25)' }}
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
              Why Home Seekers & Property Owners Choose Us
            </h2>
            <p>
              Verified rental properties, zero broker commissions, and direct transparent communication.
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
                Featured Rentals: PGs, Rooms & Houses
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
                Top-rated properties including family flats, private 1RK rooms, and luxury coliving suites.
              </p>
            </div>

            <button 
              onClick={() => handleProtectedNavigate('explore')}
              className="btn btn-outline-gold"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <span>View All Verified PGs</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid-3">
            {featuredPgs.map((pg) => (
              <PgCard 
                key={pg.id} 
                pg={pg} 
                onSelect={onSelectPg} 
                currentUser={currentUser}
                onOpenLogin={onOpenLogin}
              />
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
