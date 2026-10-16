import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  MessageSquare, 
  UserCircle, 
  ExternalLink, 
  LogOut, 
  Menu, 
  X, 
  MapPin, 
  CheckCircle, 
  FileEdit, 
  Trash2, 
  Bed, 
  Wifi, 
  Upload, 
  Navigation, 
  Eye, 
  Users, 
  ShieldCheck, 
  Phone,
  MessageCircle,
  TrendingUp,
  Building,
  CreditCard,
  RefreshCw,
  Home,
  DoorClosed,
  Car,
  Utensils,
  Coffee,
  Sparkles,
  Clock,
  Compass,
  Maximize2,
  Layers
} from 'lucide-react';
import { api } from '../services/api';
import LocationSearchBar from '../components/LocationSearchBar';
import GoogleMapView from '../components/GoogleMapView';
import OwnerSubscriptionModal from '../components/OwnerSubscriptionModal';
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
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [editingPgId, setEditingPgId] = useState(null);
  const [listingFilter, setListingFilter] = useState('all'); // 'all', 'approved', 'pending_review', 'draft'
  const [detectingCurrentLocation, setDetectingCurrentLocation] = useState(false);
  const [subscription, setSubscription] = useState(currentUser?.subscription || null);
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [deductingAutopay, setDeductingAutopay] = useState(false);
  const [receiptModalInvoice, setReceiptModalInvoice] = useState(null);

  // PG / Room / Flat Add Form State
  const initialFormState = {
    name: '',
    propertyType: 'house', // 'house' (Flat), 'room' (Private Room), 'pg' (PG / Coliving)
    
    // Flat / House specifics
    bhk: '2BHK',
    bathrooms: '2',
    balconies: '1',
    carpetAreaSqft: '1050',
    floorNo: '3',
    totalFloors: '5',
    parking: '1 Covered Car + Bike Parking',
    maintenanceCharges: 'Included in Rent',
    maintenanceAmount: '',
    facingDirection: 'East Facing',

    // PG specifics
    gender: 'Co-ed', // 'Boys', 'Girls', 'Co-ed'
    mealsIncluded: '3 Daily Meals (Breakfast, Lunch & Dinner)',
    curfewTime: '11:00 PM',
    wardenAvailable: 'Yes (Onsite 24x7)',

    // Room specifics
    roomSubtype: '1RK Studio Room',
    washroomType: 'Attached Private',
    kitchenSetup: 'Private Kitchenette',
    privateEntry: 'Yes (Separate Key / Direct Entry)',
    roomBalcony: 'Attached Balcony',
    roomSize: '180 Sq.Ft (14x13 ft)',
    bedSetup: 'Queen / Double Bed',
    electricityCharges: 'Separate Sub-Meter',

    // Common fields
    furnishing: 'Fully Furnished',
    suitableFor: 'All Tenants Welcome',
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
      { id: 'r1', type: 'Master Bedroom', beds: 1, rent: 18000, available: 1, washroom: 'Attached', ac: true, balcony: true, wardrobe: 'Built-in Wardrobe' },
      { id: 'r2', type: 'Second Bedroom', beds: 1, rent: 14000, available: 1, washroom: 'Common', ac: false, balcony: false, wardrobe: 'Built-in Wardrobe' }
    ],
    facilities: [
      'High-Speed Passenger Lifts / Elevators',
      'Covered Car Parking',
      '24x7 Gated Security & CCTV',
      '100% Power Backup',
      'Piped Natural Gas (PNG / Gas Line)',
      'Modular Kitchen with Chimney'
    ],
    rules: [
      'Gate closes at 11:30 PM',
      'Strictly non-smoking bedrooms',
      'Quiet hours 11 PM - 6 AM'
    ]
  };

  const [formData, setFormData] = useState(initialFormState);

  const PG_AMENITIES = [
    '3 Daily Meals (Breakfast, Lunch & Dinner)',
    'Daily Room Housekeeping',
    'High-Speed Fiber WiFi',
    'RO Purified Drinking Water',
    'Air Conditioning (AC)',
    'Washing Machine & Laundry',
    '24x7 Power Backup',
    'Geyser / Hot Water',
    'Digital Door Lock',
    'CCTV Security Coverage',
    'Attached Balcony',
    'Common TV & Lounge Area',
    'Reserved Bike Parking',
    'Pure Veg Food Available'
  ];

  const ROOM_AMENITIES = [
    'High-Speed Fiber WiFi',
    'Air Conditioning (AC)',
    'Geyser / Hot Water',
    'Attached Private Washroom',
    'Attached Private Balcony',
    'Wardrobe & Cupboard',
    'Study Desk & Chair',
    'Washing Machine Access',
    'RO Drinking Water',
    'Mini Refrigerator',
    '24x7 Power Backup',
    'Two-Wheeler / Bike Parking',
    'Independent Separate Key / Entry',
    'CCTV & Gated Building Security'
  ];

  const FLAT_AMENITIES = [
    'High-Speed Passenger Lifts / Elevators',
    'Covered Car Parking',
    '24x7 Gated Security & CCTV',
    '100% Power Backup',
    'Piped Natural Gas (PNG / Gas Line)',
    'Modular Kitchen with Chimney',
    'Swimming Pool & Clubhouse',
    'Children Play Area & Park',
    'Gym & Fitness Centre',
    '24x7 Water Supply',
    'Intercom & Video Doorbell',
    'Reserved Bike Parking',
    'Air Conditioning (AC)',
    'Pet Friendly Society'
  ];

  const getCategoryAmenities = (type) => {
    if (type === 'pg') return PG_AMENITIES;
    if (type === 'room') return ROOM_AMENITIES;
    return FLAT_AMENITIES;
  };

  const handleCategoryChange = (newType) => {
    let newFacilities = [];
    let newRooms = [];
    if (newType === 'pg') {
      newFacilities = [
        '3 Daily Meals (Breakfast, Lunch & Dinner)',
        'Daily Room Housekeeping',
        'High-Speed Fiber WiFi',
        'RO Purified Drinking Water',
        'Air Conditioning (AC)',
        'Washing Machine & Laundry',
        '24x7 Power Backup',
        'Geyser / Hot Water'
      ];
      newRooms = [
        { id: 'r1', type: 'Single Executive Suite', beds: 1, rent: Number(formData.rent) || 16000, available: 2, washroom: 'Attached', ac: true, balcony: true },
        { id: 'r2', type: 'Twin Sharing Deluxe', beds: 2, rent: Number(formData.rent) ? Math.round(Number(formData.rent) * 0.7) : 12000, available: 4, washroom: 'Attached', ac: true, balcony: false }
      ];
    } else if (newType === 'room') {
      newFacilities = [
        'High-Speed Fiber WiFi',
        'Air Conditioning (AC)',
        'Geyser / Hot Water',
        'Attached Private Washroom',
        'Attached Private Balcony',
        'Wardrobe & Cupboard',
        'Study Desk & Chair',
        '24x7 Power Backup'
      ];
      newRooms = [
        { id: 'r1', type: 'Private 1RK Studio Room', beds: 1, rent: Number(formData.rent) || 12000, available: 1, washroom: 'Attached', ac: true, balcony: true }
      ];
    } else {
      newFacilities = [
        'High-Speed Passenger Lifts / Elevators',
        'Covered Car Parking',
        '24x7 Gated Security & CCTV',
        '100% Power Backup',
        'Piped Natural Gas (PNG / Gas Line)',
        'Modular Kitchen with Chimney'
      ];
      newRooms = [
        { id: 'r1', type: 'Master Bedroom', beds: 1, rent: Number(formData.rent) || 20000, available: 1, washroom: 'Attached', ac: true, balcony: true, wardrobe: 'Built-in Wardrobe' },
        { id: 'r2', type: 'Second Bedroom', beds: 1, rent: 0, available: 1, washroom: 'Common', ac: false, balcony: false, wardrobe: 'Built-in Wardrobe' }
      ];
    }

    setFormData(prev => ({
      ...prev,
      propertyType: newType,
      facilities: newFacilities,
      rooms: prev.rooms && prev.rooms.length > 0 && prev.propertyType === newType ? prev.rooms : newRooms
    }));
  };

  const loadOwnerData = async () => {
    setLoading(true);
    try {
      const pgRes = await api.getPgs(currentUser?.id ? { ownerId: currentUser?.id } : {});
      setPgs(pgRes.pgs || []);

      if (currentUser?.id) {
        const inqRes = await api.getInquiries(currentUser?.id);
        setInquiries(inqRes || []);

        try {
          const subRes = await api.getSubscription(currentUser.id);
          if (subRes) setSubscription(subRes);
        } catch {
          // Fallback to existing user subscription
        }
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
    }
  };

  useEffect(() => {
    loadOwnerData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      console.warn('Location parse error:', err);
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
    if (formData.propertyType === 'pg') {
      const newRoom = {
        id: `r-${Date.now()}`,
        type: 'Triple Sharing Room',
        beds: 3,
        rent: formData.rent ? Math.round(Number(formData.rent) * 0.7) : 10000,
        available: 3,
        washroom: 'Attached',
        ac: true,
        balcony: false
      };
      setFormData(prev => ({ ...prev, rooms: [...prev.rooms, newRoom] }));
    } else if (formData.propertyType === 'room') {
      const newRoom = {
        id: `r-${Date.now()}`,
        type: 'Attached Balcony / Study Nook',
        beds: 1,
        rent: 0,
        available: 1,
        washroom: 'Attached',
        ac: true,
        balcony: true
      };
      setFormData(prev => ({ ...prev, rooms: [...prev.rooms, newRoom] }));
    } else {
      const newRoom = {
        id: `r-${Date.now()}`,
        type: `Bedroom ${(formData.rooms?.length || 0) + 1}`,
        beds: 1,
        rent: 0,
        available: 1,
        washroom: 'Attached',
        ac: true,
        balcony: true,
        wardrobe: 'Built-in Wardrobe'
      };
      setFormData(prev => ({ ...prev, rooms: [...prev.rooms, newRoom] }));
    }
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

    if (subscription?.status !== 'active') {
      setSubModalOpen(true);
      setMessage({
        type: 'error',
        text: '👑 Host Partnership Subscription (₹99 Activation + ₹99/30-day Autopay) is required before listing properties.'
      });
      return;
    }

    if (!formData.name || !formData.rent || !formData.address.city) {
      alert("Please fill in Property Name, Monthly Rent, and City.");
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
        const typeLabel = formData.propertyType === 'house' ? 'Rental Flat' : formData.propertyType === 'room' ? 'Private Room' : 'PG Residence';
        setMessage({ 
          type: 'success', 
          text: isDraft 
            ? 'Draft saved successfully!' 
            : `👑 ${typeLabel} submitted successfully! It is now under Super Admin review. Once approved, it will appear on the public frontend.`
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
      name: pg.name || '',
      propertyType: pg.propertyType || (pg.bhk === '1RK' ? 'room' : 'house'),
      bhk: pg.bhk || (pg.propertyType === 'room' ? '1RK' : '2BHK'),
      bathrooms: pg.bathrooms || '2',
      balconies: pg.balconies || '1',
      carpetAreaSqft: pg.carpetAreaSqft || '1050',
      floorNo: pg.floorNo || '3',
      totalFloors: pg.totalFloors || '5',
      parking: pg.parking || '1 Covered Car + Bike Parking',
      maintenanceCharges: pg.maintenanceCharges || 'Included in Rent',
      maintenanceAmount: pg.maintenanceAmount || '',
      facingDirection: pg.facingDirection || 'East Facing',
      gender: pg.gender || 'Co-ed',
      mealsIncluded: pg.mealsIncluded || '3 Daily Meals (Breakfast, Lunch & Dinner)',
      curfewTime: pg.curfewTime || '11:00 PM',
      wardenAvailable: pg.wardenAvailable || 'Yes (Onsite 24x7)',
      roomSubtype: pg.roomSubtype || '1RK Studio Room',
      washroomType: pg.washroomType || 'Attached Private',
      kitchenSetup: pg.kitchenSetup || 'Private Kitchenette',
      privateEntry: pg.privateEntry || 'Yes (Separate Key / Direct Entry)',
      roomBalcony: pg.roomBalcony || 'Attached Balcony',
      roomSize: pg.roomSize || '180 Sq.Ft (14x13 ft)',
      bedSetup: pg.bedSetup || 'Queen / Double Bed',
      electricityCharges: pg.electricityCharges || 'Separate Sub-Meter',
      furnishing: pg.furnishing || 'Fully Furnished',
      suitableFor: pg.suitableFor || 'All',
      rent: pg.rent || '',
      deposit: pg.deposit || '',
      noticePeriodDays: pg.noticePeriodDays || 30,
      description: pg.description || '',
      photos: pg.photos || [],
      photoInput: '',
      ownerName: pg.ownerName || currentUser?.name || 'Property Host',
      ownerPhone: pg.ownerPhone || currentUser?.phone || '',
      ownerWhatsapp: pg.ownerWhatsapp || '',
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

  const handleTriggerAutopayTest = async () => {
    if (!currentUser?.id) return;
    setDeductingAutopay(true);
    try {
      const res = await api.deductRecurringAutopay(currentUser.id);
      setSubscription(res.subscription);
      setMessage({
        type: 'success',
        text: res.message || '₹99 recurring autopay payment successfully deducted! Next cycle extended by 30 days.'
      });
      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      alert(err.message || 'Failed to trigger recurring deduction');
    } finally {
      setDeductingAutopay(false);
    }
  };

  const handleCancelAutopay = async () => {
    if (!window.confirm('Are you sure you want to cancel your ₹99/30-day autopay mandate? You will lose automatic listing promotion upon cycle expiry.')) return;
    try {
      const res = await api.cancelSubscription(currentUser.id);
      setSubscription(res.subscription);
      setMessage({
        type: 'success',
        text: res.message || 'Autopay mandate cancelled.'
      });
      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      alert(err.message || 'Failed to cancel autopay');
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
        <div className="admin-sidebar-brand" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', padding: '18px 20px' }}>
          <img 
            src="/logo.png" 
            alt="Vrundavan Ventures" 
            style={{ 
              height: '46px', 
              width: 'auto', 
              maxWidth: '220px',
              objectFit: 'contain',
              display: 'block'
            }} 
          />
          <span style={{ 
            fontSize: '0.66rem', 
            letterSpacing: '0.12em', 
            fontWeight: 700, 
            color: 'var(--gold-primary)',
            textTransform: 'uppercase',
            padding: '2px 8px',
            background: 'rgba(212, 175, 55, 0.1)',
            borderRadius: '4px',
            border: '1px solid rgba(212, 175, 55, 0.25)'
          }}>
            Host & Landlord Portal
          </span>
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

          <span className="admin-nav-section">Host Account & Billing</span>

          <button 
            onClick={() => { setActiveTab('subscription'); setSidebarOpen(false); }}
            className={`admin-nav-btn ${activeTab === 'subscription' ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CreditCard size={18} style={{ color: '#facc15' }} />
              <span>Subscription & Autopay</span>
            </div>
            <span 
              className={`badge ${subscription?.status === 'active' ? 'badge-green' : 'badge-crimson'}`} 
              style={{ fontSize: '0.65rem', padding: '2px 6px', fontWeight: 800 }}
            >
              {subscription?.status === 'active' ? 'Active' : '₹99 Due'}
            </span>
          </button>

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
                {activeTab === 'subscription' && 'Host Subscription & Autopay Management'}
                {activeTab === 'profile' && 'Host Profile & Payment Settings'}
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={onNavigateHome}
              className="btn btn-ghost btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
              title="Return to Public Site"
            >
              <ExternalLink size={14} /> Live Site
            </button>
            <button 
              onClick={onLogout}
              className="btn btn-ghost btn-sm"
              style={{ color: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem' }}
              title="Sign Out"
            >
              <LogOut size={14} /> Sign Out
            </button>
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

        {/* Subscription Pending Alert Banner for logged in hosts */}
        {!isGuest && subscription && subscription.status !== 'active' && (
          <div style={{
            background: 'linear-gradient(90deg, rgba(234, 179, 8, 0.18) 0%, rgba(239, 68, 68, 0.18) 100%)',
            border: '1.5px solid rgba(234, 179, 8, 0.45)',
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
              <span style={{ fontSize: '1.8rem' }}>👑</span>
              <div>
                <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 800, margin: '0 0 3px 0' }}>
                  Host Partnership Subscription Required (₹99 One-Time + ₹99 Autopay)
                </h4>
                <p style={{ color: '#CBD5E1', fontSize: '0.86rem', margin: 0 }}>
                  Complete your ₹99 activation to list properties, unlock verified host badges, and access student leads.
                </p>
              </div>
            </div>
            <button
              onClick={() => setSubModalOpen(true)}
              className="btn btn-gold btn-sm"
              style={{ fontWeight: 800, padding: '8px 16px' }}
            >
              Activate ₹99 Autopay Now
            </button>
          </div>
        )}

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
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=300&q=80';
                        }}
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
              {/* Category Selector Tabs */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <label className="form-label" style={{ fontSize: '0.92rem', margin: 0, color: 'var(--gold-light)', fontWeight: 700 }}>
                    Select Property Category *
                  </label>
                  <span style={{ fontSize: '0.8rem', color: '#888' }}>Fields will instantly adapt based on selection</span>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '12px'
                }}>
                  <button
                    type="button"
                    onClick={() => handleCategoryChange('house')}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '16px',
                      background: formData.propertyType === 'house' ? 'rgba(212, 175, 55, 0.15)' : '#141414',
                      border: formData.propertyType === 'house' ? '2px solid var(--gold-primary)' : '1px solid #27272a',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      boxShadow: formData.propertyType === 'house' ? '0 0 16px rgba(212,175,55,0.22)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '1.4rem' }}>🏠</span>
                      <span style={{ 
                        fontWeight: 700, 
                        color: formData.propertyType === 'house' ? '#fff' : '#ccc',
                        fontSize: '0.96rem'
                      }}>
                        Rental Flat / House
                      </span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: formData.propertyType === 'house' ? 'var(--gold-light)' : '#888' }}>
                      1BHK, 2BHK, 3BHK, 4BHK+, Villa & Independent Floor
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCategoryChange('room')}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '16px',
                      background: formData.propertyType === 'room' ? 'rgba(212, 175, 55, 0.15)' : '#141414',
                      border: formData.propertyType === 'room' ? '2px solid var(--gold-primary)' : '1px solid #27272a',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      boxShadow: formData.propertyType === 'room' ? '0 0 16px rgba(212,175,55,0.22)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '1.4rem' }}>🛏️</span>
                      <span style={{ 
                        fontWeight: 700, 
                        color: formData.propertyType === 'room' ? '#fff' : '#ccc',
                        fontSize: '0.96rem'
                      }}>
                        Private Rental Room
                      </span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: formData.propertyType === 'room' ? 'var(--gold-light)' : '#888' }}>
                      1RK Studio, Single Private Bedroom, Master Bed with Bath
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCategoryChange('pg')}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '16px',
                      background: formData.propertyType === 'pg' ? 'rgba(212, 175, 55, 0.15)' : '#141414',
                      border: formData.propertyType === 'pg' ? '2px solid var(--gold-primary)' : '1px solid #27272a',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      boxShadow: formData.propertyType === 'pg' ? '0 0 16px rgba(212,175,55,0.22)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '1.4rem' }}>🏢</span>
                      <span style={{ 
                        fontWeight: 700, 
                        color: formData.propertyType === 'pg' ? '#fff' : '#ccc',
                        fontSize: '0.96rem'
                      }}>
                        PG & Coliving Residence
                      </span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: formData.propertyType === 'pg' ? 'var(--gold-light)' : '#888' }}>
                      Boys, Girls, Co-ed with 3 Meals & Daily Housekeeping
                    </span>
                  </button>
                </div>
              </div>

              {/* Category Active Banner */}
              <div style={{
                background: 'rgba(212, 175, 55, 0.05)',
                border: '1px solid rgba(212, 175, 55, 0.22)',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Sparkles size={18} style={{ color: 'var(--gold-primary)' }} />
                <span style={{ fontSize: '0.88rem', color: '#e5e7eb' }}>
                  Showing fields customized specifically for: <strong style={{ color: 'var(--gold-primary)' }}>
                    {formData.propertyType === 'house' && '🏠 Rental Flat / Apartment / House'}
                    {formData.propertyType === 'room' && '🛏️ Private Room / 1RK Studio'}
                    {formData.propertyType === 'pg' && '🏢 PG & Coliving Residence'}
                  </strong>
                </span>
              </div>

              {/* 1. Basic Info */}
              <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building size={17} style={{ color: 'var(--gold-primary)' }} />
                1. Basic Property Information
              </h3>

              <div className="grid-2" style={{ marginBottom: '16px' }}>
                <div className="form-group">
                  <label className="form-label">
                    {formData.propertyType === 'house' && 'Flat / Apartment Title *'}
                    {formData.propertyType === 'room' && 'Room Title *'}
                    {formData.propertyType === 'pg' && 'PG / Coliving Residence Name *'}
                  </label>
                  <input 
                    type="text" 
                    required 
                    className="form-input" 
                    placeholder={
                      formData.propertyType === 'house' ? 'e.g. Prestige Green 3BHK Luxury Flat' :
                      formData.propertyType === 'room' ? 'e.g. Sunny Private 1RK Studio with Balcony' :
                      'e.g. Royal Grand Luxury PG & Coliving'
                    }
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="owner-property-type">Property Category *</label>
                  <select 
                    id="owner-property-type"
                    aria-label="Property Category"
                    className="form-select"
                    value={formData.propertyType || 'house'}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                  >
                    <option value="house">🏠 Rental House / Flat (1/2/3/4 BHK)</option>
                    <option value="room">🛏️ Private Rental Room (1RK / Studio)</option>
                    <option value="pg">🏢 PG & Coliving Residence</option>
                  </select>
                </div>
              </div>

              {/* CATEGORY A: Flat / House Specific Fields */}
              {formData.propertyType === 'house' && (
                <>
                  <div className="grid-3">
                    <div className="form-group">
                      <label className="form-label" htmlFor="flat-bhk-select">Configuration / BHK *</label>
                      <select 
                        id="flat-bhk-select"
                        className="form-select"
                        value={formData.bhk || '2BHK'}
                        onChange={(e) => setFormData({ ...formData, bhk: e.target.value })}
                      >
                        <option value="1BHK">1BHK Apartment</option>
                        <option value="2BHK">2BHK Standard Flat</option>
                        <option value="3BHK">3BHK Luxury Residence</option>
                        <option value="4BHK">4BHK Executive Flat</option>
                        <option value="5+ BHK">5+ BHK Penthouse</option>
                        <option value="Villa">Independent Villa / Bungalow</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Total Bathrooms *</label>
                      <select 
                        className="form-select"
                        value={formData.bathrooms || '2'}
                        onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                      >
                        <option value="1">1 Bathroom</option>
                        <option value="2">2 Bathrooms</option>
                        <option value="3">3 Bathrooms</option>
                        <option value="4">4 Bathrooms</option>
                        <option value="5+">5+ Bathrooms</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Total Balconies</label>
                      <select 
                        className="form-select"
                        value={formData.balconies || '1'}
                        onChange={(e) => setFormData({ ...formData, balconies: e.target.value })}
                      >
                        <option value="0">No Balcony</option>
                        <option value="1">1 Balcony</option>
                        <option value="2">2 Balconies</option>
                        <option value="3">3 Balconies</option>
                        <option value="4+">4+ Balconies</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid-4">
                    <div className="form-group">
                      <label className="form-label">Carpet Area (Sq.Ft.) *</label>
                      <input 
                        type="number" 
                        required 
                        className="form-input" 
                        placeholder="e.g. 1150"
                        value={formData.carpetAreaSqft || ''}
                        onChange={(e) => setFormData({ ...formData, carpetAreaSqft: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Floor Number</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. 3rd Floor"
                        value={formData.floorNo || ''}
                        onChange={(e) => setFormData({ ...formData, floorNo: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Total Floors in Building</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. 8 Floors"
                        value={formData.totalFloors || ''}
                        onChange={(e) => setFormData({ ...formData, totalFloors: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Facing Direction</label>
                      <select 
                        className="form-select"
                        value={formData.facingDirection || 'East Facing'}
                        onChange={(e) => setFormData({ ...formData, facingDirection: e.target.value })}
                      >
                        <option value="East Facing">East Facing</option>
                        <option value="North Facing">North Facing</option>
                        <option value="North-East Facing">North-East Facing</option>
                        <option value="West Facing">West Facing</option>
                        <option value="South Facing">South Facing</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid-3">
                    <div className="form-group">
                      <label className="form-label">Dedicated Parking *</label>
                      <select 
                        className="form-select"
                        value={formData.parking || '1 Covered Car + Bike Parking'}
                        onChange={(e) => setFormData({ ...formData, parking: e.target.value })}
                      >
                        <option value="1 Covered Car + Bike Parking">1 Covered Car + Bike Parking</option>
                        <option value="2 Covered Car Parking">2 Covered Car Parking</option>
                        <option value="Open Car Parking">Open Car Parking</option>
                        <option value="Bike Parking Only">Bike Parking Only</option>
                        <option value="No Dedicated Parking">No Dedicated Parking</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Furnishing Status *</label>
                      <select 
                        className="form-select"
                        value={formData.furnishing || 'Fully Furnished'}
                        onChange={(e) => setFormData({ ...formData, furnishing: e.target.value })}
                      >
                        <option value="Fully Furnished">Fully Furnished</option>
                        <option value="Semi-Furnished">Semi-Furnished</option>
                        <option value="Unfurnished">Unfurnished</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Tenant Preference (Suitable For)</label>
                      <select 
                        className="form-select"
                        value={formData.suitableFor || 'All Tenants Welcome'}
                        onChange={(e) => setFormData({ ...formData, suitableFor: e.target.value })}
                      >
                        <option value="All Tenants Welcome">All Tenants Welcome</option>
                        <option value="Families Only">👨‍👩‍👧 Families Only</option>
                        <option value="Working Professionals">💼 Working Professionals</option>
                        <option value="Bachelors & Singles Allowed">🧑‍🤝‍🧑 Bachelors / Singles Allowed</option>
                        <option value="Corporate Lease">🏢 Corporate Lease</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid-3">
                    <div className="form-group">
                      <label className="form-label">Monthly Rent (₹ / Month) *</label>
                      <input 
                        type="number" 
                        required 
                        className="form-input" 
                        placeholder="e.g. 28000"
                        value={formData.rent}
                        onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Maintenance Charges</label>
                      <select 
                        className="form-select"
                        value={formData.maintenanceCharges || 'Included in Rent'}
                        onChange={(e) => setFormData({ ...formData, maintenanceCharges: e.target.value })}
                      >
                        <option value="Included in Rent">Included in Rent</option>
                        <option value="Extra Monthly Charge">Extra ₹ / Month</option>
                      </select>
                    </div>

                    {formData.maintenanceCharges === 'Extra Monthly Charge' ? (
                      <div className="form-group">
                        <label className="form-label">Maintenance Amount (₹ / Month)</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          placeholder="e.g. 2500"
                          value={formData.maintenanceAmount || ''}
                          onChange={(e) => setFormData({ ...formData, maintenanceAmount: e.target.value })}
                        />
                      </div>
                    ) : (
                      <div className="form-group">
                        <label className="form-label">Refundable Security Deposit (₹)</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          placeholder="e.g. 50000"
                          value={formData.deposit}
                          onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid-2">
                    {formData.maintenanceCharges === 'Extra Monthly Charge' && (
                      <div className="form-group">
                        <label className="form-label">Refundable Security Deposit (₹)</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          placeholder="e.g. 50000"
                          value={formData.deposit}
                          onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                        />
                      </div>
                    )}
                    <div className="form-group">
                      <label className="form-label">Notice Period (Days)</label>
                      <input 
                        type="number" 
                        aria-label="Notice Period (Days)"
                        placeholder="30"
                        className="form-input" 
                        value={formData.noticePeriodDays}
                        onChange={(e) => setFormData({ ...formData, noticePeriodDays: e.target.value })}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* CATEGORY B: Room Specific Fields */}
              {formData.propertyType === 'room' && (
                <>
                  <div className="grid-3">
                    <div className="form-group">
                      <label className="form-label">Room Subtype *</label>
                      <select 
                        className="form-select"
                        value={formData.roomSubtype || '1RK Studio Room'}
                        onChange={(e) => setFormData({ ...formData, roomSubtype: e.target.value, bhk: '1RK' })}
                      >
                        <option value="1RK Studio Room">1RK Studio Apartment</option>
                        <option value="Private Single Bedroom">Single Private Bedroom</option>
                        <option value="Master Bedroom with Attached Bath">Master Bedroom with Attached Bath</option>
                        <option value="Penthouse Studio Room">Penthouse Studio Room</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Washroom Setup *</label>
                      <select 
                        className="form-select"
                        value={formData.washroomType || 'Attached Private'}
                        onChange={(e) => setFormData({ ...formData, washroomType: e.target.value })}
                      >
                        <option value="Attached Private">Attached Private Washroom</option>
                        <option value="Dedicated Outside">Dedicated Private Washroom (Outside)</option>
                        <option value="Shared Washroom">Shared Washroom</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Kitchen / Cooking Setup *</label>
                      <select 
                        className="form-select"
                        value={formData.kitchenSetup || 'Private Kitchenette'}
                        onChange={(e) => setFormData({ ...formData, kitchenSetup: e.target.value })}
                      >
                        <option value="Private Kitchenette">Private Kitchenette / Cooking Slab</option>
                        <option value="Shared Kitchen Access">Shared Kitchen Access</option>
                        <option value="No Cooking Allowed">No Cooking Allowed</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid-4">
                    <div className="form-group">
                      <label className="form-label">Private Entry / Gate *</label>
                      <select 
                        className="form-select"
                        value={formData.privateEntry || 'Yes (Separate Key / Direct Entry)'}
                        onChange={(e) => setFormData({ ...formData, privateEntry: e.target.value })}
                      >
                        <option value="Yes (Separate Key / Direct Entry)">Yes (Independent Key & Direct Entry)</option>
                        <option value="Shared Main Entrance">Shared Main Entrance</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Balcony / Terrace</label>
                      <select 
                        className="form-select"
                        value={formData.roomBalcony || 'Attached Balcony'}
                        onChange={(e) => setFormData({ ...formData, roomBalcony: e.target.value })}
                      >
                        <option value="Attached Balcony">Attached Private Balcony</option>
                        <option value="French Window">French Window / Large Window</option>
                        <option value="No Balcony">No Balcony</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Room Dimensions / Size</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. 180 Sq.Ft (14x13 ft)"
                        value={formData.roomSize || ''}
                        onChange={(e) => setFormData({ ...formData, roomSize: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Bed Setup Provided</label>
                      <select 
                        className="form-select"
                        value={formData.bedSetup || 'Queen / Double Bed'}
                        onChange={(e) => setFormData({ ...formData, bedSetup: e.target.value })}
                      >
                        <option value="Queen / Double Bed">Queen / Double Bed Provided</option>
                        <option value="Single Bed">Single Bed Provided</option>
                        <option value="Unfurnished">Unfurnished / Bring Own Bed</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid-3">
                    <div className="form-group">
                      <label className="form-label">Electricity Charges *</label>
                      <select 
                        className="form-select"
                        value={formData.electricityCharges || 'Separate Sub-Meter'}
                        onChange={(e) => setFormData({ ...formData, electricityCharges: e.target.value })}
                      >
                        <option value="Separate Sub-Meter">Separate Sub-Meter (Pay Per Unit)</option>
                        <option value="Included in Rent">Included in Monthly Rent</option>
                        <option value="Fixed ₹500/Month">Fixed ₹500 / Month Split</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Furnishing Status</label>
                      <select 
                        className="form-select"
                        value={formData.furnishing || 'Fully Furnished'}
                        onChange={(e) => setFormData({ ...formData, furnishing: e.target.value })}
                      >
                        <option value="Fully Furnished">Fully Furnished</option>
                        <option value="Semi-Furnished">Semi-Furnished</option>
                        <option value="Unfurnished">Unfurnished</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Tenant Preference</label>
                      <select 
                        className="form-select"
                        value={formData.suitableFor || 'All Tenants Welcome'}
                        onChange={(e) => setFormData({ ...formData, suitableFor: e.target.value })}
                      >
                        <option value="All Tenants Welcome">All Bachelors & Singles</option>
                        <option value="Working Professionals">💼 Working Professionals</option>
                        <option value="Students & Scholars">🎓 Students & Scholars</option>
                        <option value="Female Only">👩 Female Tenants Only</option>
                        <option value="Male Only">👨 Male Tenants Only</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid-3">
                    <div className="form-group">
                      <label className="form-label">Monthly Room Rent (₹ / Month) *</label>
                      <input 
                        type="number" 
                        required 
                        className="form-input" 
                        placeholder="e.g. 12000"
                        value={formData.rent}
                        onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Refundable Security Deposit (₹)</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="e.g. 15000"
                        value={formData.deposit}
                        onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Notice Period (Days)</label>
                      <input 
                        type="number" 
                        aria-label="Notice Period (Days)"
                        placeholder="30"
                        className="form-input" 
                        value={formData.noticePeriodDays}
                        onChange={(e) => setFormData({ ...formData, noticePeriodDays: e.target.value })}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* CATEGORY C: PG / Coliving Specific Fields */}
              {formData.propertyType === 'pg' && (
                <>
                  <div className="grid-3">
                    <div className="form-group">
                      <label className="form-label">Gender Policy *</label>
                      <select 
                        className="form-select"
                        value={formData.gender || 'Co-ed'}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      >
                        <option value="Co-ed">👫 Co-ed Coliving (All Welcome)</option>
                        <option value="Boys">👨 Boys PG Only</option>
                        <option value="Girls">👩 Girls PG Only</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Food & Meals Policy *</label>
                      <select 
                        className="form-select"
                        value={formData.mealsIncluded || '3 Daily Meals (Breakfast, Lunch & Dinner)'}
                        onChange={(e) => setFormData({ ...formData, mealsIncluded: e.target.value })}
                      >
                        <option value="3 Daily Meals (Breakfast, Lunch & Dinner)">🍽️ 3 Daily Meals (Breakfast, Lunch & Dinner)</option>
                        <option value="2 Meals (Breakfast & Dinner)">🍛 2 Meals (Breakfast & Dinner)</option>
                        <option value="Breakfast Only">☕ Breakfast Only</option>
                        <option value="No Food / Self Cooking">🍳 Self Cooking / No Food</option>
                        <option value="Pure Veg Food Only">🥗 Pure Veg Food Only</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Curfew / Gate Closing Time *</label>
                      <select 
                        className="form-select"
                        value={formData.curfewTime || '11:00 PM'}
                        onChange={(e) => setFormData({ ...formData, curfewTime: e.target.value })}
                      >
                        <option value="No Curfew (24x7 Entry)">🔓 No Curfew (24x7 Entry)</option>
                        <option value="10:30 PM">⏰ 10:30 PM</option>
                        <option value="11:00 PM">⏰ 11:00 PM</option>
                        <option value="11:30 PM">⏰ 11:30 PM</option>
                        <option value="12:00 Midnight">⏰ 12:00 Midnight</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid-3">
                    <div className="form-group">
                      <label className="form-label">Warden / Caretaker Available *</label>
                      <select 
                        className="form-select"
                        value={formData.wardenAvailable || 'Yes (Onsite 24x7)'}
                        onChange={(e) => setFormData({ ...formData, wardenAvailable: e.target.value })}
                      >
                        <option value="Yes (Onsite 24x7)">👮 Yes (Onsite 24x7 Caretaker)</option>
                        <option value="Daytime Caretaker">☀️ Daytime Caretaker</option>
                        <option value="No Warden / Digital Lock">🔑 No Warden (Digital Door Lock)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Tenant Preference (Suitable For)</label>
                      <select 
                        className="form-select"
                        value={formData.suitableFor || 'Students & Working Professionals'}
                        onChange={(e) => setFormData({ ...formData, suitableFor: e.target.value })}
                      >
                        <option value="Students & Working Professionals">🎓💼 Students & Working Professionals</option>
                        <option value="Students Only">🎓 Students Only</option>
                        <option value="Working Professionals">💼 Working Professionals Only</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Furnishing Status</label>
                      <select 
                        className="form-select"
                        value={formData.furnishing || 'Fully Furnished'}
                        onChange={(e) => setFormData({ ...formData, furnishing: e.target.value })}
                      >
                        <option value="Fully Furnished">Fully Furnished</option>
                        <option value="Semi-Furnished">Semi-Furnished</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid-3">
                    <div className="form-group">
                      <label className="form-label">Starting Rent (₹ / Bed / Month) *</label>
                      <input 
                        type="number" 
                        required 
                        className="form-input" 
                        placeholder="e.g. 9500"
                        value={formData.rent}
                        onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Refundable Security Deposit (₹)</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="e.g. 10000"
                        value={formData.deposit}
                        onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Notice Period (Days)</label>
                      <input 
                        type="number" 
                        aria-label="Notice Period (Days)"
                        placeholder="30"
                        className="form-input" 
                        value={formData.noticePeriodDays}
                        onChange={(e) => setFormData({ ...formData, noticePeriodDays: e.target.value })}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="form-group" style={{ marginTop: '16px' }}>
                <label className="form-label">Property Description</label>
                <textarea 
                  rows={3} 
                  className="form-textarea" 
                  placeholder={
                    formData.propertyType === 'house'
                      ? 'Highlight modular kitchen, spacious balconies, society clubhouse, high-speed elevators, and nearby metro station...'
                      : formData.propertyType === 'room'
                      ? 'Highlight private key entry, quiet peaceful ambience, attached washroom, study desk, power backup, and proximity to bus/metro...'
                      : 'Highlight wholesome home-cooked 3 daily meals, daily room cleaning, high-speed WiFi, laundry facilities, and safe security...'
                  }
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

              {/* 3. Rooms / Bedrooms / Space Configuration */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h3 style={{ color: '#fff', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                      <Bed size={18} style={{ color: 'var(--gold-primary)' }} />
                      {formData.propertyType === 'house' && '3. Bedrooms & Layout Configuration'}
                      {formData.propertyType === 'room' && '3. Room Specifications & Layout'}
                      {formData.propertyType === 'pg' && '3. Rooms & Bed Sharing Configurations'}
                    </h3>
                    <p style={{ color: '#888', fontSize: '0.82rem', margin: '4px 0 0 0' }}>
                      {formData.propertyType === 'house' && 'Configure attached washrooms, balconies, and wardrobe amenities for each bedroom in this flat.'}
                      {formData.propertyType === 'room' && 'Detailed in-room setup, private spaces, and attached amenities for this room.'}
                      {formData.propertyType === 'pg' && 'Specify bed sharing tiers (Single, Twin, Triple sharing), rent per bed, and bed availability.'}
                    </p>
                  </div>
                  <button type="button" onClick={handleAddRoom} className="btn btn-outline-gold btn-sm">
                    {formData.propertyType === 'house' && '+ Add Bedroom / Space'}
                    {formData.propertyType === 'room' && '+ Add In-Room Space'}
                    {formData.propertyType === 'pg' && '+ Add Sharing Tier'}
                  </button>
                </div>

                {/* If Flat / House */}
                {formData.propertyType === 'house' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
                    {formData.rooms.map((room, idx) => (
                      <div 
                        key={room.id}
                        style={{
                          background: '#111',
                          border: '1px solid #27272a',
                          borderRadius: '8px',
                          padding: '16px',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr)) auto',
                          gap: '12px',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <span style={{ fontSize: '0.75rem', color: '#888' }}>Bedroom Name</span>
                          <input 
                            type="text"
                            className="form-input"
                            style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                            value={room.type}
                            placeholder="e.g. Master Bedroom"
                            onChange={(e) => handleUpdateRoom(idx, 'type', e.target.value)}
                          />
                        </div>

                        <div>
                          <span style={{ fontSize: '0.75rem', color: '#888' }}>Washroom Setup</span>
                          <select 
                            className="form-select"
                            style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                            value={room.washroom || 'Attached'}
                            onChange={(e) => handleUpdateRoom(idx, 'washroom', e.target.value)}
                          >
                            <option value="Attached">Attached Private Washroom</option>
                            <option value="Common">Common / Hall Washroom</option>
                          </select>
                        </div>

                        <div>
                          <span style={{ fontSize: '0.75rem', color: '#888' }}>Wardrobe Storage</span>
                          <select 
                            className="form-select"
                            style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                            value={room.wardrobe || 'Built-in Wardrobe'}
                            onChange={(e) => handleUpdateRoom(idx, 'wardrobe', e.target.value)}
                          >
                            <option value="Built-in Wardrobe">Built-in Wardrobe</option>
                            <option value="Free-standing Cupboard">Free-standing Cupboard</option>
                            <option value="No Wardrobe">No Wardrobe</option>
                          </select>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '12px' }}>
                          <label style={{ fontSize: '0.82rem', color: '#aaa', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                            <input 
                              type="checkbox" 
                              checked={!!room.ac} 
                              onChange={(e) => handleUpdateRoom(idx, 'ac', e.target.checked)} 
                              style={{ accentColor: 'var(--gold-primary)' }}
                            />
                            AC Fitted
                          </label>
                          <label style={{ fontSize: '0.82rem', color: '#aaa', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                            <input 
                              type="checkbox" 
                              checked={!!room.balcony} 
                              onChange={(e) => handleUpdateRoom(idx, 'balcony', e.target.checked)} 
                              style={{ accentColor: 'var(--gold-primary)' }}
                            />
                            Private Balcony
                          </label>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button 
                            type="button" 
                            disabled={formData.rooms.length <= 1}
                            onClick={() => handleRemoveRoom(idx)}
                            style={{ background: 'transparent', border: 'none', color: formData.rooms.length <= 1 ? '#555' : '#ef4444', cursor: formData.rooms.length <= 1 ? 'not-allowed' : 'pointer', padding: '6px' }}
                            title="Remove bedroom"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* If Room */}
                {formData.propertyType === 'room' && (
                  <div style={{ marginTop: '14px' }}>
                    {/* Room Summary Specs Card */}
                    <div style={{
                      background: 'rgba(212, 175, 55, 0.05)',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: '14px',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '12px'
                    }}>
                      <div>
                        <span style={{ fontSize: '0.74rem', color: '#888', display: 'block' }}>Room Subtype</span>
                        <strong style={{ color: 'var(--gold-light)', fontSize: '0.88rem' }}>{formData.roomSubtype || '1RK Studio'}</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.74rem', color: '#888', display: 'block' }}>Washroom Setup</span>
                        <strong style={{ color: '#fff', fontSize: '0.88rem' }}>{formData.washroomType || 'Attached Private'}</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.74rem', color: '#888', display: 'block' }}>Kitchen Setup</span>
                        <strong style={{ color: '#fff', fontSize: '0.88rem' }}>{formData.kitchenSetup || 'Private Kitchenette'}</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.74rem', color: '#888', display: 'block' }}>Entry Access</span>
                        <strong style={{ color: '#fff', fontSize: '0.88rem' }}>{formData.privateEntry || 'Independent Key'}</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.74rem', color: '#888', display: 'block' }}>Balcony</span>
                        <strong style={{ color: '#fff', fontSize: '0.88rem' }}>{formData.roomBalcony || 'Attached Balcony'}</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.74rem', color: '#888', display: 'block' }}>Bed Setup</span>
                        <strong style={{ color: '#fff', fontSize: '0.88rem' }}>{formData.bedSetup || 'Queen / Double Bed'}</strong>
                      </div>
                    </div>

                    {/* In-room Zones / Features list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {formData.rooms.map((room, idx) => (
                        <div 
                          key={room.id}
                          style={{
                            background: '#111',
                            border: '1px solid #27272a',
                            borderRadius: '8px',
                            padding: '14px 16px',
                            display: 'grid',
                            gridTemplateColumns: '1fr auto auto auto',
                            gap: '12px',
                            alignItems: 'center'
                          }}
                        >
                          <div>
                            <span style={{ fontSize: '0.74rem', color: '#888' }}>In-Room Space / Feature Name</span>
                            <input 
                              type="text"
                              className="form-input"
                              style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                              value={room.type}
                              placeholder="e.g. Attached Balcony / Study Nook"
                              onChange={(e) => handleUpdateRoom(idx, 'type', e.target.value)}
                            />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '14px' }}>
                            <label style={{ fontSize: '0.82rem', color: '#aaa', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                              <input 
                                type="checkbox" 
                                checked={!!room.ac} 
                                onChange={(e) => handleUpdateRoom(idx, 'ac', e.target.checked)} 
                                style={{ accentColor: 'var(--gold-primary)' }}
                              />
                              AC
                            </label>
                            <label style={{ fontSize: '0.82rem', color: '#aaa', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                              <input 
                                type="checkbox" 
                                checked={!!room.balcony} 
                                onChange={(e) => handleUpdateRoom(idx, 'balcony', e.target.checked)} 
                                style={{ accentColor: 'var(--gold-primary)' }}
                              />
                              Balcony / Window
                            </label>
                          </div>
                          <div style={{ marginTop: '14px' }}>
                            <button 
                              type="button" 
                              onClick={() => handleRemoveRoom(idx)}
                              style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px' }}
                              title="Remove item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* If PG & Coliving */}
                {formData.propertyType === 'pg' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
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
                          <span style={{ fontSize: '0.75rem', color: '#888' }}>Sharing Room Name</span>
                          <input 
                            type="text"
                            className="form-input"
                            style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                            value={room.type}
                            placeholder="e.g. Twin Sharing Deluxe"
                            onChange={(e) => handleUpdateRoom(idx, 'type', e.target.value)}
                          />
                        </div>

                        <div>
                          <span style={{ fontSize: '0.75rem', color: '#888' }}>Bed Sharing Tier</span>
                          <select 
                            className="form-select"
                            style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                            value={room.beds}
                            onChange={(e) => handleUpdateRoom(idx, 'beds', Number(e.target.value))}
                          >
                            <option value="1">1 Bed (Single Private)</option>
                            <option value="2">2 Beds (Twin Sharing)</option>
                            <option value="3">3 Beds (Triple Sharing)</option>
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
                            placeholder="e.g. 10000"
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
                            placeholder="e.g. 2"
                            onChange={(e) => handleUpdateRoom(idx, 'available', Number(e.target.value))}
                          />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px' }}>
                          <label style={{ fontSize: '0.8rem', color: '#aaa', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                            <input 
                              type="checkbox" 
                              checked={!!room.ac} 
                              onChange={(e) => handleUpdateRoom(idx, 'ac', e.target.checked)} 
                              style={{ accentColor: 'var(--gold-primary)' }}
                            />
                            AC
                          </label>
                          <label style={{ fontSize: '0.8rem', color: '#aaa', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                            <input 
                              type="checkbox" 
                              checked={room.washroom === 'Attached' || !!room.washroom} 
                              onChange={(e) => handleUpdateRoom(idx, 'washroom', e.target.checked ? 'Attached' : 'Common')} 
                              style={{ accentColor: 'var(--gold-primary)' }}
                            />
                            Attached Bath
                          </label>
                          <button 
                            type="button" 
                            disabled={formData.rooms.length <= 1}
                            onClick={() => handleRemoveRoom(idx)}
                            style={{ background: 'transparent', border: 'none', color: formData.rooms.length <= 1 ? '#555' : '#ef4444', cursor: formData.rooms.length <= 1 ? 'not-allowed' : 'pointer', padding: '4px' }}
                            title="Remove tier"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. Facilities */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{ marginBottom: '14px' }}>
                  <h3 style={{ color: '#fff', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                    <Wifi size={18} style={{ color: 'var(--gold-primary)' }} />
                    {formData.propertyType === 'house' && '4. Included Society & Apartment Facilities'}
                    {formData.propertyType === 'room' && '4. Included Room Facilities & Inclusions'}
                    {formData.propertyType === 'pg' && '4. Included PG & Coliving Facilities'}
                  </h3>
                  <p style={{ color: '#888', fontSize: '0.82rem', margin: '4px 0 0 0' }}>
                    {formData.propertyType === 'house' && 'Select society amenities and apartment perks provided with this flat.'}
                    {formData.propertyType === 'room' && 'Select utilities, private fixtures, and appliances available for this room.'}
                    {formData.propertyType === 'pg' && 'Select food, cleaning services, and living conveniences included for residents.'}
                  </p>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '10px'
                }}>
                  {getCategoryAmenities(formData.propertyType).map((amenity) => {
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
                      <img 
                        src={url} 
                        alt={`photo-${idx}`} 
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=300&q=80';
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
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
                Used for automated refund tracking and verified direct booking payout guarantee.
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
        {/* TAB: SUBSCRIPTION & AUTOPAY */}
        {activeTab === 'subscription' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '980px' }}>
            {/* Plan Status Banner */}
            <div className="luxury-card" style={{
              padding: '28px 32px',
              background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)',
              border: '1.5px solid rgba(234, 179, 8, 0.35)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '999px', background: 'rgba(234, 179, 8, 0.15)', border: '1px solid rgba(234, 179, 8, 0.3)', color: '#facc15', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px' }}>
                    <ShieldCheck size={14} />
                    Verified Host Partner Membership
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', margin: '0 0 6px', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                    {subscription?.planName || 'Prestige Host Partner Plan'}
                  </h2>
                  <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0, maxWidth: '540px' }}>
                    Recurring payment through NPCI e-Mandate: ₹99 auto-cut every 30 days for uninterrupted listing promotion and instant tenant leads.
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    background: subscription?.status === 'active' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    border: `1px solid ${subscription?.status === 'active' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                    color: subscription?.status === 'active' ? '#4ade80' : '#f87171',
                    fontSize: '13px',
                    fontWeight: 800,
                    textTransform: 'uppercase'
                  }}>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: subscription?.status === 'active' ? '#4ade80' : '#f87171',
                      boxShadow: subscription?.status === 'active' ? '0 0 8px #4ade80' : 'none'
                    }} />
                    {subscription?.status === 'active' ? 'Active (Autopay Enabled)' : 'Activation Pending'}
                  </div>
                </div>
              </div>

              {/* Subscription Metrics Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
                marginTop: '24px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Initial Paid</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#facc15' }}>₹{subscription?.initialAmount || 99}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>One-time activation</div>
                </div>

                <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Next Autopay Cut</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#38bdf8' }}>₹{subscription?.recurringAmount || 99}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Every 30 days</div>
                </div>

                <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Cycle Days Remaining</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#4ade80' }}>{subscription?.daysRemaining ?? 30} Days</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Next: {subscription?.nextBillingDate ? new Date(subscription.nextBillingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'In 30 days'}</div>
                </div>

                <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>e-Mandate Reference</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#e2e8f0', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    {subscription?.mandateId || 'MNDT-UPI-AUTOPAY'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{subscription?.autopayMethod || 'UPI Autopay'}</div>
                </div>
              </div>

              {/* Action Buttons for Testing / Managing Autopay */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
                {subscription?.status === 'active' ? (
                  <>
                    <button
                      onClick={handleTriggerAutopayTest}
                      disabled={deductingAutopay}
                      className="btn btn-gold btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <RefreshCw size={15} style={{ animation: deductingAutopay ? 'spin 1s linear infinite' : 'none' }} />
                      {deductingAutopay ? 'Processing ₹99 Autopay Deduction...' : '⚡ Test 30-Day Autopay Deduction (₹99)'}
                    </button>

                    <button
                      onClick={handleCancelAutopay}
                      className="btn btn-outline-crimson btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      Cancel Mandate
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setSubModalOpen(true)}
                    className="btn btn-gold"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '14px' }}
                  >
                    <ShieldCheck size={18} />
                    Authorize ₹99 & Enable Autopay Now
                  </button>
                )}
              </div>
            </div>

            {/* Invoices and Payment History Table */}
            <div className="luxury-card" style={{ padding: '28px 32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: '0 0 4px' }}>
                    Payment & Autopay Invoices
                  </h3>
                  <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                    Official receipts for initial ₹99 host activation and ₹99 recurring coliving promotion.
                  </p>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8' }}>
                      <th style={{ padding: '10px 14px' }}>Invoice ID</th>
                      <th style={{ padding: '10px 14px' }}>Date</th>
                      <th style={{ padding: '10px 14px' }}>Description</th>
                      <th style={{ padding: '10px 14px' }}>Payment Mode</th>
                      <th style={{ padding: '10px 14px' }}>Amount</th>
                      <th style={{ padding: '10px 14px' }}>Status</th>
                      <th style={{ padding: '10px 14px', textAlign: 'right' }}>Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(subscription?.invoices || []).map((inv) => (
                      <tr key={inv.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: 700, color: '#facc15' }}>
                          {inv.id}
                        </td>
                        <td style={{ padding: '12px 14px', color: '#cbd5e1' }}>
                          {new Date(inv.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '12px 14px', color: '#ffffff', fontWeight: 600 }}>
                          {inv.description}
                        </td>
                        <td style={{ padding: '12px 14px', color: '#94a3b8' }}>
                          {inv.method || 'UPI Autopay'}
                        </td>
                        <td style={{ padding: '12px 14px', color: '#facc15', fontWeight: 800, fontSize: '14px' }}>
                          ₹{inv.amount}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span className="badge badge-green" style={{ fontSize: '11px', textTransform: 'uppercase' }}>
                            {inv.status || 'Paid'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                          <button
                            onClick={() => setReceiptModalInvoice(inv)}
                            className="btn btn-outline-gold btn-sm"
                            style={{ fontSize: '11px', padding: '4px 10px' }}
                          >
                            View Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* RECEIPT VIEW MODAL */}
      {receiptModalInvoice && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999999,
          background: 'rgba(2, 6, 23, 0.9)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#0f172a',
            border: '1px solid rgba(234, 179, 8, 0.3)',
            borderRadius: '20px',
            maxWidth: '520px',
            width: '100%',
            padding: '28px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '14px', marginBottom: '20px' }}>
              <div>
                <img src="/logo.png" alt="Vrundavan Ventures" style={{ height: '30px', width: 'auto', display: 'block', marginBottom: '6px', objectFit: 'contain' }} />
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>TAX INVOICE & AUTOPAY RECEIPT</div>
              </div>
              <button onClick={() => setReceiptModalInvoice(null)} className="btn btn-ghost btn-sm">
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#cbd5e1', marginBottom: '16px' }}>
              <div>
                <div><strong>Invoice #:</strong> {receiptModalInvoice.id}</div>
                <div><strong>Date:</strong> {new Date(receiptModalInvoice.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div><strong>Host:</strong> {currentUser?.name || 'Property Host'}</div>
                <div><strong>e-Mandate:</strong> {receiptModalInvoice.mandateId}</div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                <span style={{ color: '#fff' }}>{receiptModalInvoice.description}</span>
                <span style={{ color: '#facc15', fontWeight: 800 }}>₹{receiptModalInvoice.amount}.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8' }}>
                <span>Payment Mode</span>
                <span>{receiptModalInvoice.method || 'UPI Autopay'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                <span>Transaction Ref</span>
                <span style={{ fontFamily: 'monospace' }}>{receiptModalInvoice.transactionRef || 'TXN-998822'}</span>
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '12px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800 }}>
                <span style={{ color: '#fff' }}>Total Paid</span>
                <span style={{ color: '#facc15' }}>₹{receiptModalInvoice.amount}.00</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => window.print()} className="btn btn-gold btn-sm">
                Print / Save Receipt
              </button>
              <button onClick={() => setReceiptModalInvoice(null)} className="btn btn-ghost btn-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OWNER SUBSCRIPTION MODAL */}
      <OwnerSubscriptionModal
        isOpen={subModalOpen}
        onClose={() => setSubModalOpen(false)}
        currentUser={currentUser}
        onSuccess={(updatedSub) => {
          setSubscription(updatedSub);
          try {
            const saved = localStorage.getItem('vv_user') || localStorage.getItem('aurelia_user');
            const user = saved ? JSON.parse(saved) : (currentUser || { id: 'usr-owner-1', role: 'owner' });
            const updated = { ...user, subscription: updatedSub, role: 'owner' };
            localStorage.setItem('vv_user', JSON.stringify(updated));
          } catch {}
          setMessage({
            type: 'success',
            text: '🎉 Host Partnership Activated! ₹99 initial paid and ₹99/30-day recurring autopay configured.'
          });
          setTimeout(() => setMessage(null), 5000);
        }}
      />
    </div>
  );
}
