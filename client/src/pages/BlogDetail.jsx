import React from 'react';
import { ArrowLeft, Clock, Calendar, User, Tag, Share2, Crown } from 'lucide-react';

export default function BlogDetail({ blog, onBack }) {
  if (!blog) return null;

  return (
    <article className="container" style={{ paddingTop: '35px', paddingBottom: '90px', maxWidth: '880px' }}>
      <button 
        onClick={onBack}
        className="btn btn-ghost btn-sm"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}
      >
        <ArrowLeft size={16} /> Back to All Guides
      </button>

      {/* Header Info */}
      <div style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
          {blog.tags?.map((t, i) => (
            <span key={i} className="badge badge-gold">{t}</span>
          ))}
        </div>

        <h1 className="font-serif gold-gradient-text" style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', lineHeight: 1.25, marginBottom: '16px' }}>
          {blog.title}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#888', fontSize: '0.88rem', flexWrap: 'wrap' }}>
          <span>Written by <strong style={{ color: '#fff' }}>{blog.author}</strong> ({blog.authorRole})</span>
          <span>•</span>
          <span>Published: {blog.publishedAt}</span>
          <span>•</span>
          <span style={{ color: 'var(--gold-primary)' }}>{blog.readTime}</span>
        </div>
      </div>

      {/* Cover Image */}
      <div style={{
        width: '100%',
        height: '420px',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--gold-border)',
        marginBottom: '40px',
        boxShadow: 'var(--shadow-luxury)'
      }}>
        <img 
          src={blog.coverImage} 
          alt={blog.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Main Body */}
      <div className="luxury-card" style={{ padding: '40px 45px', marginBottom: '40px', lineHeight: 1.9, fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
        <div style={{ whiteSpace: 'pre-line' }}>
          {blog.content}
        </div>
      </div>

      {/* Author Bio Card */}
      <div className="luxury-card" style={{ padding: '28px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{
          width: '65px', height: '65px', borderRadius: '50%', background: 'var(--gold-gradient)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#080808', fontWeight: 800, fontSize: '1.3rem'
        }}>
          {blog.author?.charAt(0)}
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Article Author</span>
          <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '2px' }}>{blog.author}</h4>
          <span style={{ color: 'var(--gold-light)', fontSize: '0.85rem' }}>{blog.authorRole} • Aurelia Editorial Board</span>
        </div>
      </div>
    </article>
  );
}
