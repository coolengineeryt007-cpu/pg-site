import React from 'react';
import { MapPin, Star, Navigation, ArrowRight, Bed, Wifi, Utensils, Zap } from 'lucide-react';
import { getDirectionsUrl } from '../services/googleMaps';

export default function PgCard({ pg, onSelect, showStatus = false, currentUser, onOpenLogin }) {
  const isGuest = !currentUser;
  const coverPhoto = (pg.photos && pg.photos.length > 0) 
    ? pg.photos[0] 
    : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80';

  const directionsUrl = getDirectionsUrl(pg.address.lat, pg.address.lng, `${pg.name}, ${pg.address.city}`);

  return (
    <article className="luxury-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Card Image Banner */}
      <div style={{ position: 'relative', width: '100%', height: '220px', overflow: 'hidden' }}>
        <img 
          src={coverPhoto} 
          alt={`${pg.name} in ${pg.address?.area || ''}, ${pg.address?.city || ''}`}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80';
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          className="hover-scale-img"
        />

        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(4,13,33,0.15) 0%, rgba(4,13,33,0.92) 100%)'
        }} />

        {/* Top Badges */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          right: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '8px',
          zIndex: 2
        }}>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', flex: 1, minWidth: 0 }}>
            <span className={`badge ${
              pg.propertyType === 'house' ? 'badge-gold' : pg.propertyType === 'room' ? 'badge-peacock' : pg.gender === 'Girls' ? 'badge-peacock' : 'badge-blue'
            }`} style={{ fontSize: '0.72rem', padding: '4px 9px' }}>
              {pg.propertyType === 'house' 
                ? `🏠 ${pg.bhk || 'Rental House'}` 
                : pg.propertyType === 'room' 
                ? `🛏️ ${pg.bhk || 'Rental Room'}` 
                : `🏢 ${pg.gender || 'Co-ed'} PG`}
            </span>
            {pg.suitableFor && (
              <span className="badge badge-purple" style={{ fontSize: '0.7rem', padding: '4px 8px' }}>
                {pg.suitableFor.includes('Family') ? '👨‍👩‍👧 Family' : pg.suitableFor.includes('Student') ? '🎓 Student' : '💼 Working'}
              </span>
            )}
            {pg.featured && (
              <span className="badge badge-gold animate-pulse-gold" style={{ fontSize: '0.7rem', padding: '4px 8px' }}>
                👑 PRIME
              </span>
            )}
          </div>

          {/* Proximity / Distance Badge */}
          {pg.distanceKm !== undefined && pg.distanceKm !== null && (
            <div style={{
              background: 'rgba(4, 13, 33, 0.94)',
              border: '1px solid rgba(14, 116, 237, 0.5)',
              borderRadius: 'var(--radius-full)',
              padding: '4px 8px',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--gold-light)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              flexShrink: 0,
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)'
            }}>
              <Navigation size={11} style={{ color: 'var(--blue-light)' }} />
              <span>{pg.distanceKm} km</span>
            </div>
          )}

          {showStatus && pg.status && (
            <span className={`badge ${
              pg.status === 'approved' ? 'badge-green' : pg.status === 'pending_review' ? 'badge-gold' : 'badge-blue'
            }`} style={{ flexShrink: 0 }}>
              {pg.status.replace('_', ' ')}
            </span>
          )}
        </div>

        {/* Rating Floating Tag */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          background: 'rgba(4, 13, 33, 0.9)',
          padding: '4px 10px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          fontSize: '0.8rem',
          fontWeight: 700
        }}>
          <Star size={14} fill="#D4AF37" color="#D4AF37" />
          <span style={{ color: '#fff' }}>{pg.rating || '4.9'}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({pg.reviewsCount || 20})</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div style={{ padding: '22px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 
          onClick={() => onSelect(pg)}
          style={{ 
            fontSize: '1.2rem', 
            fontWeight: 700, 
            color: '#ffffff', 
            marginBottom: '8px',
            cursor: 'pointer',
            lineHeight: 1.35,
            fontFamily: 'var(--font-sans)'
          }}
          className="gold-gradient-hover"
        >
          {pg.name}
        </h3>

        {/* Address Location */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            color: 'var(--text-muted)', 
            fontSize: '0.85rem'
          }}>
            <MapPin size={15} style={{ color: 'var(--blue-light)', flexShrink: 0 }} />
            <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {!isGuest && pg.address.apartment ? `${pg.address.apartment}, ` : ''}{pg.address.area}, {pg.address.city}
            </span>
          </div>
          {isGuest && (
            <div 
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenLogin) onOpenLogin('tenant');
              }}
              style={{
                marginTop: '6px',
                fontSize: '0.73rem',
                fontWeight: 600,
                color: '#FDE68A',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                background: 'rgba(212, 175, 55, 0.12)',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                transition: 'all 0.2s ease'
              }}
              title="Click to sign in and view full street address and contact"
            >
              <span>🔒 Address Locked • Sign In to View</span>
            </div>
          )}
        </div>

        {/* Room / Unit configuration chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
          {pg.propertyType === 'house' ? (
            <>
              <span style={{ background: 'rgba(212, 175, 55, 0.12)', border: '1px solid rgba(212, 175, 55, 0.3)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', color: '#FDE68A' }}>
                🏠 {pg.bhk || '2BHK'} Residence
              </span>
              <span style={{ background: 'rgba(14, 116, 237, 0.08)', border: '1px solid rgba(14, 116, 237, 0.2)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', color: '#CBD5E1' }}>
                🛋️ {pg.furnishing || 'Furnished'}
              </span>
              <span style={{ background: 'rgba(0, 210, 180, 0.08)', border: '1px solid rgba(0, 210, 180, 0.2)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', color: '#A7F3D0' }}>
                👨‍👩‍👧 Family Friendly
              </span>
            </>
          ) : pg.propertyType === 'room' ? (
            <>
              <span style={{ background: 'rgba(0, 210, 180, 0.12)', border: '1px solid rgba(0, 210, 180, 0.3)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', color: '#A7F3D0' }}>
                🛏️ Private 1RK Room
              </span>
              <span style={{ background: 'rgba(14, 116, 237, 0.08)', border: '1px solid rgba(14, 116, 237, 0.2)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', color: '#CBD5E1' }}>
                🚿 Attached Bath
              </span>
              <span style={{ background: 'rgba(212, 175, 55, 0.08)', border: '1px solid rgba(212, 175, 55, 0.2)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', color: '#FDE68A' }}>
                🔑 Independent Entry
              </span>
            </>
          ) : (
            pg.rooms && pg.rooms.map((room) => (
              <span 
                key={room.id}
                style={{
                  background: 'rgba(14, 116, 237, 0.08)',
                  border: '1px solid rgba(14, 116, 237, 0.2)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  color: '#CBD5E1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Bed size={12} style={{ color: 'var(--gold-primary)' }} />
                {room.beds === 1 ? 'Single' : `${room.beds}-Bed`}
              </span>
            ))
          )}
        </div>

        {/* Amenities Highlights */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          color: 'var(--text-muted)', 
          fontSize: '0.8rem', 
          marginBottom: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: '12px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Wifi size={13} style={{ color: 'var(--blue-light)' }} />
            <span>WiFi</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Utensils size={13} style={{ color: 'var(--gold-primary)' }} />
            <span>{pg.propertyType === 'house' ? 'Modular Kitchen' : pg.propertyType === 'room' ? 'Pantry' : 'Food'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Zap size={13} style={{ color: 'var(--blue-cyan)' }} />
            <span>Power Backup</span>
          </div>
        </div>

        {/* Footer: Rent & Action Buttons */}
        <div style={{ 
          marginTop: 'auto', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          borderTop: '1px solid rgba(14, 116, 237, 0.18)',
          paddingTop: '14px'
        }}>
          <div style={{ minWidth: '95px' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>
              Starts From
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gold-light)' }}>
                ₹{pg.rent.toLocaleString('en-IN')}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/mo</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
            {isGuest ? (
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenLogin) onOpenLogin('tenant');
                }}
                className="btn btn-ghost btn-sm"
                title="Exact route locked: Sign in for GPS navigation"
                style={{ padding: '8px 10px', background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)', color: '#F59E0B' }}
              >
                <Navigation size={14} />
              </button>
            ) : (
              <a 
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm"
                title="Get Google Maps Route Directions"
                style={{ padding: '8px 10px', background: 'rgba(14, 116, 237, 0.12)', borderColor: 'rgba(14, 116, 237, 0.3)' }}
                onClick={(e) => e.stopPropagation()}
              >
                <Navigation size={14} style={{ color: 'var(--blue-light)' }} />
              </a>
            )}

            <button 
              onClick={() => onSelect(pg)}
              className="btn btn-gold btn-sm"
              style={{ padding: '8px 14px', fontSize: '0.84rem' }}
            >
              <span>{isGuest ? 'View Details' : 'Explore'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
