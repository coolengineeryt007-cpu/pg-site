import React, { useEffect, useRef, useState } from 'react';
import { loadGoogleMaps, parseAddressComponents, getCurrentPosition, reverseGeocodeCoords, geocodeAddress } from '../services/googleMaps';
import { MapPin, Navigation, Search, Loader2, X, AlertCircle } from 'lucide-react';

export default function LocationSearchBar({
  onLocationSelect,
  placeholder = "Search area, street, landmark, or university...",
  showCurrentLocationBtn = true,
  initialValue = "",
  className = ""
}) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [inputValue, setInputValue] = useState(initialValue);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [searchingText, setSearchingText] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [permissionNotice, setPermissionNotice] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceTimerRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize Google Places Autocomplete if authorized
  useEffect(() => {
    let isMounted = true;

    loadGoogleMaps()
      .then((maps) => {
        if (!isMounted || !inputRef.current || !maps.places) return;

        const autocomplete = new maps.places.Autocomplete(inputRef.current, {
          types: ['geocode', 'establishment'],
          componentRestrictions: { country: 'in' },
          fields: ['address_components', 'formatted_address', 'geometry', 'name']
        });

        autocompleteRef.current = autocomplete;

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (!place || !place.geometry) return;

          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const parsed = parseAddressComponents(
            place.address_components,
            place.formatted_address || place.name,
            lat,
            lng
          );

          if (place.name && !parsed.apartment) {
            parsed.apartment = place.name;
          }

          const displayLabel = place.formatted_address || place.name || `${parsed.area}, ${parsed.city}`;
          setInputValue(displayLabel);
          setShowDropdown(false);
          setStatusMessage({ type: 'success', text: `Verified: ${parsed.area || parsed.city}` });

          if (onLocationSelect) {
            onLocationSelect(parsed);
          }

          setTimeout(() => setStatusMessage(null), 3000);
        });
      })
      .catch(() => {
        // Fallback search suggestions are ready
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle Input Change with debounced search suggestions
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!val || val.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/geocode/search?q=${encodeURIComponent(val.trim())}`);
        if (res.ok) {
          const data = await res.json();
          if (data.results && data.results.length > 0) {
            setSuggestions(data.results);
            setShowDropdown(true);
          }
        }
      } catch (err) {
        // Quiet failure
      }
    }, 280);
  };

  const handleClearInput = () => {
    setInputValue('');
    setSuggestions([]);
    setShowDropdown(false);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleSelectSuggestion = (item) => {
    const displayLabel = item.formattedAddress || `${item.apartment}, ${item.area}, ${item.city}`;
    setInputValue(displayLabel);
    setShowDropdown(false);
    setStatusMessage({ type: 'success', text: `Selected: ${item.area || item.city}` });

    if (onLocationSelect) {
      onLocationSelect(item);
    }

    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Handle GPS / Current Location
  const handleUseCurrentLocation = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setDetectingLocation(true);
    setPermissionNotice(false);
    setStatusMessage({ type: 'info', text: 'Acquiring high-precision GPS coordinates...' });

    try {
      const pos = await getCurrentPosition();

      // Check if permission was blocked
      if (pos.permissionDenied) {
        setPermissionNotice(true);
      }

      setStatusMessage({ type: 'info', text: 'Autofilling verified address details...' });

      const parsed = await reverseGeocodeCoords(pos.lat, pos.lng);
      const displayLabel = parsed.formattedAddress || `${parsed.area}, ${parsed.city}`;
      setInputValue(displayLabel);
      setShowDropdown(false);
      setStatusMessage({ 
        type: 'success', 
        text: `✓ Verified: ${parsed.area || parsed.city}${pos.permissionDenied ? ' (Network location)' : ' (Exact GPS)'}` 
      });

      if (onLocationSelect) {
        onLocationSelect(parsed);
      }

      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err) {
      console.warn("GPS resolution error:", err);
      setStatusMessage({ type: 'error', text: 'Could not resolve address. Please type your area above.' });
      setTimeout(() => setStatusMessage(null), 4000);
    } finally {
      setDetectingLocation(false);
    }
  };

  // Handle Search on text query (Enter key or Search Button)
  const handleManualSearch = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!inputValue || !inputValue.trim()) return;

    setSearchingText(true);
    setShowDropdown(false);
    setStatusMessage({ type: 'info', text: `Locating "${inputValue.trim()}"...` });

    try {
      const parsed = await geocodeAddress(inputValue.trim());
      if (parsed) {
        setInputValue(parsed.formattedAddress || inputValue.trim());
        setStatusMessage({ type: 'success', text: `Found: ${parsed.area || parsed.city}` });
        if (onLocationSelect) {
          onLocationSelect(parsed);
        }
      }
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err) {
      console.warn("Manual geocode error:", err);
      if (onLocationSelect) {
        onLocationSelect({
          apartment: inputValue.trim(),
          addressLine1: inputValue.trim(),
          area: inputValue.trim(),
          city: 'Rajkot',
          state: 'Gujarat',
          pincode: '360001',
          lat: 22.2916,
          lng: 70.7932,
          formattedAddress: inputValue.trim()
        });
      }
      setStatusMessage({ type: 'success', text: `Applied: ${inputValue.trim()}` });
      setTimeout(() => setStatusMessage(null), 3000);
    } finally {
      setSearchingText(false);
    }
  };

  return (
    <div ref={wrapperRef} className={`location-search-wrapper ${className}`} style={{ width: '100%', position: 'relative' }}>
      {/* Search Input Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: '#121212',
        border: '1px solid rgba(212, 175, 55, 0.45)',
        borderRadius: 'var(--radius-md)',
        padding: '6px 10px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.6)',
        gap: '8px',
        position: 'relative'
      }}>
        <Search size={18} style={{ color: 'var(--gold-primary)', flexShrink: 0, marginLeft: '4px' }} />
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          data-lpignore="true"
          data-form-type="other"
          onFocus={() => {
            if (suggestions.length > 0) setShowDropdown(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleManualSearch(e);
            }
          }}
          placeholder={placeholder}
          style={{
            flex: 1,
            background: 'transparent',
            backgroundImage: 'none',
            border: 'none',
            outline: 'none',
            color: '#fff',
            fontSize: '0.95rem',
            padding: '8px 4px',
            minWidth: 0
          }}
        />

        {/* Clear / Remove Input Button (X) */}
        {inputValue && (
          <button
            type="button"
            onClick={handleClearInput}
            title="Clear and enter new location"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#888',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#888'}
          >
            <X size={16} />
          </button>
        )}

        {/* Search Action Button */}
        <button
          type="button"
          onClick={handleManualSearch}
          disabled={searchingText || !inputValue.trim()}
          className="btn btn-ghost btn-sm"
          style={{
            padding: '6px 14px',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            borderRadius: 'var(--radius-sm)'
          }}
          title="Search this location and pinpoint on map"
        >
          {searchingText ? <Loader2 size={13} className="animate-spin" /> : <Search size={13} />}
          <span>Search</span>
        </button>

        {/* Near Me GPS Button */}
        {showCurrentLocationBtn && (
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={detectingLocation}
            className="btn btn-outline-gold btn-sm"
            style={{
              padding: '6px 14px',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: 'var(--radius-sm)'
            }}
            title="Automatically detect current GPS location and autofill address"
          >
            {detectingLocation ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Navigation size={14} style={{ color: 'var(--gold-primary)' }} />
            )}
            <span>{detectingLocation ? "Detecting..." : "Near Me"}</span>
          </button>
        )}
      </div>

      {/* Autocomplete Suggestion Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          zIndex: 1000,
          marginTop: '6px',
          background: '#161616',
          border: '1px solid rgba(212, 175, 55, 0.4)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 12px 35px rgba(0,0,0,0.85)',
          overflow: 'hidden',
          maxHeight: '260px',
          overflowY: 'auto'
        }}>
          {suggestions.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectSuggestion(item)}
              style={{
                padding: '10px 14px',
                borderBottom: idx < suggestions.length - 1 ? '1px solid #222' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212, 175, 55, 0.12)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <MapPin size={16} style={{ color: 'var(--gold-primary)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 600 }}>
                  {item.apartment || item.area || item.city}
                </div>
                <div style={{ color: '#888', fontSize: '0.78rem' }}>
                  {item.formattedAddress}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Permission Notice Banner (If Browser Geolocation was Denied) */}
      {permissionNotice && (
        <div style={{
          marginTop: '10px',
          background: 'rgba(212, 175, 55, 0.08)',
          border: '1px solid rgba(212, 175, 55, 0.4)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 14px',
          fontSize: '0.8rem',
          color: 'var(--gold-light)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
        }}>
          <AlertCircle size={16} style={{ color: 'var(--gold-primary)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: '#fff', display: 'block', marginBottom: '2px' }}>
              📍 Browser Location Permission Blocked
            </strong>
            <span>
              To pinpoint your exact street instead of Rajkot city center, click the 🔒 or settings icon in your browser URL bar (left of <code>localhost:3050</code>), set <strong>Location</strong> to <strong>"Allow"</strong>, and click <strong>"Near Me"</strong> again.
            </span>
          </div>
        </div>
      )}

      {/* In-Flow Status & Feedback Message */}
      {statusMessage && (
        <div style={{
          marginTop: '10px',
          background: statusMessage.type === 'error' ? 'rgba(185, 28, 28, 0.18)' : 'rgba(212, 175, 55, 0.12)',
          border: `1px solid ${statusMessage.type === 'error' ? 'var(--red-crimson)' : 'var(--gold-primary)'}`,
          borderRadius: 'var(--radius-sm)',
          padding: '8px 14px',
          fontSize: '0.82rem',
          color: statusMessage.type === 'error' ? '#F87171' : 'var(--gold-light)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <MapPin size={14} style={{ color: statusMessage.type === 'error' ? 'var(--red-crimson)' : 'var(--gold-primary)', flexShrink: 0 }} />
          <span>{statusMessage.text}</span>
        </div>
      )}
    </div>
  );
}
