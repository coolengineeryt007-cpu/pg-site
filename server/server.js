import express from 'express';
import cors from 'cors';
import { readDB, writeDB, calculateDistanceKm } from './data/store.js';

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
  res.json({ status: 'ok', service: 'Luxury PG API Engine', timestamp: new Date().toISOString() });
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
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = readDB();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;
  const token = `token-${user.id}-${Date.now()}`;

  res.json({
    message: 'Login successful',
    token,
    user: userWithoutPassword
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role = 'owner', phone } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const db = readDB();
  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
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
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDB(db);

  const { password: _, ...userWithoutPassword } = newUser;
  const token = `token-${newUser.id}-${Date.now()}`;

  res.status(201).json({
    message: 'Registration successful',
    token,
    user: userWithoutPassword
  });
});

// PG LISTINGS ROUTES
app.get('/api/pgs', (req, res) => {
  const db = readDB();
  let list = [...db.pgs];

  const {
    lat,
    lng,
    radius,
    search,
    city,
    gender,
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
    // Super admin or full view
    if (status) {
      list = list.filter(pg => pg.status === status);
    }
  } else if (ownerId) {
    // Owner sees their own regardless of status
    list = list.filter(pg => pg.ownerId === ownerId);
    if (status) {
      list = list.filter(pg => pg.status === status);
    }
  } else {
    // Default public view
    list = list.filter(pg => pg.status === 'approved');
  }

  // Text search
  if (search) {
    const q = search.toLowerCase().trim();
    list = list.filter(pg => 
      pg.name.toLowerCase().includes(q) ||
      pg.address.city.toLowerCase().includes(q) ||
      pg.address.area.toLowerCase().includes(q) ||
      pg.address.state.toLowerCase().includes(q) ||
      pg.address.apartment?.toLowerCase().includes(q) ||
      pg.address.pincode?.includes(q)
    );
  }

  // Filter by City
  if (city && city !== 'all') {
    list = list.filter(pg => pg.address.city.toLowerCase() === city.toLowerCase());
  }

  // Filter by Gender
  if (gender && gender !== 'all') {
    list = list.filter(pg => pg.gender.toLowerCase() === gender.toLowerCase());
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
        const dist = calculateDistanceKm(userLat, userLng, pg.address.lat, pg.address.lng);
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
});

app.get('/api/pgs/:id', (req, res) => {
  const db = readDB();
  const pg = db.pgs.find(p => p.id === req.params.id);

  if (!pg) {
    return res.status(404).json({ error: 'PG accommodation not found' });
  }

  const reviews = db.reviews.filter(r => r.pgId === pg.id);
  res.json({ ...pg, reviews });
});

// CREATE PG (Owner defaults to pending_review or draft)
app.post('/api/pgs', (req, res) => {
  const db = readDB();
  const data = req.body;

  if (!data.name || !data.rent || !data.address) {
    return res.status(400).json({ error: 'Name, Rent, and Address are required' });
  }

  const newPg = {
    id: `pg-${Date.now()}`,
    name: data.name,
    ownerId: data.ownerId || 'usr-owner-1',
    ownerName: data.ownerName || 'Property Host',
    ownerPhone: data.ownerPhone || '+91 98765 43210',
    ownerWhatsapp: data.ownerWhatsapp || data.ownerPhone || '+919876543210',
    gender: data.gender || 'Co-ed',
    status: data.isDraft ? 'draft' : 'pending_review', // Pending Super Admin Approval!
    featured: false,
    rating: 5.0,
    reviewsCount: 0,
    rent: Number(data.rent),
    deposit: Number(data.deposit || data.rent * 1.5),
    noticePeriodDays: Number(data.noticePeriodDays || 30),
    description: data.description || 'Modern luxury PG accommodation.',
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

  db.pgs.unshift(newPg);
  writeDB(db);

  res.status(201).json({
    message: newPg.status === 'pending_review' 
      ? 'PG listing created and submitted for Super Admin approval!' 
      : 'PG draft saved successfully',
    pg: newPg
  });
});

// UPDATE PG
app.put('/api/pgs/:id', (req, res) => {
  const db = readDB();
  const index = db.pgs.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'PG not found' });
  }

  const existing = db.pgs[index];
  const updated = {
    ...existing,
    ...req.body,
    address: { ...existing.address, ...(req.body.address || {}) },
    updatedAt: new Date().toISOString()
  };

  db.pgs[index] = updated;
  writeDB(db);

  res.json({ message: 'PG listing updated successfully', pg: updated });
});

// SUPER ADMIN APPROVE / REJECT PG
app.patch('/api/pgs/:id/status', (req, res) => {
  const { status, statusReason } = req.body;
  if (!['approved', 'rejected', 'pending_review', 'draft'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const db = readDB();
  const pg = db.pgs.find(p => p.id === req.params.id);

  if (!pg) {
    return res.status(404).json({ error: 'PG not found' });
  }

  pg.status = status;
  if (statusReason !== undefined) {
    pg.statusReason = statusReason;
  }
  pg.statusUpdatedAt = new Date().toISOString();

  writeDB(db);

  res.json({
    message: `PG status updated to ${status}`,
    pg
  });
});

// DELETE PG
app.delete('/api/pgs/:id', (req, res) => {
  const db = readDB();
  const index = db.pgs.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'PG not found' });
  }

  db.pgs.splice(index, 1);
  writeDB(db);

  res.json({ message: 'PG listing removed successfully' });
});

// BLOGS
app.get('/api/blogs', (req, res) => {
  const db = readDB();
  res.json(db.blogs);
});

app.get('/api/blogs/:slug', (req, res) => {
  const db = readDB();
  const blog = db.blogs.find(b => b.slug === req.params.slug || b.id === req.params.slug);
  if (!blog) {
    return res.status(404).json({ error: 'Blog not found' });
  }
  res.json(blog);
});

// INQUIRIES
app.post('/api/inquiries', (req, res) => {
  const { pgId, userName, userPhone, userEmail, sharingType, visitDate, message } = req.body;
  if (!pgId || !userName || !userPhone) {
    return res.status(400).json({ error: 'PG ID, Name, and Phone are required' });
  }

  const db = readDB();
  const pg = db.pgs.find(p => p.id === pgId);

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

  db.inquiries.unshift(newInquiry);
  writeDB(db);

  res.status(201).json({ message: 'Visit inquiry submitted successfully!', inquiry: newInquiry });
});

app.get('/api/inquiries', (req, res) => {
  const { ownerId } = req.query;
  const db = readDB();
  let list = db.inquiries;

  if (ownerId) {
    list = list.filter(i => i.ownerId === ownerId);
  }

  res.json(list);
});

// SUPER ADMIN ANALYTICS
app.get('/api/stats', (req, res) => {
  const db = readDB();
  const totalPgs = db.pgs.length;
  const approvedPgs = db.pgs.filter(p => p.status === 'approved').length;
  const pendingApprovals = db.pgs.filter(p => p.status === 'pending_review').length;
  const draftPgs = db.pgs.filter(p => p.status === 'draft').length;
  const totalOwners = db.users.filter(u => u.role === 'owner').length;
  const totalInquiries = db.inquiries.length;
  const totalBlogs = db.blogs.length;

  res.json({
    totalPgs,
    approvedPgs,
    pendingApprovals,
    draftPgs,
    totalOwners,
    totalInquiries,
    totalBlogs
  });
});

// SITEMAP & ROBOTS.TXT FOR 100% SEO
app.get('/sitemap.xml', (req, res) => {
  const db = readDB();
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
  db.pgs.filter(p => p.status === 'approved').forEach(p => {
    xml += `  <url>\n    <loc>${baseUrl}/pg/${p.id}</loc>\n    <lastmod>${p.createdAt.split('T')[0]}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
  });

  // Blogs
  db.blogs.forEach(b => {
    xml += `  <url>\n    <loc>${baseUrl}/blog/${b.slug}</loc>\n    <lastmod>${b.publishedAt}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  });

  xml += `</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
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

// START SERVER (Only listen when running standalone)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`👑 Luxury PG Server running with prestige on port ${PORT}`);
    console.log(`API Base: http://localhost:${PORT}/api`);
  });
}

export default app;
