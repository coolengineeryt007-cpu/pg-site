import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  PlusCircle, 
  MessageSquare, 
  UserCircle, 
  ExternalLink, 
  LogOut, 
  Menu, 
  X, 
  MapPin, 
  CheckCircle, 
  Clock, 
  FileEdit, 
  Trash2, 
  Bed, 
  Wifi, 
  Upload, 
  Navigation, 
  Eye, 
  Users, 
  ShieldCheck, 
  AlertCircle,
  Phone,
  MessageCircle,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Building
} from 'lucide-react';
import { api } from '../services/api';
import LocationSearchBar from '../components/LocationSearchBar';
import GoogleMapView from '../components/GoogleMapView';
import { reverseGeocodeCoords, getCurrentPosition, getIpLocation } from '../services/googleMaps';

export default function OwnerPanel({ 
  currentUser, 
  onSelectPg, 
  onNavigateHome, 
  onLogout,
  onOpenLogin,
  isGuestPreview = false
}) {
  const isGuest = isGuestPreview || !currentUser || currentUser?.role !== 'owner';
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'listings', 'add', 'inquiries', 'profile'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pgs, setPgs] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [editingPgId, setEditingPgId] = useState(null);
  const [listingFilter, setListingFilter] = useState('all'); // 'all', 'approved', 'pending_review', 'draft'
  const [detectingCurrentLocation, setDetectingCurrentLocation] = useState(false);

  // PG Add Form State
  const initialFormState = {
    name: '',
    propertyType: 'house',
    bhk: '2BHK',
    furnishing: 'Furnished',
    suitableFor: 'All',
    gender: 'All',
    rent: '',
    deposit: '',
    noticePeriodDays: '30',
    description: '',
    photos: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ],
    photoInput: '',
    ownerName: currentUser?.name || 'Rajesh Sharma',
    ownerPhone: currentUser?.phone || '+91 98765 43210',
    ownerWhatsapp: '+919876543210',
    address: {
      apartment: '',
      addressLine1: '',
      addressLine2: '',
      area: '',
      city: '',
      district: '',
      state: '',
      pincode: '',
      lat: 12.9716,
      lng: 77.5946
    },
    rooms: [
      { id: 'r1', type: 'Single Executive Suite', beds: 1, rent: 18000, available: 2, washroom: 'Attached', ac: true, balcony: true },
      { id: 'r2', type: 'Twin Sharing Deluxe', beds: 2, rent: 13500, available: 4, washroom: 'Attached', ac: true, balcony: false }
    ],
    facilities: [
      'High-Speed Fiber WiFi',
      '3-Time Gourmet Buffet',
      'Air Conditioning (AC)',
      'Daily Housekeeping',
      '24x7 Power Backup',
      'RO Purified Water',
      'Biometric Smart Lock',
      'CCTV Security Coverage'
    ],
    rules: [
      'Gate closes at 11:30 PM',
      'Strictly non-smoking bedrooms',
      'Quiet hours 11 PM - 6 AM'
    ]
  };

  const [formData, setFormData] = useState(initialFormState);

  const ALL_AMENITIES = [
    'High-Speed Fiber WiFi',
    '3-Time Gourmet Buffet',
    'Air Conditioning (AC)',
    'Daily Housekeeping',
    '24x7 Power Backup',
    'RO Purified Water',
    'Biometric Smart Lock',
    'CCTV Security Coverage',
    'Gym & Fitness Zone',
    'Automatic Laundry & Ironing',
    'Attached Balcony & Geyser',
    'Gaming & PS5 Lounge',
    'Reserved Bike Parking',
    'Vegetarian Kitchen Available'
  ];

  const loadOwnerData = async () => {
    setLoading(true);
    try {
      const pgRes = await api.getPgs(currentUser?.id ? { ownerId: currentUser?.id } : {});
      setPgs(pgRes.pgs || []);

      if (currentUser?.id) {
        const inqRes = await api.getInquiries(currentUser?.id);
        setInquiries(inqRes || []);
      } else {
        // Preview inquiries for guest mode
        setInquiries([
          {
            id: 'inq_preview_1',
            pgName: 'Royal Heritage Villa',
            userName: 'Priya Patel',
            userPhone: '+91 98765 43210',
            sharingType: 'Single Executive Suite',
            visitDate: 'Tomorrow, 4:00 PM',
            message: 'Looking to move in this weekend. Is room available?',
            createdAt: new Date().toISOString()
          },
          {
            id: 'inq_preview_2',
            pgName: 'Silver Palms 2BHK Residence',
            userName: 'Rahul Verma',
            userPhone: '+91 91234 56789',
            sharingType: 'Entire Flat',
            visitDate: 'Saturday, 11:00 AM',
            message: 'Family with 2 adults. Requesting physical visit.',
            createdAt: new Date(Date.now() - 86400000).toISOString()
          }
        ]);
      }
    } catch (err) {
      console.error("Error loading owner data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOwnerData();
  }, [currentUser?.id]);

  const handleLocationAutofill = (parsed) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        apartment: parsed.apartment || prev.address.apartment,
        addressLine1: parsed.addressLine1 || prev.address.addressLine1,
        addressLine2: parsed.addressLine2 || prev.address.addressLine2,
        area: parsed.area || prev.address.area,
        city: parsed.city || prev.address.city,
        district: parsed.district || prev.address.district,
        state: parsed.state || prev.address.state,
        pincode: parsed.pincode || prev.address.pincode,
        lat: Number(parsed.lat) || prev.address.lat,
        lng: Number(parsed.lng) || prev.address.lng
      }
    }));
    setMessage({ type: 'success', text: `Location auto-detected via Google Maps: ${parsed.area || parsed.city}` });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleMarkerDragEnd = async (newLat, newLng) => {
    try {
      const parsed = await reverseGeocodeCoords(newLat, newLng);
      handleLocationAutofill(parsed);
    } catch (err) {
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, lat: newLat, lng: newLng }
      }));
    }
  };

  const handleOwnerDetectCurrentLocation = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setDetectingCurrentLocation(true);
    setMessage({ type: 'info', text: 'Acquiring high-precision GPS coordinates...' });

    try {
      const pos = await getCurrentPosition();
      const parsed = await reverseGeocodeCoords(pos.lat, pos.lng);
      handleLocationAutofill(parsed);

      if (pos.permissionDenied) {
        setMessage({ 
          type: 'info', 
          text: `✓ Rajkot location detected. (Tip: To pinpoint your exact street, click the 🔒 icon next to localhost:3050 in your URL bar and set Location to Allow!)` 
        });
        setTimeout(() => setMessage(null), 7000);
      } else {
        setMessage({ 
          type: 'success', 
          text: `✓ Precise GPS Location detected: ${parsed.area || parsed.city}. Address autofilled!` 
        });
        setTimeout(() => setMessage(null), 4000);
      }
    } catch (err) {
      console.warn("Location detection error:", err);
      const ipPos = await getIpLocation();
      const parsed = await reverseGeocodeCoords(ipPos.lat, ipPos.lng);
      handleLocationAutofill(parsed);
      setMessage({ type: 'success', text: `✓ Location auto-detected: ${parsed.area || parsed.city}. Address details autofilled!` });
      setTimeout(() => setMessage(null), 4000);
    } finally {
      setDetectingCurrentLocation(false);
    }
  };

  const handleAddRoom = () => {
    const newRoom = {
      id: `r-${Date.now()}`,
      type: 'New Room Type',
      beds: 2,
      rent: formData.rent ? Number(formData.rent) : 12000,
      available: 2,
      washroom: 'Attached',
      ac: true,
      balcony: false
    };
    setFormData(prev => ({ ...prev, rooms: [...prev.rooms, newRoom] }));
  };

  const handleUpdateRoom = (index, field, value) => {
    setFormData(prev => {
      const updatedRooms = [...prev.rooms];
      updatedRooms[index] = { ...updatedRooms[index], [field]: value };
      return { ...prev, rooms: updatedRooms };
    });
  };

  const handleRemoveRoom = (index) => {
    setFormData(prev => ({
      ...prev,
      rooms: prev.rooms.filter((_, i) => i !== index)
    }));
  };

  const toggleFacility = (facility) => {
    setFormData(prev => {
      const exists = prev.facilities.includes(facility);
      return {
        ...prev,
        facilities: exists 
          ? prev.facilities.filter(f => f !== facility)
          : [...prev.facilities, facility]
      };
    });
  };

  const handleAddPhotoUrl = () => {
    if (!formData.photoInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, prev.photoInput.trim()],
      photoInput: ''
    }));
  };

  const handleSubmitPg = async (isDraft = false) => {
    if (isGuest) {
      if (onOpenLogin) onOpenLogin('owner');
      return;
    }

    if (!formData.name || !formData.rent || !formData.address.city) {
      alert("Please fill in PG Name, Monthly Rent, and City.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        isDraft,
        ownerId: currentUser?.id || 'usr-owner-1',
        ownerName: currentUser?.name || 'Property Host',
        rent: Number(formData.rent),
        deposit: Number(formData.deposit || Number(formData.rent) * 1.5),
        noticePeriodDays: Number(formData.noticePeriodDays || 30)
      };

      if (editingPgId) {
        await api.updatePg(editingPgId, payload);
        setMessage({
          type: 'success',
          text: 'Listing updated successfully!'
        });
      } else {
        await api.createPg(payload);
        setMessage({ 
          type: 'success', 
          text: isDraft 
            ? 'Draft saved successfully!' 
            : '👑 PG submitted successfully! It is now under Super Admin review. Once approved, it will appear on the public frontend.'
        });
      }

      await loadOwnerData();
      setFormData(initialFormState);
      setEditingPgId(null);
      setActiveTab('listings');
    } catch (err) {
      alert(err.message || "Failed to submit PG");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditPg = (pg) => {
    if (isGuest) {
      if (onOpenLogin) onOpenLogin('owner');
      return;
    }
    setFormData({
      name: pg.name,
      propertyType: pg.propertyType || 'house',
      bhk: pg.bhk || (pg.propertyType === 'room' ? '1RK' : '2BHK'),
      furnishing: pg.furnishing || 'Furnished',
      suitableFor: pg.suitableFor || 'All',
      gender: pg.gender || 'All',
      rent: pg.rent,
      deposit: pg.deposit,
      noticePeriodDays: pg.noticePeriodDays || 30,
      description: pg.description,
      photos: pg.photos || [],
      photoInput: '',
      ownerName: pg.ownerName,
      ownerPhone: pg.ownerPhone,
      ownerWhatsapp: pg.ownerWhatsapp,
      address: { ...pg.address },
      rooms: pg.rooms ? [...pg.rooms] : [],
      facilities: pg.facilities ? [...pg.facilities] : [],
      rules: pg.rules ? [...pg.rules] : []
    });
    setEditingPgId(pg.id);
    setActiveTab('add');
  };

  const handleDeleteOwnerPg = async (pgId) => {
    if (isGuest) {
      if (onOpenLogin) onOpenLogin('owner');
      return;
    }
    if (!window.confirm("Are you sure you want to remove this PG listing?")) return;
    try {
      await api.deletePg(pgId);
      setMessage({ type: 'success', text: "Listing removed successfully." });
      await loadOwnerData();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      alert(err.message || "Failed to delete PG");
    }
  };

  const filteredPgs = pgs.filter(p => {
    if (listingFilter === 'all') return true;
    return p.status === listingFilter;
  });

  return (
    <div className="admin-layout">
      {/* 1. LUXURY SIDEBAR */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="admin-sidebar-brand">
          <img 
            src="/logo.png" 
            alt="Vrundavan Ventures" 
            style={{ 
              height: '42px', 
              width: '42px', 
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1.5px solid rgba(212, 175, 55, 0.75)',
              boxShadow: '0 0 10px rgba(212, 175, 55, 0.4)',
              display: 'block'
            }} 
          />
          <div>
            <span className="gold-gradient-text font-serif" style={{ fontSize: '1.15rem', fontWeight: 800, display: 'block', lineHeight: 1.1 }}>
              HOST PORTAL
            </span>
            <span style={{ fontSize: '0.65rem', color: '#888', letterSpacing: '0.15em', fontWeight: 600 }}>
              VRUNDAVAN VENTURES
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="admin-nav">
          <span className="admin-nav-section">Dashboard & Operations</span>
          
          <button 
            onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
            className={`admin-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </div>
          </button>

          <button 
            onClick={() => { setActiveTab('listings'); setSidebarOpen(false); }}
            className={`admin-nav-btn ${activeTab === 'listings' ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Building size={18} />
              <span>My Properties</span>
            </div>
            <span className="badge badge-gold" style={{ fontSize: '0.7rem', padding: '2px 7px' }}>
              {pgs.length}
            </span>
          </button>

          <button 
            onClick={() => { 
              setEditingPgId(null); 
              setFormData(initialFormState); 
              setActiveTab('add'); 
              setSidebarOpen(false); 
            }}
            className={`admin-nav-btn ${activeTab === 'add' ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <PlusCircle size={18} style={{ color: 'var(--red-crimson)' }} />
              <span>Add New PG</span>
            </div>
            <span className="badge badge-crimson" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
              Maps API
            </span>
          </button>

          <span className="admin-nav-section">Leads & Inquiries</span>

          <button 
            onClick={() => { setActiveTab('inquiries'); setSidebarOpen(false); }}
            className={`admin-nav-btn ${activeTab === 'inquiries' ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MessageSquare size={18} />
              <span>Tenant Inquiries</span>
            </div>
            {inquiries.length > 0 && (
              <span className="badge badge-green" style={{ fontSize: '0.7rem', padding: '2px 7px' }}>
                {inquiries.length}
              </span>
            )}
          </button>

          <span className="admin-nav-section">Host Account</span>

          <button 
            onClick={() => { setActiveTab('profile'); setSidebarOpen(false); }}
            className={`admin-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <UserCircle size={18} />
              <span>Profile & Banking</span>
            </div>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="admin-sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '50%', background: 'var(--gold-gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#080808', fontWeight: 800, fontSize: '0.9rem'
            }}>
              {currentUser?.name?.charAt(0) || 'R'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <strong style={{ color: '#fff', fontSize: '0.85rem', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {currentUser?.name || 'Rajesh Sharma'}
              </strong>
              <span style={{ color: 'var(--gold-primary)', fontSize: '0.7rem' }}>
                👑 Unlimited Host Tier
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={onNavigateHome}
              className="btn btn-ghost btn-sm"
              style={{ flex: 1, padding: '6px', fontSize: '0.75rem' }}
              title="Return to Public Site"
            >
              <ExternalLink size={12} /> Live Site
            </button>
            <button 
              onClick={onLogout}
              className="btn btn-ghost btn-sm"
              style={{ color: '#ef4444', padding: '6px 10px' }}
              title="Sign Out"
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="admin-main">
        {/* Topbar */}
        <div className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="btn btn-ghost btn-sm"
              style={{ display: 'inline-flex', padding: '6px 10px' }}
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#888', marginBottom: '2px' }}>
                <span>Host Portal</span>
                <span>/</span>
                <span style={{ color: 'var(--gold-primary)', textTransform: 'capitalize' }}>{activeTab}</span>
              </div>
              <h1 className="font-serif gold-gradient-text" style={{ fontSize: '1.6rem', fontWeight: 800 }}>
                {activeTab === 'dashboard' && 'Host Performance Overview'}
                {activeTab === 'listings' && 'Property Management'}
                {activeTab === 'add' && (editingPgId ? 'Modify Property Listing' : 'Add New Accommodation')}
                {activeTab === 'inquiries' && 'Tenant Inquiries & Leads'}
                {activeTab === 'profile' && 'Host Profile & Payment Settings'}
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {activeTab !== 'add' && (
              <button 
                onClick={() => { 
                  if (isGuest) {
                    if (onOpenLogin) onOpenLogin('owner');
                    return;
                  }
                  setEditingPgId(null); 
                  setFormData(initialFormState); 
                  setActiveTab('add'); 
                }}
                className="btn btn-crimson btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <PlusCircle size={15} /> Add Property Listing
              </button>
            )}
          </div>
        </div>

        {/* Owner Guest Mode Notice Banner */}
        {isGuest && (
          <div style={{
            background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.16) 0%, rgba(14, 116, 237, 0.16) 100%)',
            border: '1.5px solid rgba(245, 158, 11, 0.45)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.8rem' }}>🔒</span>
              <div>
                <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 800, margin: '0 0 3px 0' }}>
                  Owner Admin Preview Mode (Half Information)
                </h4>
                <p style={{ color: '#CBD5E1', fontSize: '0.86rem', margin: 0 }}>
                  Showing how properties, occupancy, and metrics appear in the host panel. Adding/editing properties and full tenant lead contacts are locked.
                </p>
              </div>
            </div>
            <button
              onClick={() => onOpenLogin && onOpenLogin('owner')}
              className="btn btn-gold btn-sm"
              style={{ padding: '8px 22px', fontWeight: 800, fontSize: '0.9rem' }}
            >
              🔑 Login as Property Owner
            </button>
          </div>
        )}

        {/* Global Alert */}
        {message && (
          <div style={{
            background: message.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(185, 28, 28, 0.15)',
            border: `1px solid ${message.type === 'success' ? '#10B981' : '#B91C1C'}`,
            borderRadius: 'var(--radius-sm)',
            padding: '12px 18px',
            color: message.type === 'success' ? '#34D399' : '#F87171',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <CheckCircle size={18} />
            <span>{message.text}</span>
          </div>
        )}

        {/* TAB: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            {/* KPI Cards */}
            <div className="grid-4" style={{ marginBottom: '28px' }}>
              <div className="luxury-card" style={{ padding: '20px' }}>
                <span style={{ fontSize: '0.78rem', color: '#888', textTransform: 'uppercase' }}>Total Properties</span>
                <h3 style={{ fontSize: '1.9rem', color: '#fff', marginTop: '4px' }}>{pgs.length}</h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--gold-primary)' }}>Unlimited Hosting Tier</span>
              </div>

              <div className="luxury-card" style={{ padding: '20px' }}>
                <span style={{ fontSize: '0.78rem', color: '#888', textTransform: 'uppercase' }}>Live On Frontend</span>
                <h3 style={{ fontSize: '1.9rem', color: '#34D399', marginTop: '4px' }}>
                  {pgs.filter(p => p.status === 'approved').length}
                </h3>
                <span style={{ fontSize: '0.72rem', color: '#34D399' }}>Active & Discoverable</span>
              </div>

              <div className="luxury-card" style={{ padding: '20px' }}>
                <span style={{ fontSize: '0.78rem', color: '#888', textTransform: 'uppercase' }}>Pending Review</span>
                <h3 style={{ fontSize: '1.9rem', color: 'var(--gold-primary)', marginTop: '4px' }}>
                  {pgs.filter(p => p.status === 'pending_review').length}
                </h3>
                <span style={{ fontSize: '0.72rem', color: '#bbb' }}>Awaiting Super Admin</span>
              </div>

              <div className="luxury-card" style={{ padding: '20px' }}>
                <span style={{ fontSize: '0.78rem', color: '#888', textTransform: 'uppercase' }}>Total Inquiries</span>
                <h3 style={{ fontSize: '1.9rem', color: '#60A5FA', marginTop: '4px' }}>{inquiries.length}</h3>
                <span style={{ fontSize: '0.72rem', color: '#60A5FA' }}>Prospective Tenants</span>
              </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid-2" style={{ marginBottom: '30px' }}>
              <div className="luxury-card" style={{ padding: '26px' }}>
                <h3 style={{ color: '#fff', fontSize: '1.15rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building size={18} style={{ color: 'var(--gold-primary)' }} />
                  Quick Property Actions
                </h3>
                <p style={{ color: '#aaa', fontSize: '0.88rem', marginBottom: '18px' }}>
                  Use our Google Maps location wizard to onboard new rooms, manage availability, or update monthly rent.
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setActiveTab('add')} className="btn btn-gold btn-sm">
                    <PlusCircle size={15} /> Add New Property Listing
                  </button>
                  <button onClick={() => setActiveTab('listings')} className="btn btn-ghost btn-sm">
                    Manage Properties
                  </button>
                </div>
              </div>

              <div className="luxury-card" style={{ padding: '26px' }}>
                <h3 style={{ color: '#fff', fontSize: '1.15rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={18} style={{ color: 'var(--red-crimson)' }} />
                  Host Quality Checklist
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#bbb' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={14} style={{ color: '#34D399' }} /> Google Maps GPS verified pin entrance
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={14} style={{ color: '#34D399' }} /> Minimum 2 high-res interior room photos
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={14} style={{ color: '#34D399' }} /> Standardized 30-day notice period policy
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB: MY PROPERTIES */}
        {activeTab === 'listings' && (
          <div>
            {/* Status Filter Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: `All Properties (${pgs.length})` },
                { id: 'approved', label: `Approved & Live (${pgs.filter(p => p.status === 'approved').length})` },
                { id: 'pending_review', label: `Pending Review (${pgs.filter(p => p.status === 'pending_review').length})` },
                { id: 'draft', label: `Drafts (${pgs.filter(p => p.status === 'draft').length})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setListingFilter(tab.id)}
                  className={`btn btn-sm ${listingFilter === tab.id ? 'btn-gold' : 'btn-ghost'}`}
                  style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {filteredPgs.length === 0 ? (
              <div className="luxury-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
                <Building size={48} style={{ color: 'var(--gold-primary)', margin: '0 auto 16px auto', display: 'block' }} />
                <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '8px' }}>No Listings Under Current Filter</h3>
                <p style={{ color: '#888', maxWidth: '400px', margin: '0 auto 20px auto', fontSize: '0.9rem' }}>
                  Create a new rental accommodation with Google Maps autocomplete to start receiving tenant visits.
                </p>
                <button onClick={() => setActiveTab('add')} className="btn btn-gold btn-sm">
                  <PlusCircle size={15} /> Add New Property Listing
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredPgs.map((pg) => (
                  <div 
                    key={pg.id} 
                    className="luxury-card"
                    style={{
                      padding: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '20px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                      <img 
                        src={pg.photos?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=300&q=80'} 
                        alt={pg.name}
                        style={{ width: '90px', height: '70px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #333' }}
                      />
                      <div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <h4 style={{ color: '#fff', fontSize: '1.15rem' }}>{pg.name}</h4>
                          <span className={`badge ${
                            pg.propertyType === 'house' ? 'badge-gold' : pg.propertyType === 'room' ? 'badge-peacock' : 'badge-blue'
                          }`} style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                            {pg.propertyType === 'house' ? `🏠 ${pg.bhk || 'Rental House'}` : pg.propertyType === 'room' ? `🛏️ ${pg.bhk || 'Rental Room'}` : `🏢 ${pg.gender} PG`}
                          </span>
                          {pg.suitableFor && (
                            <span className="badge badge-purple" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                              👤 {pg.suitableFor}
                            </span>
                          )}
                          <span className={`badge ${
                            pg.status === 'approved' 
                              ? 'badge-green' 
                              : pg.status === 'pending_review' 
                              ? 'badge-gold' 
                              : 'badge-crimson'
                          }`}>
                            {pg.status === 'pending_review' ? 'Pending Review' : pg.status}
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', color: '#999', fontSize: '0.85rem' }}>
                          <span>📍 {pg.address.area}, {pg.address.city}</span>
                          <span>• Monthly: ₹{pg.rent.toLocaleString('en-IN')}/mo</span>
                          <span>• Deposit: ₹{pg.deposit.toLocaleString('en-IN')}</span>
                          {pg.furnishing && <span>• {pg.furnishing}</span>}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => onSelectPg(pg)}
                        className="btn btn-ghost btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                        title="Preview details"
                      >
                        <Eye size={14} /> Preview
                      </button>
                      <button 
                        onClick={() => handleEditPg(pg)}
                        className="btn btn-outline-gold btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                        title="Edit property listing"
                      >
                        <FileEdit size={14} /> Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteOwnerPg(pg.id)}
                        className="btn btn-ghost btn-sm"
                        style={{ color: '#ef4444', padding: '6px 8px' }}
                        title="Delete property listing"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: ADD / EDIT PG */}
        {activeTab === 'add' && (
          <div className="luxury-card" style={{ padding: '32px' }}>
            <div style={{ borderBottom: '1px solid rgba(212,175,55,0.2)', paddingBottom: '16px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 className="font-serif gold-gradient-text" style={{ fontSize: '1.5rem' }}>
                    {editingPgId ? 'Modify Property Listing' : 'Add New Property (House, Room, or PG)'}
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    Utilize official Google Maps API to autofill exact building name, street address, state, district, and pincode.
                  </p>
                </div>
                {editingPgId && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setEditingPgId(null);
                      setFormData(initialFormState);
                      setActiveTab('listings');
                    }}
                    className="btn btn-ghost btn-sm"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSubmitPg(false); }}>
              {/* 1. Basic Info */}
              <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building size={17} style={{ color: 'var(--gold-primary)' }} />
                1. Basic Property Information
              </h3>

              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">Property Title / Name *</label>
                  <input 
                    type="text" 
                    required 
                    className="form-input" 
                    placeholder="e.g. Harmony Heights 2BHK Flat or Greenview Room"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Property Type *</label>
                  <select 
                    className="form-select"
                    value={formData.propertyType || 'house'}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  >
                    <option value="house">🏠 Rental House / Flat (1/2/3 BHK)</option>
                    <option value="room">🛏️ Private Rental Room (1RK / Studio)</option>
                    <option value="pg">🏢 PG & Coliving Residence</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Configuration / BHK *</label>
                  <select 
                    className="form-select"
                    value={formData.bhk || '2BHK'}
                    onChange={(e) => setFormData({ ...formData, bhk: e.target.value })}
                  >
                    <option value="1RK">1RK Studio Room</option>
                    <option value="1BHK">1BHK Flat / House</option>
                    <option value="2BHK">2BHK Flat / House</option>
                    <option value="3BHK">3BHK Luxury Residence</option>
                    <option value="Villa">Independent Villa / Bunglow</option>
                    <option value="Single/Shared Bed">Single / Shared Bed (PG)</option>
                  </select>
                </div>
              </div>

              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">Tenant Preference (Suitable For)</label>
                  <select 
                    className="form-select"
                    value={formData.suitableFor || 'All'}
                    onChange={(e) => setFormData({ ...formData, suitableFor: e.target.value })}
                  >
                    <option value="All">All Tenants Welcome</option>
                    <option value="Families & Working Professionals">👨‍👩‍👧 Families & Working Professionals</option>
                    <option value="Family Only">👨‍👩‍👧 Family Only</option>
                    <option value="Working Professionals">💼 Working Professionals</option>
                    <option value="Students & Scholars">🎓 Students & Scholars</option>
                    <option value="Bachelors Only">🧑‍🤝‍🧑 Bachelors / Singles</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Furnishing Status</label>
                  <select 
                    className="form-select"
                    value={formData.furnishing || 'Furnished'}
                    onChange={(e) => setFormData({ ...formData, furnishing: e.target.value })}
                  >
                    <option value="Fully Furnished">Fully Furnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Monthly Rent (₹ / Month) *</label>
                  <input 
                    type="number" 
                    required 
                    className="form-input" 
                    placeholder="e.g. 18500"
                    value={formData.rent}
                    onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Refundable Security Deposit (₹)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="e.g. 20000"
                    value={formData.deposit}
                    onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Notice Period (Days)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={formData.noticePeriodDays}
                    onChange={(e) => setFormData({ ...formData, noticePeriodDays: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Property Description</label>
                <textarea 
                  rows={3} 
                  className="form-textarea" 
                  placeholder="Highlight luxury dining, high-speed fiber internet, housekeeping, and study facilities..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* 2. Google Maps Location & Autofill */}
              <div style={{
                background: '#0d0d0d',
                border: '1px solid rgba(212,175,55,0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
                margin: '28px 0'
              }}>
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <h3 style={{ color: '#fff', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={18} style={{ color: 'var(--red-crimson)' }} />
                      2. Interactive Map Location & Instant Autofill
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={handleOwnerDetectCurrentLocation}
                        disabled={detectingCurrentLocation}
                        className="btn btn-gold btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px' }}
                        title="Detect your device or city location and autofill address fields"
                      >
                        <Navigation size={15} />
                        <span>{detectingCurrentLocation ? 'Detecting Location...' : '📍 Use My Current Location'}</span>
                      </button>
                    </div>
                  </div>
                  <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '6px' }}>
                    Click <strong>"Use My Current Location"</strong> or search any landmark below. All address fields (building, street, city, state, pincode, lat/lng) will fill automatically!
                  </p>
                </div>

                {/* Google Places Autocomplete Search Bar */}
                <div style={{ marginBottom: '20px' }}>
                  <LocationSearchBar 
                    onLocationSelect={handleLocationAutofill}
                    placeholder="Search apartment, society, landmark, or street name..."
                    showCurrentLocationBtn={true}
                  />
                </div>

                {/* Interactive Map with Draggable Pin */}
                <div style={{ marginBottom: '20px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#aaa', display: 'block', marginBottom: '8px' }}>
                    Pinpoint Exact Entrance Pin (Drag marker to adjust):
                  </span>
                  <GoogleMapView 
                    center={{ lat: formData.address.lat, lng: formData.address.lng }}
                    zoom={15}
                    height="360px"
                    draggableMarker={true}
                    onMarkerDragEnd={handleMarkerDragEnd}
                  />
                </div>

                {/* Autofilled Address Fields */}
                <div className="grid-3">
                  <div className="form-group">
                    <label className="form-label">Apartment / House / Society Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Autofilled from Google"
                      value={formData.address.apartment}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, apartment: e.target.value }
                      })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Address Line 1</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Autofilled street name"
                      value={formData.address.addressLine1}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, addressLine1: e.target.value }
                      })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Address Line 2 / Area Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Autofilled area"
                      value={formData.address.addressLine2 || formData.address.area}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, addressLine2: e.target.value, area: e.target.value }
                      })}
                    />
                  </div>
                </div>

                <div className="grid-4">
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input 
                      type="text" 
                      required 
                      className="form-input" 
                      placeholder="City"
                      value={formData.address.city}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, city: e.target.value }
                      })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">District</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="District"
                      value={formData.address.district}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, district: e.target.value }
                      })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <input 
                      type="text" 
                      required 
                      className="form-input" 
                      placeholder="State"
                      value={formData.address.state}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, state: e.target.value }
                      })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Pincode *</label>
                    <input 
                      type="text" 
                      required 
                      className="form-input" 
                      placeholder="560001"
                      value={formData.address.pincode}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, pincode: e.target.value }
                      })}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Latitude</label>
                    <input 
                      type="number" 
                      step="any" 
                      readOnly 
                      className="form-input" 
                      value={formData.address.lat} 
                      style={{ background: '#1c1c1c', color: 'var(--gold-light)' }} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Longitude</label>
                    <input 
                      type="number" 
                      step="any" 
                      readOnly 
                      className="form-input" 
                      value={formData.address.lng} 
                      style={{ background: '#1c1c1c', color: 'var(--gold-light)' }} 
                    />
                  </div>
                </div>
              </div>

              {/* 3. Rooms & Bed Configurations */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ color: '#fff', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bed size={18} style={{ color: 'var(--gold-primary)' }} />
                    {formData.propertyType === 'house' ? '3. Bedrooms & Layout Configuration' : formData.propertyType === 'room' ? '3. Room Specifications & Features' : '3. Rooms & Bed Configurations'}
                  </h3>
                  <button type="button" onClick={handleAddRoom} className="btn btn-outline-gold btn-sm">
                    {formData.propertyType === 'house' ? '+ Add Bedroom / Unit' : formData.propertyType === 'room' ? '+ Add Room Feature' : '+ Add Room Type'}
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {formData.rooms.map((room, idx) => (
                    <div 
                      key={room.id}
                      style={{
                        background: '#111',
                        border: '1px solid #27272a',
                        borderRadius: '8px',
                        padding: '16px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr)) auto',
                        gap: '12px',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#888' }}>Room Type Name</span>
                        <input 
                          type="text"
                          className="form-input"
                          style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                          value={room.type}
                          onChange={(e) => handleUpdateRoom(idx, 'type', e.target.value)}
                        />
                      </div>

                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#888' }}>Bed Count</span>
                        <select 
                          className="form-select"
                          style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                          value={room.beds}
                          onChange={(e) => handleUpdateRoom(idx, 'beds', Number(e.target.value))}
                        >
                          <option value="1">1 Bed (Single)</option>
                          <option value="2">2 Beds (Twin)</option>
                          <option value="3">3 Beds (Triple)</option>
                          <option value="4">4 Beds (Four Sharing)</option>
                        </select>
                      </div>

                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#888' }}>Monthly Rent / Bed (₹)</span>
                        <input 
                          type="number"
                          className="form-input"
                          style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                          value={room.rent}
                          onChange={(e) => handleUpdateRoom(idx, 'rent', Number(e.target.value))}
                        />
                      </div>

                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#888' }}>Available Beds</span>
                        <input 
                          type="number"
                          className="form-input"
                          style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                          value={room.available}
                          onChange={(e) => handleUpdateRoom(idx, 'available', Number(e.target.value))}
                        />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px' }}>
                        <label style={{ fontSize: '0.8rem', color: '#aaa', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <input 
                            type="checkbox" 
                            checked={room.ac} 
                            onChange={(e) => handleUpdateRoom(idx, 'ac', e.target.checked)} 
                          />
                          AC
                        </label>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveRoom(idx)}
                          style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Facilities */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ color: '#fff', fontSize: '1.15rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Wifi size={18} style={{ color: 'var(--gold-primary)' }} />
                  4. Included Luxury Facilities
                </h3>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '10px'
                }}>
                  {ALL_AMENITIES.map((amenity) => {
                    const isChecked = formData.facilities.includes(amenity);
                    return (
                      <label 
                        key={amenity}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 14px',
                          background: isChecked ? 'rgba(212,175,55,0.1)' : '#111',
                          border: isChecked ? '1px solid var(--gold-primary)' : '1px solid #27272a',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          color: isChecked ? '#fff' : '#aaa',
                          fontSize: '0.85rem'
                        }}
                      >
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={() => toggleFacility(amenity)}
                          style={{ accentColor: 'var(--gold-primary)' }}
                        />
                        <span>{amenity}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 5. Photos */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ color: '#fff', fontSize: '1.15rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Upload size={18} style={{ color: 'var(--gold-primary)' }} />
                  5. High-Resolution Photos
                </h3>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                  <input 
                    type="url"
                    className="form-input"
                    placeholder="Paste direct image URL (Unsplash, CDN, etc.)..."
                    value={formData.photoInput}
                    onChange={(e) => setFormData({ ...formData, photoInput: e.target.value })}
                  />
                  <button type="button" onClick={handleAddPhotoUrl} className="btn btn-outline-gold btn-sm">
                    Add URL
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {formData.photos.map((url, idx) => (
                    <div key={idx} style={{ position: 'relative', width: '110px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #333' }}>
                      <img src={url} alt={`photo-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button 
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== idx) }))}
                        style={{
                          position: 'absolute', top: '2px', right: '2px',
                          background: 'rgba(0,0,0,0.7)', border: 'none', color: '#ff5555',
                          borderRadius: '40%', cursor: 'pointer', padding: '2px'
                        }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Host Contact Details */}
              <div className="grid-2" style={{ marginBottom: '32px' }}>
                <div className="form-group">
                  <label className="form-label">Host Calling Number</label>
                  <input 
                    type="tel"
                    className="form-input"
                    value={formData.ownerPhone}
                    onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Host WhatsApp Number</label>
                  <input 
                    type="tel"
                    className="form-input"
                    value={formData.ownerWhatsapp}
                    onChange={(e) => setFormData({ ...formData, ownerWhatsapp: e.target.value })}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '14px',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                paddingTop: '20px'
              }}>
                <button 
                  type="button" 
                  onClick={() => handleSubmitPg(true)} 
                  disabled={submitting} 
                  className="btn btn-ghost"
                >
                  Save as Draft
                </button>

                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="btn btn-crimson btn-lg"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <ShieldCheck size={18} />
                  <span>{submitting ? 'Submitting...' : 'Submit for Super Admin Approval'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB: INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div>
            <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '16px' }}>
              Prospective Tenant Inquiries & Visit Requests
            </h3>

            {inquiries.length === 0 ? (
              <div className="luxury-card" style={{ padding: '50px 20px', textAlign: 'center' }}>
                <Users size={40} style={{ color: 'var(--gold-primary)', margin: '0 auto 12px auto' }} />
                <h4 style={{ color: '#fff', fontSize: '1.1rem' }}>No Tenant Inquiries Yet</h4>
                <p style={{ color: '#888', fontSize: '0.85rem' }}>As soon as students schedule visits, their contact information will appear here.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {inquiries.map((inq) => (
                  <div 
                    key={inq.id}
                    className="luxury-card"
                    style={{
                      padding: '20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '16px'
                    }}
                  >
                    <div>
                      <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '4px' }}>
                        {inq.userName}
                      </h4>
                      <p style={{ color: 'var(--gold-primary)', fontSize: '0.85rem', marginBottom: '6px' }}>
                        Interested in: <strong>{inq.pgName}</strong> ({inq.sharingType})
                      </p>
                      <div style={{ display: 'flex', gap: '14px', color: '#999', fontSize: '0.85rem' }}>
                        <span>📞 {isGuest ? '+91 98765 ••••• [Locked]' : inq.userPhone}</span>
                        {inq.visitDate && <span>📅 Visit Date: {inq.visitDate}</span>}
                      </div>
                      {inq.message && (
                        <p style={{ color: '#bbb', fontSize: '0.85rem', marginTop: '6px', fontStyle: 'italic' }}>
                          "{inq.message}"
                        </p>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      {isGuest ? (
                        <button 
                          onClick={() => onOpenLogin && onOpenLogin('owner')}
                          className="btn btn-outline-gold btn-sm"
                        >
                          🔒 Login to View Contact
                        </button>
                      ) : (
                        <>
                          <a 
                            href={`https://wa.me/${inq.userPhone?.replace(/[^0-9]/g, '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-outline-gold btn-sm"
                          >
                            <MessageCircle size={14} style={{ color: '#25D366' }} /> WhatsApp Tenant
                          </a>
                          <a 
                            href={`tel:${inq.userPhone}`} 
                            className="btn btn-gold btn-sm"
                          >
                            <Phone size={14} /> Call
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: PROFILE & BANKING */}
        {activeTab === 'profile' && (
          <div className="luxury-card" style={{ padding: '35px', maxWidth: '780px' }}>
            <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '20px' }}>
              Host Verified Profile & Payout Settings
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '28px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '20px' }}>
              <div style={{
                width: '60px', height: '60px', borderRadius: '50%', background: 'var(--gold-gradient)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#080808', fontWeight: 800, fontSize: '1.4rem'
              }}>
                {currentUser?.name?.charAt(0) || 'R'}
              </div>
              <div>
                <h4 style={{ color: '#fff', fontSize: '1.2rem' }}>{currentUser?.name || 'Rajesh Sharma'}</h4>
                <span className="badge badge-gold">Verified Property Host</span>
              </div>
            </div>

            <div className="grid-2" style={{ marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Host Email</label>
                <input type="text" readOnly className="form-input" value={currentUser?.email || 'rajesh@royalpg.com'} style={{ background: '#1c1c1c' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="text" readOnly className="form-input" value={currentUser?.phone || '+91 98765 43210'} style={{ background: '#1c1c1c' }} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '25px' }}>
              <label className="form-label">Deposit Refund Escrow Account (UPI ID / Bank IFSC)</label>
              <input type="text" className="form-input" placeholder="e.g. rajesh@okaxis or HDFC0001234" defaultValue="rajesh@icici" />
              <span style={{ fontSize: '0.75rem', color: '#888', marginTop: '4px' }}>
                Used for automated refund tracking and verified zero brokerage guarantee.
              </span>
            </div>

            <button 
              onClick={() => {
                setMessage({ type: 'success', text: 'Host profile and payout settings updated successfully!' });
                setTimeout(() => setMessage(null), 3000);
              }}
              className="btn btn-gold"
            >
              Save Host Profile
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
