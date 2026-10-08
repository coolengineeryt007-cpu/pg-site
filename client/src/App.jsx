import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

import Home from './pages/Home';
import Explore from './pages/Explore';
import PgDetailView from './components/PgDetailView';
import OwnerPanel from './pages/OwnerPanel';
import SuperAdminPanel from './pages/SuperAdminPanel';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import Legal from './pages/Legal';

import { api } from './services/api';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [selectedPg, setSelectedPg] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [exploreFilter, setExploreFilter] = useState({});
  const [allPgs, setAllPgs] = useState([]);
  
  // Auth state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aurelia_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState('owner');

  // Load initial approved PGs for home & exploration
  useEffect(() => {
    api.getPgs()
      .then((res) => setAllPgs(res.pgs || []))
      .catch((err) => console.error("Error loading initial PGs:", err));
  }, []);

  // 100% On-Page SEO: Dynamic Title and Meta Management
  useEffect(() => {
    let title = "AURELIA | Luxury PG & Coliving Residences";
    let desc = "Discover India's most prestigious Paying Guest & Coliving spaces with chef-curated dining, biometric security, and fiber WiFi.";

    if (activePage === 'home') {
      title = "AURELIA | Luxury PG & Coliving Residences in India";
    } else if (activePage === 'explore' || activePage === 'nearme') {
      title = "Explore Luxury PGs Near You | Real-time GPS Proximity | Aurelia";
      desc = "Browse verified executive and student Paying Guest accommodations with single/shared rooms and Google Maps live directions.";
    } else if (activePage === 'detail' && selectedPg) {
      title = `${selectedPg.name} in ${selectedPg.address?.area}, ${selectedPg.address?.city} | Aurelia Luxury PG`;
      desc = `Book ${selectedPg.name} with Starting Rent ₹${selectedPg.rent}/mo. Verified ${selectedPg.gender} PG with gourmet dining, AC, and 100% deposit guarantee.`;
    } else if (activePage === 'owner') {
      title = "PG Owner Admin Panel | List Your Property with Google Maps | Aurelia";
    } else if (activePage === 'superadmin') {
      title = "Super Admin Control Center | Listing Moderation Queue | Aurelia";
    } else if (activePage === 'about') {
      title = "About Us & Executive Founders | Aurelia Luxury Living";
      desc = "Learn about Aurelia's founders Vikramaditya Singhania and Priya Malhotra, our quality manifesto, and student welfare standards.";
    } else if (activePage === 'contact') {
      title = "Contact Us & Concierge | Aurelia Residences";
    } else if (activePage === 'blogs') {
      title = "Coliving & PG Living Guides | Aurelia Blog";
    } else if (activePage === 'blog-detail' && selectedBlog) {
      title = `${selectedBlog.title} | Aurelia Guide`;
      desc = selectedBlog.excerpt;
    } else if (activePage === 'terms' || activePage === 'privacy') {
      title = "Legal Compliance & Policies | Aurelia Living";
    }

    document.title = title;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', desc);
    }
  }, [activePage, selectedPg, selectedBlog]);

  const handleNavigate = (page, filter = {}) => {
    if (page === 'nearme') {
      setActivePage('explore');
      setExploreFilter({ nearMeNow: true });
    } else {
      setActivePage(page);
      setExploreFilter(filter);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPg = (pg) => {
    setSelectedPg(pg);
    setActivePage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBlog = (blog) => {
    setSelectedBlog(blog);
    setActivePage('blog-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('aurelia_user', JSON.stringify(user));
    if (user.role === 'superadmin') {
      setActivePage('superadmin');
    } else if (user.role === 'owner') {
      setActivePage('owner');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('aurelia_user');
    setActivePage('home');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar */}
      <Navbar 
        activePage={activePage}
        setActivePage={(p) => handleNavigate(p)}
        currentUser={currentUser}
        onLoginClick={(role = 'owner') => {
          setAuthModalRole(role);
          setAuthModalOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* Main Content Router */}
      <main style={{ flex: 1 }}>
        {activePage === 'home' && (
          <Home 
            pgs={allPgs}
            onSelectPg={handleSelectPg}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'explore' && (
          <Explore 
            onSelectPg={handleSelectPg}
            initialFilter={exploreFilter}
          />
        )}

        {activePage === 'detail' && selectedPg && (
          <PgDetailView 
            pg={selectedPg}
            onBack={() => setActivePage('explore')}
          />
        )}

        {activePage === 'owner' && (
          <OwnerPanel 
            currentUser={currentUser || { id: 'usr-owner-1', name: 'Rajesh Sharma', phone: '+91 98765 43210', role: 'owner' }}
            onSelectPg={handleSelectPg}
            onNavigateHome={() => handleNavigate('home')}
            onLogout={handleLogout}
          />
        )}

        {activePage === 'superadmin' && (
          <SuperAdminPanel 
            onSelectPg={handleSelectPg}
            onNavigateHome={() => handleNavigate('home')}
            onLogout={handleLogout}
          />
        )}

        {activePage === 'about' && (
          <AboutUs />
        )}

        {activePage === 'contact' && (
          <ContactUs />
        )}

        {activePage === 'blogs' && (
          <Blogs 
            onSelectBlog={handleSelectBlog}
          />
        )}

        {activePage === 'blog-detail' && selectedBlog && (
          <BlogDetail 
            blog={selectedBlog}
            onBack={() => setActivePage('blogs')}
          />
        )}

        {(activePage === 'terms' || activePage === 'privacy') && (
          <Legal 
            initialTab={activePage}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialRole={authModalRole}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
