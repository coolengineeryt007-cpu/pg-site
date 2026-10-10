import React, { useState, useEffect } from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export default function Blogs({ onSelectBlog }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBlogs()
      .then((data) => setBlogs(data))
      .catch((err) => console.error("Error fetching blogs:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '90px' }}>
      <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 50px auto' }}>
        <span className="badge badge-gold" style={{ marginBottom: '12px' }}>
          Knowledge & Insights
        </span>
        <h1 className="font-serif gold-gradient-text" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', marginBottom: '16px' }}>
          Rental Living, PG & Housing Master Guides
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7 }}>
          Actionable advice on finding the best rental houses, private rooms, and PGs, saving on deposits, inspecting property infrastructure, and leasing contracts in India's top cities.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--gold-primary)' }}>
          Loading guides...
        </div>
      ) : (
        <div className="grid-3">
          {blogs.map((blog) => (
            <article 
              key={blog.id}
              className="luxury-card"
              style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', height: '100%' }}
              onClick={() => onSelectBlog(blog)}
            >
              <div style={{ height: '210px', overflow: 'hidden', position: 'relative' }}>
                <img 
                  src={blog.coverImage} 
                  alt={blog.title}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80';
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'rgba(8,8,8,0.85)',
                  border: '1px solid var(--gold-border)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  color: 'var(--gold-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Clock size={12} />
                  <span>{blog.readTime}</span>
                </div>
              </div>

              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  {blog.tags?.slice(0, 2).map((t, i) => (
                    <span key={i} className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                      {t}
                    </span>
                  ))}
                </div>

                <h3 style={{ color: '#fff', fontSize: '1.18rem', marginBottom: '10px', lineHeight: 1.4 }}>
                  {blog.title}
                </h3>

                <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px', flex: 1 }}>
                  {blog.excerpt}
                </p>

                <div style={{
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  paddingTop: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.8rem',
                  color: '#888'
                }}>
                  <span>By {blog.author}</span>
                  <span style={{ color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                    Read Article <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
