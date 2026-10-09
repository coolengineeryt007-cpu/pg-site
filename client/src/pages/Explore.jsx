import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  Navigation, 
  Filter, 
  ArrowUpDown, 
  RotateCcw,
  Bed,
  Building,
  CheckCircle2
} from 'lucide-react';
import PgCard from '../components/PgCard';
import GoogleMapView from '../components/GoogleMapView';
import LocationSearchBar from '../components/LocationSearchBar';
import { api } from '../services/api';
import { getCurrentPosition } from '../services/googleMaps';

export default function Explore({ onSelectPg, initialFilter = {} }) {
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCoords, setUserCoords] = useState(
    initialFilter.lat && initialFilter.lng 
      ? { lat: Number(initialFilter.lat), lng: Number(initialFilter.lng) } 
      : null
  );

  // Filters
  const [search, setSearch] = useState(initialFilter.search || '');
  const [city, setCity] = useState(initialFilter.city || 'all');
  const [gender, setGender] = useState(initialFilter.gender || 'all');
  const [sharing, setSharing] = useState('all');
  const [maxRent, setMaxRent] = useState(30000);
  const [sortBy, setSortBy] = useState(initialFilter.lat ? 'distance' : 'featured');
  const [showMap, setShowMap] = useState(true);
  const [detectingGps, setDetectingGps] = useState(false);

  const fetchPgs = async () => {
    setLoading(true);
    try {
      const params = {
        search,
        city: city !== 'all' ? city : undefined,
        gender: gender !== 'all' ? gender : undefined,
        sharing: sharing !== 'all' ? sharing : undefined,
        maxRent,
        lat: userCoords?.lat,
        lng: userCoords?.lng
      };

      const res = await api.getPgs(params);
      let list = res.pgs || [];

      // Client-side sort refinement
      if (sortBy === 'price_asc') {
        list.sort((a, b) => a.rent - b.rent);
      } else if (sortBy === 'price_desc') {
        list.sort((a, b) => b.rent - a.rent);
      } else if (sortBy === 'rating') {
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (sortBy === 'distance' && userCoords) {
        list.sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));
      }

      setPgs(list);
    } catch (err) {
      console.error("Error fetching PGs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPgs();
  }, [search, city, gender, sharing, maxRent, userCoords, sortBy]);

  const handleGpsNearMe = async () => {
    setDetectingGps(true);
    try {
      const pos = await getCurrentPosition();
      setUserCoords({ lat: pos.lat, lng: pos.lng });
      setSortBy('distance');
    } catch (err) {
      alert("Could not detect device GPS. Please search your area in the search bar above.");
    } finally {
      setDetectingGps(false);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setCity('all');
    setGender('all');
    setSharing('all');
    setMaxRent(30000);
    setUserCoords(null);
    setSortBy('featured');
  };

  return (
    <div className="container" style={{ paddingTop: '35px', paddingBottom: '80px' }}>
      {/* Header Banner */}
      <div style={{ marginBottom: '30px' }}>
        <h1 className="font-serif gold-gradient-text" style={{ fontSize: '2.2rem', marginBottom: '8px' }}>
          Explore Luxury Paying Guest Residences
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Filter by proximity, sharing type, gender category, and budget with real-time Google Maps coordinates.
        </p>
      </div>

      {/* Main Filter & Search Control Panel */}
      <div className="luxury-card" style={{ padding: '24px', marginBottom: '30px' }}>
        <div className="explore-filter-grid">
          {/* Location Search Bar */}
          <LocationSearchBar 
            initialValue={search}
            onLocationSelect={(parsed) => {
              setSearch(parsed.area || parsed.city);
              setUserCoords({ lat: parsed.lat, lng: parsed.lng });
              setSortBy('distance');
            }}
            placeholder="Search locality, university, or landmark..."
            showCurrentLocationBtn={false}
          />

          {/* City Selector */}
          <select 
            className="form-select"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="all">All Cities</option>
            <option value="Rajkot">Rajkot</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Pune">Pune</option>
            <option value="Gurugram">Gurugram</option>
            <option value="Mumbai">Mumbai</option>
          </select>

          {/* Gender Filter */}
          <select 
            className="form-select"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="all">All Genders</option>
            <option value="Girls">Girls Only PG</option>
            <option value="Boys">Boys Only PG</option>
            <option value="Co-ed">Co-ed / Unisex</option>
          </select>

          {/* GPS Near Me Action Button */}
          <button 
            onClick={handleGpsNearMe}
            disabled={detectingGps}
            className="btn btn-gold"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Navigation size={16} />
            <span>{detectingGps ? 'Detecting GPS...' : 'Near Me'}</span>
          </button>
        </div>

        {/* Secondary Filter Row: Sharing, Budget Slider, Sort */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '18px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '16px'
        }}>
          {/* Sharing Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: '#888' }}>Sharing:</span>
            {['all', '1', '2', '3'].map((val) => (
              <button
                key={val}
                onClick={() => setSharing(val)}
                className={`btn btn-sm ${sharing === val ? 'btn-gold' : 'btn-ghost'}`}
                style={{ padding: '5px 12px', fontSize: '0.8rem' }}
              >
                {val === 'all' ? 'All' : val === '1' ? 'Single Room' : `${val}-Bed`}
              </button>
            ))}
          </div>

          {/* Budget Slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '220px' }}>
            <span style={{ fontSize: '0.8rem', color: '#888' }}>Max Rent:</span>
            <input 
              type="range"
              min="10000"
              max="30000"
              step="1000"
              value={maxRent}
              onChange={(e) => setMaxRent(Number(e.target.value))}
              style={{ accentColor: 'var(--gold-primary)', flex: 1 }}
            />
            <span style={{ fontSize: '0.85rem', color: 'var(--gold-primary)', fontWeight: 700 }}>
              ₹{maxRent.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Sorting */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: '#888' }}>Sort:</span>
            <select 
              className="form-select"
              style={{ padding: '6px 12px', fontSize: '0.85rem' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Prime & Featured First</option>
              {userCoords && <option value="distance">Proximity (Nearest First)</option>}
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            <button 
              onClick={handleResetFilters}
              title="Reset Filters"
              className="btn btn-ghost btn-sm"
              style={{ padding: '6px 10px' }}
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* GPS Active Badge */}
      {userCoords && (
        <div style={{
          background: 'rgba(212, 175, 55, 0.1)',
          border: '1px solid var(--gold-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 18px',
          marginBottom: '25px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.88rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold-primary)' }}>
            <Navigation size={16} style={{ color: 'var(--red-crimson)' }} />
            <span>GPS Proximity Mode Active: Sorted by distance from your coordinates ({userCoords.lat.toFixed(3)}, {userCoords.lng.toFixed(3)})</span>
          </div>
          <button 
            onClick={() => setUserCoords(null)}
            style={{ background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}
          >
            Clear GPS
          </button>
        </div>
      )}

      {/* Interactive Map Toggle & View */}
      <div style={{ marginBottom: '35px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ color: '#fff', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} style={{ color: 'var(--gold-primary)' }} />
            Interactive Map View ({pgs.length} Properties)
          </h3>
          <button 
            onClick={() => setShowMap(!showMap)}
            className="btn btn-ghost btn-sm"
          >
            {showMap ? 'Hide Map' : 'Show Map'}
          </button>
        </div>

        {showMap && (
          <GoogleMapView 
            markers={pgs}
            center={userCoords || { lat: 12.9716, lng: 77.5946 }}
            zoom={userCoords ? 13 : 11}
            height="340px"
            onSelectPg={onSelectPg}
          />
        )}
      </div>

      {/* Results Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', fontSize: '1.25rem' }}>
            Available Verified PGs <span style={{ color: '#888', fontSize: '0.9rem' }}>({pgs.length} Found)</span>
          </h3>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--gold-primary)' }}>
            <Navigation size={32} className="animate-spin" style={{ margin: '0 auto 12px auto', display: 'block' }} />
            <p style={{ letterSpacing: '0.05em' }}>FETCHING LUXURY RESIDENCES...</p>
          </div>
        ) : pgs.length === 0 ? (
          <div className="luxury-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <Building size={48} style={{ color: 'var(--gold-primary)', margin: '0 auto 16px auto', display: 'block' }} />
            <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '8px' }}>No PG Residences Match Your Filters</h3>
            <p style={{ color: '#888', maxWidth: '420px', margin: '0 auto 20px auto', fontSize: '0.9rem' }}>
              Try broadening your rent budget or selecting 'All Cities' to see more verified luxury properties.
            </p>
            <button onClick={handleResetFilters} className="btn btn-gold">
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid-3">
            {pgs.map((pg) => (
              <PgCard key={pg.id} pg={pg} onSelect={onSelectPg} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
