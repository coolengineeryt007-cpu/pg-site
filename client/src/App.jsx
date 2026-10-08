import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

import MainGateway from './pages/MainGateway';
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
  // Determine initial page: Main page load displays MainGateway ('portal') with ONLY TWO OPTIONS
  const getInitialPage = () => {
    try {
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      if (hash === '#admin-secret' || hash === '#superadmin' || hash === '#secret-admin' || params.get('admin') === 'secret') {
        return 'superadmin';
      }
      if (hash === '#student' || hash === '#student-home') {
        return 'home';
      }
      if (hash === '#explore') {
        return 'explore';
      }
      if (hash === '#nearme') {
        return 'nearme';
      }
      if (hash === '#owner' || hash === '#owner-portal') {
        return 'owner-portal';
      }
      if (hash === '#about') return 'about';
      if (hash === '#contact') return 'contact';
      if (hash === '#blogs') return 'blogs';
      if (hash === '#terms' || hash === '#privacy') return hash.replace('#', '');
      
      // Default: main page has ONLY the two options
      return 'portal';
    } catch {
      return 'portal';
    }
  };

  const [activePage, setActivePage] = useState(getInitialPage);
  const [selectedPg, setSelectedPg] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [exploreFilter, setExploreFilter] = useState({});
  const [allPgs, setAllPgs] = useState([]);

  // Two-Option Role Switcher State: 'student' (zero login) vs 'owner' (host workflow)
  const [userRoleMode, setUserRoleMode] = useState(() => {
    try {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#owner' || hash === '#owner-portal') return 'owner';
      return 'student';
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

  // Load initial approved PGs for exploration
  useEffect(() => {
    api.getPgs()
      .then((res) => setAllPgs(res.pgs || []))
      .catch((err) => console.error("Error loading initial PGs:", err));
  }, []);

  // Hash-based URL router
  // When main page loads (empty hash or #portal): loads MainGateway with ONLY TWO OPTIONS
  // Student functionality: /#student or /#explore (zero login required)
  // Owner functionality: /#owner (login, register, dashboard)
  // Super Admin functionality: /#admin-secret (secret URL only)
  useEffect(() => {
    const handleRouteByHash = () => {
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);

      if (hash === '#admin-secret' || hash === '#superadmin' || hash === '#secret-admin' || params.get('admin') === 'secret') {
        setActivePage('superadmin');
      } else if (hash === '#student' || hash === '#student-home') {
        setUserRoleMode('student');
        setActivePage('home');
      } else if (hash === '#explore') {
        setUserRoleMode('student');
        setActivePage('explore');
      } else if (hash === '#nearme') {
        setUserRoleMode('student');
        setActivePage('explore');
        setExploreFilter({ nearMeNow: true });
      } else if (hash === '#owner' || hash === '#owner-portal') {
        setUserRoleMode('owner');
        setActivePage(currentUser?.role === 'owner' ? 'owner' : 'owner-portal');
      } else if (hash === '#about') {
        setActivePage('about');
      } else if (hash === '#contact') {
        setActivePage('contact');
      } else if (hash === '#blogs') {
        setActivePage('blogs');
      } else if (hash === '#terms' || hash === '#privacy') {
        setActivePage(hash.replace('#', ''));
      } else if (hash === '' || hash === '#' || hash === '#portal') {
        setActivePage('portal');
      }
    };

    window.addEventListener('hashchange', handleRouteByHash);
    return () => window.removeEventListener('hashchange', handleRouteByHash);
  }, [currentUser]);

  // 100% On-Page SEO: Dynamic Title and Meta Management
  useEffect(() => {
    let title = "Vrundavan Ventures | Luxury PG & Coliving Residences";
    let desc = "Discover India's most prestigious Paying Guest & Coliving spaces with chef-curated dining, biometric security, and fiber WiFi.";

    if (activePage === 'portal') {
      title = "Vrundavan Ventures | Select Student or PG Owner Portal";
      desc = "Choose your portal: Find verified student and executive PGs with zero login, or list your property with 0% brokerage.";
    } else if (activePage === 'home') {
      title = "Student Residences & Luxury PGs | Vrundavan Ventures";
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
    } else if (activePage === 'contact') {
      title = "Contact Us & Concierge | Vrundavan Ventures";
    } else if (activePage === 'blogs') {
      title = "Coliving & PG Living Guides | Vrundavan Ventures Blog";
    }

    document.title = title;
  }, [activePage, selectedPg, selectedBlog]);

  const handleSelectStudentPortal = () => {
    window.location.hash = '#student';
    setUserRoleMode('student');
    setActivePage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOwnerPortal = () => {
    window.location.hash = '#owner';
    setUserRoleMode('owner');
    if (currentUser && currentUser.role === 'owner') {
      setActivePage('owner');
    } else {
      setActivePage('owner-portal');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRoleModeChange = (mode) => {
    setUserRoleMode(mode);
    if (mode === 'student') {
      handleSelectStudentPortal();
    } else if (mode === 'owner') {
      handleSelectOwnerPortal();
    }
  };

  const handleNavigate = (page, filter = {}) => {
    if (page === 'portal') {
      window.location.hash = '#portal';
      setActivePage('portal');
    } else if (page === 'nearme') {
      window.location.hash = '#nearme';
      setActivePage('explore');
      setExploreFilter({ nearMeNow: true });
    } else if (page === 'explore') {
      window.location.hash = '#explore';
      setActivePage('explore');
      setExploreFilter(filter);
    } else if (page === 'home') {
      window.location.hash = '#student';
      setActivePage('home');
    } else if (page === 'owner' || page === 'owner-portal') {
      window.location.hash = '#owner';
      setActivePage(currentUser?.role === 'owner' ? 'owner' : 'owner-portal');
    } else {
      window.location.hash = `#${page}`;
      setActivePage(page);
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
      window.location.hash = '#admin-secret';
      setActivePage('superadmin');
    } else if (user.role === 'owner') {
      window.location.hash = '#owner';
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
      window.location.hash = '#owner';
      setActivePage('owner-portal');
    } else {
      window.location.hash = '#portal';
      setActivePage('portal');
    }
  };

  const handleExitSuperAdmin = () => {
    window.location.hash = '#portal';
    setActivePage('portal');
  };

  // 1. MAIN PAGE LOAD: ONLY THE TWO OPTIONS (FOR STUDENT AND FOR OWNERS)
  if (activePage === 'portal') {
    return (
      <MainGateway 
        onSelectStudent={handleSelectStudentPortal}
        onSelectOwner={handleSelectOwnerPortal}
      />
    );
  }

  // 2. SUB-PAGES & SPECIFIC PORTAL WORKFLOWS
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar with role toggle and link back to portal */}
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
        {/* STUDENT MODE (URL: /#student, /#explore, /#nearme) - ZERO LOGIN REQUIRED */}
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
            onBack={() => handleNavigate('explore')}
          />
        )}

        {/* OWNER MODE (URL: /#owner) - HOST PORTAL / DASHBOARD */}
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
            onSwitchToStudent={handleSelectStudentPortal}
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
              onSwitchToStudent={handleSelectStudentPortal}
            />
          )
        )}

        {/* SUPER ADMIN (SECRET URL ONLY: /#admin-secret) */}
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
            onBack={() => handleNavigate('blogs')}
          />
        )}

        {(activePage === 'terms' || activePage === 'privacy') && (
          <Legal 
            initialTab={activePage}
          />
        )}
      </main>

      {/* Footer */}
      <Footer 
        onNavigate={handleNavigate} 
      />

      {/* Auth Modal for PG Owners */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialRole={authModalRole}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
