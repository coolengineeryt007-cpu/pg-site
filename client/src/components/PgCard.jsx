import React from 'react';
import { MapPin, Star, ShieldCheck, Navigation, ArrowRight, Bed, Wifi, Utensils, Zap } from 'lucide-react';
import { getDirectionsUrl } from '../services/googleMaps';

export default function PgCard({ pg, onSelect, showStatus = false }) {
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
          alt={`${pg.name} in ${pg.address.area}, ${pg.address.city}`}
          loading="lazy"
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
          background: 'linear-gradient(180deg, rgba(8,8,8,0.2) 0%, rgba(8,8,8,0.85) 100%)'
        }} />

        {/* Top Badges */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          right: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span className={`badge ${
              pg.gender === 'Girls' ? 'badge-crimson' : pg.gender === 'Boys' ? 'badge-blue' : 'badge-purple'
            }`}>
              {pg.gender} PG
            </span>
            {pg.featured && (
              <span className="badge badge-gold animate-pulse-gold">
                👑 PRIME
              </span>
            )}
          </div>

          {/* Proximity / Distance Badge */}
          {pg.distanceKm !== undefined && pg.distanceKm !== null && (
            <div style={{
              background: 'rgba(8, 8, 8, 0.85)',
              border: '1px solid var(--gold-primary)',
              borderRadius: 'var(--radius-full)',
              padding: '4px 10px',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--gold-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Navigation size={12} style={{ color: 'var(--red-crimson)' }} />
              <span>{pg.distanceKm} km away</span>
            </div>
          )}

          {showStatus && pg.status && (
            <span className={`badge ${
              pg.status === 'approved' ? 'badge-green' : pg.status === 'pending_review' ? 'badge-gold' : 'badge-crimson'
            }`}>
              {pg.status.replace('_', ' ')}
            </span>
          )}
        </div>

        {/* Rating Floating Tag */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          background: 'rgba(10, 10, 10, 0.85)',
          padding: '4px 10px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          fontSize: '0.8rem',
          fontWeight: 700
        }}>
          <Star size={14} fill="#D4AF37" color="#D4AF37" />
          <span style={{ color: '#fff' }}>{pg.rating || '4.9'}</span>
          <span style={{ color: '#888', fontSize: '0.75rem' }}>({pg.reviewsCount || 20})</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 
          onClick={() => onSelect(pg)}
          style={{ 
            fontSize: '1.15rem', 
            fontWeight: 700, 
            color: '#fff', 
            marginBottom: '6px',
            cursor: 'pointer' 
          }}
          className="gold-gradient-hover"
        >
          {pg.name}
        </h3>

        {/* Address Location */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          color: 'var(--text-muted)', 
          fontSize: '0.85rem',
          marginBottom: '14px' 
        }}>
          <MapPin size={15} style={{ color: 'var(--red-crimson)', flexShrink: 0 }} />
          <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {pg.address.apartment ? `${pg.address.apartment}, ` : ''}{pg.address.area}, {pg.address.city}
          </span>
        </div>

        {/* Room / Bed sharing chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
          {pg.rooms && pg.rooms.map((room) => (
            <span 
              key={room.id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                color: '#bbb',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Bed size={12} style={{ color: 'var(--gold-primary)' }} />
              {room.beds === 1 ? 'Single' : `${room.beds}-Bed`}
            </span>
          ))}
        </div>

        {/* Amenities Highlights */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          color: '#999', 
          fontSize: '0.8rem', 
          marginBottom: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: '12px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Wifi size={13} style={{ color: 'var(--gold-primary)' }} />
            <span>WiFi</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Utensils size={13} style={{ color: 'var(--gold-primary)' }} />
            <span>Food</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Zap size={13} style={{ color: 'var(--gold-primary)' }} />
            <span>Power Backup</span>
          </div>
        </div>

        {/* Footer: Rent & Action Buttons */}
        <div style={{ 
          marginTop: 'auto', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(212, 175, 55, 0.15)',
          paddingTop: '14px'
        }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', display: 'block' }}>
              Starts From
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gold-primary)' }}>
                ₹{pg.rent.toLocaleString('en-IN')}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#999' }}>/month</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <a 
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm"
              title="Get Google Maps Route Directions"
              style={{ padding: '8px 10px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <Navigation size={14} style={{ color: 'var(--red-crimson)' }} />
            </a>

            <button 
              onClick={() => onSelect(pg)}
              className="btn btn-gold btn-sm"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <span>Explore</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
