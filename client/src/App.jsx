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
import LockedPageGate from './components/LockedPageGate';
import AiConciergeModal from './components/AiConciergeModal';
import OwnerSubscriptionModal from './components/OwnerSubscriptionModal';
import { Lock, LogIn } from 'lucide-react';

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
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [subscriptionPendingUser, setSubscriptionPendingUser] = useState(null);

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
    let desc = "Discover India's most verified PGs, private rental rooms, flats, and houses for families, working professionals, and students with direct owner connect.";

    if (activePage === 'portal') {
      title = "Vrundavan Ventures | Find Rentals or List Your Property";
      desc = "Choose your portal: Find verified rental houses, rooms, and PGs with zero login, or list your property with direct tenant reach.";
    } else if (activePage === 'home') {
      title = "Find Rental Houses, Private Rooms & PGs | Vrundavan Ventures";
    } else if (activePage === 'explore' || activePage === 'nearme') {
      title = "Explore Rental Properties Near You | GPS Proximity | Vrundavan Ventures";
      desc = "Browse verified rental houses, flats, private rooms, and PGs with live GPS distances and direct owner contact.";
    } else if (activePage === 'detail' && selectedPg) {
      title = `${selectedPg.name} in ${selectedPg.address?.area}, ${selectedPg.address?.city} | Vrundavan Ventures`;
      desc = `Book ${selectedPg.name} with Starting Rent ₹${selectedPg.rent}/mo. Verified ${selectedPg.propertyType === 'house' ? 'Rental House' : selectedPg.propertyType === 'room' ? 'Private Room' : 'PG'} with direct owner connect.`;
    } else if (activePage === 'owner' || activePage === 'owner-portal') {
      title = "Property Owner & Landlord Portal | Host Verified PGs & Rooms | Vrundavan Ventures";
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
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = desc;
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
    if (!currentUser) {
      setAuthModalRole('tenant');
      setAuthModalOpen(true);
    }
  };

  const handleSelectOwnerPortal = () => {
    setUserRoleMode('owner');
    const target = currentUser?.role === 'owner' ? 'owner' : 'owner-portal';
    navigateTo('/owner', target);
    if (!currentUser) {
      setAuthModalRole('owner');
      setAuthModalOpen(true);
    }
  };

  const handleSkipLogin = () => {
    // set guest skipped
    setAuthModalOpen(false);
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
      if (!user.subscription || user.subscription.status !== 'active') {
        setSubscriptionPendingUser(user);
        setSubscriptionModalOpen(true);
      } else {
        navigateTo('/owner', 'owner');
      }
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

  // Admin & Host Portal views operate with their own dedicated dashboards and must NOT render public consumer Header & Footer
  const isSuperAdminPage = activePage === 'superadmin';
  const isHostPanelPage = activePage === 'owner-portal' || activePage === 'owner';
  const hideHeaderAndFooter = isSuperAdminPage || isHostPanelPage;

  // 2. SUB-PAGES & SPECIFIC PORTAL WORKFLOWS
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar with role toggle and link back to portal */}
      {!hideHeaderAndFooter && (
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
          onOpenAiConcierge={() => setAiModalOpen(true)}
        />
      )}

      {/* Guest Mode Half-Information Notification Banner */}
      {!hideHeaderAndFooter && !currentUser && (
        <div style={{
          background: 'linear-gradient(90deg, rgba(14, 116, 237, 0.22) 0%, rgba(212, 175, 55, 0.22) 100%)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.35)',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          fontSize: '0.86rem',
          color: '#E2E8F0',
          textAlign: 'center',
          position: 'relative',
          zIndex: 9990
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '1.1rem' }}>🔒</span>
            <strong>Guest Preview Mode:</strong> Half / Partial information is showing.
          </span>
          <button
            onClick={() => {
              setAuthModalRole(userRoleMode === 'owner' ? 'owner' : 'tenant');
              setAuthModalOpen(true);
            }}
            className="btn btn-gold btn-sm"
            style={{
              padding: '4px 14px',
              fontSize: '0.8rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-full)'
            }}
          >
            🔑 Do login for more information
          </button>
        </div>
      )}

      {/* Main Content Router */}
      <main style={{ flex: 1 }}>
        {/* STUDENT MODE (URL: /student) - HOME PAGE ALWAYS ACCESSIBLE */}
        {activePage === 'home' && (
          <Home 
            pgs={allPgs}
            onSelectPg={handleSelectPg}
            onNavigate={handleNavigate}
            currentUser={currentUser}
            onOpenLogin={(role = 'tenant') => {
              setAuthModalRole(role);
              setAuthModalOpen(true);
            }}
          />
        )}

        {/* DETAIL PAGE: IF NOT LOGGED IN, SHOW "PLEASE LOGIN FOR MORE INFORMATION" GATEWAY */}
        {activePage === 'detail' && selectedPg && (
          !currentUser ? (
            <div className="container" style={{ padding: '60px 20px', minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div className="luxury-card" style={{ maxWidth: '640px', width: '100%', padding: '36px 30px', textAlign: 'center' }}>
                {/* Selected Property Preview */}
                <div style={{ position: 'relative', height: '220px', borderRadius: '14px', overflow: 'hidden', marginBottom: '24px' }}>
                  <img 
                    src={selectedPg.photos?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'} 
                    alt={selectedPg.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80';
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 20%, rgba(4,13,33,0.92) 100%)' }} />
                  <div style={{ position: 'absolute', bottom: '16px', left: '18px', right: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div style={{ textAlign: 'left' }}>
                      <h3 style={{ color: '#ffffff', fontSize: '1.35rem', fontWeight: 800, margin: '0 0 4px 0' }}>
                        {selectedPg.name}
                      </h3>
                      <span style={{ color: '#CBD5E1', fontSize: '0.85rem' }}>
                        📍 {selectedPg.address?.area}, {selectedPg.address?.city}
                      </span>
                    </div>
                    <span className="badge badge-gold" style={{ fontSize: '0.9rem', fontWeight: 800 }}>
                      ₹{selectedPg.rent?.toLocaleString('en-IN')}/mo
                    </span>
                  </div>
                </div>

                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1.5px solid rgba(212, 175, 55, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  color: 'var(--gold-primary)'
                }}>
                  <Lock size={30} />
                </div>

                <h2 className="font-serif gold-gradient-text" style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '10px' }}>
                  Please Login for More Information
                </h2>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto 26px auto' }}>
                  Full house details, exact street address, host direct phone & WhatsApp contacts, verified room availability, and physical visit scheduling are locked. Please login with your student/seeker account to view all details.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '380px', margin: '0 auto' }}>
                  <button 
                    onClick={() => {
                      setAuthModalRole('tenant');
                      setAuthModalOpen(true);
                    }}
                    className="btn btn-gold btn-lg"
                    style={{ width: '100%', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                  >
                    <LogIn size={18} />
                    <span>Please Login for More Information</span>
                  </button>

                  <button 
                    onClick={() => handleNavigate('home')}
                    className="btn btn-ghost"
                    style={{ width: '100%', fontSize: '0.9rem' }}
                  >
                    ← Back to Home Listings
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <PgDetailView 
              pg={selectedPg}
              onBack={() => handleNavigate('explore')}
              currentUser={currentUser}
              onOpenLogin={(role = 'tenant') => {
                setAuthModalRole(role);
                setAuthModalOpen(true);
              }}
            />
          )
        )}

        {/* EXPLORE PAGE: ONLY SHOWN IF LOGGED IN */}
        {activePage === 'explore' && (
          !currentUser ? (
            <LockedPageGate 
              title="Please Login to Explore Properties"
              message="Access to all verified rental properties is restricted to registered members. Please sign in to unlock all listings, live GPS filters, and direct owner WhatsApp contacts."
              role="student"
              onOpenLogin={(r) => { setAuthModalRole(r); setAuthModalOpen(true); }}
              onGoHome={() => handleNavigate('home')}
            />
          ) : (
            <Explore 
              onSelectPg={handleSelectPg}
              initialFilter={exploreFilter}
              currentUser={currentUser}
              onOpenLogin={(role = 'tenant') => {
                setAuthModalRole(role);
                setAuthModalOpen(true);
              }}
            />
          )
        )}

        {/* OWNER PORTAL: SHOWS MOTIVATIONAL STUDENT SHOWCASE & REAL LISTINGS TO MOTIVATE HOSTS */}
        {(activePage === 'owner-portal' || activePage === 'owner') && (
          currentUser && currentUser.role === 'owner' ? (
            <OwnerPanel 
              currentUser={currentUser}
              isGuestPreview={false}
              onSelectPg={handleSelectPg}
              onNavigateHome={() => handleNavigate('home')}
              onLogout={handleLogout}
              onOpenLogin={(role = 'owner') => {
                setAuthModalRole(role);
                setAuthModalOpen(true);
              }}
            />
          ) : (
            <OwnerLanding 
              pgs={allPgs}
              currentUser={currentUser}
              onSelectPg={handleSelectPg}
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
              onLogout={handleLogout}
            />
          )
        )}

        {/* SUPER ADMIN (SECRET URL ONLY: /superadmin) */}
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

        {/* GENERAL PAGES: PROTECTED WITH LOGIN GATE */}
        {activePage === 'about' && (
          !currentUser ? (
            <LockedPageGate 
              title="Please Login to View About Us"
              message="Our company background and mission information are reserved for registered members. Please sign in to continue."
              role="student"
              onOpenLogin={(r) => { setAuthModalRole(r); setAuthModalOpen(true); }}
              onGoHome={() => handleNavigate('home')}
            />
          ) : (
            <AboutUs />
          )
        )}

        {activePage === 'contact' && (
          !currentUser ? (
            <LockedPageGate 
              title="Please Login to View Concierge Contact"
              message="Our direct phone support, VIP concierge desk, and physical office locations are available to registered members."
              role="student"
              onOpenLogin={(r) => { setAuthModalRole(r); setAuthModalOpen(true); }}
              onGoHome={() => handleNavigate('home')}
            />
          ) : (
            <ContactUs />
          )
        )}

        {activePage === 'blogs' && (
          !currentUser ? (
            <LockedPageGate 
              title="Please Login to Read Rental Guides"
              message="Unlock all tenant relocation guides, city living advice, and tenant checklists by signing in with your account."
              role="student"
              onOpenLogin={(r) => { setAuthModalRole(r); setAuthModalOpen(true); }}
              onGoHome={() => handleNavigate('home')}
            />
          ) : (
            <Blogs 
              onSelectBlog={handleSelectBlog}
            />
          )
        )}

        {activePage === 'blog-detail' && selectedBlog && (
          !currentUser ? (
            <LockedPageGate 
              title="Please Login to Read Full Article"
              role="student"
              onOpenLogin={(r) => { setAuthModalRole(r); setAuthModalOpen(true); }}
              onGoHome={() => handleNavigate('home')}
            />
          ) : (
            <BlogDetail 
              blog={selectedBlog}
              onBack={() => handleNavigate('blogs')}
            />
          )
        )}

        {(activePage === 'terms' || activePage === 'privacy') && (
          <Legal 
            initialTab={activePage}
          />
        )}
      </main>

      {/* Footer */}
      {!hideHeaderAndFooter && (
        <Footer 
          onNavigate={handleNavigate} 
        />
      )}

      {/* Auth Modal for Both Tenants and PG Owners */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialRole={authModalRole}
        onLoginSuccess={handleLoginSuccess}
        onSkipLogin={handleSkipLogin}
      />


      {/* AI Concierge Modal */}
      <AiConciergeModal 
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onSelectPg={handleSelectPg}
      />

      {/* Host Partner Subscription & Autopay Modal */}
      <OwnerSubscriptionModal
        isOpen={subscriptionModalOpen}
        onClose={() => setSubscriptionModalOpen(false)}
        currentUser={subscriptionPendingUser || currentUser}
        onSuccess={(updatedSub) => {
          const activeUser = subscriptionPendingUser || currentUser;
          if (activeUser) {
            const updated = { ...activeUser, subscription: updatedSub };
            setCurrentUser(updated);
            try {
              localStorage.setItem('vv_user', JSON.stringify(updated));
            } catch {}
          }
          setSubscriptionModalOpen(false);
          setSubscriptionPendingUser(null);
          setUserRoleMode('owner');
          navigateTo('/owner', 'owner');
        }}
      />
    </div>
  );
}
