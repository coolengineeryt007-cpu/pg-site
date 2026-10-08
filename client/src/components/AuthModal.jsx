import React, { useState } from 'react';
import { Crown, ShieldCheck, User, X, Check, Lock, Mail, Phone } from 'lucide-react';
import { api } from '../services/api';

export default function AuthModal({ isOpen, onClose, initialRole = 'owner', onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState(initialRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        const res = await api.register({ name, email, password, role, phone });
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

  // Quick 1-Click Demo Login buttons for instant tester access
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#999', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '44px', height: '44px', background: 'var(--gold-gradient)', borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', color: '#080808'
          }}>
            <Crown size={24} />
          </div>
          <h2 className="font-serif gold-gradient-text" style={{ fontSize: '1.6rem' }}>
            {isRegister ? 'Create Aurelia Account' : 'Prestige Access Portal'}
          </h2>
          <p style={{ color: '#888', fontSize: '0.85rem' }}>
            {isRegister ? 'Register as PG Owner or Student Resident' : 'Sign in to access your administrative dashboard'}
          </p>
        </div>

        {/* 1-Click Demo Logins */}
        {!isRegister && (
          <div style={{
            background: '#121212',
            border: '1px solid rgba(212,175,55,0.2)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px',
            marginBottom: '20px'
          }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--gold-primary)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '8px', textAlign: 'center' }}>
              ⚡ 1-Click Instant Demo Profiles:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              <button 
                type="button"
                onClick={() => handleDemoLogin('superadmin@luxurypg.com', 'Super@123')}
                className="btn btn-crimson btn-sm"
                style={{ fontSize: '0.75rem', padding: '6px 8px' }}
              >
                <ShieldCheck size={13} /> Super Admin
              </button>
              <button 
                type="button"
                onClick={() => handleDemoLogin('rajesh@royalpg.com', 'Owner@123')}
                className="btn btn-gold btn-sm"
                style={{ fontSize: '0.75rem', padding: '6px 8px' }}
              >
                <Crown size={13} /> PG Owner Host
              </button>
            </div>
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '10px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  required 
                  className="form-input" 
                  placeholder="e.g. Vikram Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Account Role</label>
                <select 
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="owner">PG Owner (Unlimited Host Tier)</option>
                  <option value="tenant">Student / Tenant Resident</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  type="tel" 
                  className="form-input" 
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              required 
              className="form-input" 
              placeholder="user@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              required 
              className="form-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn btn-gold" 
            style={{ width: '100%', marginTop: '12px' }}
          >
            {loading ? 'Authenticating...' : isRegister ? 'Register Account' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.85rem', color: '#888' }}>
          {isRegister ? (
            <span>
              Already registered?{' '}
              <button 
                onClick={() => setIsRegister(false)} 
                style={{ background: 'transparent', border: 'none', color: 'var(--gold-primary)', cursor: 'pointer', fontWeight: 600 }}
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Are you a new PG Owner?{' '}
              <button 
                onClick={() => { setIsRegister(true); setRole('owner'); }} 
                style={{ background: 'transparent', border: 'none', color: 'var(--gold-primary)', cursor: 'pointer', fontWeight: 600 }}
              >
                Register as Host
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
