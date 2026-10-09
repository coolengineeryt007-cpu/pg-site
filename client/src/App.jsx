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
  // Route Parser: HTML5 Clean Path-Based Routing (NO # symbols)
  // Maps URLs like /student, /owner, /explore, /nearme, /superadmin, /about, /contact, /blogs, /terms, /privacy
  const parseCurrentRoute = () => {
    try {
      let path = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
      
      // Auto-migrate legacy hash if any user visits old bookmark (e.g., /#owner -> /owner)
      if (window.location.hash) {
        const legacy = window.location.hash.toLowerCase().replace('#', '').replace(/\/+$/, '');
        if (legacy) {
          path = `/${legacy}`;
          window.history.replaceState(null, '', path + window.location.search);
        }
      }

      const params = new URLSearchParams(window.location.search);
      if (
        path === '/admin-secret' || 
        path === '/superadmin' || 
        path === '/secret-admin' || 
        params.get('admin') === 'secret'
      ) {
        return { page: 'superadmin', role: 'student' };
      }

      if (path === '/owner' || path === '/owner-portal' || path === '/host') {
        return { page: 'owner-portal', role: 'owner' };
      }

      if (path === '/student' || path === '/student-home') {
        return { page: 'home', role: 'student' };
      }

      if (path === '/explore') {
        return { page: 'explore', role: 'student' };
      }

      if (path === '/nearme') {
        return { page: 'nearme', role: 'student' };
      }

      if (path === '/about') {
        return { page: 'about', role: 'student' };
      }

      if (path === '/contact') {
        return { page: 'contact', role: 'student' };
      }

      if (path === '/blogs') {
        return { page: 'blogs', role: 'student' };
      }

      if (path === '/terms') {
        return { page: 'terms', role: 'student' };
      }

      if (path === '/privacy') {
        return { page: 'privacy', role: 'student' };
      }

      // Root path '/' loads the two-option Gateway
      return { page: 'portal', role: 'student' };
    } catch {
      return { page: 'portal', role: 'student' };
    }
  };

  const initialRoute = parseCurrentRoute();
  const [activePage, setActivePage] = useState(initialRoute.page);
  const [selectedPg, setSelectedPg] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [exploreFilter, setExploreFilter] = useState(() => {
    return initialRoute.page === 'nearme' ? { nearMeNow: true } : {};
  });
  const [allPgs, setAllPgs] = useState([]);

  // Two-Option Role Switcher State: 'student' (zero login) vs 'owner' (host workflow)
  const [userRoleMode, setUserRoleMode] = useState(initialRoute.role);

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

  // HTML5 History Popstate listener (supports browser Back / Forward buttons smoothly)
  useEffect(() => {
    const handlePopState = () => {
      const route = parseCurrentRoute();
      setUserRoleMode(route.role);
      if (route.page === 'nearme') {
        setActivePage('explore');
        setExploreFilter({ nearMeNow: true });
      } else if (route.page === 'owner-portal') {
        setActivePage(currentUser?.role === 'owner' ? 'owner' : 'owner-portal');
      } else {
        setActivePage(route.page);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentUser]);

  // 100% On-Page SEO: Dynamic Title and Meta Management
  useEffect(() => {
    let title = "Vrundavan Ventures | PGs, Rental Rooms & Houses for Rent";
    let desc = "Discover India's most verified PGs, private rental rooms, flats, and houses for families, working professionals, and students with zero brokerage.";

    if (activePage === 'portal') {
      title = "Vrundavan Ventures | Find Rentals or List Your Property";
      desc = "Choose your portal: Find verified rental houses, rooms, and PGs with zero login, or list your property with 0% brokerage.";
    } else if (activePage === 'home') {
      title = "Find Rental Houses, Private Rooms & PGs | Vrundavan Ventures";
    } else if (activePage === 'explore' || activePage === 'nearme') {
      title = "Explore Rental Properties Near You | GPS Proximity | Vrundavan Ventures";
      desc = "Browse verified rental houses, flats, private rooms, and PGs with live GPS distances and direct owner contact.";
    } else if (activePage === 'detail' && selectedPg) {
      title = `${selectedPg.name} in ${selectedPg.address?.area}, ${selectedPg.address?.city} | Vrundavan Ventures`;
      desc = `Book ${selectedPg.name} with Starting Rent ₹${selectedPg.rent}/mo. Verified ${selectedPg.propertyType === 'house' ? 'Rental House' : selectedPg.propertyType === 'room' ? 'Private Room' : 'PG'} with direct owner connect.`;
    } else if (activePage === 'owner' || activePage === 'owner-portal') {
      title = "Property Owner & Landlord Portal | List PGs, Rooms & Houses Free | Vrundavan Ventures";
    } else if (activePage === 'superadmin') {
      title = "Master Control Portal | Restricted Admin Access | Vrundavan Ventures";
    } else if (activePage === 'about') {
      title = "About Us & Vision | Vrundavan Ventures";
    } else if (activePage === 'contact') {
      title = "Contact Us & Concierge | Vrundavan Ventures";
    } else if (activePage === 'blogs') {
      title = "Rental Guides & Living Advice | Vrundavan Ventures Blog";
    }

    document.title = title;
  }, [activePage, selectedPg, selectedBlog]);

  // PushState Navigation Helper for clean professional URLs
  const navigateTo = (path, targetPage, filter = {}) => {
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
    setActivePage(targetPage);
    if (filter && Object.keys(filter).length > 0) {
      setExploreFilter(filter);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectStudentPortal = () => {
    setUserRoleMode('student');
    navigateTo('/student', 'home');
  };

  const handleSelectOwnerPortal = () => {
    setUserRoleMode('owner');
    const target = currentUser?.role === 'owner' ? 'owner' : 'owner-portal';
    navigateTo('/owner', target);
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
      navigateTo('/', 'portal');
    } else if (page === 'nearme') {
      setUserRoleMode('student');
      navigateTo('/nearme', 'explore', { nearMeNow: true });
    } else if (page === 'explore') {
      setUserRoleMode('student');
      navigateTo('/explore', 'explore', filter);
    } else if (page === 'home' || page === 'student') {
      setUserRoleMode('student');
      navigateTo('/student', 'home');
    } else if (page === 'owner' || page === 'owner-portal') {
      setUserRoleMode('owner');
      const target = currentUser?.role === 'owner' ? 'owner' : 'owner-portal';
      navigateTo('/owner', target);
    } else if (page === 'superadmin' || page === 'admin-secret') {
      navigateTo('/superadmin', 'superadmin');
    } else if (page === 'about') {
      navigateTo('/about', 'about');
    } else if (page === 'contact') {
      navigateTo('/contact', 'contact');
    } else if (page === 'blogs') {
      navigateTo('/blogs', 'blogs');
    } else if (page === 'terms') {
      navigateTo('/terms', 'terms');
    } else if (page === 'privacy') {
      navigateTo('/privacy', 'privacy');
    } else {
      navigateTo(`/${page}`, page);
    }
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
      navigateTo('/superadmin', 'superadmin');
    } else if (user.role === 'owner') {
      setUserRoleMode('owner');
      navigateTo('/owner', 'owner');
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
      navigateTo('/owner', 'owner-portal');
    } else {
      navigateTo('/', 'portal');
    }
  };

  const handleExitSuperAdmin = () => {
    navigateTo('/', 'portal');
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
