import React, { useState, useMemo } from 'react';
import { 
  Crown, 
  Navigation, 
  ShieldCheck, 
  Utensils, 
  Star, 
  ArrowRight, 
  CheckCircle,
  MapPin,
  Lock,
  Zap,
  CreditCard,
  Search,
  Building2,
  PhoneCall,
  UserCheck,
  ChevronRight,
  RotateCcw,
  BadgePercent,
  MessageCircle,
  Sparkles,
  Key
} from 'lucide-react';
import LocationSearchBar from '../components/LocationSearchBar';
import PgCard from '../components/PgCard';
import GoogleMapView from '../components/GoogleMapView';

export default function Home({ pgs, onSelectPg, onNavigate, currentUser, onOpenLogin }) {
  const [activeFaq, setActiveFaq] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
  const [mapZoom, setMapZoom] = useState(5);
  const [featuredFilter, setFeaturedFilter] = useState('all');

  // Filter featured listings by category
  const filteredFeaturedPgs = useMemo(() => {
    if (featuredFilter === 'all') return (pgs || []).slice(0, 6);
    return (pgs || []).filter(p => p.propertyType === featuredFilter).slice(0, 6);
  }, [pgs, featuredFilter]);

  // Show all verified properties with valid GPS coordinates on the map
  const mapMarkers = useMemo(() => (pgs || []).filter(p => p.address?.lat && p.address?.lng), [pgs]);

  // Dynamic Total Verified Count & Active Cities Calculation
  const totalVerifiedCount = pgs?.length || 0;

  // Real listing counts computed per city from database
  const cityCounts = (pgs || []).reduce((acc, p) => {
    const c = p.address?.city || p.city;
    if (c) {
      const norm = c.trim();
      acc[norm] = (acc[norm] || 0) + 1;
    }
    return acc;
  }, {});

  const activeCities = Object.keys(cityCounts);
  const activeCitiesDisplay = activeCities.length > 0 
    ? activeCities.slice(0, 4).join(' • ') + (activeCities.length > 4 ? ' & more' : '')
    : 'Rajkot • Bengaluru • Hyderabad • Gurugram & more';

  // Major Indian Hubs Coordinates & Metadata
  const CITY_METADATA = {
    'Rajkot': { lat: 22.2965, lng: 70.768, state: 'Gujarat' },
    'Bengaluru': { lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
    'Hyderabad': { lat: 17.4375, lng: 78.3812, state: 'Telangana' },
    'Gurugram': { lat: 28.4385, lng: 77.1082, state: 'Haryana' },
    'Ahmedabad': { lat: 23.0225, lng: 72.5714, state: 'Gujarat' },
    'Surat': { lat: 21.1702, lng: 72.8311, state: 'Gujarat' },
    'Vadodara': { lat: 22.3072, lng: 73.1812, state: 'Gujarat' },
    'Mumbai': { lat: 19.0760, lng: 72.8777, state: 'Maharashtra' },
    'Pune': { lat: 18.5204, lng: 73.8567, state: 'Maharashtra' },
    'Delhi NCR': { lat: 28.6139, lng: 77.2090, state: 'Delhi' },
    'Chennai': { lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu' }
  };

  // Merge active cities with hubs, prioritizing active listings
  const allCitiesList = Array.from(new Set([...activeCities, ...Object.keys(CITY_METADATA)]))
    .map(name => {
      const count = cityCounts[name] || 0;
      const meta = CITY_METADATA[name] || { lat: 20.5937, lng: 78.9629, state: 'India' };
      return {
        city: name,
        count,
        hasActive: count > 0,
        state: meta.state,
        lat: meta.lat,
        lng: meta.lng
      };
    })
    .sort((a, b) => {
      if (a.hasActive && !b.hasActive) return -1;
      if (!a.hasActive && b.hasActive) return 1;
      if (b.count !== a.count) return b.count - a.count;
      return a.city.localeCompare(b.city);
    });

  const filteredCities = allCitiesList.filter(c => 
    c.city.toLowerCase().includes(citySearchTerm.toLowerCase()) ||
    c.state.toLowerCase().includes(citySearchTerm.toLowerCase())
  );

  const handleSelectCity = (loc) => {
    setSelectedCity(loc.city);
    setMapCenter({ lat: loc.lat, lng: loc.lng });
    setMapZoom(12);
  };

  const handleResetMapView = () => {
    setSelectedCity(null);
    setMapCenter({ lat: 20.5937, lng: 78.9629 });
    setMapZoom(5);
  };

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
      q: "What types of properties can I find on Vrundavan Ventures?",
      a: "Our platform features verified Paying Guest (PG) coliving, 1RK furnished private rental rooms, family flats (1BHK, 2BHK, 3BHK), and independent houses across India with verified photos, amenities, and accurate GPS mapping."
    },
    {
      q: "Is the platform only for students, or can I rent for families too?",
      a: "Vrundavan Ventures is built for everyone! We have dedicated verified rental categories for families seeking flats & homes, single working professionals needing 1RK/coliving, and university students seeking hostels and PGs."
    },
    {
      q: "How does the owner and tenant communication work?",
      a: "Once registered, you connect directly with verified property owners and hosts via phone call or WhatsApp. There are zero middleman commissions, zero brokerage, and direct deposit agreements."
    },
    {
      q: "How can property owners (PGs, rooms, flats, houses) list their property?",
      a: "Landlords and PG owners can click the 'Register as Owner' button to set up a host account. Our automated address geocoder makes listing your property fast, verified, and visible to thousands of high-intent tenants."
    },
    {
      q: "What payment methods are supported?",
      a: "We support direct UPI payments (Google Pay, PhonePe, Paytm, BHIM), Net Banking, Debit Cards, and Credit Cards with 100% secure end-to-end encryption."
    }
  ];

  return (
    <div>
      {/* =========================================================================
          SECTION 1: HERO SECTION (NEAT, CLEAN & SIMPLE FOR INDIA)
          - Simple & Small Content (India Launch)
          - Left: Heading, Category pills, Search bar, 4 Trust Badges
          - Right: Theme-related Room Image Card with Verified Homes pill
         ========================================================================= */}
      <section style={{
        position: 'relative',
        padding: '52px 0 58px 0',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(14, 116, 237, 0.20)',
        background: 'radial-gradient(ellipse at 30% 15%, rgba(14, 116, 237, 0.16) 0%, rgba(4, 13, 33, 0.98) 75%)'
      }}>
        {/* Ambient Top Glow */}
        <div style={{
          position: 'absolute', top: '-25%', left: '20%',
          width: '750px', height: '420px',
          background: 'radial-gradient(circle, rgba(14, 116, 237, 0.20) 0%, rgba(212, 175, 55, 0.10) 50%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-split-grid">
            {/* Left Column: Clean & Simple Copy + Search */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {/* Badge */}
              <div style={{ marginBottom: '14px' }}>
                <span className="badge badge-gold animate-pulse-gold" style={{ 
                  padding: '6px 14px', 
                  fontSize: '0.80rem', 
                  fontWeight: 700,
                  letterSpacing: '0.4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Crown size={13} /> Zero Brokerage PGs & Rooms in India
                </span>
              </div>

              {/* Simple & Bold Heading */}
              <h1 style={{ 
                fontSize: 'clamp(2.1rem, 3.4vw, 3.2rem)', 
                lineHeight: 1.16, 
                marginBottom: '14px', 
                fontWeight: 800, 
                color: '#ffffff',
                letterSpacing: '-0.5px'
              }}>
                Find PGs, Rooms & Flats <br />
                <span className="gold-gradient-text">Across India</span>
              </h1>

              {/* Short & Simple Subtitle in Easy Words */}
              <p style={{
                color: '#CBD5E1',
                fontSize: 'clamp(0.94rem, 1.3vw, 1.05rem)',
                maxWidth: '520px',
                margin: '0 0 20px 0',
                lineHeight: 1.55
              }}>
                Connect directly with genuine property owners. Verified photos, transparent rent, safe deposits, and instant WhatsApp chat.
              </p>

              {/* Quick Category Buttons */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '18px'
              }}>
                <button
                  onClick={() => handleProtectedNavigate('explore', { propertyType: 'all' })}
                  className="btn btn-gold btn-sm"
                  style={{ borderRadius: '20px', padding: '6px 14px', fontSize: '0.82rem', fontWeight: 700 }}
                >
                  🌟 All
                </button>
                <button
                  onClick={() => handleProtectedNavigate('explore', { propertyType: 'pg' })}
                  className="btn btn-outline-gold btn-sm"
                  style={{ borderRadius: '20px', padding: '6px 14px', fontSize: '0.82rem', fontWeight: 600 }}
                >
                  🏢 PGs & Hostels
                </button>
                <button
                  onClick={() => handleProtectedNavigate('explore', { propertyType: 'room' })}
                  className="btn btn-outline-gold btn-sm"
                  style={{ borderRadius: '20px', padding: '6px 14px', fontSize: '0.82rem', fontWeight: 600 }}
                >
                  🛏️ Private Rooms
                </button>
                <button
                  onClick={() => handleProtectedNavigate('explore', { propertyType: 'house' })}
                  className="btn btn-outline-gold btn-sm"
                  style={{ borderRadius: '20px', padding: '6px 14px', fontSize: '0.82rem', fontWeight: 600 }}
                >
                  🏠 Flats & Houses
                </button>
              </div>

              {/* Search Bar */}
              <div style={{ maxWidth: '520px', marginBottom: '20px' }}>
                <LocationSearchBar 
                  onLocationSelect={handleHeroLocationSelect}
                  placeholder="Enter city, area, college or landmark..."
                  showCurrentLocationBtn={true}
                />
              </div>

              {/* 4 Trust Badges (Simple & Clear) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '14px 20px',
                color: '#CBD5E1',
                fontSize: '0.84rem',
                fontWeight: 600
              }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={16} style={{ color: 'var(--gold-primary)' }} />
                  <span>Verified Listings</span>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Lock size={16} style={{ color: '#38BDF8' }} />
                  <span>Safe & Secure</span>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={16} style={{ color: '#F59E0B' }} />
                  <span>Direct Owner Chat</span>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <CreditCard size={16} style={{ color: '#00D2B4' }} />
                  <span>UPI Payment</span>
                </div>
              </div>
            </div>

            {/* Right Column: Theme-Related Room Photo Card */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '560px',
                borderRadius: '22px',
                overflow: 'hidden',
                border: '1.5px solid rgba(212, 175, 55, 0.35)',
                boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.85), 0 0 35px rgba(14, 116, 237, 0.22)',
                background: '#040d21'
              }}>
                <img 
                  src="/hero-room.jpg" 
                  alt="Modern Furnished Rental Room in India" 
                  style={{
                    width: '100%',
                    height: '420px',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(4,13,33,0.05) 45%, rgba(4,13,33,0.92) 100%)',
                  pointerEvents: 'none'
                }} />

                {/* Floating Bottom Info Pill */}
                <div style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  right: '16px',
                  background: 'rgba(4, 13, 33, 0.92)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  borderRadius: '14px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.7)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'rgba(212, 175, 55, 0.18)',
                      border: '1px solid rgba(212, 175, 55, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--gold-primary)'
                    }}>
                      <Building2 size={18} />
                    </div>
                    <div>
                      <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: 'var(--gold-primary)' }}>
                          {totalVerifiedCount > 0 ? `${totalVerifiedCount}+` : '10,000+'}
                        </span>
                        <span>Verified Homes</span>
                      </div>
                      <div style={{ color: '#94A3B8', fontSize: '0.76rem', marginTop: '1px' }}>
                        {activeCitiesDisplay}
                      </div>
                    </div>
                  </div>
                  <span className="badge badge-gold" style={{ fontSize: '0.74rem', padding: '4px 10px' }}>
                    ★ 4.9 Rated
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: LIVE GPS MAP & POPULAR LOCATIONS (DYNAMIC & PROPER DESIGN)
          - Section Header with Live GPS Badge
          - Left: Interactive Google Map (with live markers & auto-fit)
          - Right: Dynamic Popular Locations with live listing counts & city search
         ========================================================================= */}
      <section style={{ 
        padding: '65px 0 75px 0', 
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'linear-gradient(180deg, rgba(4, 13, 33, 0.98) 0%, rgba(2, 6, 23, 0.98) 100%)'
      }}>
        <div className="container">
          {/* Section Header */}
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 36px auto' }}>
            <div style={{ marginBottom: '10px' }}>
              <span className="badge badge-blue" style={{ fontSize: '0.78rem', padding: '5px 14px', letterSpacing: '0.4px', fontWeight: 700 }}>
                <MapPin size={13} /> LIVE GPS MAP & EXPLORER
              </span>
            </div>
            <h2 className="font-serif gold-gradient-text" style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.35rem)', margin: '0 0 10px 0', fontWeight: 800 }}>
              Explore Verified Rentals on the Map
            </h2>
            <p style={{ color: '#CBD5E1', fontSize: '0.95rem', margin: 0, lineHeight: 1.55 }}>
              Select any city on the right to focus the map or click any marker to inspect verified photos, monthly rent, and amenities.
            </p>
          </div>

          <div className="home-map-grid">
            {/* Left: Interactive Map Card */}
            <div style={{
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1.5px solid rgba(14, 116, 237, 0.35)',
              boxShadow: '0 18px 50px rgba(0, 0, 0, 0.75), 0 0 30px rgba(14, 116, 237, 0.16)',
              background: '#040d21',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Map Header Bar */}
              <div style={{
                padding: '12px 18px',
                background: 'rgba(5, 16, 42, 0.96)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge badge-gold" style={{ fontSize: '0.76rem', padding: '5px 12px' }}>
                    <MapPin size={13} /> {selectedCity ? `${selectedCity} Selected` : 'Interactive GPS Explorer'}
                  </span>
                  <span style={{ fontSize: '0.84rem', color: '#94A3B8' }}>
                    {mapMarkers.length} verified properties mapped
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {selectedCity && (
                    <button
                      onClick={handleResetMapView}
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: '0.76rem', padding: '5px 12px', borderRadius: '16px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '5px' }}
                      title="Reset map view to whole country"
                    >
                      <RotateCcw size={12} />
                      <span>Reset View</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleProtectedNavigate('nearme')}
                    className="btn btn-outline-gold btn-sm"
                    style={{ fontSize: '0.78rem', padding: '5px 14px', borderRadius: '16px' }}
                  >
                    <Navigation size={13} />
                    <span>Search Near Me</span>
                  </button>
                </div>
              </div>

              {/* Map View */}
              <div style={{ flex: 1, minHeight: '480px' }}>
                <GoogleMapView 
                  markers={mapMarkers}
                  center={mapCenter}
                  zoom={mapZoom}
                  height="490px"
                  onSelectPg={onSelectPg}
                />
              </div>
            </div>

            {/* Right: Dynamic Popular Locations Card */}
            <div style={{
              background: 'linear-gradient(180deg, rgba(7, 23, 57, 0.98) 0%, rgba(3, 10, 28, 0.99) 100%)',
              border: '1.5px solid rgba(212, 175, 55, 0.35)',
              borderRadius: '20px',
              padding: '20px',
              boxShadow: '0 18px 50px rgba(0, 0, 0, 0.7)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%'
            }}>
              <div>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={18} style={{ color: 'var(--gold-primary)' }} />
                    <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                      Popular Locations
                    </h3>
                  </div>
                  <span className="badge badge-gold" style={{ fontSize: '0.72rem', padding: '3px 8px', fontWeight: 700 }}>
                    {totalVerifiedCount} Verified
                  </span>
                </div>

                {/* Search / Filter input inside card */}
                <div style={{ position: 'relative', margin: '12px 0 10px 0' }}>
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input
                    type="text"
                    value={citySearchTerm}
                    onChange={(e) => setCitySearchTerm(e.target.value)}
                    placeholder="Filter cities..."
                    style={{
                      width: '100%',
                      padding: '7px 10px 7px 32px',
                      fontSize: '0.80rem',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      outline: 'none'
                    }}
                  />
                  {citySearchTerm && (
                    <button
                      onClick={() => setCitySearchTerm('')}
                      style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '0.75rem' }}
                    >✕</button>
                  )}
                </div>

                {/* Subtitle instruction */}
                <div style={{ fontSize: '0.74rem', color: '#94A3B8', marginBottom: '10px' }}>
                  Click a city to center map, or arrow to view listings:
                </div>

                {/* Dynamic City List */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  maxHeight: '320px',
                  overflowY: 'auto',
                  paddingRight: '4px'
                }}>
                  {filteredCities.map((loc) => {
                    const isSelected = selectedCity === loc.city;
                    return (
                      <div
                        key={loc.city}
                        onClick={() => handleSelectCity(loc)}
                        style={{
                          background: isSelected 
                            ? 'rgba(14, 116, 237, 0.22)' 
                            : 'rgba(255, 255, 255, 0.03)',
                          border: isSelected 
                            ? '1px solid rgba(56, 189, 248, 0.6)' 
                            : '1px solid rgba(255, 255, 255, 0.06)',
                          borderRadius: '10px',
                          padding: '8px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          transition: 'all 0.18s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.background = 'rgba(14, 116, 237, 0.12)';
                            e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.35)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                          }
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                            background: loc.hasActive ? '#10B981' : '#64748B',
                            boxShadow: loc.hasActive ? '0 0 8px #10B981' : 'none'
                          }} />
                          <div>
                            <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.85rem' }}>
                              {loc.city}
                            </div>
                            <div style={{ color: '#94A3B8', fontSize: '0.70rem' }}>
                              {loc.state}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                          {loc.hasActive ? (
                            <span style={{
                              background: 'rgba(16, 185, 129, 0.16)',
                              color: '#34D399',
                              border: '1px solid rgba(16, 185, 129, 0.4)',
                              borderRadius: '12px',
                              padding: '2px 8px',
                              fontSize: '0.72rem',
                              fontWeight: 700
                            }}>
                              {loc.count} Verified
                            </span>
                          ) : (
                            <span style={{
                              color: '#94A3B8',
                              fontSize: '0.72rem',
                              padding: '2px 6px'
                            }}>
                              Explore
                            </span>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProtectedNavigate('explore', { search: loc.city });
                            }}
                            title={`Browse ${loc.city} Listings`}
                            style={{
                              background: 'rgba(212, 175, 55, 0.12)',
                              border: '1px solid rgba(212, 175, 55, 0.3)',
                              borderRadius: '6px',
                              padding: '4px 6px',
                              color: 'var(--gold-primary)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.18s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'var(--gold-primary)';
                              e.currentTarget.style.color = '#040d21';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.12)';
                              e.currentTarget.style.color = 'var(--gold-primary)';
                            }}
                          >
                            <ChevronRight size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* View All Locations Button */}
              <button
                onClick={() => handleProtectedNavigate('explore', selectedCity ? { search: selectedCity } : {})}
                className="btn btn-gold btn-sm"
                style={{
                  width: '100%',
                  marginTop: '16px',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 20px rgba(212, 175, 55, 0.3)'
                }}
              >
                <span>{selectedCity ? `View ${selectedCity} Listings (${cityCounts[selectedCity] || 0})` : `View All Locations (${totalVerifiedCount})`}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: PROPERTY LISTINGS (FEATURED PGS & ROOMS)
          - Featured PGs & Rooms
          - Property cards with images
          - Price, amenities, view details
         ========================================================================= */}
      <section style={{ padding: '70px 0 80px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: '28px'
          }}>
            <div>
              <div style={{ marginBottom: '8px' }}>
                <span className="badge badge-gold" style={{ fontSize: '0.75rem', padding: '4px 12px', fontWeight: 700 }}>
                  ✨ HANDPICKED FOR YOU
                </span>
              </div>
              <h2 className="font-serif gold-gradient-text" style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.35rem)', margin: '0 0 6px 0', fontWeight: 800 }}>
                Featured PGs, Rooms & Flats
              </h2>
              <p style={{ color: '#CBD5E1', fontSize: '0.94rem', margin: 0, lineHeight: 1.5 }}>
                Top-rated verified properties with photos, direct owner contact, and zero brokerage.
              </p>
            </div>

            <button 
              onClick={() => handleProtectedNavigate('explore')}
              className="btn btn-outline-gold"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 18px', fontSize: '0.90rem', borderRadius: '10px' }}
            >
              <span>View All Properties</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Interactive Category Filter Chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
            <button
              onClick={() => setFeaturedFilter('all')}
              className={`btn btn-sm ${featuredFilter === 'all' ? 'btn-gold' : 'btn-ghost'}`}
              style={{
                borderRadius: '20px',
                padding: '6px 15px',
                fontSize: '0.80rem',
                fontWeight: 600,
                border: featuredFilter === 'all' ? 'none' : '1px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              🌟 All Verified ({(pgs || []).length})
            </button>
            <button
              onClick={() => setFeaturedFilter('pg')}
              className={`btn btn-sm ${featuredFilter === 'pg' ? 'btn-gold' : 'btn-ghost'}`}
              style={{
                borderRadius: '20px',
                padding: '6px 15px',
                fontSize: '0.80rem',
                fontWeight: 600,
                border: featuredFilter === 'pg' ? 'none' : '1px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              🏢 PGs & Coliving
            </button>
            <button
              onClick={() => setFeaturedFilter('room')}
              className={`btn btn-sm ${featuredFilter === 'room' ? 'btn-gold' : 'btn-ghost'}`}
              style={{
                borderRadius: '20px',
                padding: '6px 15px',
                fontSize: '0.80rem',
                fontWeight: 600,
                border: featuredFilter === 'room' ? 'none' : '1px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              🛏️ Private 1RK Rooms
            </button>
            <button
              onClick={() => setFeaturedFilter('house')}
              className={`btn btn-sm ${featuredFilter === 'house' ? 'btn-gold' : 'btn-ghost'}`}
              style={{
                borderRadius: '20px',
                padding: '6px 15px',
                fontSize: '0.80rem',
                fontWeight: 600,
                border: featuredFilter === 'house' ? 'none' : '1px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              🏠 Flats & Houses
            </button>
          </div>

          {/* Properties Grid */}
          {filteredFeaturedPgs.length > 0 ? (
            <div className="grid-3" style={{ gap: '24px' }}>
              {filteredFeaturedPgs.map((pg) => (
                <PgCard 
                  key={pg.id} 
                  pg={pg} 
                  onSelect={onSelectPg} 
                  currentUser={currentUser}
                  onOpenLogin={onOpenLogin}
                />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '48px 20px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '16px',
              border: '1px dashed rgba(255, 255, 255, 0.1)'
            }}>
              <p style={{ color: '#94A3B8', fontSize: '0.95rem', margin: '0 0 14px 0' }}>
                No properties in this category yet.
              </p>
              <button 
                onClick={() => setFeaturedFilter('all')}
                className="btn btn-outline-gold btn-sm"
              >
                View All Categories
              </button>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: WHY CHOOSE US
          - Key benefits / trust points
          - 4 Icons with short info
         ========================================================================= */}
      <section style={{ 
        padding: '85px 0 90px 0', 
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'linear-gradient(180deg, rgba(4, 13, 33, 0.98) 0%, rgba(2, 6, 23, 0.98) 100%)'
      }}>
        <div className="container">
          <div className="section-header-center">
            <div className="badge-wrap">
              <span className="badge badge-gold" style={{ fontSize: '0.78rem', padding: '5px 14px', letterSpacing: '0.4px', fontWeight: 700 }}>
                <Sparkles size={13} /> SIMPLE & HONEST RENTING
              </span>
            </div>
            <h2 className="font-serif gold-gradient-text" style={{ fontSize: 'clamp(1.85rem, 3.4vw, 2.4rem)', marginBottom: '10px', fontWeight: 800 }}>
              Why Rent With Vrundavan Ventures?
            </h2>
            <p style={{ maxWidth: '680px', margin: '0 auto', fontSize: '0.96rem', color: '#CBD5E1', lineHeight: 1.6 }}>
              No brokers, no fake photos, and no surprise charges. Everything you need to find your next stay in India quickly and tension-free.
            </p>
          </div>

          <div className="grid-4" style={{ marginTop: '42px', gap: '24px' }}>
            {/* Card 1: Zero Brokerage */}
            <div 
              className="luxury-card why-benefit-card" 
              style={{
                background: 'linear-gradient(180deg, rgba(8, 26, 64, 0.96) 0%, rgba(3, 10, 28, 0.99) 100%)',
                border: '1.5px solid rgba(245, 158, 11, 0.35)',
                borderRadius: '22px',
                padding: '28px 22px',
                boxShadow: '0 16px 45px rgba(0, 0, 0, 0.7)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.25s ease'
              }}
            >
              <div>
                {/* Top Row: Icon + Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '16px',
                    background: 'radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, rgba(212, 175, 55, 0.10) 100%)',
                    border: '1.5px solid rgba(245, 158, 11, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#F59E0B',
                    boxShadow: '0 8px 24px rgba(245, 158, 11, 0.2)'
                  }}>
                    <BadgePercent size={28} />
                  </div>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.3px',
                    padding: '3px 9px',
                    borderRadius: '12px',
                    background: 'rgba(245, 158, 11, 0.12)',
                    color: '#FDE68A',
                    border: '1px solid rgba(245, 158, 11, 0.3)'
                  }}>
                    SAVE MONEY
                  </span>
                </div>

                <h3 style={{ color: '#ffffff', fontSize: '1.22rem', fontWeight: 800, margin: '0 0 4px 0' }}>
                  Zero Brokerage
                </h3>
                <div style={{ color: '#FDE68A', fontSize: '0.80rem', fontWeight: 700, marginBottom: '12px' }}>
                  Pay 0% Broker Fee
                </div>
                <p style={{ color: '#CBD5E1', fontSize: '0.88rem', lineHeight: 1.6, margin: '0 0 18px 0' }}>
                  Deal directly with the house owner. No brokers, no agent commission, and zero extra charges. Save thousands on every move.
                </p>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '7px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#FDE68A',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>💰 Save ₹10,000+ Broker Fees</span>
              </div>
            </div>

            {/* Card 2: 100% Real & Verified */}
            <div 
              className="luxury-card why-benefit-card" 
              style={{
                background: 'linear-gradient(180deg, rgba(8, 26, 64, 0.96) 0%, rgba(3, 10, 28, 0.99) 100%)',
                border: '1.5px solid rgba(16, 185, 129, 0.35)',
                borderRadius: '22px',
                padding: '28px 22px',
                boxShadow: '0 16px 45px rgba(0, 0, 0, 0.7)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.25s ease'
              }}
            >
              <div>
                {/* Top Row: Icon + Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '16px',
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(0, 210, 180, 0.10) 100%)',
                    border: '1.5px solid rgba(16, 185, 129, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#10B981',
                    boxShadow: '0 8px 24px rgba(16, 185, 129, 0.2)'
                  }}>
                    <ShieldCheck size={28} />
                  </div>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.3px',
                    padding: '3px 9px',
                    borderRadius: '12px',
                    background: 'rgba(16, 185, 129, 0.12)',
                    color: '#A7F3D0',
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}>
                    100% GENUINE
                  </span>
                </div>

                <h3 style={{ color: '#ffffff', fontSize: '1.22rem', fontWeight: 800, margin: '0 0 4px 0' }}>
                  Verified Listings
                </h3>
                <div style={{ color: '#34D399', fontSize: '0.80rem', fontWeight: 700, marginBottom: '12px' }}>
                  Real Photos & Exact Addresses
                </div>
                <p style={{ color: '#CBD5E1', fontSize: '0.88rem', lineHeight: 1.6, margin: '0 0 18px 0' }}>
                  Every room, flat, and PG is checked with real photos and exact addresses. What you see online is exactly what you get.
                </p>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '7px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#34D399',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>🛡️ Inspected Photos & Rooms</span>
              </div>
            </div>

            {/* Card 3: Find Homes Near You */}
            <div 
              className="luxury-card why-benefit-card" 
              style={{
                background: 'linear-gradient(180deg, rgba(8, 26, 64, 0.96) 0%, rgba(3, 10, 28, 0.99) 100%)',
                border: '1.5px solid rgba(14, 116, 237, 0.35)',
                borderRadius: '22px',
                padding: '28px 22px',
                boxShadow: '0 16px 45px rgba(0, 0, 0, 0.7)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.25s ease'
              }}
            >
              <div>
                {/* Top Row: Icon + Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '16px',
                    background: 'radial-gradient(circle, rgba(14, 116, 237, 0.22) 0%, rgba(56, 189, 248, 0.10) 100%)',
                    border: '1.5px solid rgba(14, 116, 237, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#38BDF8',
                    boxShadow: '0 8px 24px rgba(14, 116, 237, 0.2)'
                  }}>
                    <MapPin size={28} />
                  </div>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.3px',
                    padding: '3px 9px',
                    borderRadius: '12px',
                    background: 'rgba(14, 116, 237, 0.12)',
                    color: '#BAE6FD',
                    border: '1px solid rgba(14, 116, 237, 0.3)'
                  }}>
                    SAVE TIME
                  </span>
                </div>

                <h3 style={{ color: '#ffffff', fontSize: '1.22rem', fontWeight: 800, margin: '0 0 4px 0' }}>
                  Find Homes Near You
                </h3>
                <div style={{ color: '#38BDF8', fontSize: '0.80rem', fontWeight: 700, marginBottom: '12px' }}>
                  Walk to College & Office
                </div>
                <p style={{ color: '#CBD5E1', fontSize: '0.88rem', lineHeight: 1.6, margin: '0 0 18px 0' }}>
                  Search properties near your college, office, or coaching center. Check exact walking distance and live Google Maps route.
                </p>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '7px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#38BDF8',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>📍 Live Google GPS Route</span>
              </div>
            </div>

            {/* Card 4: Direct Owner Chat */}
            <div 
              className="luxury-card why-benefit-card" 
              style={{
                background: 'linear-gradient(180deg, rgba(8, 26, 64, 0.96) 0%, rgba(3, 10, 28, 0.99) 100%)',
                border: '1.5px solid rgba(34, 197, 94, 0.35)',
                borderRadius: '22px',
                padding: '28px 22px',
                boxShadow: '0 16px 45px rgba(0, 0, 0, 0.7)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.25s ease'
              }}
            >
              <div>
                {/* Top Row: Icon + Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '16px',
                    background: 'radial-gradient(circle, rgba(34, 197, 94, 0.22) 0%, rgba(0, 210, 180, 0.10) 100%)',
                    border: '1.5px solid rgba(34, 197, 94, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#4ADE80',
                    boxShadow: '0 8px 24px rgba(34, 197, 94, 0.2)'
                  }}>
                    <MessageCircle size={28} />
                  </div>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.3px',
                    padding: '3px 9px',
                    borderRadius: '12px',
                    background: 'rgba(34, 197, 94, 0.12)',
                    color: '#86EFAC',
                    border: '1px solid rgba(34, 197, 94, 0.3)'
                  }}>
                    FAST CONTACT
                  </span>
                </div>

                <h3 style={{ color: '#ffffff', fontSize: '1.22rem', fontWeight: 800, margin: '0 0 4px 0' }}>
                  Direct Owner Chat
                </h3>
                <div style={{ color: '#4ADE80', fontSize: '0.80rem', fontWeight: 700, marginBottom: '12px' }}>
                  Call or WhatsApp Instantly
                </div>
                <p style={{ color: '#CBD5E1', fontSize: '0.88rem', lineHeight: 1.6, margin: '0 0 18px 0' }}>
                  Talk directly to verified owners via WhatsApp or phone call. Ask questions, schedule your visit, and move in quickly.
                </p>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '7px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#4ADE80',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>💬 Direct Call & WhatsApp</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: HOW IT WORKS
          - 4 simple steps
          - Easy booking process
         ========================================================================= */}
      <section style={{ 
        padding: '85px 0', 
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'linear-gradient(180deg, rgba(2, 6, 23, 0.98) 0%, rgba(4, 13, 33, 0.98) 100%)'
      }}>
        <div className="container">
          <div className="section-header-center">
            <div className="badge-wrap">
              <span className="badge badge-gold" style={{ fontSize: '0.78rem', padding: '5px 14px', letterSpacing: '0.4px', fontWeight: 700 }}>
                <Sparkles size={13} /> 4 SIMPLE STEPS
              </span>
            </div>
            <h2 className="font-serif gold-gradient-text" style={{ fontSize: 'clamp(1.85rem, 3.4vw, 2.4rem)', marginBottom: '10px', fontWeight: 800 }}>
              How Renting Works on Vrundavan
            </h2>
            <p style={{ maxWidth: '680px', margin: '0 auto', fontSize: '0.96rem', color: '#CBD5E1', lineHeight: 1.6 }}>
              Find, inspect, and move into your next room in 4 easy steps — without paying a single rupee in broker fees.
            </p>
          </div>

          <div className="home-steps-grid" style={{ marginTop: '42px', gap: '22px' }}>
            {/* Step 1: Search */}
            <div 
              className="luxury-card how-it-works-card" 
              style={{ 
                background: 'linear-gradient(180deg, rgba(8, 26, 64, 0.96) 0%, rgba(3, 10, 28, 0.99) 100%)',
                border: '1.5px solid rgba(56, 189, 248, 0.35)',
                borderRadius: '22px',
                padding: '28px 22px',
                boxShadow: '0 16px 45px rgba(0, 0, 0, 0.7)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                {/* Top Row: Step Tag + Timing */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 11px',
                    borderRadius: '12px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    color: '#BAE6FD',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.5px'
                  }}>
                    STEP 01
                  </div>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.3px',
                    padding: '3px 9px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: '#94A3B8'
                  }}>
                    ⚡ 10 SECONDS
                  </span>
                </div>

                {/* Icon */}
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  background: 'radial-gradient(circle, rgba(14, 116, 237, 0.25) 0%, rgba(56, 189, 248, 0.10) 100%)',
                  border: '1.5px solid rgba(56, 189, 248, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38BDF8',
                  marginBottom: '18px',
                  boxShadow: '0 8px 24px rgba(14, 116, 237, 0.25)'
                }}>
                  <Search size={26} />
                </div>

                <h3 style={{ color: '#ffffff', fontSize: '1.20rem', fontWeight: 800, margin: '0 0 4px 0' }}>
                  1. Search Your Area
                </h3>
                <div style={{ color: '#38BDF8', fontSize: '0.80rem', fontWeight: 700, marginBottom: '12px' }}>
                  Colleges, Offices or Landmark
                </div>
                <p style={{ color: '#CBD5E1', fontSize: '0.88rem', lineHeight: 1.6, margin: '0 0 18px 0' }}>
                  Type where you want to stay in India. Instantly see verified PGs, private rooms, and flats near you.
                </p>
              </div>

              <div style={{
                padding: '7px 12px',
                borderRadius: '10px',
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                color: '#BAE6FD',
                fontSize: '0.78rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>📍 Instant Map & Nearby List</span>
              </div>
            </div>

            {/* Step 2: Compare */}
            <div 
              className="luxury-card how-it-works-card" 
              style={{ 
                background: 'linear-gradient(180deg, rgba(8, 26, 64, 0.96) 0%, rgba(3, 10, 28, 0.99) 100%)',
                border: '1.5px solid rgba(16, 185, 129, 0.35)',
                borderRadius: '22px',
                padding: '28px 22px',
                boxShadow: '0 16px 45px rgba(0, 0, 0, 0.7)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                {/* Top Row: Step Tag + Timing */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 11px',
                    borderRadius: '12px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    color: '#A7F3D0',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.5px'
                  }}>
                    STEP 02
                  </div>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.3px',
                    padding: '3px 9px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: '#94A3B8'
                  }}>
                    🛡️ VERIFIED
                  </span>
                </div>

                {/* Icon */}
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(0, 210, 180, 0.10) 100%)',
                  border: '1.5px solid rgba(16, 185, 129, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10B981',
                  marginBottom: '18px',
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)'
                }}>
                  <Building2 size={26} />
                </div>

                <h3 style={{ color: '#ffffff', fontSize: '1.20rem', fontWeight: 800, margin: '0 0 4px 0' }}>
                  2. Compare Real Rooms
                </h3>
                <div style={{ color: '#34D399', fontSize: '0.80rem', fontWeight: 700, marginBottom: '12px' }}>
                  Photos, Rent & Amenities
                </div>
                <p style={{ color: '#CBD5E1', fontSize: '0.88rem', lineHeight: 1.6, margin: '0 0 18px 0' }}>
                  Check real room pictures, exact monthly rent, food menu, AC, and WiFi. No fake photos or surprises.
                </p>
              </div>

              <div style={{
                padding: '7px 12px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                color: '#A7F3D0',
                fontSize: '0.78rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>📸 100% Inspected & Real</span>
              </div>
            </div>

            {/* Step 3: Contact */}
            <div 
              className="luxury-card how-it-works-card" 
              style={{ 
                background: 'linear-gradient(180deg, rgba(8, 26, 64, 0.96) 0%, rgba(3, 10, 28, 0.99) 100%)',
                border: '1.5px solid rgba(34, 197, 94, 0.35)',
                borderRadius: '22px',
                padding: '28px 22px',
                boxShadow: '0 16px 45px rgba(0, 0, 0, 0.7)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                {/* Top Row: Step Tag + Timing */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 11px',
                    borderRadius: '12px',
                    background: 'rgba(34, 197, 94, 0.15)',
                    border: '1px solid rgba(34, 197, 94, 0.35)',
                    color: '#86EFAC',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.5px'
                  }}>
                    STEP 03
                  </div>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.3px',
                    padding: '3px 9px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: '#94A3B8'
                  }}>
                    💬 DIRECT
                  </span>
                </div>

                {/* Icon */}
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  background: 'radial-gradient(circle, rgba(34, 197, 94, 0.25) 0%, rgba(0, 210, 180, 0.10) 100%)',
                  border: '1.5px solid rgba(34, 197, 94, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4ADE80',
                  marginBottom: '18px',
                  boxShadow: '0 8px 24px rgba(34, 197, 94, 0.25)'
                }}>
                  <MessageCircle size={26} />
                </div>

                <h3 style={{ color: '#ffffff', fontSize: '1.20rem', fontWeight: 800, margin: '0 0 4px 0' }}>
                  3. Connect With Owner
                </h3>
                <div style={{ color: '#4ADE80', fontSize: '0.80rem', fontWeight: 700, marginBottom: '12px' }}>
                  Direct WhatsApp or Phone Call
                </div>
                <p style={{ color: '#CBD5E1', fontSize: '0.88rem', lineHeight: 1.6, margin: '0 0 18px 0' }}>
                  Call or chat with the landlord directly. Ask your doubts, plan a free physical visit, and finalize directly.
                </p>
              </div>

              <div style={{
                padding: '7px 12px',
                borderRadius: '10px',
                background: 'rgba(34, 197, 94, 0.08)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                color: '#86EFAC',
                fontSize: '0.78rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>📱 Zero Middlemen or Agents</span>
              </div>
            </div>

            {/* Step 4: Move In */}
            <div 
              className="luxury-card how-it-works-card" 
              style={{ 
                background: 'linear-gradient(180deg, rgba(8, 26, 64, 0.96) 0%, rgba(3, 10, 28, 0.99) 100%)',
                border: '1.5px solid rgba(245, 158, 11, 0.35)',
                borderRadius: '22px',
                padding: '28px 22px',
                boxShadow: '0 16px 45px rgba(0, 0, 0, 0.7)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                {/* Top Row: Step Tag + Timing */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 11px',
                    borderRadius: '12px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.35)',
                    color: '#FDE68A',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.5px'
                  }}>
                    STEP 04
                  </div>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.3px',
                    padding: '3px 9px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: '#94A3B8'
                  }}>
                    🎉 MOVE IN
                  </span>
                </div>

                {/* Icon */}
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, rgba(212, 175, 55, 0.10) 100%)',
                  border: '1.5px solid rgba(245, 158, 11, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#F59E0B',
                  marginBottom: '18px',
                  boxShadow: '0 8px 24px rgba(245, 158, 11, 0.25)'
                }}>
                  <Key size={26} />
                </div>

                <h3 style={{ color: '#ffffff', fontSize: '1.20rem', fontWeight: 800, margin: '0 0 4px 0' }}>
                  4. Pack Bags & Move In
                </h3>
                <div style={{ color: '#FDE68A', fontSize: '0.80rem', fontWeight: 700, marginBottom: '12px' }}>
                  Pay ₹0 Brokerage Fee
                </div>
                <p style={{ color: '#CBD5E1', fontSize: '0.88rem', lineHeight: 1.6, margin: '0 0 18px 0' }}>
                  Agree on terms directly, collect your room keys, and move in tension-free. You save full 1 month rent!
                </p>
              </div>

              <div style={{
                padding: '7px 12px',
                borderRadius: '10px',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                color: '#FDE68A',
                fontSize: '0.78rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>💰 Save ₹10,000+ Brokerage</span>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div style={{
            marginTop: '44px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '14px',
              padding: '12px 24px',
              borderRadius: '50px',
              background: 'linear-gradient(90deg, rgba(8, 26, 64, 0.92) 0%, rgba(14, 40, 95, 0.92) 100%)',
              border: '1.5px solid rgba(212, 175, 55, 0.35)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
            }}>
              <span style={{ color: '#F8FAFC', fontSize: '0.94rem', fontWeight: 600 }}>
                Ready to find your room without paying any broker fee?
              </span>
              <button 
                onClick={() => onNavigate ? onNavigate('explore') : null}
                className="btn btn-gold"
                style={{
                  padding: '8px 20px',
                  fontSize: '0.86rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  borderRadius: '25px',
                  fontWeight: 700
                }}
              >
                Start Exploring Rooms <ArrowRight size={15} />
              </button>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.84rem', margin: 0 }}>
              ✨ 100% Free for Students & Tenants • Direct Owner Phone Numbers & WhatsApp
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: REVIEWS / TRUST
          - Customer testimonials
          - Star ratings
          - "Loved by 50,000+ Property Owners & Tenants"
         ========================================================================= */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container">
          <div className="section-header-center">
            <div className="badge-wrap">
              <span className="badge badge-gold" style={{ fontSize: '0.78rem', padding: '5px 14px' }}>
                TRUSTED BY PROPERTY OWNERS
              </span>
            </div>
            <h2 className="font-serif gold-gradient-text" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.35rem)', marginBottom: '8px' }}>
              Loved by 50,000+ Property Owners & Tenants
            </h2>
            <p style={{ maxWidth: '640px', margin: '0 auto', fontSize: '0.95rem' }}>
              Join thousands of happy users who found their perfect stay with us.
            </p>
          </div>

          <div className="home-reviews-grid" style={{ marginTop: '38px' }}>
            {/* Review 1 */}
            <div className="luxury-card" style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
                <p style={{ color: '#CBD5E1', fontSize: '0.92rem', fontStyle: 'italic', marginBottom: '22px', lineHeight: 1.65 }}>
                  "Very easy to find good PGs in my area. The map feature and verified listings are really helpful. Highly recommended!"
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #0e74ed 0%, #00d2b4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.90rem' }}>
                  SP
                </div>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '0.95rem', margin: '0 0 2px 0', fontWeight: 700 }}>Sahil Patel</h4>
                  <span style={{ color: '#94A3B8', fontSize: '0.78rem' }}>Student, Ahmedabad</span>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="luxury-card" style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
                <p style={{ color: '#CBD5E1', fontSize: '0.92rem', fontStyle: 'italic', marginBottom: '22px', lineHeight: 1.65 }}>
                  "Great platform for PG owners. I got real genuine tenants within a week. The registration process was simple and fast."
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37 0%, #f5c542 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#040d21', fontWeight: 800, fontSize: '0.90rem' }}>
                  SV
                </div>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '0.95rem', margin: '0 0 2px 0', fontWeight: 700 }}>Sneha Varma</h4>
                  <span style={{ color: '#94A3B8', fontSize: '0.78rem' }}>PG Owner, Surat</span>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="luxury-card" style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
                <p style={{ color: '#CBD5E1', fontSize: '0.92rem', fontStyle: 'italic', marginBottom: '22px', lineHeight: 1.65 }}>
                  "Safe, reliable and user-friendly. Found a perfect room near my college. Will definitely use again!"
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #38bdf8 0%, #0e74ed 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.90rem' }}>
                  AS
                </div>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '0.95rem', margin: '0 0 2px 0', fontWeight: 700 }}>Amit Sharma</h4>
                  <span style={{ color: '#94A3B8', fontSize: '0.78rem' }}>Student, Vadodara</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: FAQ SECTION
          - Common questions
          - Accordion style
         ========================================================================= */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          <div className="section-header-center">
            <div className="badge-wrap">
              <span className="badge badge-blue" style={{ fontSize: '0.78rem', padding: '5px 14px' }}>
                FREQUENTLY ASKED QUESTIONS
              </span>
            </div>
            <h2 className="font-serif gold-gradient-text" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.35rem)', marginBottom: '8px' }}>
              Got Questions? We're Here to Help
            </h2>
            <p style={{ maxWidth: '640px', margin: '0 auto', fontSize: '0.95rem' }}>
              Find answers to the most common questions about PGs, rooms and rentals.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '36px' }}>
            {FAQS.map((faq, idx) => (
              <div 
                key={idx} 
                className="luxury-card"
                style={{ 
                  padding: '18px 22px', 
                  cursor: 'pointer',
                  border: activeFaq === idx ? '1px solid rgba(212, 175, 55, 0.45)' : '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                  <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, margin: 0, lineHeight: 1.4 }}>
                    {idx + 1}. {faq.q}
                  </h4>
                  <span style={{ 
                    color: 'var(--gold-primary)', 
                    fontSize: '1.4rem', 
                    fontWeight: 700,
                    lineHeight: 1,
                    flexShrink: 0 
                  }}>
                    {activeFaq === idx ? '−' : '+'}
                  </span>
                </div>
                {activeFaq === idx && (
                  <p style={{ 
                    color: '#CBD5E1', 
                    fontSize: '0.90rem', 
                    marginTop: '12px', 
                    lineHeight: 1.65, 
                    borderTop: '1px solid rgba(255,255,255,0.08)', 
                    paddingTop: '12px',
                    margin: '12px 0 0 0'
                  }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: CALL TO ACTION (BOTTOM)
          - For property owners
          - Register / List property button
         ========================================================================= */}
      <section style={{ padding: '80px 0 90px 0' }}>
        <div className="container">
          <div className="luxury-card" style={{
            padding: '52px 30px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(7, 23, 57, 0.96) 0%, rgba(4, 13, 33, 0.98) 100%)',
            border: '1.5px solid rgba(212, 175, 55, 0.40)',
            boxShadow: '0 24px 60px rgba(2, 6, 23, 0.9), 0 0 35px rgba(212, 175, 55, 0.20)',
            borderRadius: '24px',
            maxWidth: '920px',
            margin: '0 auto'
          }}>
            <Crown size={38} style={{ color: 'var(--gold-primary)', margin: '0 auto 16px auto', display: 'block' }} />
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', color: '#fff', marginBottom: '14px', fontWeight: 800 }}>
              ARE YOU A PROPERTY OWNER?
            </h2>
            <p style={{ color: '#CBD5E1', maxWidth: '620px', margin: '0 auto 28px auto', fontSize: '1rem', lineHeight: 1.65 }}>
              List your PG, flats, rooms or rental properties on Vrundavan Ventures. Reach more tenants, get verified and grow your business.
            </p>
            <button 
              onClick={() => onNavigate('owner-register')}
              className="btn btn-gold btn-lg"
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '10px',
                padding: '13px 30px',
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(212, 175, 55, 0.4)'
              }}
            >
              <span>Register as Owner</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Responsive Layout Styles */}
      <style>{`
        .hero-split-grid {
          display: grid;
          grid-template-columns: 1.12fr 0.88fr;
          gap: 48px;
          align-items: center;
        }

        .home-map-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 24px;
          align-items: stretch;
        }

        .home-steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px;
        }

        .how-it-works-card,
        .why-benefit-card {
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease;
        }

        .how-it-works-card:hover,
        .why-benefit-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 22px 50px rgba(0, 0, 0, 0.75) !important;
        }

        .home-reviews-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        @media (max-width: 980px) {
          .hero-split-grid {
            grid-template-columns: 1fr;
            gap: 36px;
          }
          .home-map-grid {
            grid-template-columns: 1fr;
          }
          .home-steps-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 860px) {
          .home-reviews-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 560px) {
          .home-steps-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
