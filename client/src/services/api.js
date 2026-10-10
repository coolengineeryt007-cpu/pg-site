const API_BASE = '/api';

export const api = {
  // Authentication
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to login');
    return data;
  },

  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to register');
    return data;
  },

  // PG Listings
  async getPgs(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });

    const res = await fetch(`${API_BASE}/pgs?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch PGs');
    return res.json();
  },

  async getPgById(id) {
    const res = await fetch(`${API_BASE}/pgs/${id}`);
    if (!res.ok) throw new Error('Failed to fetch PG details');
    return res.json();
  },

  async createPg(pgData) {
    const res = await fetch(`${API_BASE}/pgs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pgData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create PG');
    return data;
  },

  async updatePg(id, pgData) {
    const res = await fetch(`${API_BASE}/pgs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pgData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update PG');
    return data;
  },

  async updatePgStatus(id, status, statusReason = '') {
    const res = await fetch(`${API_BASE}/pgs/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, statusReason })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update PG status');
    return data;
  },

  async deletePg(id) {
    const res = await fetch(`${API_BASE}/pgs/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete PG');
    return data;
  },

  // Inquiries
  async submitInquiry(inquiryData) {
    const res = await fetch(`${API_BASE}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiryData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit inquiry');
    return data;
  },

  async getInquiries(ownerId) {
    const query = ownerId ? `?ownerId=${ownerId}` : '';
    const res = await fetch(`${API_BASE}/inquiries${query}`);
    if (!res.ok) throw new Error('Failed to fetch inquiries');
    return res.json();
  },

  // Blogs
  async getBlogs() {
    const res = await fetch(`${API_BASE}/blogs`);
    if (!res.ok) throw new Error('Failed to fetch blogs');
    return res.json();
  },

  async getBlogBySlug(slug) {
    const res = await fetch(`${API_BASE}/blogs/${slug}`);
    if (!res.ok) throw new Error('Failed to fetch blog post');
    return res.json();
  },

  // Super Admin Stats
  async getStats() {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to fetch platform stats');
    return res.json();
  },

  // AI Matchmaker & Concierge Engine
  async aiMatch(payload = {}) {
    const res = await fetch(`${API_BASE}/ai/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to get AI recommendations');
    return res.json();
  },

  async aiChat(message) {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    if (!res.ok) throw new Error('Failed to communicate with AI Concierge');
    return res.json();
  }
};
