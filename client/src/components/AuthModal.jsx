import React, { useState } from 'react';
import { Building2, User, X, Check, Lock, Mail, Phone, Crown } from 'lucide-react';
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
        const res = await api.register({ name, email, password, role: 'owner', phone });
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

  // Quick 1-Click Demo Login button for instant Owner access
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
            <Building2 size={24} />
          </div>
          <h2 className="font-serif gold-gradient-text" style={{ fontSize: '1.6rem' }}>
            {isRegister ? 'Register as PG Owner' : 'PG Owner Access Portal'}
          </h2>
          <p style={{ color: '#888', fontSize: '0.85rem' }}>
            {isRegister ? 'Create your host account to list properties with 0% brokerage' : 'Sign in to access your properties, rooms, and tenant leads'}
          </p>
        </div>

        {/* 1-Click Demo Login for PG Owner ONLY (Super Admin is strictly hidden) */}
        {!isRegister && (
          <div style={{
            background: '#071739',
            border: '1px solid rgba(212,175,55,0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px',
            marginBottom: '20px'
          }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--gold-primary)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '8px', textAlign: 'center' }}>
              ⚡ 1-Click Demo Host Access:
            </span>
            <button 
              type="button"
              onClick={() => handleDemoLogin('rajesh@royalpg.com', 'Owner@123')}
              className="btn btn-gold btn-sm"
              style={{ width: '100%', fontSize: '0.82rem', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Crown size={14} /> Instant Demo PG Owner Login (Rajesh Sharma)
            </button>
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
                <label className="form-label">Full Name / PG Entity Name</label>
                <input 
                  type="text" 
                  required 
                  className="form-input" 
                  placeholder="e.g. Rajesh Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone / WhatsApp Number</label>
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
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              required 
              className="form-input" 
              placeholder="owner@domain.com"
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
            {loading ? 'Authenticating...' : isRegister ? 'Create Host Account' : 'Sign In as Owner'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.85rem', color: '#888' }}>
          {isRegister ? (
            <span>
              Already have an owner account?{' '}
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
