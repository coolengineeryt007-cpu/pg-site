import React, { useState } from 'react';
import { 
  Users, 
  Home as HomeIcon, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin,
  Eye, 
  EyeOff, 
  AlertCircle, 
  Info, 
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  initialRole = 'tenant', 
  initialMode = 'login',
  onLoginSuccess,
  onSkipLogin,
  onGoHome,
  onRoleChange
}) {
  const [role, setRole] = useState(initialRole === 'owner' ? 'owner' : 'tenant');
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);

  const [prevInitialRole, setPrevInitialRole] = useState(initialRole);
  const [prevInitialMode, setPrevInitialMode] = useState(initialMode);
  
  if (initialRole !== prevInitialRole || initialMode !== prevInitialMode) {
    setPrevInitialRole(initialRole);
    setPrevInitialMode(initialMode);
    setRole(initialRole === 'owner' ? 'owner' : 'tenant');
    setIsRegister(initialMode === 'register');
    setError('');
    setForgotPasswordNotice(false);
  }

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        const res = await api.register({ 
          name, 
          email, 
          password, 
          role: role === 'owner' ? 'owner' : 'tenant', 
          phone,
          address
        });
        onLoginSuccess(res.user);
        onClose();
      } else {
        const res = await api.login(email, password);
        onLoginSuccess(res.user);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    setError('');
    api.login(demoEmail, demoPass)
      .then((res) => {
        onLoginSuccess(res.user);
        onClose();
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleSkip = () => {
    if (onSkipLogin) {
      onSkipLogin();
    } else {
      onClose();
    }
  };

  const handleHomeClick = (e) => {
    if (e) e.preventDefault();
    if (onGoHome) {
      onGoHome();
    } else {
      onClose();
      window.location.href = '/';
    }
  };

  const isOwner = role === 'owner';

  return (
    <div className="auth-page-container">
      {/* Background Soft Glows */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '15%',
        width: '600px',
        height: '400px',
        background: isOwner 
          ? 'radial-gradient(circle, rgba(212, 175, 55, 0.16) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(14, 116, 237, 0.18) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '0%',
        right: '15%',
        width: '600px',
        height: '400px',
        background: isOwner 
          ? 'radial-gradient(circle, rgba(245, 197, 66, 0.12) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(0, 210, 180, 0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* 1. Header: Big Centered Brand Logo (Approved Header) */}
      <header style={{
        padding: '10px 32px',
        borderBottom: isOwner 
          ? '1px solid rgba(212, 175, 55, 0.3)' 
          : '1px solid rgba(14, 116, 237, 0.3)',
        background: 'rgba(4, 13, 33, 0.96)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        position: 'relative',
        zIndex: 30,
        width: '100%',
        flexShrink: 0
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          {/* Left: Back to Home */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)'
          }}>
            <button
              onClick={handleHomeClick}
              className="btn btn-ghost"
              style={{
                color: '#CBD5E1',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.84rem',
                fontWeight: 600,
                padding: '7px 16px',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                background: 'rgba(255, 255, 255, 0.05)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.borderColor = isOwner ? 'rgba(212, 175, 55, 0.5)' : 'rgba(14, 116, 237, 0.5)';
                e.currentTarget.style.background = isOwner ? 'rgba(212, 175, 55, 0.1)' : 'rgba(14, 116, 237, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#CBD5E1';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
            >
              <ArrowLeft size={15} />
              <span>Back to Home</span>
            </button>
          </div>

          {/* Center: Grand Big Brand Logo */}
          <a 
            href="/" 
            onClick={handleHomeClick}
            style={{ display: 'inline-block', textDecoration: 'none', cursor: 'pointer' }}
            title="Return to Home"
          >
            <img 
              src="/logo.png" 
              alt="Vrundavan Ventures" 
              style={{ 
                height: '84px', 
                width: 'auto', 
                maxHeight: '88px',
                maxWidth: '440px',
                objectFit: 'contain',
                display: 'block',
                filter: 'drop-shadow(0 6px 22px rgba(0, 0, 0, 0.85))'
              }} 
            />
          </a>

          {/* Right: Portal Indicator Pill Badge */}
          <div style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span 
              className={`badge ${isOwner ? 'badge-gold' : 'badge-blue'}`}
              style={{ 
                fontSize: '0.78rem', 
                padding: '6px 14px', 
                fontWeight: 700, 
                letterSpacing: '0.5px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: isOwner ? '0 0 16px rgba(212, 175, 55, 0.25)' : '0 0 16px rgba(14, 116, 237, 0.25)'
              }}
            >
              {isOwner ? <HomeIcon size={14} /> : <Users size={14} />}
              {isOwner ? 'OWNER PORTAL' : 'STUDENT PORTAL'}
            </span>
          </div>
        </div>
      </header>

      {/* 2. Main Center Section: Streamlined, Clean, Visible & User-Friendly 2-Column Split */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 28px',
        position: 'relative',
        zIndex: 10,
        width: '100%',
        minHeight: 0,
        overflow: 'hidden'
      }}>
        <div className="auth-split-layout">
          {/* LEFT COLUMN: Clean, High-Impact, Minimalist (Extra Content Removed) */}
          <div className="auth-left-pane">
            {/* Headline & 1-line Subtitle */}
            <div style={{ marginBottom: '18px' }}>
              <h1 style={{
                fontSize: 'clamp(1.85rem, 2.6vw, 2.45rem)',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.22,
                margin: '0 0 8px 0',
                letterSpacing: '-0.3px'
              }}>
                {isOwner ? (
                  isRegister ? (
                    <>
                      Owner & Rental <br />
                      <span className="gold-gradient-text">Registration Form</span>
                    </>
                  ) : (
                    <>
                      Owner & Rental <br />
                      <span className="gold-gradient-text">Login Form</span>
                    </>
                  )
                ) : (
                  isRegister ? (
                    <>
                      Student & Rental <br />
                      <span style={{ color: '#38BDF8' }}>Registration Form</span>
                    </>
                  ) : (
                    <>
                      Student & Rental <br />
                      <span style={{ color: '#38BDF8' }}>Login Form</span>
                    </>
                  )
                )}
              </h1>
              <p style={{
                color: '#94A3B8',
                fontSize: '0.92rem',
                lineHeight: 1.48,
                margin: 0,
                maxWidth: '460px'
              }}>
                {isOwner 
                  ? (isRegister 
                      ? 'Free host signup. ₹99/month listing plan to publish your properties and receive direct student inquiries.' 
                      : 'Log in to manage your property listings, tenant leads, and direct WhatsApp inquiries.')
                  : (isRegister 
                      ? '100% free registration. Connect directly with verified PG and room owners across Pune.' 
                      : 'Log in to view direct owner contact & WhatsApp numbers. Zero brokerage fees.')}
              </p>
            </div>

            {/* 3 Crisp, High-Visibility Feature Cards (Neat, Clean & Modern) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {isOwner ? (
                <>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '14px',
                    padding: '10px 15px',
                    borderRadius: '12px',
                    background: 'rgba(212, 175, 55, 0.05)',
                    border: '1px solid rgba(212, 175, 55, 0.18)'
                  }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '10px', 
                      background: 'rgba(212, 175, 55, 0.16)', 
                      border: '1px solid rgba(212, 175, 55, 0.35)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      flexShrink: 0 
                    }}>
                      <Phone size={19} style={{ color: 'var(--gold-primary)' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#F8FAFC' }}>
                        Direct WhatsApp & Calls
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                        Tenant inquiries reach your phone directly. Zero broker fee.
                      </div>
                    </div>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '14px',
                    padding: '10px 15px',
                    borderRadius: '12px',
                    background: 'rgba(212, 175, 55, 0.05)',
                    border: '1px solid rgba(212, 175, 55, 0.18)'
                  }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '10px', 
                      background: 'rgba(212, 175, 55, 0.16)', 
                      border: '1px solid rgba(212, 175, 55, 0.35)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      flexShrink: 0 
                    }}>
                      <CreditCard size={19} style={{ color: 'var(--gold-primary)' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#F8FAFC' }}>
                        Transparent ₹99/mo AutoPay
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                        Flat monthly plan to activate host panel and frontend listings.
                      </div>
                    </div>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '14px',
                    padding: '10px 15px',
                    borderRadius: '12px',
                    background: 'rgba(212, 175, 55, 0.05)',
                    border: '1px solid rgba(212, 175, 55, 0.18)'
                  }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '10px', 
                      background: 'rgba(212, 175, 55, 0.16)', 
                      border: '1px solid rgba(212, 175, 55, 0.35)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      flexShrink: 0 
                    }}>
                      <MapPin size={19} style={{ color: 'var(--gold-primary)' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#F8FAFC' }}>
                        Google Maps GPS Navigation
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                        Turn-by-turn directions bring tenants straight to your door.
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '14px',
                    padding: '10px 15px',
                    borderRadius: '12px',
                    background: 'rgba(14, 116, 237, 0.05)',
                    border: '1px solid rgba(14, 116, 237, 0.18)'
                  }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '10px', 
                      background: 'rgba(14, 116, 237, 0.16)', 
                      border: '1px solid rgba(56, 189, 248, 0.35)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      flexShrink: 0 
                    }}>
                      <Phone size={19} style={{ color: '#38BDF8' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#F8FAFC' }}>
                        Instant Direct Owner Calling
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                        Direct mobile numbers & WhatsApp messaging with genuine owners.
                      </div>
                    </div>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '14px',
                    padding: '10px 15px',
                    borderRadius: '12px',
                    background: 'rgba(0, 210, 180, 0.05)',
                    border: '1px solid rgba(0, 210, 180, 0.18)'
                  }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '10px', 
                      background: 'rgba(0, 210, 180, 0.16)', 
                      border: '1px solid rgba(0, 210, 180, 0.35)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      flexShrink: 0 
                    }}>
                      <CheckCircle2 size={19} style={{ color: '#00D2B4' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#F8FAFC' }}>
                        100% Free Forever
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                        Zero registration charges, zero brokerage, zero booking fees.
                      </div>
                    </div>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '14px',
                    padding: '10px 15px',
                    borderRadius: '12px',
                    background: 'rgba(212, 175, 55, 0.05)',
                    border: '1px solid rgba(212, 175, 55, 0.18)'
                  }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '10px', 
                      background: 'rgba(212, 175, 55, 0.16)', 
                      border: '1px solid rgba(212, 175, 55, 0.35)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      flexShrink: 0 
                    }}>
                      <MapPin size={19} style={{ color: 'var(--gold-primary)' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#F8FAFC' }}>
                        Verified Accommodations
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                        Authentic room photos, food menu info & verified security deposit.
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Portal Switch Button */}
            <div>
              <button
                type="button"
                onClick={() => {
                  const newRole = isOwner ? 'tenant' : 'owner';
                  setRole(newRole);
                  setError('');
                  setForgotPasswordNotice(false);
                  if (onRoleChange) onRoleChange(newRole);
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: isOwner ? '1px solid rgba(212, 175, 55, 0.35)' : '1px solid rgba(14, 116, 237, 0.35)',
                  color: isOwner ? 'var(--gold-light)' : '#93C5FD',
                  borderRadius: '22px',
                  padding: '6px 16px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{isOwner ? 'Looking for PG or Room? Switch to Student Portal' : 'Are you a property owner? Switch to Owner Portal'}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: High-Visibility, Clean & User-Friendly Form Card (Scaled Up & Spacious) */}
          <div className="auth-right-pane">
            <div style={{
              width: '100%',
              maxWidth: '620px',
              background: 'linear-gradient(180deg, rgba(10, 32, 78, 0.96) 0%, rgba(5, 16, 42, 0.98) 100%)',
              border: isOwner ? '1.5px solid rgba(212, 175, 55, 0.45)' : '1.5px solid rgba(14, 116, 237, 0.45)',
              borderRadius: '24px',
              padding: isRegister ? '24px 36px 20px 36px' : '32px 40px 26px 40px',
              boxShadow: isOwner 
                ? '0 24px 60px -10px rgba(0, 0, 0, 0.85), 0 0 35px rgba(212, 175, 55, 0.22)' 
                : '0 24px 60px -10px rgba(0, 0, 0, 0.85), 0 0 35px rgba(14, 116, 237, 0.22)',
              textAlign: 'left',
              position: 'relative'
            }}>
              {/* High-Contrast Segmented Tabs: Instant Switch between Login & Register */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                padding: '4px',
                borderRadius: '13px',
                marginBottom: isRegister ? '18px' : '24px'
              }}>
                <button
                  type="button"
                  onClick={() => { setIsRegister(false); setError(''); }}
                  style={{
                    padding: isRegister ? '10px 0' : '12px 0',
                    borderRadius: '10px',
                    border: 'none',
                    background: !isRegister 
                      ? (isOwner ? 'linear-gradient(135deg, #d4af37 0%, #f5c542 100%)' : 'linear-gradient(135deg, #0e74ed 0%, #0099ff 100%)')
                      : 'transparent',
                    color: !isRegister ? (isOwner ? '#040d21' : '#ffffff') : '#CBD5E1',
                    fontWeight: 700,
                    fontSize: '0.94rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Lock size={16} />
                  <span>Log In</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setIsRegister(true); setError(''); }}
                  style={{
                    padding: isRegister ? '10px 0' : '12px 0',
                    borderRadius: '10px',
                    border: 'none',
                    background: isRegister 
                      ? (isOwner ? 'linear-gradient(135deg, #d4af37 0%, #f5c542 100%)' : 'linear-gradient(135deg, #0e74ed 0%, #0099ff 100%)')
                      : 'transparent',
                    color: isRegister ? (isOwner ? '#040d21' : '#ffffff') : '#CBD5E1',
                    fontWeight: 700,
                    fontSize: '0.94rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <User size={16} />
                  <span>Create Account</span>
                </button>
              </div>

              {/* Error Notice */}
              {error && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid #ef4444',
                  color: '#f87171',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.80rem',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <AlertCircle size={15} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              {/* Forgot Password Helper Toast */}
              {forgotPasswordNotice && (
                <div style={{
                  background: 'rgba(14, 116, 237, 0.14)',
                  border: '1px solid rgba(14, 116, 237, 0.35)',
                  color: '#93C5FD',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.80rem',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Info size={15} style={{ flexShrink: 0 }} />
                  <span>Demo Password: <strong>{isOwner ? 'Owner@123' : 'User@123'}</strong></span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* REGISTER FIELDS - Structured in clean 2-column grid with generous breathing room */}
                {isRegister ? (
                  <>
                    {/* Row 1: Full Name & Mobile Number */}
                    <div className="auth-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '13px' }}>
                      {/* Name */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.86rem', color: '#F1F5F9', marginBottom: '5px', fontWeight: 600 }}>
                          {isOwner ? 'Host / Owner Name' : 'Full Name'}
                        </label>
                        <div style={{ position: 'relative' }}>
                          <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                          <input 
                            type="text" 
                            required 
                            placeholder={isOwner ? "Rajesh Sharma" : "Aakash Mehta"}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`auth-input ${isOwner ? 'auth-input-owner' : ''}`}
                            style={{
                              width: '100%',
                              padding: '12px 14px 12px 42px',
                              borderRadius: '11px',
                              fontSize: '0.94rem',
                              outline: 'none'
                            }}
                          />
                        </div>
                      </div>

                      {/* Mobile */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.86rem', color: '#F1F5F9', marginBottom: '5px', fontWeight: 600 }}>
                          {isOwner ? 'Mobile / WhatsApp' : 'Mobile Number'}
                        </label>
                        <div style={{ position: 'relative' }}>
                          <Phone size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: isOwner ? 'var(--gold-primary)' : '#38BDF8' }} />
                          <input 
                            type="tel" 
                            required 
                            placeholder="+91 98765 43210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className={`auth-input ${isOwner ? 'auth-input-owner' : ''}`}
                            style={{
                              width: '100%',
                              padding: '12px 14px 12px 42px',
                              borderRadius: '11px',
                              fontSize: '0.94rem',
                              outline: 'none'
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Email ID & Location/Address */}
                    <div className="auth-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '13px' }}>
                      {/* Email */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.86rem', color: '#F1F5F9', marginBottom: '5px', fontWeight: 600 }}>
                          {isOwner ? 'Owner Email ID' : 'Student Email ID'}
                        </label>
                        <div style={{ position: 'relative' }}>
                          <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: isOwner ? 'var(--gold-primary)' : '#38BDF8' }} />
                          <input 
                            type="email" 
                            required 
                            placeholder={isOwner ? "owner@domain.com" : "student@example.com"}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`auth-input ${isOwner ? 'auth-input-owner' : ''}`}
                            style={{
                              width: '100%',
                              padding: '12px 14px 12px 42px',
                              borderRadius: '11px',
                              fontSize: '0.94rem',
                              outline: 'none'
                            }}
                          />
                        </div>
                      </div>

                      {/* Address */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.86rem', color: '#F1F5F9', marginBottom: '5px', fontWeight: 600 }}>
                          {isOwner ? 'Property City / Location' : 'City / Address'}
                        </label>
                        <div style={{ position: 'relative' }}>
                          <MapPin size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: isOwner ? 'var(--gold-primary)' : '#38BDF8' }} />
                          <input 
                            type="text" 
                            required 
                            placeholder={isOwner ? "e.g. Pune, MH" : "e.g. Pune, MH"}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className={`auth-input ${isOwner ? 'auth-input-owner' : ''}`}
                            style={{
                              width: '100%',
                              padding: '12px 14px 12px 42px',
                              borderRadius: '11px',
                              fontSize: '0.94rem',
                              outline: 'none'
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 3: Password */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '0.86rem', color: '#F1F5F9', marginBottom: '5px', fontWeight: 600 }}>
                        Create Password
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: isOwner ? 'var(--gold-primary)' : '#38BDF8' }} />
                        <input 
                          type={showPassword ? "text" : "password"} 
                          required 
                          placeholder="Minimum 6 characters"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={`auth-input ${isOwner ? 'auth-input-owner' : ''}`}
                          style={{
                            width: '100%',
                            padding: '12px 44px 12px 42px',
                            borderRadius: '11px',
                            fontSize: '0.94rem',
                            outline: 'none'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          style={{
                            position: 'absolute',
                            right: '14px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'transparent',
                            border: 'none',
                            color: '#94A3B8',
                            cursor: 'pointer'
                          }}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  /* LOGIN FIELDS - Scaled Up for Maximum Prominence */
                  <>
                    {/* Email Address */}
                    <div style={{ marginBottom: '18px' }}>
                      <label style={{ display: 'block', fontSize: '0.88rem', color: '#F1F5F9', marginBottom: '6px', fontWeight: 600 }}>
                        {isOwner ? 'Owner Email ID' : 'Student Email ID'}
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: isOwner ? 'var(--gold-primary)' : '#38BDF8' }} />
                        <input 
                          type="email" 
                          required 
                          placeholder={isOwner ? "owner@domain.com" : "student@example.com"}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={`auth-input ${isOwner ? 'auth-input-owner' : ''}`}
                          style={{
                            width: '100%',
                            padding: '13px 14px 13px 44px',
                            borderRadius: '11px',
                            fontSize: '0.96rem',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>

                    {/* Password with Forgot Password */}
                    <div style={{ marginBottom: '22px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <label style={{ fontSize: '0.88rem', color: '#F1F5F9', fontWeight: 600 }}>
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => setForgotPasswordNotice(!forgotPasswordNotice)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: isOwner ? 'var(--gold-primary)' : '#60A5FA',
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            padding: 0
                          }}
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: isOwner ? 'var(--gold-primary)' : '#38BDF8' }} />
                        <input 
                          type={showPassword ? "text" : "password"} 
                          required 
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={`auth-input ${isOwner ? 'auth-input-owner' : ''}`}
                          style={{
                            width: '100%',
                            padding: '13px 44px 13px 44px',
                            borderRadius: '11px',
                            fontSize: '0.96rem',
                            outline: 'none'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          style={{
                            position: 'absolute',
                            right: '14px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'transparent',
                            border: 'none',
                            color: '#94A3B8',
                            cursor: 'pointer'
                          }}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Submit Action Button */}
                <button 
                  type="submit" 
                  disabled={loading} 
                  style={{ 
                    width: '100%', 
                    padding: isRegister ? '14px' : '15px', 
                    fontSize: isRegister ? '1.02rem' : '1.06rem',
                    fontWeight: isOwner ? 800 : 700,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    background: isOwner 
                      ? 'linear-gradient(135deg, #d4af37 0%, #f5c542 100%)' 
                      : 'linear-gradient(135deg, #0e74ed 0%, #0099ff 100%)',
                    color: isOwner ? '#040d21' : '#ffffff',
                    boxShadow: isOwner 
                      ? '0 8px 24px rgba(212, 175, 55, 0.40)' 
                      : '0 8px 24px rgba(14, 116, 237, 0.40)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {loading 
                    ? 'Processing...' 
                    : isRegister 
                      ? (isOwner ? 'Register as Owner (Free) →' : 'Create Free Student Account →') 
                      : 'Log In →'}
                </button>

                {/* Footnote for owner registration */}
                {isRegister && isOwner && (
                  <p style={{
                    fontSize: '0.74rem',
                    color: '#94A3B8',
                    textAlign: 'center',
                    margin: '8px 0 0 0',
                    lineHeight: 1.25
                  }}>
                    * Active ₹99/mo subscription required to display your properties publicly.
                  </p>
                )}
              </form>

              {/* Secondary Action: High-Visibility Secondary Skip Button */}
              <div style={{ 
                marginTop: isRegister ? '12px' : '16px', 
                paddingTop: isRegister ? '12px' : '14px', 
                borderTop: '1px solid rgba(255, 255, 255, 0.10)',
                width: '100%'
              }}>
                <button
                  type="button"
                  onClick={handleSkip}
                  style={{
                    width: '100%',
                    padding: isRegister ? '10px 16px' : '12px 18px',
                    borderRadius: '11px',
                    border: isOwner 
                      ? '1.5px solid rgba(212, 175, 55, 0.35)' 
                      : '1.5px solid rgba(56, 189, 248, 0.35)',
                    background: isOwner 
                      ? 'rgba(212, 175, 55, 0.06)' 
                      : 'rgba(14, 116, 237, 0.08)',
                    color: isOwner ? 'var(--gold-light)' : '#BAE6FD',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isOwner ? 'rgba(212, 175, 55, 0.15)' : 'rgba(14, 116, 237, 0.18)';
                    e.currentTarget.style.borderColor = isOwner ? 'rgba(212, 175, 55, 0.7)' : 'rgba(56, 189, 248, 0.7)';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isOwner ? 'rgba(212, 175, 55, 0.06)' : 'rgba(14, 116, 237, 0.08)';
                    e.currentTarget.style.borderColor = isOwner ? 'rgba(212, 175, 55, 0.35)' : 'rgba(56, 189, 248, 0.35)';
                    e.currentTarget.style.color = isOwner ? 'var(--gold-light)' : '#BAE6FD';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span>Skip & browse properties without {isRegister ? 'registering' : 'logging in'}</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Bottom Footer */}
      <footer style={{
        padding: '6px 0',
        borderTop: isOwner 
          ? '1px solid rgba(212, 175, 55, 0.15)' 
          : '1px solid rgba(14, 116, 237, 0.15)',
        background: 'rgba(3, 10, 28, 0.95)',
        textAlign: 'center',
        position: 'relative',
        zIndex: 20,
        width: '100%',
        flexShrink: 0
      }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '0.76rem',
          color: '#94A3B8'
        }}>
          <span style={{ color: '#CBD5E1', fontWeight: 500 }}>
            © 2026 Vrundavan Ventures Residences
          </span>
          <span>•</span>
          <span>Verified Luxury Accommodations</span>
          <span>•</span>
          <span>Direct Connect Network</span>
        </div>
      </footer>

      {/* Modern Responsive Styles */}
      <style>{`
        .auth-page-container {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: var(--bg-primary);
          display: flex;
          flex-direction: column;
          justifyContent: space-between;
          overflow-x: hidden;
          animation: fadeIn 0.2s ease-out;
        }

        .auth-split-layout {
          max-width: 1220px;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1.22fr;
          gap: 54px;
          align-items: center;
          margin: 0 auto;
        }

        .auth-left-pane {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .auth-right-pane {
          display: flex;
          flex-direction: column;
          align-items: center;
          justifyContent: center;
          width: 100%;
        }

        /* High-Visibility Interactive Input Styles */
        .auth-input {
          width: 100%;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.08) !important;
          border: 1px solid rgba(255, 255, 255, 0.22) !important;
          color: #ffffff !important;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          outline: none;
        }
        .auth-input:hover {
          border-color: rgba(255, 255, 255, 0.38) !important;
          background: rgba(255, 255, 255, 0.10) !important;
        }
        .auth-input:focus {
          background: rgba(255, 255, 255, 0.12) !important;
          border-color: #38BDF8 !important;
          box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.25) !important;
        }
        .auth-input-owner:focus {
          border-color: #f5c542 !important;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.28) !important;
        }
        .auth-input::placeholder {
          color: #94A3B8;
          opacity: 0.85;
        }

        /* Desktop: strictly fit inside 100vh with zero scrollbar */
        @media (min-width: 900px) and (min-height: 520px) {
          .auth-page-container {
            height: 100vh;
            max-height: 100vh;
            overflow: hidden;
          }
        }

        /* Mobile or compact viewports */
        @media (max-width: 899px), (max-height: 519px) {
          .auth-page-container {
            height: auto;
            min-height: 100vh;
            overflow-y: auto;
            justifyContent: flex-start;
            padding-bottom: 20px;
          }
          .auth-split-layout {
            grid-template-columns: 1fr;
            gap: 20px;
            padding-top: 10px;
          }
          .auth-left-pane {
            display: none;
          }
          .auth-two-col {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
