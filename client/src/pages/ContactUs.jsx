import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import GoogleMapView from '../components/GoogleMapView';

export default function ContactUs() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '90px' }}>
      <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 50px auto' }}>
        <span className="badge badge-crimson" style={{ marginBottom: '12px' }}>
          24/7 Prestige Concierge
        </span>
        <h1 className="font-serif gold-gradient-text" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', marginBottom: '14px' }}>
          Connect with Aurelia Living
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7 }}>
          Whether you are a prospective resident seeking suite availability or a PG owner requesting property onboarding verification, our concierge team is at your service.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)', gap: '40px', marginBottom: '60px' }}>
        {/* Contact Form */}
        <div className="luxury-card" style={{ padding: '36px' }}>
          <h2 className="font-serif" style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '10px' }}>
            Send Us a Priority Message
          </h2>
          <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '24px' }}>
            We typically respond within 15 minutes during active business hours.
          </p>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 10px', color: '#34D399' }}>
              <CheckCircle2 size={52} style={{ margin: '0 auto 16px auto', display: 'block' }} />
              <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '8px' }}>Message Dispatched Successfully</h3>
              <p style={{ color: '#aaa', fontSize: '0.95rem' }}>Our concierge team has received your ticket and will call/email you shortly.</p>
              <button onClick={() => setSubmitted(false)} className="btn btn-outline-gold btn-sm" style={{ marginTop: '20px' }}>
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input 
                  type="text" 
                  required 
                  className="form-input" 
                  placeholder="e.g. Vikramaditya"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input 
                    type="email" 
                    required 
                    className="form-input" 
                    placeholder="name@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Number *</label>
                  <input 
                    type="tel" 
                    required 
                    className="form-input" 
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Inquiry Purpose</label>
                <select 
                  className="form-select"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                >
                  <option value="General Inquiry">General Resident Inquiry</option>
                  <option value="PG Owner Partnership">List My PG Property (Host Onboarding)</option>
                  <option value="Corporate Booking">Corporate Employee Bulk Suites</option>
                  <option value="Report Listing Issue">Super Admin Quality Flag</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Your Message *</label>
                <textarea 
                  rows={4} 
                  required 
                  className="form-textarea" 
                  placeholder="Tell us what you're looking for or how we can assist..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-gold btn-lg" style={{ width: '100%', marginTop: '10px' }}>
                <Send size={18} />
                <span>Submit Priority Ticket</span>
              </button>
            </form>
          )}
        </div>

        {/* Corporate Hub Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="luxury-card" style={{ padding: '28px' }}>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={18} style={{ color: 'var(--gold-primary)' }} />
              Helpline & Urgent Support
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem', color: '#ccc' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', display: 'block' }}>Toll-Free Resident Desk</span>
                <strong style={{ color: 'var(--gold-primary)', fontSize: '1.1rem' }}>+91 1800 212 9999</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', display: 'block' }}>WhatsApp Concierge</span>
                <strong style={{ color: '#fff' }}>+91 98765 43210</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', display: 'block' }}>Official Email</span>
                <strong style={{ color: '#fff' }}>concierge@aureliapg.com</strong>
              </div>
            </div>
          </div>

          <div className="luxury-card" style={{ padding: '28px' }}>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} style={{ color: 'var(--red-crimson)' }} />
              Headquarters Location
            </h3>
            <p style={{ color: '#bbb', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '12px' }}>
              <strong>Aurelia Prestige Towers</strong><br />
              8th Floor, Executive Wing, 100 Feet Road, 4th Block, Koramangala, Bengaluru, Karnataka 560034
            </p>
            <span style={{ fontSize: '0.8rem', color: 'var(--gold-primary)' }}>
              Open Monday to Saturday: 9:00 AM – 8:00 PM IST
            </span>
          </div>
        </div>
      </div>

      {/* Embedded Google Map of HQ */}
      <div className="luxury-card" style={{ padding: '24px' }}>
        <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '14px' }}>
          Find Our Bengaluru Corporate Headquarters
        </h3>
        <GoogleMapView 
          center={{ lat: 12.9352, lng: 77.6245 }}
          zoom={15}
          height="320px"
          markers={[{
            id: 'hq',
            name: 'Aurelia Residences Corporate HQ',
            gender: 'Headquarters',
            rent: 0,
            featured: true,
            address: { lat: 12.9352, lng: 77.6245, area: 'Koramangala 4th Block', city: 'Bengaluru' }
          }]}
        />
      </div>
    </div>
  );
}
