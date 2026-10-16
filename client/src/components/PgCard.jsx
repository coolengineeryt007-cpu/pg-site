import React from 'react';
import { 
  MapPin, 
  Star, 
  Navigation, 
  ArrowRight, 
  ShieldCheck, 
  Crown, 
  Lock 
} from 'lucide-react';
import { getDirectionsUrl } from '../services/googleMaps';

export default function PgCard({ pg, onSelect, showStatus = false, currentUser, onOpenLogin }) {
  const isGuest = !currentUser;
  const coverPhoto = (pg.photos && pg.photos.length > 0) 
    ? pg.photos[0] 
    : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80';

  const directionsUrl = getDirectionsUrl(pg.address?.lat, pg.address?.lng, `${pg.name}, ${pg.address?.city}`);

  // Property Type Badge Configuration
  const isHouse = pg.propertyType === 'house';
  const isRoom = pg.propertyType === 'room';
  const typeLabel = isHouse 
    ? (pg.bhk ? `🏠 ${pg.bhk} Flat` : '🏠 Family Flat') 
    : isRoom 
    ? '🛏️ 1RK Studio' 
    : `🏢 ${pg.gender || 'Co-ed'} PG`;

  const typeBadgeStyle = isHouse
    ? { background: '#FEF3C7', border: '1px solid #FCD34D', color: '#92400E' }
    : isRoom
    ? { background: '#F0FDFA', border: '1px solid #99F6E4', color: '#0F766E' }
    : { background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1D4ED8' };

  // Key Features (Consolidated cleanly into 3 items max)
  const features = isHouse
    ? [
        { icon: '🛋️', label: pg.furnishing || 'Furnished' },
        { icon: '👨‍👩‍👧', label: 'Family Friendly' },
        { icon: '📶', label: 'WiFi Ready' }
      ]
    : isRoom
    ? [
        { icon: '🚿', label: 'Attached Bath' },
        { icon: '🔑', label: 'Private Entry' },
        { icon: '📶', label: 'High-Speed WiFi' }
      ]
    : [
        { icon: '🛏️', label: `${pg.rooms?.[0]?.beds || 1}-Sharing` },
        { icon: '🍲', label: 'Food Included' },
        { icon: '📶', label: 'WiFi & Backup' }
      ];

  return (
    <article 
      onClick={() => onSelect(pg)}
      className="luxury-card property-card-hover" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        borderRadius: '18px',
        border: '1.5px solid #E2E8F0',
        background: '#FFFFFF',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.08), 0 0 1px 1px rgba(226, 232, 240, 0.9)',
        transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease'
      }}
    >
      {/* Photo Container */}
      <div style={{ position: 'relative', width: '100%', height: '190px', overflow: 'hidden' }}>
        <img 
          src={coverPhoto} 
          alt={`${pg.name} in ${pg.address?.area || ''}, ${pg.address?.city || ''}`}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80';
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease, filter 0.3s ease',
            filter: isGuest ? 'blur(10px)' : 'none',
            WebkitFilter: isGuest ? 'blur(10px)' : 'none',
            transform: isGuest ? 'scale(1.08)' : undefined
          }}
          className={!isGuest ? "hover-scale-img" : ""}
        />

        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.04) 55%, rgba(0,0,0,0.45) 100%)',
          pointerEvents: 'none'
        }} />

        {/* Guest Mode Photo Lock Overlay */}
        {isGuest && (
          <div 
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenLogin) onOpenLogin('tenant');
            }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3,
              cursor: 'pointer'
            }}
          >
            <span style={{
              background: 'rgba(15, 23, 42, 0.88)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(212, 175, 55, 0.5)',
              borderRadius: '20px',
              padding: '6px 14px',
              fontSize: '0.74rem',
              fontWeight: 700,
              color: '#FEF08A',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)'
            }}>
              <Lock size={12} style={{ color: '#F59E0B' }} />
              <span>Login to View Clear Photos</span>
            </span>
          </div>
        )}

        {/* Top Badges Bar */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          right: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '6px',
          zIndex: 2,
          pointerEvents: 'none'
        }}>
          {/* Left: Category Badge + Prime */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{
              ...typeBadgeStyle,
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              padding: '3px 9px',
              borderRadius: '20px',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.2px'
            }}>
              {typeLabel}
            </span>

            {pg.featured && (
              <span style={{
                background: '#FEF3C7',
                border: '1px solid #FCD34D',
                color: '#92400E',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                padding: '3px 8px',
                borderRadius: '20px',
                fontSize: '0.68rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px'
              }}>
                <Crown size={11} style={{ color: '#D97706' }} />
                <span>PRIME</span>
              </span>
            )}
          </div>

          {/* Right: Verified or Distance */}
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            {pg.distanceKm !== undefined && pg.distanceKm !== null ? (
              <span style={{
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #CBD5E1',
                borderRadius: '20px',
                padding: '3px 8px',
                fontSize: '0.70rem',
                fontWeight: 700,
                color: '#0052CC',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <Navigation size={10} style={{ color: '#0052CC' }} />
                <span>{pg.distanceKm} km</span>
              </span>
            ) : (
              <span style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(6px)',
                border: '1px solid #A7F3D0',
                borderRadius: '20px',
                padding: '3px 8px',
                fontSize: '0.68rem',
                fontWeight: 700,
                color: '#065F46',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <ShieldCheck size={11} color="#059669" />
                <span>Verified</span>
              </span>
            )}
          </div>
        </div>

        {/* Rating Floating Tag */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          padding: '3px 8px',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.76rem',
          fontWeight: 700,
          color: '#0F172A',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.12)'
        }}>
          <Star size={12} fill="#F59E0B" color="#F59E0B" />
          <span>{pg.rating || '4.9'}</span>
          <span style={{ color: '#64748B', fontSize: '0.70rem', fontWeight: 500 }}>
            ({pg.reviewsCount || 20})
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Title */}
        <h3 
          style={{ 
            fontSize: '1.08rem', 
            fontWeight: 700, 
            color: '#0F172A', 
            marginBottom: '6px',
            lineHeight: 1.35,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
          title={pg.name}
        >
          {pg.name}
        </h3>

        {/* Address Location */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: '6px', 
          color: '#64748B', 
          fontSize: '0.80rem',
          marginBottom: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0 }}>
            <MapPin size={13} style={{ color: '#0052CC', flexShrink: 0 }} />
            {isGuest ? (
              <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                {/* Specific locality/area blurred for privacy in guest mode */}
                <span 
                  style={{ 
                    display: 'inline-block',
                    filter: 'blur(5px)', 
                    WebkitFilter: 'blur(5px)',
                    userSelect: 'none', 
                    opacity: 0.68,
                    color: '#64748B',
                    letterSpacing: '0.2px',
                    pointerEvents: 'none'
                  }}
                  aria-hidden="true"
                  title="Specific area is hidden in guest mode. Login to view exact location."
                >
                  {pg.address?.area || 'Area Locality'},
                </span>
                {/* Main city name clearly visible */}
                <span style={{ color: '#0F172A', fontWeight: 700, display: 'inline-block' }}>
                  {pg.address?.city || 'Rajkot'}
                </span>
              </span>
            ) : (
              <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', color: '#334155' }}>
                {pg.address?.area || pg.address?.city}, {pg.address?.city}
              </span>
            )}
          </div>

          {isGuest && (
            <span 
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenLogin) onOpenLogin('tenant');
              }}
              style={{
                fontSize: '0.68rem',
                color: '#B45309',
                background: '#FEF3C7',
                padding: '2px 6px',
                borderRadius: '4px',
                border: '1px solid #FCD34D',
                flexShrink: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px'
              }}
              title="Sign in to view exact building and house number"
            >
              <Lock size={9} />
              <span>Sign In</span>
            </span>
          )}
        </div>

        {/* Clean Consolidated Features Row */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
          {features.map((f, i) => (
            <span 
              key={i}
              style={{
                background: '#F1F5F9',
                border: '1px solid #E2E8F0',
                borderRadius: '6px',
                padding: '3px 8px',
                fontSize: '0.73rem',
                color: '#334155',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </span>
          ))}
        </div>

        {/* Footer: Rent & Action Buttons */}
        <div style={{ 
          marginTop: 'auto', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderTop: '1px solid #E2E8F0',
          paddingTop: '12px',
          gap: '10px'
        }}>
          <div>
            <span style={{ fontSize: '0.66rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', fontWeight: 600 }}>
              Monthly Rent
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
              <span style={{ fontSize: '1.24rem', fontWeight: 800, color: '#0052CC' }}>
                ₹{(pg.rent || 0).toLocaleString('en-IN')}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#64748B' }}>/mo</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {isGuest ? (
              <button 
                type="button"
                className="btn btn-ghost btn-sm"
                title="Sign in to view directions on Google Maps"
                aria-label="Sign in to view directions on Google Maps"
                style={{ 
                  padding: '6px 8px', 
                  background: '#EFF6FF', 
                  borderColor: '#BFDBFE',
                  borderRadius: '8px'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenLogin) onOpenLogin('tenant');
                }}
              >
                <Navigation size={13} style={{ color: '#0052CC' }} />
              </button>
            ) : (
              <a 
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm"
                title="Get Google Maps Route"
                aria-label={`Get directions to ${pg.name} on Google Maps`}
                style={{ 
                  padding: '6px 8px', 
                  background: '#EFF6FF', 
                  borderColor: '#BFDBFE',
                  borderRadius: '8px'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <Navigation size={13} style={{ color: '#0052CC' }} />
              </a>
            )}

            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(pg);
              }}
              className="btn btn-primary btn-sm"
              style={{ 
                padding: '7px 13px', 
                fontSize: '0.80rem', 
                borderRadius: '8px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <span>View Details</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
