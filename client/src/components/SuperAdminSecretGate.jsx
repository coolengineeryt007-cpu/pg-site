import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowLeft, 
  KeyRound, 
  AlertTriangle, 
  CheckCircle2,
  Sparkles,
  Crown
} from 'lucide-react';
import { api } from '../services/api';

export default function SuperAdminSecretGate({ onLoginSuccess, onCancel }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.login(email, password);
      if (res.user.role !== 'superadmin') {
        throw new Error('Access denied: Provided account does not possess Super Administrator privileges.');
      }
      onLoginSuccess(res.user);
    } catch (err) {
      setError(err.message || 'Super Admin authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoAccess = () => {
    setEmail('superadmin@luxurypg.com');
    setPassword('Super@123');
    setLoading(true);
    setError('');
    api.login('superadmin@luxurypg.com', 'Super@123')
      .then((res) => {
        onLoginSuccess(res.user);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative'
    }}>
      {/* Background cyber radial glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '650px',
        height: '450px',
        background: 'radial-gradient(ellipse, rgba(14, 116, 237, 0.22) 0%, rgba(0, 210, 180, 0.12) 40%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%',
        maxWidth: '460px',
        background: 'rgba(4, 13, 33, 0.98)',
        border: '1px solid rgba(14, 116, 237, 0.45)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 25px 50px -12px rgba(2, 6, 23, 0.95), 0 0 35px rgba(14, 116, 237, 0.35)',
        padding: '36px 30px',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Top return link */}
        <div style={{ marginBottom: '22px' }}>
          <button 
            onClick={onCancel}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem'
            }}
          >
            <ArrowLeft size={16} /> Exit to Public Website
          </button>
        </div>

        {/* Security Emblem */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(14, 116, 237, 0.25) 0%, rgba(0, 210, 180, 0.2) 100%)',
            border: '1px solid rgba(14, 116, 237, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            color: '#60A5FA',
            boxShadow: '0 0 20px rgba(14, 116, 237, 0.4)'
          }}>
            <ShieldCheck size={32} />
          </div>

          <h2 className="font-serif" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
            Master Control Center
          </h2>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span className="badge badge-blue" style={{ fontSize: '0.72rem', letterSpacing: '0.08em' }}>
              <Lock size={11} /> RESTRICTED ADMINISTRATIVE ACCESS
            </span>
          </div>
          <p style={{ color: '#94A3B8', fontSize: '0.82rem', marginTop: '10px' }}>
            This portal is isolated from public view. Authorized Super Admin credentials required.
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            color: '#fca5a5',
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={13} style={{ color: 'var(--blue-light)' }} /> Admin Email
            </label>
            <input 
              type="email" 
              required
              className="form-input"
              placeholder="superadmin@luxurypg.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <KeyRound size={13} style={{ color: 'var(--blue-light)' }} /> Master Password
            </label>
            <input 
              type="password" 
              required
              className="form-input"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {loading ? 'Verifying Credentials...' : 'Authenticate Master Admin'}
          </button>
        </form>

        {/* 1-Click Evaluation Access */}
        <div style={{
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(14, 116, 237, 0.25)',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', marginBottom: '10px' }}>
            Authorized Demo Access Shortcut:
          </span>
          <button 
            type="button"
            onClick={handleQuickDemoAccess}
            disabled={loading}
            className="btn btn-sm btn-outline-blue"
            style={{ width: '100%', fontSize: '0.82rem' }}
          >
            ⚡ 1-Click Master Access (superadmin@luxurypg.com)
          </button>
        </div>
      </div>
    </div>
  );
}
