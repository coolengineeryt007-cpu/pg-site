import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  initDatabase,
  isMySQLActive,
  getDB,
  findUserByEmail,
  createUser,
  getAllPgs,
  getPgById,
  createPg,
  updatePg,
  updatePgStatus,
  deletePg,
  getAllBlogs,
  getBlogBySlug,
  createInquiry,
  getInquiries,
  getReviews,
  getStats,
  getUserById,
  getUserSubscription,
  updateUserSubscription,
  activateOwnerSubscription,
  triggerRecurringAutopayDeduction,
  cancelOwnerSubscription,
  getAllOwnerSubscriptions,
  calculateDistanceKm
} from './data/store.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// Request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Luxury PG API Engine',
    database: isMySQLActive() ? 'MySQL (luxury_pg_db on localhost:3306)' : 'JSON fallback',
    timestamp: new Date().toISOString()
  });
});

// GEOCODING PROXY ROUTES (Guaranteed fast response, no CORS issues, no watermarks)
app.get('/api/geocode/reverse', async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ error: 'lat and lng query parameters required' });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const osmUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&zoom=18&addressdetails=1`;
    const response = await fetch(osmUrl, {
      headers: {
        'User-Agent': 'AureliaLuxuryPGPlatform/1.0 (contact@aureliapg.com)',
        'Accept-Language': 'en'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      const addr = data.address || {};
      const apartment = addr.building || addr.house_name || addr.amenity || addr.road || 'Executive Suite';
      const addressLine1 = [addr.house_number, addr.road].filter(Boolean).join(' ') || data.display_name?.split(',')[0] || '';
      const addressLine2 = addr.suburb || addr.neighbourhood || '';
      const area = addr.neighbourhood || addr.suburb || addr.city_district || addr.subdistrict || 'Prime Area';
      const city = addr.city || addr.town || addr.municipality || addr.county || 'Bengaluru';
      const district = addr.state_district || addr.county || city;
      const state = addr.state || 'Karnataka';
      const pincode = addr.postcode || '560001';

      return res.json({
        apartment,
        addressLine1,
        addressLine2,
        area,
        city,
        district,
        state,
        pincode,
        lat: Number(lat),
        lng: Number(lng),
        formattedAddress: data.display_name || `${addressLine1}, ${area}, ${city}, ${state}`
      });
    }
  } catch (err) {
    console.warn('Backend reverse geocode fallback error:', err.message);
  }

  res.json({
    apartment: 'Aurelia Prime Residence',
    addressLine1: 'Main Residency Road',
    addressLine2: 'Phase 1',
    area: 'Central District',
    city: 'Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    pincode: '560001',
    lat: Number(lat),
    lng: Number(lng),
    formattedAddress: 'Main Residency Road, Central District, Bengaluru'
  });
});

app.get('/api/geocode/search', async (req, res) => {
  const { q } = req.query;
  if (!q || !q.trim()) {
    return res.status(400).json({ error: 'Search query required' });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const osmUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q.trim())}&limit=5&addressdetails=1`;
    const response = await fetch(osmUrl, {
      headers: {
        'User-Agent': 'AureliaLuxuryPGPlatform/1.0 (contact@aureliapg.com)',
        'Accept-Language': 'en'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const results = data.map(item => {
          const addr = item.address || {};
          const city = addr.city || addr.town || addr.county || (q.toLowerCase().includes('rajkot') ? 'Rajkot' : 'Bengaluru');
          const state = addr.state || (q.toLowerCase().includes('gujarat') || q.toLowerCase().includes('rajkot') ? 'Gujarat' : 'Karnataka');
          return {
            apartment: addr.building || addr.amenity || item.name || item.display_name?.split(',')[0],
            addressLine1: [addr.house_number, addr.road].filter(Boolean).join(' ') || item.display_name?.split(',')[0],
            addressLine2: addr.suburb || addr.neighbourhood || '',
            area: addr.neighbourhood || addr.suburb || addr.city_district || 'Prime Area',
            city,
            district: addr.state_district || addr.county || city,
            state,
            pincode: addr.postcode || (city === 'Rajkot' ? '360001' : '560001'),
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            formattedAddress: item.display_name
          };
        });
        return res.json({ results });
      }
    }
  } catch (err) {
    console.warn('Backend Nominatim search error:', err.message);
  }

  // Fallback to Photon (OpenStreetMap global POI search)
  try {
    const pRes = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q.trim())}&limit=5`);
    if (pRes.ok) {
      const pData = await pRes.json();
      if (pData && pData.features && pData.features.length > 0) {
        const results = pData.features.map(f => {
          const props = f.properties || {};
          const coords = f.geometry?.coordinates || [70.7932, 22.2916];
          const city = props.city || (q.toLowerCase().includes('rajkot') ? 'Rajkot' : 'Bengaluru');
          const state = props.state || (q.toLowerCase().includes('rajkot') ? 'Gujarat' : 'Karnataka');
          const name = props.name || props.street || q.trim();
          return {
            apartment: name,
            addressLine1: props.street || name,
            addressLine2: props.district || props.suburb || '',
            area: props.district || props.suburb || city,
            city,
            district: props.county || city,
            state,
            pincode: props.postcode || (city === 'Rajkot' ? '360001' : '560001'),
            lat: coords[1],
            lng: coords[0],
            formattedAddress: [name, props.street, props.district, city, state, props.country || 'India'].filter(Boolean).join(', ')
          };
        });
        return res.json({ results });
      }
    }
  } catch (err) {
    console.warn('Backend Photon search error:', err.message);
  }

  // Context-aware fallback based on query terms
  const isGujarat = q.toLowerCase().includes('rajkot') || q.toLowerCase().includes('gujarat') || q.toLowerCase().includes('morbi');
  const fallbackCity = isGujarat ? 'Rajkot' : 'Bengaluru';
  const fallbackState = isGujarat ? 'Gujarat' : 'Karnataka';
  const fallbackPincode = isGujarat ? '360001' : '560001';
  const fallbackLat = isGujarat ? 22.2916 : 12.9716;
  const fallbackLng = isGujarat ? 70.7932 : 77.5946;

  res.json({
    results: [{
      apartment: q.trim(),
      addressLine1: q.trim(),
      addressLine2: '',
      area: q.trim(),
      city: fallbackCity,
      district: fallbackCity,
      state: fallbackState,
      pincode: fallbackPincode,
      lat: fallbackLat,
      lng: fallbackLng,
      formattedAddress: `${q.trim()}, ${fallbackCity}, ${fallbackState}`
    }]
  });
});

app.get('/api/geocode/my-ip', async (req, res) => {
  try {
    const r1 = await fetch('https://ipwho.is/');
    if (r1.ok) {
      const d1 = await r1.json();
      if (d1.success !== false && d1.latitude && d1.longitude) {
        return res.json({
          lat: Number(d1.latitude),
          lng: Number(d1.longitude),
          city: d1.city || 'Rajkot',
          region: d1.region || 'Gujarat'
        });
      }
    }
  } catch (e) {}

  try {
    const r2 = await fetch('http://ip-api.com/json/');
    if (r2.ok) {
      const d2 = await r2.json();
      if (d2.lat && d2.lon) {
        return res.json({
          lat: Number(d2.lat),
          lng: Number(d2.lon),
          city: d2.city || 'Rajkot',
          region: d2.regionName || 'Gujarat'
        });
      }
    }
  } catch (e) {}

  res.json({
    lat: 22.2916,
    lng: 70.7932,
    city: 'Rajkot',
    region: 'Gujarat'
  });
});

// AUTHENTICATION ROUTES
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await findUserByEmail(email);

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Attach latest subscription status for owners
    if (user.role === 'owner') {
      const sub = await getUserSubscription(user.id);
      userWithoutPassword.subscription = sub;
    }

    const token = `token-${user.id}-${Date.now()}`;

    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role = 'owner', phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'Email is already registered' });
    }

    const newUser = {
      id: `usr-${role}-${Date.now()}`,
      name,
      email: email.toLowerCase().trim(),
      password,
      role: role === 'superadmin' ? 'owner' : role, // superadmins are pre-created
      phone: phone || '',
      createdAt: new Date().toISOString(),
      subscription: role === 'owner' ? {
        status: 'pending_payment',
        planId: 'owner_partner_autopay',
        initialAmount: 99,
        recurringAmount: 99,
        currency: 'INR',
        currencySymbol: '₹',
        billingCycleDays: 30,
        autopayEnabled: false
      } : null
    };

    await createUser(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    const token = `token-${newUser.id}-${Date.now()}`;

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// PG LISTINGS ROUTES
app.get('/api/pgs', async (req, res) => {
  try {
    let list = await getAllPgs();

    const {
      lat,
      lng,
      radius,
      search,
      city,
      gender,
      propertyType,
      suitableFor,
      maxRent,
      minRent,
      sharing,
      amenity,
      status,
      ownerId,
      includeAllStatus
    } = req.query;

    // Status filtering: Public frontend only sees 'approved'
    if (includeAllStatus === 'true') {
      if (status) {
        list = list.filter(pg => pg.status === status);
      }
    } else if (ownerId) {
      list = list.filter(pg => pg.ownerId === ownerId);
      if (status) {
        list = list.filter(pg => pg.status === status);
      }
    } else {
      list = list.filter(pg => pg.status === 'approved');
    }

    // Filter by Property Type ('pg', 'room', 'house', 'flat')
    if (propertyType && propertyType !== 'all') {
      list = list.filter(pg => {
        const type = (pg.propertyType || 'pg').toLowerCase();
        if (propertyType === 'house' || propertyType === 'flat') {
          return type === 'house' || type === 'flat' || type === 'apartment';
        }
        return type === propertyType.toLowerCase();
      });
    }

    // Filter by Suitable For / Tenant Preference ('Family', 'Working Professionals', 'Students', 'All')
    if (suitableFor && suitableFor !== 'all') {
      const sTerm = suitableFor.toLowerCase();
      list = list.filter(pg => {
        const suit = (pg.suitableFor || 'All').toLowerCase();
        const gend = (pg.gender || '').toLowerCase();
        return suit.includes(sTerm) || suit === 'all' || gend.includes(sTerm);
      });
    }

    // Text search
    if (search) {
      const q = search.toLowerCase().trim();
      list = list.filter(pg => 
        pg.name.toLowerCase().includes(q) ||
        (pg.address?.city && pg.address.city.toLowerCase().includes(q)) ||
        (pg.address?.area && pg.address.area.toLowerCase().includes(q)) ||
        (pg.address?.state && pg.address.state.toLowerCase().includes(q)) ||
        (pg.address?.apartment && pg.address.apartment.toLowerCase().includes(q)) ||
        (pg.address?.pincode && pg.address.pincode.includes(q)) ||
        (pg.propertyType && pg.propertyType.toLowerCase().includes(q)) ||
        (pg.suitableFor && pg.suitableFor.toLowerCase().includes(q)) ||
        (pg.bhk && pg.bhk.toLowerCase().includes(q))
      );
    }

    // Filter by City
    if (city && city !== 'all') {
      list = list.filter(pg => pg.address?.city && pg.address.city.toLowerCase() === city.toLowerCase());
    }

    // Filter by Gender
    if (gender && gender !== 'all') {
      list = list.filter(pg => pg.gender && pg.gender.toLowerCase() === gender.toLowerCase());
    }

    // Filter by Rent
    if (maxRent) {
      list = list.filter(pg => pg.rent <= Number(maxRent));
    }
    if (minRent) {
      list = list.filter(pg => pg.rent >= Number(minRent));
    }

    // Filter by Sharing Bed Count
    if (sharing && sharing !== 'all') {
      const bedCount = Number(sharing);
      list = list.filter(pg => pg.rooms && pg.rooms.some(r => r.beds === bedCount));
    }

    // Filter by Amenity
    if (amenity) {
      list = list.filter(pg => pg.facilities && pg.facilities.some(f => f.toLowerCase().includes(amenity.toLowerCase())));
    }

    // Distance calculation if lat & lng are provided
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);

      if (!isNaN(userLat) && !isNaN(userLng)) {
        list = list.map(pg => {
          const dist = calculateDistanceKm(userLat, userLng, pg.address?.lat, pg.address?.lng);
          return { ...pg, distanceKm: dist };
        });

        // Filter by radius if provided
        if (radius) {
          const radNum = parseFloat(radius);
          list = list.filter(pg => pg.distanceKm !== null && pg.distanceKm <= radNum);
        }

        // Sort by proximity ascending
        list.sort((a, b) => (a.distanceKm ?? 99999) - (b.distanceKm ?? 99999));
      }
    } else {
      // Default sort: featured first, then newest
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    res.json({
      total: list.length,
      pgs: list
    });
  } catch (error) {
    console.error('Get PGs error:', error);
    res.status(500).json({ error: 'Failed to retrieve listings' });
  }
});

app.get('/api/pgs/:id', async (req, res) => {
  try {
    const pg = await getPgById(req.params.id);

    if (!pg) {
      return res.status(404).json({ error: 'PG accommodation not found' });
    }

    const reviews = await getReviews(pg.id);
    res.json({ ...pg, reviews });
  } catch (error) {
    console.error('Get PG by ID error:', error);
    res.status(500).json({ error: 'Failed to retrieve listing details' });
  }
});

// CREATE PG (Owner defaults to pending_review or draft)
app.post('/api/pgs', async (req, res) => {
  try {
    const data = req.body;

    if (!data.name || !data.rent || !data.address) {
      return res.status(400).json({ error: 'Name, Rent, and Address are required' });
    }

    if (!data.ownerId) {
      return res.status(401).json({ error: 'Host account login required to list property' });
    }

    const sub = await getUserSubscription(data.ownerId);
    if (!sub || sub.status !== 'active') {
      return res.status(403).json({ 
        error: 'Host Partnership Subscription Required: Please complete your ₹99 activation with 30-day recurring autopay to list properties.' 
      });
    }

    const newPg = {
      id: `pg-${Date.now()}`,
      name: data.name,
      ownerId: data.ownerId || 'usr-owner-1',
      ownerName: data.ownerName || 'Property Host',
      ownerPhone: data.ownerPhone || '+91 98765 43210',
      ownerWhatsapp: data.ownerWhatsapp || data.ownerPhone || '+919876543210',
      gender: data.gender || 'Co-ed',
      propertyType: data.propertyType || 'pg', // 'pg', 'room', 'house', 'flat'
      bhk: data.bhk || '',
      furnishing: data.furnishing || 'Furnished',
      suitableFor: data.suitableFor || 'All',
      status: data.isDraft ? 'draft' : 'pending_review', // Pending Super Admin Approval!
      statusReason: null,
      statusUpdatedAt: new Date().toISOString(),
      featured: false,
      rating: 5.0,
      reviewsCount: 0,
      rent: Number(data.rent),
      deposit: Number(data.deposit || data.rent * 1.5),
      noticePeriodDays: Number(data.noticePeriodDays || 30),
      description: data.description || 'Modern rental property accommodation.',
      photos: Array.isArray(data.photos) && data.photos.length > 0 
        ? data.photos 
        : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'],
      address: {
        apartment: data.address.apartment || '',
        addressLine1: data.address.addressLine1 || '',
        addressLine2: data.address.addressLine2 || '',
        area: data.address.area || '',
        city: data.address.city || '',
        district: data.address.district || '',
        state: data.address.state || '',
        pincode: data.address.pincode || '',
        lat: Number(data.address.lat || 12.9716),
        lng: Number(data.address.lng || 77.5946)
      },
      rooms: Array.isArray(data.rooms) && data.rooms.length > 0 
        ? data.rooms 
        : [
            { id: 'r1', type: 'Single Luxury Suite', beds: 1, rent: Number(data.rent) * 1.3, available: 1, washroom: 'Attached', ac: true, balcony: true },
            { id: 'r2', type: 'Twin Sharing Room', beds: 2, rent: Number(data.rent), available: 2, washroom: 'Attached', ac: true, balcony: false }
          ],
      facilities: Array.isArray(data.facilities) ? data.facilities : [
        'High-Speed WiFi', 'Daily Housekeeping', 'Air Conditioning', 'RO Drinking Water', '24x7 Power Backup'
      ],
      rules: Array.isArray(data.rules) ? data.rules : [
        'Gate closes at 11:30 PM', 'No smoking in bedrooms'
      ],
      createdAt: new Date().toISOString()
    };

    await createPg(newPg);

    res.status(201).json({
      message: newPg.status === 'pending_review' 
        ? 'PG listing created and submitted for Super Admin approval!' 
        : 'PG draft saved successfully',
      pg: newPg
    });
  } catch (error) {
    console.error('Create PG error:', error);
    res.status(500).json({ error: 'Failed to create PG listing' });
  }
});

// UPDATE PG
app.put('/api/pgs/:id', async (req, res) => {
  try {
    const existing = await getPgById(req.params.id);

    if (!existing) {
      return res.status(404).json({ error: 'PG not found' });
    }

    const updated = {
      ...existing,
      ...req.body,
      address: { ...existing.address, ...(req.body.address || {}) },
      updatedAt: new Date().toISOString()
    };

    await updatePg(req.params.id, updated);

    res.json({ message: 'PG listing updated successfully', pg: updated });
  } catch (error) {
    console.error('Update PG error:', error);
    res.status(500).json({ error: 'Failed to update PG listing' });
  }
});

// SUPER ADMIN APPROVE / REJECT PG
app.patch('/api/pgs/:id/status', async (req, res) => {
  try {
    const { status, statusReason } = req.body;
    if (!['approved', 'rejected', 'pending_review', 'draft'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const pg = await getPgById(req.params.id);

    if (!pg) {
      return res.status(404).json({ error: 'PG not found' });
    }

    const updatedPg = await updatePgStatus(req.params.id, status, statusReason);

    res.json({
      message: `PG status updated to ${status}`,
      pg: updatedPg
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update PG status' });
  }
});

// DELETE PG
app.delete('/api/pgs/:id', async (req, res) => {
  try {
    const existing = await getPgById(req.params.id);

    if (!existing) {
      return res.status(404).json({ error: 'PG not found' });
    }

    await deletePg(req.params.id);

    res.json({ message: 'PG listing removed successfully' });
  } catch (error) {
    console.error('Delete PG error:', error);
    res.status(500).json({ error: 'Failed to remove PG listing' });
  }
});

// BLOGS
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await getAllBlogs();
    res.json(blogs);
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ error: 'Failed to retrieve blogs' });
  }
});

app.get('/api/blogs/:slug', async (req, res) => {
  try {
    const blog = await getBlogBySlug(req.params.slug);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    console.error('Get blog by slug error:', error);
    res.status(500).json({ error: 'Failed to retrieve blog article' });
  }
});

// INQUIRIES
app.post('/api/inquiries', async (req, res) => {
  try {
    const { pgId, userName, userPhone, userEmail, sharingType, visitDate, message } = req.body;
    if (!pgId || !userName || !userPhone) {
      return res.status(400).json({ error: 'PG ID, Name, and Phone are required' });
    }

    const pg = await getPgById(pgId);

    const newInquiry = {
      id: `inq-${Date.now()}`,
      pgId,
      pgName: pg ? pg.name : 'PG Accommodation',
      ownerId: pg ? pg.ownerId : 'unknown',
      userName,
      userPhone,
      userEmail: userEmail || '',
      sharingType: sharingType || 'Any',
      visitDate: visitDate || '',
      message: message || '',
      status: 'new',
      createdAt: new Date().toISOString()
    };

    await createInquiry(newInquiry);

    res.status(201).json({ message: 'Visit inquiry submitted successfully!', inquiry: newInquiry });
  } catch (error) {
    console.error('Create inquiry error:', error);
    res.status(500).json({ error: 'Failed to submit inquiry' });
  }
});

app.get('/api/inquiries', async (req, res) => {
  try {
    const { ownerId } = req.query;
    const list = await getInquiries(ownerId);
    res.json(list);
  } catch (error) {
    console.error('Get inquiries error:', error);
    res.status(500).json({ error: 'Failed to retrieve inquiries' });
  }
});

// SUPER ADMIN ANALYTICS
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await getStats();
    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to retrieve stats' });
  }
});

// OWNER PARTNER SUBSCRIPTION & RECURRING AUTOPAY ROUTES
app.get('/api/subscription/config', (req, res) => {
  res.json({
    initialAmount: 99,
    recurringAmount: 99,
    billingCycleDays: 30,
    currency: 'INR',
    currencySymbol: '₹',
    mode: 'functional_sandbox',
    supportedMethods: [
      { id: 'upi_autopay', name: 'UPI Autopay (GPay, PhonePe, Paytm, BHIM)', recommended: true },
      { id: 'card_mandate', name: 'Debit / Credit Card e-Mandate (Visa, Mastercard, RuPay)', recommended: false },
      { id: 'netbanking_mandate', name: 'Net Banking e-Mandate (HDFC, ICICI, SBI, Axis)', recommended: false }
    ]
  });
});

app.get('/api/subscription/:userId', async (req, res) => {
  try {
    const sub = await getUserSubscription(req.params.userId);
    if (!sub) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(sub);
  } catch (err) {
    console.error('Get subscription error:', err);
    res.status(500).json({ error: 'Failed to retrieve subscription' });
  }
});

app.post('/api/subscription/activate', async (req, res) => {
  try {
    const { userId, paymentMethod, upiId, amount = 99, recurringAmount = 99 } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    const result = await activateOwnerSubscription(userId, { paymentMethod, upiId, amount, recurringAmount });
    res.json(result);
  } catch (err) {
    console.error('Activate subscription error:', err);
    res.status(500).json({ error: err.message || 'Failed to activate subscription' });
  }
});

app.post('/api/subscription/recurring-deduct', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    const result = await triggerRecurringAutopayDeduction(userId);
    res.json(result);
  } catch (err) {
    console.error('Recurring autopay error:', err);
    res.status(500).json({ error: err.message || 'Failed to process recurring autopay deduction' });
  }
});

app.post('/api/subscription/cancel', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    const result = await cancelOwnerSubscription(userId);
    res.json(result);
  } catch (err) {
    console.error('Cancel autopay error:', err);
    res.status(500).json({ error: err.message || 'Failed to cancel autopay mandate' });
  }
});

// SUPER ADMIN ORDERS, PAYMENTS & AUTOPAY DIRECTORY
app.get('/api/admin/subscriptions', async (req, res) => {
  try {
    const data = await getAllOwnerSubscriptions();
    res.json(data);
  } catch (err) {
    console.error('Get admin subscriptions error:', err);
    res.status(500).json({ error: 'Failed to retrieve admin subscription data' });
  }
});

// AI PROPERTY MATCHMAKER & CONCIERGE ENGINE
app.post('/api/ai/match', async (req, res) => {
  try {
    const { query = '', budget, city, propertyType, suitableFor } = req.body;
    const allPgs = await getAllPgs();
    const approvedPgs = allPgs.filter(p => p.status === 'approved');

    const cleanQuery = (query || '').toLowerCase();
    
    // Auto-detect parameters from query if not explicitly passed
    let targetCity = (city && city !== 'all') ? city.toLowerCase() : '';
    if (!targetCity) {
      if (cleanQuery.includes('rajkot')) targetCity = 'rajkot';
      else if (cleanQuery.includes('bengaluru') || cleanQuery.includes('bangalore')) targetCity = 'bengaluru';
      else if (cleanQuery.includes('pune')) targetCity = 'pune';
      else if (cleanQuery.includes('mumbai')) targetCity = 'mumbai';
      else if (cleanQuery.includes('delhi')) targetCity = 'delhi';
    }

    let targetMaxBudget = budget ? Number(budget) : null;
    if (!targetMaxBudget) {
      const budgetMatch = cleanQuery.match(/(?:under|below|budget|within|upto|around)\s*(?:₹|rs\.?|inr)?\s*(\d+)(?:k|000)?/i);
      if (budgetMatch) {
        let val = parseInt(budgetMatch[1], 10);
        if (val < 100) val = val * 1000;
        targetMaxBudget = val;
      }
    }

    let targetType = propertyType || '';
    if (!targetType) {
      if (cleanQuery.includes('house') || cleanQuery.includes('flat') || cleanQuery.includes('apartment') || cleanQuery.includes('bhk')) targetType = 'house';
      else if (cleanQuery.includes('private room') || cleanQuery.includes('1rk') || cleanQuery.includes('studio')) targetType = 'room';
      else if (cleanQuery.includes('pg') || cleanQuery.includes('paying guest') || cleanQuery.includes('coliving')) targetType = 'pg';
    }

    let targetSuitable = suitableFor || '';
    if (!targetSuitable) {
      if (cleanQuery.includes('student') || cleanQuery.includes('college') || cleanQuery.includes('university')) targetSuitable = 'Students';
      else if (cleanQuery.includes('professional') || cleanQuery.includes('office') || cleanQuery.includes('working') || cleanQuery.includes('corporate')) targetSuitable = 'Working Professionals';
      else if (cleanQuery.includes('family') || cleanQuery.includes('kids') || cleanQuery.includes('couple')) targetSuitable = 'Family';
    }

    // Score and rank listings
    const scored = approvedPgs.map(pg => {
      let score = 50; // base score
      const reasons = [];

      // City score
      if (targetCity) {
        if (pg.address?.city?.toLowerCase() === targetCity) {
          score += 25;
          reasons.push(`Prime location in ${pg.address.city}`);
        } else {
          score -= 30;
        }
      }

      // Budget score
      if (targetMaxBudget) {
        if (pg.rent <= targetMaxBudget) {
          score += 20;
          const savings = targetMaxBudget - pg.rent;
          if (savings > 0) {
            reasons.push(`Saves ₹${savings.toLocaleString('en-IN')}/mo within your budget`);
          } else {
            reasons.push('Fits your exact budget limit');
          }
        } else if (pg.rent <= targetMaxBudget * 1.15) {
          score += 5;
          reasons.push('Just slightly above budget with premium amenities');
        } else {
          score -= 25;
        }
      }

      // Property type score
      if (targetType) {
        const pType = (pg.propertyType || 'pg').toLowerCase();
        if (pType === targetType.toLowerCase() || (targetType === 'house' && (pType === 'flat' || pType === 'apartment'))) {
          score += 15;
          reasons.push(`Verified ${pg.propertyTypeLabel || pg.propertyType || 'rental'}`);
        }
      }

      // Suitable for score
      if (targetSuitable) {
        const suit = (pg.suitableFor || 'All').toLowerCase();
        if (suit.includes(targetSuitable.toLowerCase()) || suit === 'all') {
          score += 15;
          reasons.push(`Tailored for ${targetSuitable}`);
        }
      }

      // Keyword query match
      if (cleanQuery) {
        const text = `${pg.name} ${pg.description} ${pg.address?.area} ${(pg.facilities || []).join(' ')}`.toLowerCase();
        if (cleanQuery.includes('kathiyawadi') || cleanQuery.includes('food') || cleanQuery.includes('meal')) {
          if (text.includes('kathiyawadi') || text.includes('meal') || text.includes('food')) {
            score += 15;
            reasons.push('Includes freshly cooked homestyle meals');
          }
        }
        if (cleanQuery.includes('ac') || cleanQuery.includes('air condition')) {
          if (text.includes('ac') || text.includes('air conditioning')) {
            score += 10;
            reasons.push('Air Conditioning equipped');
          }
        }
        if (cleanQuery.includes('wifi') || cleanQuery.includes('internet')) {
          if (text.includes('wifi') || text.includes('internet')) {
            score += 10;
            reasons.push('Ultra-fast fiber WiFi');
          }
        }
      }

      // Quality rating bonus
      if (pg.rating >= 4.8) {
        score += 5;
        reasons.push(`Top-rated property (★ ${pg.rating})`);
      }

      const matchPercentage = Math.min(99, Math.max(55, Math.round(score)));

      return {
        ...pg,
        aiScore: matchPercentage,
        aiReasons: reasons.slice(0, 3)
      };
    });

    scored.sort((a, b) => b.aiScore - a.aiScore);

    const topMatches = scored.slice(0, 6);

    let summaryMessage = `I analyzed our verified database and found ${topMatches.length} properties matching your preferences.`;
    if (topMatches.length > 0) {
      summaryMessage = `✨ Here are your top ${topMatches.length} AI-matched accommodations. ${topMatches[0].name} is your #1 match with a ${topMatches[0].aiScore}% compatibility score.`;
    }

    res.json({
      message: summaryMessage,
      matches: topMatches,
      detectedCriteria: {
        city: targetCity || 'All Cities',
        budget: targetMaxBudget || 'Flexible',
        propertyType: targetType || 'All Types',
        suitableFor: targetSuitable || 'All Categories'
      }
    });
  } catch (err) {
    console.error('AI match error:', err);
    res.status(500).json({ error: 'Failed to process AI recommendations' });
  }
});

app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message = '' } = req.body;
    const allPgs = await getAllPgs();
    const approved = allPgs.filter(p => p.status === 'approved');
    const msg = message.toLowerCase();

    let reply = '';
    let suggestedAction = null;
    let relevantPgs = [];

    if (msg.includes('rajkot')) {
      relevantPgs = approved.filter(p => p.address?.city?.toLowerCase() === 'rajkot').slice(0, 3);
      reply = `In Rajkot, we currently have verified properties including Pride Classic Luxury PG on Yogi Nagar Main Road (with 3-time Kathiyawadi homestyle meals and fiber internet). Rent starts from ₹12,500/mo with direct host connect.`;
      suggestedAction = { type: 'filter', city: 'Rajkot' };
    } else if (msg.includes('bengaluru') || msg.includes('bangalore')) {
      relevantPgs = approved.filter(p => p.address?.city?.toLowerCase() === 'bengaluru').slice(0, 3);
      reply = `In Bengaluru, we offer executive coliving spaces like The Imperial Crown in Koramangala and Prestige Silver Oak in Whitefield. These feature biometric security, attached private washrooms, and high-speed workspaces.`;
      suggestedAction = { type: 'filter', city: 'Bengaluru' };
    } else if (msg.includes('deposit') || msg.includes('security deposit')) {
      reply = `All properties on Vrundavan Ventures follow our Model Tenancy Guarantee: Security deposits are capped at 1.5x month's rent, held securely, and refunded within 7 days upon standard 30-day departure notice.`;
    } else if (msg.includes('brokerage') || msg.includes('fee') || msg.includes('commission')) {
      reply = `Direct Host Connect! You connect and chat directly with verified property hosts and owners via phone or WhatsApp with 100% direct communication.`;
    } else if (msg.includes('owner') || msg.includes('list') || msg.includes('register property')) {
      reply = `Are you a property owner? You can list your PG, room, or house in less than 2 minutes using our Host Portal with 100% direct tenant rental income!`;
      suggestedAction = { type: 'navigate', page: 'owner' };
    } else {
      relevantPgs = approved.slice(0, 3);
      reply = `Welcome to Vrundavan Ventures! I am your AI Accommodation Concierge. I can help you find verified rental houses, private rooms, and luxury PGs across India with direct host connect. Tell me your preferred city, budget, or university/office location!`;
    }

    res.json({
      reply,
      suggestedAction,
      relevantPgs
    });
  } catch (err) {
    console.error('AI chat error:', err);
    res.status(500).json({ error: 'AI Concierge temporarily unavailable' });
  }
});

// SITEMAP & ROBOTS.TXT FOR 100% SEO
app.get('/sitemap.xml', async (req, res) => {
  try {
    const pgs = await getAllPgs();
    const blogs = await getAllBlogs();
    const baseUrl = req.protocol + '://' + req.get('host');
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static pages
    const staticRoutes = [
      { loc: '/', priority: '1.0', changefreq: 'daily' },
      { loc: '/explore', priority: '0.9', changefreq: 'daily' },
      { loc: '/about', priority: '0.7', changefreq: 'monthly' },
      { loc: '/contact', priority: '0.7', changefreq: 'monthly' },
      { loc: '/blogs', priority: '0.8', changefreq: 'weekly' },
      { loc: '/terms', priority: '0.3', changefreq: 'yearly' },
      { loc: '/privacy', priority: '0.3', changefreq: 'yearly' }
    ];

    staticRoutes.forEach(r => {
      xml += `  <url>\n    <loc>${baseUrl}${r.loc}</loc>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>\n`;
    });

    // Approved PGs
    pgs.filter(p => p.status === 'approved').forEach(p => {
      xml += `  <url>\n    <loc>${baseUrl}/pg/${p.id}</loc>\n    <lastmod>${p.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    });

    // Blogs
    blogs.forEach(b => {
      xml += `  <url>\n    <loc>${baseUrl}/blog/${b.slug}</loc>\n    <lastmod>${b.publishedAt || new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Sitemap error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

app.get('/robots.txt', (req, res) => {
  const baseUrl = req.protocol + '://' + req.get('host');
  const content = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /superadmin
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;
  res.header('Content-Type', 'text/plain');
  res.send(content);
});

// START SERVER
export async function startServer() {
  await initDatabase();
  return app.listen(PORT, () => {
    console.log(`👑 Luxury PG Server running with prestige on port ${PORT}`);
    console.log(`API Base: http://localhost:${PORT}/api`);
    console.log(`🗄️ Database: ${isMySQLActive() ? 'Active MySQL Database (luxury_pg_db)' : 'JSON Database Backup'}`);
  });
}

// Only auto-listen if run directly
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  startServer();
}

export default app;
