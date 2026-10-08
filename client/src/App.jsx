import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import WelcomeRoleModal from './components/WelcomeRoleModal';

import Home from './pages/Home';
import Explore from './pages/Explore';
import PgDetailView from './components/PgDetailView';
import OwnerPanel from './pages/OwnerPanel';
import OwnerLanding from './pages/OwnerLanding';
import SuperAdminPanel from './pages/SuperAdminPanel';
import SuperAdminSecretGate from './components/SuperAdminSecretGate';
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
  
  // Full-Screen Role Pop-up on First Site Visit
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(() => {
    try {
      return !localStorage.getItem('vv_role_selected');
    } catch {
      return true;
    }
  });

  // Two-Option Role Switcher State: 'student' (default, zero login) vs 'owner' (host workflow)
  const [userRoleMode, setUserRoleMode] = useState(() => {
    try {
      return localStorage.getItem('vv_user_mode') || 'student';
    } catch {
      return 'student';
    }
  });

  // Auth state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('vv_user') || localStorage.getItem('aurelia_user');
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

  // Special Secret URL Monitor for Super Admin (#admin-secret or #superadmin)
  // Super Admin is 100% isolated and never linked in public menus or footers
  useEffect(() => {
    const checkSecretRoute = () => {
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      if (hash === '#admin-secret' || hash === '#superadmin' || hash === '#secret-admin' || params.get('admin') === 'secret') {
        setActivePage('superadmin');
      }
    };
    checkSecretRoute();
    window.addEventListener('hashchange', checkSecretRoute);
    return () => window.removeEventListener('hashchange', checkSecretRoute);
  }, []);

  // 100% On-Page SEO: Dynamic Title and Meta Management
  useEffect(() => {
    let title = "Vrundavan Ventures | Luxury PG & Coliving Residences";
    let desc = "Discover India's most prestigious Paying Guest & Coliving spaces with chef-curated dining, biometric security, and fiber WiFi.";

    if (activePage === 'home') {
      title = "Vrundavan Ventures | Luxury PG & Coliving Residences in India";
    } else if (activePage === 'explore' || activePage === 'nearme') {
      title = "Explore Luxury PGs Near You | Real-time GPS Proximity | Vrundavan Ventures";
      desc = "Browse verified executive and student Paying Guest accommodations with single/shared rooms and Google Maps live directions.";
    } else if (activePage === 'detail' && selectedPg) {
      title = `${selectedPg.name} in ${selectedPg.address?.area}, ${selectedPg.address?.city} | Vrundavan Ventures`;
      desc = `Book ${selectedPg.name} with Starting Rent ₹${selectedPg.rent}/mo. Verified ${selectedPg.gender} PG with gourmet dining, AC, and 100% deposit guarantee.`;
    } else if (activePage === 'owner' || activePage === 'owner-portal') {
      title = "PG Owner Host Portal | List Your Property with 0% Brokerage | Vrundavan Ventures";
    } else if (activePage === 'superadmin') {
      title = "Master Control Portal | Restricted Admin Access | Vrundavan Ventures";
    } else if (activePage === 'about') {
      title = "About Us & Vision | Vrundavan Ventures";
      desc = "Learn about Vrundavan Ventures, our quality manifesto, and student welfare standards.";
    } else if (activePage === 'contact') {
      title = "Contact Us & Concierge | Vrundavan Ventures";
    } else if (activePage === 'blogs') {
      title = "Coliving & PG Living Guides | Vrundavan Ventures Blog";
    } else if (activePage === 'blog-detail' && selectedBlog) {
      title = `${selectedBlog.title} | Vrundavan Ventures Guide`;
      desc = selectedBlog.excerpt;
    } else if (activePage === 'terms' || activePage === 'privacy') {
      title = "Legal Compliance & Policies | Vrundavan Ventures";
    }

    document.title = title;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', desc);
    }
  }, [activePage, selectedPg, selectedBlog]);

  const handleRoleModeChange = (mode) => {
    setUserRoleMode(mode);
    try {
      localStorage.setItem('vv_user_mode', mode);
    } catch {}

    if (mode === 'student') {
      // Student mode: Seamless, zero-login, take to student home/browse
      if (activePage === 'owner' || activePage === 'owner-portal' || activePage === 'superadmin') {
        setActivePage('home');
      }
    } else if (mode === 'owner') {
      // Owner mode: if logged in as owner, show OwnerPanel; else show Host Portal landing
      if (currentUser && currentUser.role === 'owner') {
        setActivePage('owner');
      } else {
        setActivePage('owner-portal');
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWelcomeRoleSelect = (role) => {
    try {
      localStorage.setItem('vv_role_selected', 'true');
    } catch {}
    setWelcomeModalOpen(false);
    handleRoleModeChange(role);
  };

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
    try {
      localStorage.setItem('vv_user', JSON.stringify(user));
    } catch {}

    if (user.role === 'superadmin') {
      setActivePage('superadmin');
    } else if (user.role === 'owner') {
      setUserRoleMode('owner');
      setActivePage('owner');
    }
  };

  const handleDemoOwnerLogin = () => {
    api.login('rajesh@royalpg.com', 'Owner@123')
      .then((res) => {
        handleLoginSuccess(res.user);
      })
      .catch((err) => alert(err.message || 'Demo owner login failed'));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('vv_user');
      localStorage.removeItem('aurelia_user');
    } catch {}

    if (userRoleMode === 'owner') {
      setActivePage('owner-portal');
    } else {
      setActivePage('home');
    }
  };

  const handleExitSuperAdmin = () => {
    window.location.hash = '';
    setActivePage('home');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar: Has Student vs Owner Role Switcher; zero Super Admin references */}
      <Navbar 
        activePage={activePage}
        setActivePage={(p) => handleNavigate(p)}
        userRoleMode={userRoleMode}
        onChangeRoleMode={handleRoleModeChange}
        currentUser={currentUser}
        onLoginClick={(role = 'owner') => {
          setAuthModalRole(role);
          setAuthModalOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* Main Content Router */}
      <main style={{ flex: 1 }}>
        {/* STUDENT MODE & PUBLIC EXPLORATION */}
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

        {/* OWNER MODE & PORTAL */}
        {activePage === 'owner-portal' && (
          <OwnerLanding 
            onOpenLogin={() => {
              setAuthModalRole('owner');
              setAuthModalOpen(true);
            }}
            onOpenRegister={() => {
              setAuthModalRole('owner');
              setAuthModalOpen(true);
            }}
            onDemoLogin={handleDemoOwnerLogin}
            onSwitchToStudent={() => handleRoleModeChange('student')}
          />
        )}

        {activePage === 'owner' && (
          currentUser && currentUser.role === 'owner' ? (
            <OwnerPanel 
              currentUser={currentUser}
              onSelectPg={handleSelectPg}
              onNavigateHome={() => handleNavigate('home')}
              onLogout={handleLogout}
            />
          ) : (
            <OwnerLanding 
              onOpenLogin={() => {
                setAuthModalRole('owner');
                setAuthModalOpen(true);
              }}
              onOpenRegister={() => {
                setAuthModalRole('owner');
                setAuthModalOpen(true);
              }}
              onDemoLogin={handleDemoOwnerLogin}
              onSwitchToStudent={() => handleRoleModeChange('student')}
            />
          )
        )}

        {/* SUPER ADMIN: Only accessible via dedicated secret URL (#admin-secret) */}
        {activePage === 'superadmin' && (
          currentUser && currentUser.role === 'superadmin' ? (
            <SuperAdminPanel 
              onSelectPg={handleSelectPg}
              onNavigateHome={handleExitSuperAdmin}
              onLogout={() => {
                handleLogout();
                handleExitSuperAdmin();
              }}
            />
          ) : (
            <SuperAdminSecretGate 
              onLoginSuccess={handleLoginSuccess}
              onCancel={handleExitSuperAdmin}
            />
          )
        )}

        {/* GENERAL PAGES */}
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

      {/* Footer: Public footer without Super Admin links */}
      <Footer 
        onNavigate={handleNavigate} 
      />

      {/* Auth Modal: Dedicated to PG Owners */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialRole={authModalRole}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Full-Screen Welcome Role Pop-up */}
      <WelcomeRoleModal 
        isOpen={welcomeModalOpen}
        onSelectRole={handleWelcomeRoleSelect}
      />
    </div>
  );
}
