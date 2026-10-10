import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  MapPin, 
  Check, 
  ArrowRight, 
  Sliders, 
  Zap
} from 'lucide-react';
import { api } from '../services/api';

export default function AiConciergeModal({ isOpen, onClose, onSelectPg }) {
  const [activeTab, setActiveTab] = useState('matchmaker'); // 'matchmaker' | 'chat'
  
  // Matchmaker form state
  const [city, setCity] = useState('Rajkot');
  const [budget, setBudget] = useState('15000');
  const [propertyType, setPropertyType] = useState('all');
  const [suitableFor, setSuitableFor] = useState('all');
  const [customPrompt, setCustomPrompt] = useState('');
  const [matching, setMatching] = useState(false);
  const [matchResults, setMatchResults] = useState(null);

  // Chat state
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Namaste! I am your Vrundavan AI Property Concierge. Tell me where you want to stay, your budget, or your college/office location, and I will find your 100% verified match with 0% brokerage."
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatting, setChatting] = useState(false);

  const quickPrompts = [
    "Student PG in Rajkot under ₹12k with food",
    "Single room near 150ft Ring Road Rajkot",
    "Executive PG in Bengaluru near Koramangala",
    "Family 2BHK flat with modular kitchen",
    "What is the security deposit policy?"
  ];

  const handleRunMatchmaker = async (overridePrompt = null) => {
    setMatching(true);
    setMatchResults(null);
    try {
      const payload = {
        query: overridePrompt || customPrompt,
        city: city === 'all' ? undefined : city,
        budget: budget ? Number(budget) : undefined,
        propertyType: propertyType === 'all' ? undefined : propertyType,
        suitableFor: suitableFor === 'all' ? undefined : suitableFor
      };
      const res = await api.aiMatch(payload);
      setMatchResults(res);
    } catch (err) {
      console.error("AI Matchmaker error:", err);
    } finally {
      setMatching(false);
    }
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setChatting(true);

    try {
      const res = await api.aiChat(text);
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: res.reply,
        relevantPgs: res.relevantPgs || [],
        suggestedAction: res.suggestedAction
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.warn('AI Chat message error:', err);
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, sender: 'ai', text: "I'm having trouble connecting right now. Please try again in a moment." }
      ]);
    } finally {
      setChatting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(2, 6, 23, 0.82)',
      backdropFilter: 'blur(10px)',
      zIndex: 100000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        background: 'linear-gradient(145deg, #071536, #020A1E)',
        border: '1px solid rgba(212, 175, 55, 0.35)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(212, 175, 55, 0.2)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '780px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(10, 25, 60, 0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0E74ED, #D4AF37)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(212, 175, 55, 0.4)'
            }}>
              <Sparkles size={22} color="#fff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#fff', fontWeight: 700 }}>
                  Vrundavan AI Concierge
                </h3>
                <span style={{
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  color: 'var(--gold-primary)',
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '20px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Zap size={11} /> AI v2.4 Active
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Intelligent Neural Accommodation Matchmaker & Zero Brokerage Advisor
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              color: '#aaa',
              cursor: 'pointer',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Controls */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(5, 14, 38, 0.7)'
        }}>
          <button
            onClick={() => setActiveTab('matchmaker')}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: 'none',
              background: activeTab === 'matchmaker' ? 'rgba(212, 175, 55, 0.12)' : 'transparent',
              borderBottom: activeTab === 'matchmaker' ? '2px solid var(--gold-primary)' : '2px solid transparent',
              color: activeTab === 'matchmaker' ? 'var(--gold-primary)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Sliders size={16} /> AI Matchmaker Engine
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: 'none',
              background: activeTab === 'chat' ? 'rgba(212, 175, 55, 0.12)' : 'transparent',
              borderBottom: activeTab === 'chat' ? '2px solid var(--gold-primary)' : '2px solid transparent',
              color: activeTab === 'chat' ? 'var(--gold-primary)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Bot size={16} /> Chat with AI Assistant
          </button>
        </div>

        {/* Body Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {activeTab === 'matchmaker' ? (
            <div>
              {/* Natural Query Input */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--gold-primary)', fontWeight: 600, marginBottom: '6px' }}>
                  Describe Your Dream Stay or Requirements in Plain Language:
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g. Student single room near Yogi Nagar Rajkot under ₹14000 with 3-time meals..."
                    onKeyDown={(e) => e.key === 'Enter' && handleRunMatchmaker()}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: '14px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>
              </div>

              {/* Filter Parameters Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '14px',
                marginBottom: '20px'
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Preferred City:
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: '#07183D',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      fontSize: '0.88rem'
                    }}
                  >
                    <option value="all">All Available Cities</option>
                    <option value="Rajkot">Rajkot</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Pune">Pune</option>
                    <option value="Delhi">Delhi</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Max Monthly Budget (₹):
                  </label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: '#07183D',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      fontSize: '0.88rem'
                    }}
                  >
                    <option value="">No Budget Limit</option>
                    <option value="10000">Up to ₹10,000 / month</option>
                    <option value="15000">Up to ₹15,000 / month</option>
                    <option value="20000">Up to ₹20,000 / month</option>
                    <option value="35000">Up to ₹35,000 / month</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Property Category:
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: '#07183D',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      fontSize: '0.88rem'
                    }}
                  >
                    <option value="all">All Properties</option>
                    <option value="pg">Luxury PG & Coliving</option>
                    <option value="room">Private Rental Room</option>
                    <option value="house">Rental House / Flat</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Suitable For:
                  </label>
                  <select
                    value={suitableFor}
                    onChange={(e) => setSuitableFor(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: '#07183D',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      fontSize: '0.88rem'
                    }}
                  >
                    <option value="all">Anyone / All</option>
                    <option value="Students">Students & Scholars</option>
                    <option value="Working Professionals">Working Professionals</option>
                    <option value="Family">Families</option>
                  </select>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleRunMatchmaker()}
                disabled={matching}
                className="btn btn-gold"
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  borderRadius: '14px',
                  boxShadow: '0 8px 25px rgba(212, 175, 55, 0.35)',
                  marginBottom: '24px'
                }}
              >
                {matching ? (
                  <>Processing AI Neural Matching Engine...</>
                ) : (
                  <>
                    <Sparkles size={18} /> Find My AI Compatible Stays
                  </>
                )}
              </button>

              {/* Quick AI Presets */}
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                  Popular AI Prompts:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {quickPrompts.slice(0, 3).map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCustomPrompt(prompt);
                        handleRunMatchmaker(prompt);
                      }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        color: 'var(--gold-light)',
                        fontSize: '0.78rem',
                        cursor: 'pointer'
                      }}
                    >
                      ⚡ {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results Container */}
              {matchResults && (
                <div>
                  <div style={{
                    padding: '14px 18px',
                    borderRadius: '12px',
                    background: 'rgba(14, 116, 237, 0.12)',
                    border: '1px solid rgba(14, 116, 237, 0.3)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <Sparkles size={18} color="var(--gold-primary)" />
                    <span>{matchResults.message}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {matchResults.matches?.map((pg) => (
                      <div
                        key={pg.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(212, 175, 55, 0.25)',
                          borderRadius: '16px',
                          padding: '16px',
                          display: 'flex',
                          gap: '16px',
                          alignItems: 'center',
                          flexWrap: 'wrap'
                        }}
                      >
                        <img
                          src={pg.photos?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300'}
                          alt={pg.name}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300';
                          }}
                          style={{
                            width: '100px',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '12px'
                          }}
                        />

                        <div style={{ flex: 1, minWidth: '220px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <h4 style={{ margin: 0, color: '#fff', fontSize: '1.05rem', fontWeight: 600 }}>
                              {pg.name}
                            </h4>
                            <span style={{
                              background: 'rgba(16, 185, 129, 0.18)',
                              border: '1px solid #10b981',
                              color: '#10b981',
                              fontSize: '0.72rem',
                              padding: '2px 8px',
                              borderRadius: '20px',
                              fontWeight: 700
                            }}>
                              {pg.aiScore}% Match
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <MapPin size={13} color="var(--gold-primary)" /> {pg.address?.area}, {pg.address?.city}
                            </span>
                            <span style={{ color: 'var(--gold-primary)', fontWeight: 700 }}>
                              ₹{Number(pg.rent).toLocaleString('en-IN')}/mo
                            </span>
                          </div>

                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {pg.aiReasons?.map((r, i) => (
                              <span
                                key={i}
                                style={{
                                  fontSize: '0.72rem',
                                  background: 'rgba(212, 175, 55, 0.12)',
                                  color: 'var(--gold-light)',
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                <Check size={11} /> {r}
                              </span>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (onSelectPg) onSelectPg(pg);
                            onClose();
                          }}
                          className="btn btn-sm btn-gold"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          View Stay <ArrowRight size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Chat Tab */
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '380px' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' }}>
                {messages.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      background: m.sender === 'user'
                        ? 'linear-gradient(135deg, #0E74ED, #0A5AC0)'
                        : 'rgba(255, 255, 255, 0.06)',
                      border: m.sender === 'user' ? 'none' : '1px solid rgba(212, 175, 55, 0.25)',
                      padding: '12px 18px',
                      borderRadius: m.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      color: '#fff',
                      fontSize: '0.9rem',
                      lineHeight: 1.6
                    }}
                  >
                    {m.text}

                    {m.relevantPgs && m.relevantPgs.length > 0 && (
                      <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {m.relevantPgs.map(p => (
                          <div
                            key={p.id}
                            onClick={() => {
                              if (onSelectPg) onSelectPg(p);
                              onClose();
                            }}
                            style={{
                              background: 'rgba(0,0,0,0.3)',
                              border: '1px solid rgba(212, 175, 55, 0.3)',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              cursor: 'pointer'
                            }}
                          >
                            <span style={{ fontWeight: 600, color: 'var(--gold-light)', fontSize: '0.85rem' }}>
                              {p.name} (₹{p.rent}/mo)
                            </span>
                            <ArrowRight size={13} color="var(--gold-primary)" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {chatting && (
                  <div style={{
                    alignSelf: 'flex-start',
                    background: 'rgba(255, 255, 255, 0.06)',
                    padding: '10px 16px',
                    borderRadius: '16px',
                    color: 'var(--gold-light)',
                    fontSize: '0.82rem'
                  }}>
                    Vrundavan AI is formulating personalized recommendations...
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask anything about properties, rates, amenities or rules..."
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    fontSize: '0.9rem'
                  }}
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={chatting || !inputMessage.trim()}
                  className="btn btn-gold"
                  style={{
                    padding: '0 20px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
