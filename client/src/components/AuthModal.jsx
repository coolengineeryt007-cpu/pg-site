import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  X, 
  Check, 
  Lock, 
  Mail, 
  Phone, 
  Crown, 
  GraduationCap, 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  EyeOff,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  initialRole = 'tenant', 
  onLoginSuccess,
  onSkipLogin
}) {
  const [role, setRole] = useState(initialRole === 'owner' ? 'owner' : 'tenant');
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sync role if initialRole changes when modal opens
  React.useEffect(() => {
    if (initialRole) {
      setRole(initialRole === 'owner' ? 'owner' : 'tenant');
    }
  }, [initialRole]);

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
          phone 
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

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      background: 'rgba(2, 6, 23, 0.95)',
      backdropFilter: 'blur(22px)',
      WebkitBackdropFilter: 'blur(22px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      overflowY: 'auto',
      animation: 'fadeIn 0.25s ease-out'
    }}>
      {/* Background Cyber Ambient Lights */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '15%',
        width: '500px',
        height: '400px',
        background: role === 'owner' 
          ? 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 65%)'
          : 'radial-gradient(circle, rgba(14, 116, 237, 0.25) 0%, transparent 65%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '15%',
        width: '500px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(0, 210, 180, 0.15) 0%, transparent 65%)',
        pointerEvents: 'none'
      }} />

      {/* Main Full-Screen Modal Card */}
      <div style={{
        width: '100%',
        maxWidth: '540px',
        background: 'rgba(4, 13, 33, 0.98)',
        border: '1px solid rgba(212, 175, 55, 0.35)',
        borderRadius: '20px',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px rgba(14, 116, 237, 0.2)',
        padding: '36px 32px',
        position: 'relative',
        zIndex: 10,
        margin: 'auto'
      }}>
        {/* Top Header Row with Logo and Skip Close */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <img 
            src="/logo.png" 
            alt="Vrundavan Ventures" 
            style={{ 
              height: '68px', 
              width: '68px', 
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid rgba(212, 175, 55, 0.85)',
              boxShadow: '0 0 18px rgba(212, 175, 55, 0.5)',
              display: 'block'
            }} 
          />

          <button 
            onClick={handleSkip}
            className="btn btn-ghost btn-sm"
            style={{ color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}
            title="Skip and view partial information as guest"
          >
            <span>Skip for Now</span>
            <X size={16} />
          </button>
        </div>

        {/* Dedicated Portal Badge (Strictly Single Role: Student OR Owner) */}
        <div style={{ textAlign: 'center', marginBottom: '14px' }}>
          <span className={`badge ${role === 'owner' ? 'badge-gold' : 'badge-blue'}`} style={{ fontSize: '0.84rem', padding: '6px 16px', fontWeight: 700 }}>
            {role === 'owner' ? '🏢 Property Owner & Landlord Portal' : '🎓 Student & Home Seeker Portal'}
          </span>
        </div>

        {/* Modal Title & Welcome Notice */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <h2 className="font-serif gold-gradient-text" style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '6px' }}>
            {role === 'owner'
              ? (isRegister ? 'Register as Property Host' : 'Host & Landlord Portal')
              : (isRegister ? 'Create Home Seeker Account' : 'Welcome to Rental Search')}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5 }}>
            {role === 'owner'
              ? (isRegister 
                  ? 'List houses, private rooms & PGs with 0% brokerage and receive verified tenant leads.' 
                  : 'Sign in to access your properties, manage room vacancies, and view tenant inquiries.')
              : (isRegister
                  ? 'Sign up to unlock verified owner contacts, WhatsApp directly, and schedule zero-brokerage visits.'
                  : 'Sign in to reveal direct owner phone numbers, schedule physical visits, and get instant booking confirmations.')}
          </p>
        </div>

        {/* 1-Click Instant Demo Login Box */}
        {!isRegister && (
          <div style={{
            background: 'rgba(14, 116, 237, 0.1)',
            border: '1px solid rgba(14, 116, 237, 0.35)',
            borderRadius: '10px',
            padding: '12px 14px',
            marginBottom: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--gold-primary)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
                ⚡ Fast 1-Click Demo Access:
              </span>
              <span style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: 600 }}>Zero Password Needed</span>
            </div>

            {role === 'owner' ? (
              <button 
                type="button"
                onClick={() => handleDemoLogin('rajesh@royalpg.com', 'Owner@123')}
                className="btn btn-gold btn-sm"
                style={{ width: '100%', fontSize: '0.82rem', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Crown size={14} /> Instant Demo Host Login (Rajesh Sharma)
              </button>
            ) : (
              <button 
                type="button"
                onClick={() => handleDemoLogin('aakash@gmail.com', 'User@123')}
                className="btn btn-blue btn-sm"
                style={{ width: '100%', fontSize: '0.82rem', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <User size={14} /> Instant Demo Tenant Login (Aakash Mehta)
              </button>
            )}
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            color: '#f87171',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div className="form-group">
                <label className="form-label">{role === 'owner' ? 'Full Name / Property Management Name *' : 'Your Full Name *'}</label>
                <input 
                  type="text" 
                  required 
                  className="form-input" 
                  placeholder={role === 'owner' ? "e.g. Rajesh Sharma" : "e.g. Rahul Verma"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone / WhatsApp Number *</label>
                <input 
                  type="tel" 
                  required
                  className="form-input" 
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input 
              type="email" 
              required 
              className="form-input" 
              placeholder={role === 'owner' ? "owner@domain.com" : "you@example.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                className="form-input" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className={`btn ${role === 'owner' ? 'btn-gold' : 'btn-blue'}`} 
            style={{ width: '100%', marginTop: '14px', padding: '12px', fontSize: '0.95rem' }}
          >
            {loading ? 'Authenticating...' : isRegister ? `Create Free ${role === 'owner' ? 'Host' : 'Tenant'} Account` : `Sign In as ${role === 'owner' ? 'Owner' : 'Tenant'}`}
          </button>
        </form>

        {/* Toggle between Sign In and Register */}
        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.86rem', color: '#94A3B8' }}>
          {isRegister ? (
            <span>
              Already have an account?{' '}
              <button 
                type="button"
                onClick={() => { setIsRegister(false); setError(''); }} 
                style={{ background: 'transparent', border: 'none', color: 'var(--gold-primary)', cursor: 'pointer', fontWeight: 700 }}
              >
                Sign In here
              </button>
            </span>
          ) : (
            <span>
              New to Vrundavan Ventures?{' '}
              <button 
                type="button"
                onClick={() => { setIsRegister(true); setError(''); }} 
                style={{ background: 'transparent', border: 'none', color: 'var(--gold-primary)', cursor: 'pointer', fontWeight: 700 }}
              >
                Register for Free
              </button>
            </span>
          )}
        </div>

        {/* SKIP LOGIN / GUEST MODE SECTION */}
        <div style={{
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          textAlign: 'center'
        }}>
          <button
            type="button"
            onClick={handleSkip}
            className="btn btn-ghost"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px dashed rgba(212, 175, 55, 0.45)',
              borderRadius: '10px',
              color: 'var(--gold-light)',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: 'rgba(212, 175, 55, 0.04)'
            }}
          >
            <span>⏭️ Skip Login & Continue as Guest</span>
            <ArrowRight size={15} />
          </button>

          <p style={{
            fontSize: '0.76rem',
            color: '#64748B',
            marginTop: '8px',
            lineHeight: 1.4
          }}>
            ℹ️ <em>Guest Mode: Partial / half information is displayed. Exact house address, direct phone numbers, and WhatsApp contact are locked until login.</em>
          </p>
        </div>
      </div>
    </div>
  );
}
