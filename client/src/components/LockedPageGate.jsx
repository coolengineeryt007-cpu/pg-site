import React from 'react';
import { Lock, LogIn, ArrowLeft } from 'lucide-react';

export default function LockedPageGate({ 
  title = "Please Login to Access This Page", 
  message, 
  role = "student", 
  onOpenLogin, 
  onGoHome 
}) {
  return (
    <div className="container" style={{ 
      padding: '80px 20px', 
      minHeight: '65vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      textAlign: 'center' 
    }}>
      <div className="luxury-card" style={{
        maxWidth: '560px',
        width: '100%',
        padding: '44px 32px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, rgba(7, 23, 57, 0.95) 0%, rgba(4, 13, 33, 0.98) 100%)',
        border: '1.5px solid rgba(212, 175, 55, 0.45)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(14, 116, 237, 0.2)'
      }}>
        {/* Lock Icon Emblem */}
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          background: 'rgba(212, 175, 55, 0.12)',
          border: '1.5px solid rgba(212, 175, 55, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 18px auto',
          color: 'var(--gold-primary)',
          boxShadow: '0 0 25px rgba(212, 175, 55, 0.25)'
        }}>
          <Lock size={36} />
        </div>

        <span className="badge badge-gold" style={{ marginBottom: '16px', fontSize: '0.82rem', padding: '6px 14px', fontWeight: 700 }}>
          🔒 Restricted Page
        </span>

        <h2 className="font-serif gold-gradient-text" style={{ fontSize: 'clamp(1.7rem, 4vw, 2.3rem)', fontWeight: 800, marginBottom: '12px' }}>
          {title}
        </h2>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto 28px auto' }}>
          {message || 'You must be logged in to view this page. Please sign in to browse all verified rental properties, access live GPS filters, and connect directly with hosts.'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '360px', margin: '0 auto' }}>
          <button 
            type="button"
            onClick={() => onOpenLogin && onOpenLogin(role)}
            className="btn btn-gold btn-lg"
            style={{ width: '100%', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
          >
            <LogIn size={18} />
            <span>{role === 'owner' ? 'Please Login as Property Owner' : 'Please Login as Student / Seeker'}</span>
          </button>

          {onGoHome && (
            <button 
              type="button"
              onClick={onGoHome}
              className="btn btn-ghost"
              style={{ width: '100%', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <ArrowLeft size={16} />
              <span>Back to Home Page</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
