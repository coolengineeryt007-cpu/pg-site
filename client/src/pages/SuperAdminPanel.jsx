import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Clock, 
  Building, 
  Users, 
  ShieldCheck, 
  BookOpen, 
  ExternalLink, 
  LogOut, 
  Menu, 
  X, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Trash2, 
  MessageCircle,
  MessageSquare,
  FileCheck,
  Phone,
  CreditCard,
  Receipt
} from 'lucide-react';
import { api } from '../services/api';

export default function SuperAdminPanel({ onSelectPg, onNavigateHome, onLogout }) {
  const [activeTab, setActiveTab] = useState('pending'); // 'overview', 'pending', 'properties', 'inquiries', 'owners', 'admins', 'blogs'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [allPgs, setAllPgs] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [filterCity, setFilterCity] = useState('all');
  const [filterType, setFilterType] = useState('all'); // 'all', 'house', 'room', 'pg'
  const [searchTerm, setSearchTerm] = useState('');
  const [actionMessage, setActionMessage] = useState(null);

  // Payments & Autopay Subscriptions state
  const [adminSubsData, setAdminSubsData] = useState(null);
  const [paymentSubTab, setPaymentSubTab] = useState('invoices'); // 'invoices', 'mandates'
  const [paymentSearch, setPaymentSearch] = useState('');
  const [selectedReceiptInvoice, setSelectedReceiptInvoice] = useState(null);

  const loadData = async () => {
    try {
      const statsRes = await api.getStats();
      setStats(statsRes);

      const pgsRes = await api.getPgs({ includeAllStatus: 'true' });
      setAllPgs(pgsRes.pgs || []);

      const inqRes = await api.getInquiries();
      setInquiries(inqRes || []);

      const blogsRes = await api.getBlogs();
      setBlogs(blogsRes || []);

      const subsRes = await api.getAdminSubscriptions();
      setAdminSubsData(subsRes);
    } catch (err) {
      console.error("Super Admin data fetch error:", err);
    }
  };

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateStatus = async (pgId, newStatus, reason = '') => {
    try {
      await api.updatePgStatus(pgId, newStatus, reason);
      setActionMessage({
        type: 'success',
        text: `Property status updated to: ${newStatus.toUpperCase()}`
      });
      await loadData();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      alert(err.message || 'Error updating PG status');
    }
  };

  const handleDeletePg = async (pgId) => {
    if (!window.confirm("Are you sure you want to permanently delete this property listing?")) return;
    try {
      await api.deletePg(pgId);
      setActionMessage({ type: 'success', text: "Listing removed permanently." });
      await loadData();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      alert(err.message || 'Error deleting property');
    }
  };

  const pendingPgs = allPgs.filter(p => p.status === 'pending_review');

  const filteredPgs = allPgs.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.ownerName && p.ownerName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCity = filterCity === 'all' || p.address.city.toLowerCase() === filterCity.toLowerCase();
    const matchesType = filterType === 'all' || (p.propertyType || 'pg') === filterType;
    return matchesSearch && matchesCity && matchesType;
  });

  return (
    <div className="admin-layout">
      {/* 1. SUPER ADMIN LUXURY SIDEBAR */}
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
              SUPER ADMIN
            </span>
            <span style={{ fontSize: '0.65rem', color: '#F87171', letterSpacing: '0.15em', fontWeight: 700 }}>
              VRUNDAVAN VENTURES
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="admin-nav">
          <span className="admin-nav-section">Executive Command</span>

          <button 
            onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}
            className={`admin-nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LayoutDashboard size={18} />
              <span>Platform Stats</span>
            </div>
          </button>

          <button 
            onClick={() => { setActiveTab('pending'); setSidebarOpen(false); }}
            className={`admin-nav-btn ${activeTab === 'pending' ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={18} style={{ color: 'var(--red-crimson)' }} />
              <span>Approval Queue</span>
            </div>
            {pendingPgs.length > 0 && (
              <span className="badge badge-crimson animate-pulse" style={{ fontSize: '0.7rem', padding: '2px 7px' }}>
                {pendingPgs.length}
              </span>
            )}
          </button>

          <span className="admin-nav-section">Database & Entities</span>

          <button 
            onClick={() => { setActiveTab('properties'); setSidebarOpen(false); }}
            className={`admin-nav-btn ${activeTab === 'properties' ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Building size={18} />
              <span>All Properties</span>
            </div>
            <span className="badge badge-gold" style={{ fontSize: '0.7rem', padding: '2px 7px' }}>
              {allPgs.length}
            </span>
          </button>

          <button 
            onClick={() => { setActiveTab('inquiries'); setSidebarOpen(false); }}
            className={`admin-nav-btn ${activeTab === 'inquiries' ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MessageSquare size={18} style={{ color: 'var(--blue-light)' }} />
              <span>All Tenant Leads</span>
            </div>
            <span className="badge badge-blue" style={{ fontSize: '0.7rem', padding: '2px 7px' }}>
              {inquiries.length}
            </span>
          </button>

          <button 
            onClick={() => { setActiveTab('owners'); setSidebarOpen(false); }}
            className={`admin-nav-btn ${activeTab === 'owners' ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={18} />
              <span>Property Hosts Directory</span>
            </div>
          </button>

          <button 
            onClick={() => { setActiveTab('payments'); setSidebarOpen(false); }}
            className={`admin-nav-btn ${activeTab === 'payments' ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CreditCard size={18} style={{ color: '#facc15' }} />
              <span>Order Payments & Autopay</span>
            </div>
            {adminSubsData?.totalRevenue > 0 && (
              <span className="badge badge-gold" style={{ fontSize: '0.7rem', padding: '2px 7px' }}>
                ₹{adminSubsData.totalRevenue}
              </span>
            )}
          </button>

          <button 
            onClick={() => { setActiveTab('blogs'); setSidebarOpen(false); }}
            className={`admin-nav-btn ${activeTab === 'blogs' ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BookOpen size={18} />
              <span>SEO Guides & Blogs</span>
            </div>
            <span className="badge badge-gold" style={{ fontSize: '0.7rem', padding: '2px 7px' }}>
              {blogs.length}
            </span>
          </button>

          <span className="admin-nav-section">System Governance</span>

          <button 
            onClick={() => { setActiveTab('admins'); setSidebarOpen(false); }}
            className={`admin-nav-btn ${activeTab === 'admins' ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={18} />
              <span>Root Admins (2-3)</span>
            </div>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="admin-sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '50%', background: 'var(--red-gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.9rem'
            }}>
              VS
            </div>
            <div style={{ overflow: 'hidden' }}>
              <strong style={{ color: '#fff', fontSize: '0.85rem', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                Vikramaditya Singhania
              </strong>
              <span style={{ color: '#F87171', fontSize: '0.7rem' }}>
                👑 Root Super Administrator
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
                <span>Root Governance</span>
                <span>/</span>
                <span style={{ color: 'var(--gold-primary)', textTransform: 'capitalize' }}>{activeTab}</span>
              </div>
              <h1 className="font-serif gold-gradient-text" style={{ fontSize: '1.6rem', fontWeight: 800 }}>
                {activeTab === 'overview' && 'Global Analytics & KPIs'}
                {activeTab === 'pending' && `Moderation Queue (${pendingPgs.length} Awaiting Approval)`}
                {activeTab === 'properties' && `Properties Database (${allPgs.length} Total)`}
                {activeTab === 'inquiries' && `Tenant Leads & Inquiries (${inquiries.length} Total)`}
                {activeTab === 'owners' && 'Property Hosts Directory'}
                {activeTab === 'payments' && `Host Order Payments & Recurring Autopay (${adminSubsData?.totalInvoices || 0} Orders)`}
                {activeTab === 'blogs' && 'SEO Editorial Content'}
                {activeTab === 'admins' && 'Privileged Super Administrators (2-3 Root Users)'}
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {stats?.databaseEngine && (
              <span className="badge badge-gold" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
                🗄️ {stats.databaseEngine}
              </span>
            )}
            <span className="badge badge-crimson" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
              <ShieldCheck size={13} /> Root Admin Authorized
            </span>
          </div>
        </div>

        {/* Global Toast */}
        {actionMessage && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid #10B981',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 18px',
            color: '#34D399',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <CheckCircle2 size={18} />
            <span>{actionMessage.text}</span>
          </div>
        )}

        {/* TAB: OVERVIEW / STATS */}
        {activeTab === 'overview' && (
          <div>
            {/* KPI Cards */}
            <div className="grid-4" style={{ marginBottom: '24px' }}>
              <div className="luxury-card" style={{ padding: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#888', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.78rem', textTransform: 'uppercase' }}>Total Properties</span>
                  <Building size={18} style={{ color: 'var(--gold-primary)' }} />
                </div>
                <h2 style={{ fontSize: '2rem', color: '#fff' }}>{allPgs.length}</h2>
                <span style={{ fontSize: '0.72rem', color: '#888' }}>Across all regions</span>
              </div>

              <div className="luxury-card" style={{ padding: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#888', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.78rem', textTransform: 'uppercase' }}>Live On Frontend</span>
                  <CheckCircle2 size={18} style={{ color: '#34D399' }} />
                </div>
                <h2 style={{ fontSize: '2rem', color: '#34D399' }}>{allPgs.filter(p => p.status === 'approved').length}</h2>
                <span style={{ fontSize: '0.72rem', color: '#34D399' }}>100% Vetted & Active</span>
              </div>

              <div className="luxury-card" style={{ padding: '22px', border: pendingPgs.length > 0 ? '1px solid var(--red-crimson)' : '' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#888', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.78rem', textTransform: 'uppercase' }}>Needs Approval</span>
                  <Clock size={18} style={{ color: 'var(--red-crimson)' }} />
                </div>
                <h2 style={{ fontSize: '2rem', color: pendingPgs.length > 0 ? '#F87171' : '#fff' }}>
                  {pendingPgs.length}
                </h2>
                <span style={{ fontSize: '0.72rem', color: '#F87171' }}>Awaiting Moderation</span>
              </div>

              <div className="luxury-card" style={{ padding: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#888', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.78rem', textTransform: 'uppercase' }}>Tenant Leads</span>
                  <MessageSquare size={18} style={{ color: 'var(--blue-light)' }} />
                </div>
                <h2 style={{ fontSize: '2rem', color: 'var(--blue-light)' }}>{inquiries.length}</h2>
                <span style={{ fontSize: '0.72rem', color: '#888' }}>Platform Inquiries</span>
              </div>

              <div className="luxury-card" style={{ padding: '22px', border: '1px solid rgba(234, 179, 8, 0.35)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#888', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.78rem', textTransform: 'uppercase' }}>Host Autopay Revenue</span>
                  <CreditCard size={18} style={{ color: '#facc15' }} />
                </div>
                <h2 style={{ fontSize: '2rem', color: '#facc15' }}>₹{adminSubsData?.totalRevenue || 0}</h2>
                <span style={{ fontSize: '0.72rem', color: '#38bdf8' }}>{adminSubsData?.totalInvoices || 0} Paid Orders (₹99 Model)</span>
              </div>

              <div className="luxury-card" style={{ padding: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#888', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.78rem', textTransform: 'uppercase' }}>Active e-Mandates</span>
                  <CheckCircle2 size={18} style={{ color: '#4ade80' }} />
                </div>
                <h2 style={{ fontSize: '2rem', color: '#4ade80' }}>{adminSubsData?.activeMandates || 0}</h2>
                <span style={{ fontSize: '0.72rem', color: '#888' }}>30-Day Auto-Renewal Active</span>
              </div>
            </div>

            {/* Property Types Distribution */}
            <div className="grid-3" style={{ marginBottom: '32px' }}>
              <div className="luxury-card" style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ color: '#888', fontSize: '0.8rem' }}>🏠 Houses & Flats</span>
                  <h3 style={{ color: '#fff', fontSize: '1.4rem', marginTop: '2px' }}>{allPgs.filter(p => p.propertyType === 'house').length}</h3>
                </div>
                <span className="badge badge-gold">Family & Exec</span>
              </div>

              <div className="luxury-card" style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ color: '#888', fontSize: '0.8rem' }}>🛏️ Private Rental Rooms</span>
                  <h3 style={{ color: '#fff', fontSize: '1.4rem', marginTop: '2px' }}>{allPgs.filter(p => p.propertyType === 'room').length}</h3>
                </div>
                <span className="badge badge-peacock">1RK & Studios</span>
              </div>

              <div className="luxury-card" style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ color: '#888', fontSize: '0.8rem' }}>🏢 PGs & Coliving</span>
                  <h3 style={{ color: '#fff', fontSize: '1.4rem', marginTop: '2px' }}>{allPgs.filter(p => !p.propertyType || p.propertyType === 'pg').length}</h3>
                </div>
                <span className="badge badge-blue">With Food & Maid</span>
              </div>
            </div>

            {/* Quick Review Shortcut */}
            {pendingPgs.length > 0 && (
              <div className="luxury-card" style={{
                padding: '24px',
                border: '1px solid var(--red-crimson)',
                background: 'rgba(185, 28, 28, 0.08)',
                marginBottom: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div>
                  <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '4px' }}>
                    ⚠️ {pendingPgs.length} Property Submissions Pending Verification
                  </h3>
                  <p style={{ color: '#bbb', fontSize: '0.88rem' }}>
                    Review submitted photos, location accuracy, and host pricing to publish them live to tenants and home seekers.
                  </p>
                </div>
                <button onClick={() => setActiveTab('pending')} className="btn btn-crimson btn-sm">
                  Open Approval Queue
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB: PENDING APPROVALS QUEUE */}
        {activeTab === 'pending' && (
          <div>
            {pendingPgs.length === 0 ? (
              <div className="luxury-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
                <FileCheck size={48} style={{ color: '#34D399', margin: '0 auto 16px auto', display: 'block' }} />
                <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '8px' }}>Approval Queue is Clean!</h3>
                <p style={{ color: '#888', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto' }}>
                  All submitted properties (houses, rooms, and PGs) have been vetted and approved. New submissions from hosts will appear here automatically.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {pendingPgs.map((pg) => (
                  <div 
                    key={pg.id}
                    className="luxury-card"
                    style={{
                      padding: '24px',
                      display: 'grid',
                      gridTemplateColumns: '140px 1fr auto',
                      gap: '24px',
                      alignItems: 'center'
                    }}
                  >
                    <img 
                      src={pg.photos?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=300&q=80'} 
                      alt={pg.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=300&q=80';
                      }}
                      style={{ width: '140px', height: '110px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #333' }}
                    />

                    <div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <h3 style={{ color: '#fff', fontSize: '1.25rem' }}>{pg.name}</h3>
                        <span className={`badge ${
                          pg.propertyType === 'house' ? 'badge-gold' : pg.propertyType === 'room' ? 'badge-peacock' : 'badge-blue'
                        }`} style={{ fontSize: '0.8rem', padding: '3px 8px' }}>
                          {pg.propertyType === 'house' ? `🏠 ${pg.bhk || 'Rental House'}` : pg.propertyType === 'room' ? `🛏️ ${pg.bhk || 'Rental Room'}` : `🏢 ${pg.gender} PG`}
                        </span>
                        {pg.suitableFor && (
                          <span className="badge badge-purple" style={{ fontSize: '0.75rem', padding: '3px 8px' }}>
                            👤 {pg.suitableFor}
                          </span>
                        )}
                        <span className="badge badge-gold">Pending Approval</span>
                      </div>

                      <p style={{ color: 'var(--gold-light)', fontSize: '0.9rem', marginBottom: '6px' }}>
                        📍 {pg.address.apartment ? `${pg.address.apartment}, ` : ''}{pg.address.addressLine1}, {pg.address.city}, {pg.address.state} ({pg.address.pincode})
                      </p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '0.85rem', color: '#aaa' }}>
                        <span>👤 Host: <strong style={{ color: '#fff' }}>{pg.ownerName}</strong> ({pg.ownerPhone})</span>
                        <span>💰 Rent: <strong style={{ color: 'var(--gold-primary)' }}>₹{pg.rent.toLocaleString('en-IN')}/mo</strong></span>
                        <span>🛡️ Deposit: ₹{pg.deposit.toLocaleString('en-IN')}</span>
                        {pg.furnishing && <span>🛋️ {pg.furnishing}</span>}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <button 
                        onClick={() => handleUpdateStatus(pg.id, 'approved')}
                        className="btn btn-gold btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <CheckCircle2 size={16} /> Approve & Publish
                      </button>

                      <button 
                        onClick={() => {
                          const reason = window.prompt("Enter rejection reason for Property Host:", "Incomplete photos or invalid address proof");
                          if (reason !== null) {
                            handleUpdateStatus(pg.id, 'rejected', reason);
                          }
                        }}
                        className="btn btn-crimson btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <XCircle size={16} /> Reject with Note
                      </button>

                      <button 
                        onClick={() => onSelectPg(pg)}
                        className="btn btn-ghost btn-sm"
                      >
                        <Eye size={14} /> Full Inspection
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: ALL PROPERTIES DATABASE */}
        {activeTab === 'properties' && (
          <div>
            {/* Search & Filter Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '280px', maxWidth: '400px' }}>
                <input 
                  type="text" 
                  placeholder="Search property name, city, or owner..."
                  className="form-input"
                  style={{ padding: '8px 12px' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                {/* Category Filter Pills */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {[
                    { id: 'all', label: `All (${allPgs.length})` },
                    { id: 'house', label: `🏠 Houses (${allPgs.filter(p => p.propertyType === 'house').length})` },
                    { id: 'room', label: `🛏️ Rooms (${allPgs.filter(p => p.propertyType === 'room').length})` },
                    { id: 'pg', label: `🏢 PGs (${allPgs.filter(p => !p.propertyType || p.propertyType === 'pg').length})` }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setFilterType(tab.id)}
                      className={`btn btn-sm ${filterType === tab.id ? 'btn-gold' : 'btn-ghost'}`}
                      style={{ fontSize: '0.78rem', padding: '5px 10px' }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <select 
                  className="form-select"
                  style={{ padding: '8px 14px', width: 'auto' }}
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                >
                  <option value="all">All Cities</option>
                  <option value="Rajkot">Rajkot</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Pune">Pune</option>
                  <option value="Gurugram">Gurugram</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Hyderabad">Hyderabad</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="luxury-card" style={{ overflowX: 'auto', padding: '0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: '#121212', borderBottom: '1px solid rgba(212,175,55,0.2)', color: 'var(--gold-primary)' }}>
                    <th style={{ padding: '14px 18px' }}>Property</th>
                    <th style={{ padding: '14px 18px' }}>Type & Suitability</th>
                    <th style={{ padding: '14px 18px' }}>Location</th>
                    <th style={{ padding: '14px 18px' }}>Host</th>
                    <th style={{ padding: '14px 18px' }}>Rent</th>
                    <th style={{ padding: '14px 18px' }}>Status</th>
                    <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPgs.map((pg) => (
                    <tr key={pg.id} style={{ borderBottom: '1px solid #1c1c1c' }}>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img 
                            src={pg.photos?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=100&q=80'} 
                            alt={pg.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=100&q=80';
                            }}
                            style={{ width: '45px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                          />
                          <div>
                            <strong style={{ color: '#fff', display: 'block' }}>{pg.name}</strong>
                            <span style={{ fontSize: '0.75rem', color: '#888' }}>{pg.address.apartment || pg.address.area}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <span className={`badge ${
                          pg.propertyType === 'house' ? 'badge-gold' : pg.propertyType === 'room' ? 'badge-peacock' : 'badge-blue'
                        }`} style={{ fontSize: '0.75rem', padding: '2px 8px', display: 'inline-block', marginBottom: '3px' }}>
                          {pg.propertyType === 'house' ? `🏠 ${pg.bhk || 'House'}` : pg.propertyType === 'room' ? `🛏️ ${pg.bhk || 'Room'}` : `🏢 ${pg.gender} PG`}
                        </span>
                        {pg.suitableFor && (
                          <div style={{ fontSize: '0.72rem', color: '#aaa' }}>
                            👤 {pg.suitableFor}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '14px 18px', color: '#ccc' }}>
                        {pg.address.area}, {pg.address.city}
                      </td>
                      <td style={{ padding: '14px 18px', color: '#ccc' }}>
                        {pg.ownerName}
                      </td>
                      <td style={{ padding: '14px 18px', color: 'var(--gold-primary)', fontWeight: 700 }}>
                        ₹{pg.rent.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <span className={`badge ${
                          pg.status === 'approved' ? 'badge-green' : pg.status === 'pending_review' ? 'badge-gold' : 'badge-crimson'
                        }`}>
                          {pg.status === 'pending_review' ? 'Pending' : pg.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          {pg.status !== 'approved' && (
                            <button 
                              onClick={() => handleUpdateStatus(pg.id, 'approved')}
                              className="btn btn-gold btn-sm"
                              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                              title="Approve"
                            >
                              Approve
                            </button>
                          )}
                          <button 
                            onClick={() => onSelectPg(pg)}
                            className="btn btn-ghost btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                            title="View"
                          >
                            <Eye size={13} />
                          </button>
                          <button 
                            onClick={() => handleDeletePg(pg.id)}
                            style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                            title="Delete Listing"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: TENANT INQUIRIES & LEADS */}
        {activeTab === 'inquiries' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ color: '#fff', fontSize: '1.3rem' }}>Platform-Wide Tenant Leads</h3>
                <p style={{ color: '#888', fontSize: '0.85rem' }}>All inquiries submitted by tenants, bachelors, families, and students.</p>
              </div>
              <span className="badge badge-blue" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                {inquiries.length} Total Inquiries Recorded
              </span>
            </div>

            {inquiries.length === 0 ? (
              <div className="luxury-card" style={{ padding: '50px 20px', textAlign: 'center' }}>
                <Users size={40} style={{ color: 'var(--gold-primary)', margin: '0 auto 12px auto' }} />
                <h4 style={{ color: '#fff', fontSize: '1.1rem' }}>No Tenant Inquiries Yet</h4>
                <p style={{ color: '#888', fontSize: '0.85rem' }}>When users click Schedule Visit on any property, inquiries will be logged here.</p>
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <h4 style={{ color: '#fff', fontSize: '1.15rem' }}>
                          {inq.userName}
                        </h4>
                        <span className="badge badge-green">New Lead</span>
                        <span className="badge badge-gold">{inq.sharingType || 'Standard'}</span>
                      </div>
                      <p style={{ color: 'var(--gold-primary)', fontSize: '0.9rem', marginBottom: '6px' }}>
                        Interested in: <strong>{inq.pgName}</strong>
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', color: '#aaa', fontSize: '0.85rem' }}>
                        <span>📞 Phone: <strong style={{ color: '#fff' }}>{inq.userPhone}</strong></span>
                        {inq.userEmail && <span>✉️ Email: {inq.userEmail}</span>}
                        {inq.visitDate && <span>📅 Visit Date: <strong style={{ color: 'var(--gold-light)' }}>{inq.visitDate}</strong></span>}
                        <span>🕒 Received: {new Date(inq.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      {inq.message && (
                        <p style={{ color: '#bbb', fontSize: '0.88rem', marginTop: '8px', background: '#111', padding: '8px 12px', borderRadius: '6px', border: '1px solid #222' }}>
                          💬 "{inq.message}"
                        </p>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <a 
                        href={`https://wa.me/${inq.userPhone?.replace(/[^0-9]/g, '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-outline-gold btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <MessageCircle size={15} style={{ color: '#25D366' }} /> WhatsApp Lead
                      </a>
                      <a 
                        href={`tel:${inq.userPhone}`} 
                        className="btn btn-gold btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Phone size={15} /> Call
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: OWNERS DIRECTORY */}
        {activeTab === 'owners' && (
          <div>
            <div className="grid-2">
              <div className="luxury-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                  <div style={{
                    width: '46px', height: '46px', borderRadius: '50%', background: 'var(--gold-gradient)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#080808', fontWeight: 800
                  }}>
                    RS
                  </div>
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '1.15rem' }}>Rajesh Sharma</h4>
                    <span className="badge badge-gold">Active Host</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#aaa', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span>Email: <strong>rajesh@royalpg.com</strong></span>
                  <span>Phone: +91 98765 43210</span>
                  <span>Managed Properties: <strong>{allPgs.filter(p => p.ownerId === 'usr-owner-1').length} Residences</strong></span>
                </div>
              </div>

              <div className="luxury-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                  <div style={{
                    width: '46px', height: '46px', borderRadius: '50%', background: 'var(--gold-gradient)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#080808', fontWeight: 800
                  }}>
                    PM
                  </div>
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '1.15rem' }}>Priya Malhotra</h4>
                    <span className="badge badge-gold">Active Host</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#aaa', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span>Email: <strong>priya@elitepg.com</strong></span>
                  <span>Phone: +91 98111 87654</span>
                  <span>Managed Properties: <strong>{allPgs.filter(p => p.ownerId === 'usr-owner-2').length} Residences</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: BLOGS */}
        {activeTab === 'blogs' && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {blogs.map((b) => (
                <div key={b.id} className="luxury-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '4px' }}>{b.title}</h4>
                    <span style={{ color: 'var(--gold-primary)', fontSize: '0.8rem' }}>Author: {b.author} • {b.readTime}</span>
                  </div>
                  <span className="badge badge-green">Published Live</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: SUPER ADMINS (2-3 Users) */}
        {activeTab === 'admins' && (
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
              As per platform architecture, Super Admin privileges are restricted to 2-3 authorized accounts with root verification capabilities.
            </p>

            <div className="grid-2">
              <div className="luxury-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                  <div style={{
                    width: '50px', height: '50px', borderRadius: '50%', background: 'var(--red-gradient)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800
                  }}>
                    VS
                  </div>
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '1.15rem' }}>Vikramaditya Singhania</h4>
                    <span className="badge badge-crimson">Primary Super Admin</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#aaa', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span>Email: <strong>superadmin@luxurypg.com</strong></span>
                  <span>Phone: +91 99999 11111</span>
                  <span>Permissions: Full Root, Moderation, Financial Approval</span>
                </div>
              </div>

              <div className="luxury-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                  <div style={{
                    width: '50px', height: '50px', borderRadius: '50%', background: 'var(--gold-gradient)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#080808', fontWeight: 800
                  }}>
                    AD
                  </div>
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '1.15rem' }}>Ananya Deshmukh</h4>
                    <span className="badge badge-gold">Associate Super Admin</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#aaa', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span>Email: <strong>admin2@luxurypg.com</strong></span>
                  <span>Phone: +91 99999 22222</span>
                  <span>Permissions: Quality Verification & Content Publishing</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: ORDERS, PAYMENTS & RECURRING AUTOPAY */}
        {activeTab === 'payments' && (
          <div>
            {/* Top Revenue KPIs */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
              marginBottom: '28px'
            }}>
              <div className="luxury-card" style={{ padding: '22px', border: '1px solid rgba(234, 179, 8, 0.4)' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, marginBottom: '6px' }}>Total Platform Revenue</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#facc15', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                  ₹{adminSubsData?.totalRevenue || 0}
                </div>
                <div style={{ fontSize: '12px', color: '#38bdf8', marginTop: '4px' }}>
                  Collected from ₹99 Activation & 30-Day Autopay
                </div>
              </div>

              <div className="luxury-card" style={{ padding: '22px' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, marginBottom: '6px' }}>Active e-Mandates</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#4ade80' }}>
                  {adminSubsData?.activeMandates || 0} Hosts
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                  Authorized UPI Autopay / Bank Mandates
                </div>
              </div>

              <div className="luxury-card" style={{ padding: '22px' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, marginBottom: '6px' }}>Recurring Autopay Cut</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#38bdf8' }}>
                  ₹99
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                  Fixed Cycle: Every 30 Days / Host
                </div>
              </div>

              <div className="luxury-card" style={{ padding: '22px' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, marginBottom: '6px' }}>Total Invoices Generated</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#e2e8f0' }}>
                  {adminSubsData?.totalInvoices || 0}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                  100% Tax Compliant Digital Receipts
                </div>
              </div>
            </div>

            {/* Filter and Sub-Tab Navigation Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setPaymentSubTab('invoices')}
                  className={`btn btn-sm ${paymentSubTab === 'invoices' ? 'btn-gold' : 'btn-ghost'}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Receipt size={15} />
                  <span>All Invoices & Orders ({adminSubsData?.allInvoices?.length || 0})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentSubTab('mandates')}
                  className={`btn btn-sm ${paymentSubTab === 'mandates' ? 'btn-gold' : 'btn-ghost'}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <CreditCard size={15} />
                  <span>Host Mandates Directory ({adminSubsData?.ownerSubscriptions?.length || 0})</span>
                </button>
              </div>

              <div style={{ position: 'relative', minWidth: '280px' }}>
                <input
                  type="text"
                  placeholder="Search by Host, Invoice #, or Mandate..."
                  value={paymentSearch}
                  onChange={(e) => setPaymentSearch(e.target.value)}
                  className="form-input"
                  style={{ padding: '8px 14px', fontSize: '13px' }}
                />
              </div>
            </div>

            {/* SUB-VIEW 1: INVOICES & ORDERS TABLE */}
            {paymentSubTab === 'invoices' && (
              <div className="luxury-card" style={{ padding: '24px 28px' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8' }}>
                        <th style={{ padding: '12px 14px' }}>Invoice ID</th>
                        <th style={{ padding: '12px 14px' }}>Date</th>
                        <th style={{ padding: '12px 14px' }}>Host / Owner</th>
                        <th style={{ padding: '12px 14px' }}>Order Description</th>
                        <th style={{ padding: '12px 14px' }}>Payment Mode</th>
                        <th style={{ padding: '12px 14px' }}>Amount</th>
                        <th style={{ padding: '12px 14px' }}>e-Mandate Ref</th>
                        <th style={{ padding: '12px 14px' }}>Status</th>
                        <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(adminSubsData?.allInvoices || [])
                        .filter(inv => {
                          const s = paymentSearch.toLowerCase();
                          return (
                            inv.id?.toLowerCase().includes(s) ||
                            inv.ownerName?.toLowerCase().includes(s) ||
                            inv.ownerEmail?.toLowerCase().includes(s) ||
                            inv.mandateId?.toLowerCase().includes(s) ||
                            inv.transactionRef?.toLowerCase().includes(s)
                          );
                        })
                        .map((inv) => (
                          <tr key={`${inv.id}-${inv.transactionRef}`} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: 800, color: '#facc15' }}>
                              {inv.id}
                            </td>
                            <td style={{ padding: '12px 14px', color: '#cbd5e1' }}>
                              {new Date(inv.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </td>
                            <td style={{ padding: '12px 14px' }}>
                              <div style={{ fontWeight: 700, color: '#fff' }}>{inv.ownerName}</div>
                              <div style={{ fontSize: '11px', color: '#94a3b8' }}>{inv.ownerEmail}</div>
                            </td>
                            <td style={{ padding: '12px 14px', color: '#e2e8f0', fontWeight: 600 }}>
                              {inv.description}
                            </td>
                            <td style={{ padding: '12px 14px', color: '#38bdf8' }}>
                              {inv.autopayMethod || inv.method || 'UPI Autopay'}
                            </td>
                            <td style={{ padding: '12px 14px', color: '#facc15', fontWeight: 900, fontSize: '15px' }}>
                              ₹{inv.amount}
                            </td>
                            <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '11px', color: '#94a3b8' }}>
                              {inv.mandateId || 'MNDT-AUTO'}
                            </td>
                            <td style={{ padding: '12px 14px' }}>
                              <span className="badge badge-green" style={{ fontSize: '11px', textTransform: 'uppercase' }}>
                                {inv.status || 'Paid'}
                              </span>
                            </td>
                            <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                              <button
                                type="button"
                                onClick={() => setSelectedReceiptInvoice(inv)}
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
            )}

            {/* SUB-VIEW 2: HOST MANDATES DIRECTORY */}
            {paymentSubTab === 'mandates' && (
              <div className="luxury-card" style={{ padding: '24px 28px' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8' }}>
                        <th style={{ padding: '12px 14px' }}>Host Name</th>
                        <th style={{ padding: '12px 14px' }}>Email & Phone</th>
                        <th style={{ padding: '12px 14px' }}>e-Mandate Reference</th>
                        <th style={{ padding: '12px 14px' }}>Payment Mode</th>
                        <th style={{ padding: '12px 14px' }}>Recurring Fee</th>
                        <th style={{ padding: '12px 14px' }}>Next Auto-Debit</th>
                        <th style={{ padding: '12px 14px' }}>Days Left</th>
                        <th style={{ padding: '12px 14px' }}>Mandate Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(adminSubsData?.ownerSubscriptions || [])
                        .filter(o => {
                          const s = paymentSearch.toLowerCase();
                          return (
                            o.name?.toLowerCase().includes(s) ||
                            o.email?.toLowerCase().includes(s) ||
                            o.subscription?.mandateId?.toLowerCase().includes(s)
                          );
                        })
                        .map(o => {
                          const sub = o.subscription || {};
                          return (
                            <tr key={o.ownerId} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                              <td style={{ padding: '12px 14px', fontWeight: 800, color: '#fff' }}>
                                {o.name}
                              </td>
                              <td style={{ padding: '12px 14px', color: '#cbd5e1' }}>
                                <div>{o.email}</div>
                                <div style={{ fontSize: '11px', color: '#94a3b8' }}>{o.phone || 'No phone'}</div>
                              </td>
                              <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: 700, color: '#facc15' }}>
                                {sub.mandateId || 'Pending Activation'}
                              </td>
                              <td style={{ padding: '12px 14px', color: '#38bdf8' }}>
                                {sub.autopayMethod || 'UPI Autopay'}
                              </td>
                              <td style={{ padding: '12px 14px', fontWeight: 800, color: '#facc15' }}>
                                ₹{sub.recurringAmount || 99} / 30d
                              </td>
                              <td style={{ padding: '12px 14px', color: '#e2e8f0' }}>
                                {sub.nextBillingDate ? new Date(sub.nextBillingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                              </td>
                              <td style={{ padding: '12px 14px', color: '#4ade80', fontWeight: 700 }}>
                                {sub.daysRemaining ?? 30} Days
                              </td>
                              <td style={{ padding: '12px 14px' }}>
                                <span className={`badge ${sub.status === 'active' ? 'badge-green' : 'badge-crimson'}`} style={{ fontSize: '11px', textTransform: 'uppercase' }}>
                                  {sub.status === 'active' ? 'Active (Autopay Enabled)' : (sub.status || 'Pending')}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUPER ADMIN TAX RECEIPT MODAL */}
            {selectedReceiptInvoice && (
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
                  border: '1px solid rgba(234, 179, 8, 0.4)',
                  borderRadius: '20px',
                  maxWidth: '520px',
                  width: '100%',
                  padding: '28px',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.85)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '14px', marginBottom: '20px' }}>
                    <div>
                      <span className="gold-gradient-text font-serif" style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                        VRUNDAVAN VENTURES
                      </span>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>TAX INVOICE & NPCI AUTOPAY RECEIPT</div>
                    </div>
                    <button onClick={() => setSelectedReceiptInvoice(null)} className="btn btn-ghost btn-sm">
                      <X size={18} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#cbd5e1', marginBottom: '16px' }}>
                    <div>
                      <div><strong>Invoice #:</strong> {selectedReceiptInvoice.id}</div>
                      <div><strong>Date:</strong> {new Date(selectedReceiptInvoice.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div><strong>Host:</strong> {selectedReceiptInvoice.ownerName || 'Property Host'}</div>
                      <div><strong>e-Mandate:</strong> {selectedReceiptInvoice.mandateId}</div>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                      <span style={{ color: '#fff' }}>{selectedReceiptInvoice.description}</span>
                      <span style={{ color: '#facc15', fontWeight: 800 }}>₹{selectedReceiptInvoice.amount}.00</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8' }}>
                      <span>Payment Method</span>
                      <span>{selectedReceiptInvoice.autopayMethod || selectedReceiptInvoice.method || 'UPI Autopay'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                      <span>Transaction Ref</span>
                      <span style={{ fontFamily: 'monospace' }}>{selectedReceiptInvoice.transactionRef || 'TXN-998822'}</span>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '12px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800 }}>
                      <span style={{ color: '#fff' }}>Total Settled</span>
                      <span style={{ color: '#facc15' }}>₹{selectedReceiptInvoice.amount}.00</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button onClick={() => window.print()} className="btn btn-gold btn-sm">
                      Print / Save Receipt
                    </button>
                    <button onClick={() => setSelectedReceiptInvoice(null)} className="btn btn-ghost btn-sm">
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
