import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, MapPin, Satellite, Moon } from 'lucide-react';
import { getDirectionsUrl } from '../services/googleMaps';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Luxury Gold & Crimson Map Pin Icon Generator
const createLuxuryPin = (isFeatured = false, isDraggable = false) => {
  return L.divIcon({
    className: 'custom-luxury-pin',
    html: `
      <div style="
        position: relative;
        width: 42px;
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: ${isDraggable ? 'grab' : 'pointer'};
      ">
        <div style="
          width: 34px;
          height: 34px;
          background: ${isFeatured ? 'linear-gradient(135deg, #FFF0A8 0%, #D4AF37 60%, #996515 100%)' : 'linear-gradient(135deg, #1D68F2 0%, #0E74ED 60%, #00B4D8 100%)'};
          border: 2px solid #D4AF37;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 8px 24px rgba(0,0,0,0.9), 0 0 15px rgba(14, 116, 237, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        ">
          <div style="
            width: 11px;
            height: 11px;
            background: #080808;
            border-radius: 50%;
            transform: rotate(45deg);
            border: 1px solid #D4AF37;
          "></div>
        </div>
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -42]
  });
};

export default function GoogleMapView({
  center = { lat: 12.9716, lng: 77.5946 },
  zoom = 15,
  markers = [],
  interactive = true,
  draggableMarker = false,
  onMarkerDragEnd = null,
  height = "420px",
  onSelectPg = null
}) {
  const lat = Number(center.lat) || 12.9716;
  const lng = Number(center.lng) || 77.5946;

  // Layer mode: 'google_roadmap' | 'google_satellite' | 'google_dark'
  const [mapLayer, setMapLayer] = useState('google_roadmap');

  const containerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const singleMarkerRef = useRef(null);
  const markerLayerGroupRef = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(containerRef.current, {
        center: [lat, lng],
        zoom: zoom,
        zoomControl: interactive,
        attributionControl: false,
        dragging: interactive,
        touchZoom: interactive,
        scrollWheelZoom: interactive ? 'center' : false,
        doubleClickZoom: interactive
      });

      // Google Maps Official Tile Layer
      // Subdomains: mt0, mt1, mt2, mt3
      const googleTiles = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: 'Map data &copy; Google'
      }).addTo(map);

      tileLayerRef.current = googleTiles;
      markerLayerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update Tile Layer on Layer Toggle (Roadmap, Satellite Hybrid, Luxury Dark)
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const map = mapInstanceRef.current;

    tileLayerRef.current.remove();

    let newUrl = 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'; // Google Roadmap
    if (mapLayer === 'google_satellite') {
      newUrl = 'https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'; // Google Satellite Hybrid (with roads)
    }

    const newLayer = L.tileLayer(newUrl, {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: 'Map data &copy; Google'
    }).addTo(map);

    tileLayerRef.current = newLayer;
  }, [mapLayer]);

  // Handle Center and Zoom updates
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    if (!isNaN(lat) && !isNaN(lng)) {
      map.setView([lat, lng], zoom, { animate: true });
    }
  }, [lat, lng, zoom]);

  // Handle Draggable Single Pin Mode (PG Owner Add/Edit Location)
  useEffect(() => {
    if (!mapInstanceRef.current || !draggableMarker) return;
    const map = mapInstanceRef.current;

    if (singleMarkerRef.current) {
      singleMarkerRef.current.remove();
    }

    const pin = L.marker([lat, lng], {
      icon: createLuxuryPin(true, true),
      draggable: true,
      title: "Drag to pinpoint exact entrance"
    }).addTo(map);

    pin.bindPopup(`
      <div style="background:#111; color:#fff; padding:8px 12px; border-radius:6px; font-size:12px; border:1px solid #D4AF37; font-family:sans-serif;">
        <strong style="color:#D4AF37; font-size:13px; display:block; margin-bottom:2px;">📍 PG Entrance Pin</strong>
        Drag marker or click anywhere on map to position!
      </div>
    `).openPopup();

    pin.on('dragend', (e) => {
      const position = e.target.getLatLng();
      if (onMarkerDragEnd) {
        onMarkerDragEnd(position.lat, position.lng);
      }
    });

    const handleMapClick = (e) => {
      pin.setLatLng(e.latlng);
      if (onMarkerDragEnd) {
        onMarkerDragEnd(e.latlng.lat, e.latlng.lng);
      }
    };

    map.on('click', handleMapClick);
    singleMarkerRef.current = pin;

    return () => {
      map.off('click', handleMapClick);
      if (pin) pin.remove();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draggableMarker, lat, lng, onMarkerDragEnd]);

  // Handle Multiple PG Markers (Explore & Near Me)
  useEffect(() => {
    if (!mapInstanceRef.current || !markerLayerGroupRef.current || draggableMarker) return;
    const map = mapInstanceRef.current;
    const layer = markerLayerGroupRef.current;

    layer.clearLayers();

    if (markers && markers.length > 0) {
      const bounds = [];

      markers.forEach((pg) => {
        if (!pg.address || isNaN(pg.address.lat) || isNaN(pg.address.lng)) return;

        const pos = [Number(pg.address.lat), Number(pg.address.lng)];
        bounds.push(pos);

        const m = L.marker(pos, {
          icon: createLuxuryPin(pg.featured, false)
        });

        // Luxury Info Popup
        const popupContent = document.createElement('div');
        popupContent.style.background = '#121212';
        popupContent.style.color = '#ffffff';
        popupContent.style.padding = '12px';
        popupContent.style.borderRadius = '8px';
        popupContent.style.border = '1px solid #D4AF37';
        popupContent.style.maxWidth = '250px';
        popupContent.style.fontFamily = 'sans-serif';

        popupContent.innerHTML = `
          <strong style="color:#D4AF37; font-size:14px; display:block; margin-bottom:4px;">${pg.name}</strong>
          <p style="font-size:12px; color:#aaa; margin:0 0 8px 0;">${pg.address.area || pg.address.city}</p>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-size:13px; font-weight:bold; color:#fff;">₹${(pg.rent || 0).toLocaleString('en-IN')}/mo</span>
            <span style="background:#B91C1C; color:#fff; font-size:10px; padding:2px 6px; border-radius:4px; font-weight:600;">${pg.gender}</span>
          </div>
          <div style="display:flex; gap:6px;">
            <a href="${getDirectionsUrl(pg.address.lat, pg.address.lng)}" target="_blank" rel="noopener noreferrer" style="background:#222; color:#D4AF37; border:1px solid #D4AF37; padding:4px 8px; border-radius:4px; font-size:11px; text-decoration:none; display:inline-flex; align-items:center; gap:4px;">
              Directions on Google Maps ↗
            </a>
          </div>
        `;

        m.bindPopup(popupContent);

        if (onSelectPg) {
          m.on('click', () => onSelectPg(pg));
        }

        layer.addLayer(m);
      });

      if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    }
  }, [markers, draggableMarker, onSelectPg]);

  const googleDirectionsUrl = getDirectionsUrl(lat, lng);

  return (
    <div style={{
      position: 'relative',
      height,
      width: '100%',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid rgba(212, 175, 55, 0.4)',
      boxShadow: 'var(--shadow-card)',
      background: '#0d0d0d'
    }}>
      {/* Map Canvas */}
      <div 
        ref={containerRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          filter: mapLayer === 'google_dark' 
            ? 'invert(100%) hue-rotate(180deg) brightness(92%) contrast(88%)' 
            : 'none'
        }} 
      />

      {/* Floating Header: Layer Switcher & Google Maps Navigation */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        right: '10px',
        zIndex: 500,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '6px',
        pointerEvents: 'none'
      }}>
        {/* Google Map Layer Switcher */}
        <div style={{
          display: 'flex',
          background: 'rgba(10, 10, 10, 0.92)',
          border: '1px solid rgba(212, 175, 55, 0.4)',
          borderRadius: 'var(--radius-sm)',
          padding: '3px',
          gap: '3px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.85)',
          pointerEvents: 'auto'
        }}>
          <button
            type="button"
            onClick={() => setMapLayer('google_roadmap')}
            className={`btn btn-sm ${mapLayer === 'google_roadmap' ? 'btn-gold' : 'btn-ghost'}`}
            style={{
              fontSize: '0.73rem',
              padding: '4px 10px',
              borderRadius: '4px',
              fontWeight: 600,
              gap: '4px'
            }}
            title="Google Maps Official Roadmap"
          >
            🗺️ Google Maps
          </button>

          <button
            type="button"
            onClick={() => setMapLayer('google_satellite')}
            className={`btn btn-sm ${mapLayer === 'google_satellite' ? 'btn-gold' : 'btn-ghost'}`}
            style={{
              fontSize: '0.73rem',
              padding: '4px 10px',
              borderRadius: '4px',
              fontWeight: 600,
              gap: '4px'
            }}
            title="Google Maps Satellite & Hybrid View"
          >
            <Satellite size={12} /> Satellite
          </button>

          <button
            type="button"
            onClick={() => setMapLayer('google_dark')}
            className={`btn btn-sm ${mapLayer === 'google_dark' ? 'btn-gold' : 'btn-ghost'}`}
            style={{
              fontSize: '0.73rem',
              padding: '4px 10px',
              borderRadius: '4px',
              fontWeight: 600,
              gap: '4px'
            }}
            title="Luxury Dark Mode Theme"
          >
            <Moon size={12} /> Dark Mode
          </button>
        </div>

        {/* External Google Maps Button */}
        <a 
          href={googleDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-gold btn-sm"
          style={{
            padding: '6px 14px',
            fontSize: '0.75rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.85)',
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            borderRadius: 'var(--radius-sm)'
          }}
          title="Open in Official Google Maps Navigation"
        >
          <ExternalLink size={12} /> Google Maps
        </a>
      </div>

      {/* Floating Bottom Instructions Pill */}
      {draggableMarker && (
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          right: '12px',
          zIndex: 500,
          background: 'rgba(8, 8, 8, 0.94)',
          border: '1px solid var(--gold-primary)',
          borderRadius: 'var(--radius-sm)',
          padding: '7px 14px',
          fontSize: '0.78rem',
          color: 'var(--gold-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 6px 20px rgba(0,0,0,0.9)',
          pointerEvents: 'none'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={15} style={{ color: 'var(--red-crimson)', flexShrink: 0 }} />
            <span>Click anywhere or drag the Gold Pin to pinpoint exact entrance</span>
          </div>
          <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 700, background: '#1c1c1c', padding: '2px 8px', borderRadius: '4px', border: '1px solid #333' }}>
            {lat.toFixed(4)}, {lng.toFixed(4)}
          </span>
        </div>
      )}
    </div>
  );
}
