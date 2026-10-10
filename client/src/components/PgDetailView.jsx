import React, { useState } from 'react';
import { 
  MapPin, 
  Star, 
  ArrowLeft, 
  Phone, 
  MessageCircle, 
  Navigation, 
  Calendar, 
  CheckCircle2, 
  Bed, 
  Lock
} from 'lucide-react';
import GoogleMapView from './GoogleMapView';
import { getDirectionsUrl } from '../services/googleMaps';
import { api } from '../services/api';

export default function PgDetailView({ pg, onBack, currentUser, onOpenLogin }) {
  const isGuest = !currentUser;
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    phone: '',
    email: '',
    sharingType: pg.rooms?.[0]?.type || 'Single Private Suite',
    visitDate: '',
    message: ''
  });
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  const photos = (pg.photos && pg.photos.length > 0)
    ? pg.photos
    : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'];

  const directionsUrl = getDirectionsUrl(pg.address.lat, pg.address.lng, `${pg.name}, ${pg.address.city}`);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setInquirySubmitting(true);
    try {
      await api.submitInquiry({
        pgId: pg.id,
        userName: inquiryForm.name,
        userPhone: inquiryForm.phone,
        userEmail: inquiryForm.email,
        sharingType: inquiryForm.sharingType,
        visitDate: inquiryForm.visitDate,
        message: inquiryForm.message
      });
      setInquirySuccess(true);
      setTimeout(() => {
        setInquiryModalOpen(false);
        setInquirySuccess(false);
      }, 2500);
    } catch (err) {
      alert(err.message || 'Error submitting visit inquiry');
    } finally {
      setInquirySubmitting(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '30px', paddingBottom: '70px' }}>
      {/* Top Guest Notice: Half Information Displayed */}
      {isGuest && (
        <div style={{
          background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.16) 0%, rgba(14, 116, 237, 0.16) 100%)',
          border: '1.5px solid rgba(245, 158, 11, 0.45)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          marginBottom: '22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.6rem' }}>🔒</span>
            <div>
              <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, margin: '0 0 2px 0' }}>
                Guest Mode: Half Information Displayed
              </h4>
              <p style={{ color: '#CBD5E1', fontSize: '0.85rem', margin: 0 }}>
                Exact building address, direct owner contact (Phone & WhatsApp), and visit booking are locked.
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenLogin && onOpenLogin('tenant')}
            className="btn btn-gold btn-sm"
            style={{ padding: '8px 20px', fontWeight: 800, fontSize: '0.88rem' }}
          >
            🔑 Do login for more information
          </button>
        </div>
      )}

      {/* Top Navigation Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button 
          onClick={onBack}
          className="btn btn-ghost btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ArrowLeft size={16} /> Back to Listings
        </button>

        <div style={{ display: 'flex', gap: '10px' }}>
          {isGuest ? (
            <button 
              onClick={() => onOpenLogin && onOpenLogin('tenant')}
              className="btn btn-outline-gold btn-sm"
            >
              <Navigation size={15} style={{ color: 'var(--gold-primary)' }} />
              <span>🔒 Directions (Do login for more info)</span>
            </button>
          ) : (
            <a 
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-gold btn-sm"
            >
              <Navigation size={15} style={{ color: 'var(--red-crimson)' }} />
              <span>Get Live Directions</span>
            </a>
          )}
        </div>
      </div>

      {/* Main Title Banner */}
      <div style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <h1 className="font-serif gold-gradient-text" style={{ fontSize: '2.2rem', fontWeight: 800 }}>
            {pg.name}
          </h1>
          <span className={`badge ${
            pg.propertyType === 'house' ? 'badge-gold' : pg.propertyType === 'room' ? 'badge-peacock' : pg.gender === 'Girls' ? 'badge-crimson' : 'badge-blue'
          }`} style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
            {pg.propertyType === 'house' ? `🏠 ${pg.bhk || 'Rental House/Flat'}` : pg.propertyType === 'room' ? `🛏️ ${pg.bhk || 'Rental Room'}` : `🏢 ${pg.gender} PG`}
          </span>
          {pg.suitableFor && (
            <span className="badge badge-purple" style={{ fontSize: '0.82rem', padding: '6px 12px' }}>
              👤 Ideal for: {pg.suitableFor}
            </span>
          )}
          {pg.featured && <span className="badge badge-gold">👑 Verified Prime</span>}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={16} style={{ color: 'var(--red-crimson)' }} />
            <span>
              {!isGuest && pg.address.apartment ? `${pg.address.apartment}, ` : ''}{pg.address.area}, {pg.address.city}
              {isGuest && (
                <span 
                  onClick={() => onOpenLogin && onOpenLogin('tenant')}
                  style={{ color: '#F59E0B', marginLeft: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' }}
                >
                  • [🔒 Street Address Locked — Do login for more info]
                </span>
              )}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Star size={16} fill="#D4AF37" color="#D4AF37" />
            <strong style={{ color: '#fff' }}>{pg.rating || '4.9'}</strong>
            <span style={{ color: '#888' }}>({pg.reviewsCount || 24} Verified Reviews)</span>
          </div>

          {pg.distanceKm !== undefined && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold-primary)', fontWeight: 600 }}>
              <Navigation size={15} />
              <span>{pg.distanceKm} km from your current location</span>
            </div>
          )}
        </div>
      </div>

      {/* Photo Gallery Grid */}
      <div style={{ marginBottom: '35px' }}>
        <div 
          className="pg-detail-gallery-main"
          style={{
            position: 'relative',
            width: '100%',
            height: '460px',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '1px solid var(--gold-border)',
            boxShadow: 'var(--shadow-luxury)',
            marginBottom: '14px'
          }}
        >
          <img 
            src={photos[selectedPhoto]} 
            alt={pg.name} 
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80';
            }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            background: 'rgba(0,0,0,0.85)',
            border: '1px solid var(--gold-primary)',
            borderRadius: 'var(--radius-full)',
            padding: '6px 14px',
            fontSize: '0.85rem',
            color: 'var(--gold-light)'
          }}>
            Photo {selectedPhoto + 1} of {photos.length}
          </div>
        </div>

        {/* Thumbnail Selector */}
        {photos.length > 1 && (
          <div className="horizontal-scroll-row no-scrollbar" style={{ gap: '10px', paddingBottom: '6px' }}>
            {photos.map((src, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPhoto(idx)}
                style={{
                  width: '90px',
                  height: '65px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  border: selectedPhoto === idx ? '2px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.15)',
                  padding: 0,
                  cursor: 'pointer',
                  opacity: selectedPhoto === idx ? 1 : 0.6,
                  transition: 'all 0.2s',
                  flexShrink: 0
                }}
              >
                <img 
                  src={src} 
                  alt={`thumbnail-${idx}`} 
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=300&q=80';
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Grid: Details (Left 7) & Pricing/Contact Card (Right 5) */}
      <div className="pg-detail-grid">
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* About / Description */}
          <div className="luxury-card" style={{ padding: '28px' }}>
            <h2 className="font-serif" style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '14px' }}>
              About This Luxury Residence
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.8' }}>
              {pg.description}
            </p>
          </div>

          {/* Room Configurations & Beds */}
          <div className="luxury-card" style={{ padding: '28px' }}>
            <h2 className="font-serif" style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '20px' }}>
              Available Room & Bed Configurations
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {pg.rooms && pg.rooms.map((room) => (
                <div 
                  key={room.id}
                  style={{
                    background: '#121212',
                    border: '1px solid rgba(212,175,55,0.2)',
                    borderRadius: 'var(--radius-md)',
                    padding: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '44px', height: '44px', background: 'rgba(212,175,55,0.1)',
                      border: '1px solid var(--gold-primary)', borderRadius: '10px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)'
                    }}>
                      <Bed size={22} />
                    </div>
                    <div>
                      <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '4px' }}>{room.type}</h4>
                      <div style={{ display: 'flex', gap: '10px', fontSize: '0.8rem', color: '#999' }}>
                        <span>• {room.beds} Bed{room.beds > 1 ? 's' : ''} Capacity</span>
                        {room.washroom && <span>• {room.washroom} Washroom</span>}
                        {room.ac && <span style={{ color: 'var(--gold-primary)' }}>• Air Conditioned</span>}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--gold-primary)' }}>
                      ₹{room.rent.toLocaleString('en-IN')}<span style={{ fontSize: '0.75rem', color: '#999' }}>/mo</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#4ade80' }}>
                      {room.available} Bed{room.available > 1 ? 's' : ''} Available
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Full Structured Address Breakdown */}
          <div className="luxury-card" style={{ padding: '28px' }}>
            <h2 className="font-serif" style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '18px' }}>
              Structured Location & Building Details
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{ background: '#111', padding: '12px 16px', borderRadius: '8px', border: '1px solid #222' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', textTransform: 'uppercase', display: 'block' }}>Building / Society</span>
                <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{pg.address.apartment || 'Luxury Villa'}</strong>
              </div>

              <div style={{ background: '#111', padding: '12px 16px', borderRadius: '8px', border: '1px solid #222' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', textTransform: 'uppercase', display: 'block' }}>Address Line 1</span>
                <span style={{ color: '#fff', fontSize: '0.95rem' }}>{pg.address.addressLine1}</span>
              </div>

              <div style={{ background: '#111', padding: '12px 16px', borderRadius: '8px', border: '1px solid #222' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', textTransform: 'uppercase', display: 'block' }}>Address Line 2 / Area</span>
                <span style={{ color: '#fff', fontSize: '0.95rem' }}>{pg.address.addressLine2 || pg.address.area}</span>
              </div>

              <div style={{ background: '#111', padding: '12px 16px', borderRadius: '8px', border: '1px solid #222' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', textTransform: 'uppercase', display: 'block' }}>City & State</span>
                <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{pg.address.city}, {pg.address.state}</strong>
              </div>

              <div style={{ background: '#111', padding: '12px 16px', borderRadius: '8px', border: '1px solid #222' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', textTransform: 'uppercase', display: 'block' }}>Pincode</span>
                <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{pg.address.pincode}</strong>
              </div>

              <div style={{ background: '#111', padding: '12px 16px', borderRadius: '8px', border: '1px solid #222' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', textTransform: 'uppercase', display: 'block' }}>GPS Coordinates</span>
                <span style={{ color: isGuest ? '#F59E0B' : 'var(--gold-light)', fontSize: '0.85rem' }}>
                  {isGuest ? '🔒 Locked (Do login for info)' : `${pg.address.lat.toFixed(4)}, ${pg.address.lng.toFixed(4)}`}
                </span>
              </div>
            </div>

            {/* Google Map Embed with Directions Button */}
            <div style={{ position: 'relative' }}>
              <GoogleMapView 
                center={{ lat: pg.address.lat, lng: pg.address.lng }}
                zoom={15}
                height="320px"
                markers={[pg]}
              />
              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                {isGuest ? (
                  <button 
                    onClick={() => onOpenLogin && onOpenLogin('tenant')}
                    className="btn btn-crimson btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Navigation size={15} />
                    <span>🔒 Navigation Locked • Do Login for More Info</span>
                  </button>
                ) : (
                  <a 
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-crimson btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Navigation size={15} />
                    <span>Navigate with Google Maps</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Luxury Facilities & Amenities */}
          <div className="luxury-card" style={{ padding: '28px' }}>
            <h2 className="font-serif" style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '20px' }}>
              Signature Facilities & Inclusions
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '14px'
            }}>
              {pg.facilities && pg.facilities.map((fac, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    background: '#121212',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '8px'
                  }}
                >
                  <CheckCircle2 size={16} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{fac}</span>
                </div>
              ))}
            </div>
          </div>

          {/* House Rules */}
          {pg.rules && pg.rules.length > 0 && (
            <div className="luxury-card" style={{ padding: '28px' }}>
              <h2 className="font-serif" style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '16px' }}>
                House Rules & Policies
              </h2>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {pg.rules.map((rule, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#bbb', fontSize: '0.95rem' }}>
                    <span style={{ width: '6px', height: '6px', background: 'var(--red-crimson)', borderRadius: '50%' }} />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Sticky Column: Pricing, Owner Info & Booking CTA */}
        <div>
          <div className="luxury-card" style={{ padding: '30px', position: 'sticky', top: '90px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Starting Monthly Tariff
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '16px' }}>
              <span className="gold-gradient-text" style={{ fontSize: '2.5rem', fontWeight: 900 }}>
                ₹{pg.rent.toLocaleString('en-IN')}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>/ month</span>
            </div>

            {/* Financial Highlights */}
            <div style={{
              background: '#121212',
              borderRadius: 'var(--radius-sm)',
              padding: '16px',
              border: '1px solid rgba(212,175,55,0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginBottom: '24px',
              fontSize: '0.9rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#bbb' }}>
                <span>Refundable Deposit:</span>
                <strong style={{ color: '#fff' }}>₹{pg.deposit.toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#bbb' }}>
                <span>Notice Period:</span>
                <strong style={{ color: '#fff' }}>{pg.noticePeriodDays} Days</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#bbb' }}>
                <span>Connect Type:</span>
                <strong style={{ color: '#34D399' }}>Direct Owner Connect</strong>
              </div>
            </div>

            {/* CTAs / Locked Guest Gating */}
            {isGuest ? (
              <div style={{
                background: 'linear-gradient(180deg, rgba(14, 116, 237, 0.12) 0%, rgba(212, 175, 55, 0.12) 100%)',
                border: '1.5px solid rgba(212, 175, 55, 0.45)',
                borderRadius: 'var(--radius-md)',
                padding: '24px 18px',
                textAlign: 'center',
                marginBottom: '24px'
              }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '50%',
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 12px auto', color: 'var(--gold-light)'
                }}>
                  <Lock size={26} />
                </div>
                <h4 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>
                  Owner Contact & Booking Locked
                </h4>
                <p style={{ color: '#CBD5E1', fontSize: '0.86rem', lineHeight: 1.5, marginBottom: '18px' }}>
                  You are viewing partial / half information in Guest Mode. <strong>Do login for more information</strong> to reveal verified owner contact, direct WhatsApp chat, exact building address, and schedule physical visits.
                </p>
                <button 
                  onClick={() => onOpenLogin && onOpenLogin('tenant')}
                  className="btn btn-gold btn-lg"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 800 }}
                >
                  <span>🔑 Do Login for More Information</span>
                </button>
                
                <div style={{
                  marginTop: '16px',
                  paddingTop: '12px',
                  borderTop: '1px dashed rgba(255, 255, 255, 0.12)',
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <div>📞 Direct Phone: <span style={{ color: '#F59E0B' }}>+91 98765 ••••• [Locked]</span></div>
                  <div>💬 WhatsApp Chat: <span style={{ color: '#F59E0B' }}>Direct Connect [Locked]</span></div>
                  <div>📅 Schedule Visit: <span style={{ color: '#F59E0B' }}>Calendar Booking [Locked]</span></div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <button 
                  onClick={() => setInquiryModalOpen(true)}
                  className="btn btn-gold btn-lg"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Calendar size={18} /> Schedule Visit / Inquire
                </button>

                <a 
                  href={`https://wa.me/${pg.ownerWhatsapp?.replace(/[^0-9]/g, '') || '919876543210'}?text=${encodeURIComponent(`Hello, I am interested in ${pg.name} (${pg.address.city}). Could you share current availability and booking details?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-gold"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <MessageCircle size={18} style={{ color: '#25D366' }} /> WhatsApp Host
                </a>

                <a 
                  href={`tel:${pg.ownerPhone || '+919876543210'}`}
                  className="btn btn-ghost"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Phone size={16} /> Call Host: {pg.ownerPhone || '+91 98765 43210'}
                </a>
              </div>
            )}

            {/* Host Credentials */}
            <div style={{
              borderTop: '1px solid rgba(255,255,255,0.08)',
              paddingTop: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '50%', background: 'var(--gold-gradient)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#080808', fontWeight: 800
              }}>
                {pg.ownerName?.charAt(0) || 'H'}
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Verified Host</span>
                <h5 style={{ color: '#fff', fontSize: '0.95rem' }}>{pg.ownerName || 'Verified Property Manager'}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Visit Modal */}
      {inquiryModalOpen && (
        <div className="modal-overlay" onClick={() => setInquiryModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif gold-gradient-text" style={{ fontSize: '1.6rem', marginBottom: '8px' }}>
              Schedule a Visit or Inquiry
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Submit your visit schedule for <strong>{pg.name}</strong>. The host will confirm via phone/WhatsApp.
            </p>

            {inquirySuccess ? (
              <div style={{ textAlign: 'center', padding: '30px 10px', color: '#34D399' }}>
                <CheckCircle2 size={48} style={{ margin: '0 auto 15px auto', display: 'block' }} />
                <h4 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '8px' }}>Visit Request Received!</h4>
                <p style={{ color: '#aaa', fontSize: '0.9rem' }}>The property manager has been notified and will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    className="form-input" 
                    placeholder="e.g. Rahul Sharma"
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input 
                      type="tel" 
                      required 
                      className="form-input" 
                      placeholder="+91 98765 00000"
                      value={inquiryForm.phone}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      placeholder="rahul@example.com"
                      value={inquiryForm.email}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">{pg.propertyType === 'house' ? 'Unit / Configuration' : pg.propertyType === 'room' ? 'Room Preference' : 'Preferred Sharing Type'}</label>
                    <select 
                      className="form-select"
                      value={inquiryForm.sharingType}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, sharingType: e.target.value })}
                    >
                      {pg.rooms && pg.rooms.map((r) => (
                        <option key={r.id} value={r.type}>{r.type} (₹{r.rent}/mo)</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Visit Date</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      value={inquiryForm.visitDate}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, visitDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Message / Special Requirements</label>
                  <textarea 
                    rows={3} 
                    className="form-textarea" 
                    placeholder="e.g. When can I view the property? Need move-in from 1st of next month."
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button 
                    type="button" 
                    onClick={() => setInquiryModalOpen(false)} 
                    className="btn btn-ghost" 
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={inquirySubmitting} 
                    className="btn btn-gold" 
                    style={{ flex: 1 }}
                  >
                    {inquirySubmitting ? 'Sending Request...' : 'Confirm Inquiry'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
