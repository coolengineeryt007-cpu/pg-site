import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  CreditCard, 
  Smartphone, 
  Building2, 
  ArrowRight, 
  Lock, 
  Sparkles, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';

export default function OwnerSubscriptionModal({
  isOpen,
  onClose,
  currentUser,
  onSuccess
}) {
  const [selectedMethod, setSelectedMethod] = useState('upi_autopay'); // 'upi_autopay', 'card_mandate', 'netbanking'
  const [upiApp, setUpiApp] = useState('gpay'); // 'gpay', 'phonepe', 'paytm', 'bhim', 'custom'
  const [upiId, setUpiId] = useState(currentUser?.email ? `${currentUser.email.split('@')[0]}@okaxis` : 'owner@okhdfcbank');
  
  // Card states
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('•••');

  const [processing, setProcessing] = useState(false);
  const [processStep, setProcessStep] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAuthorizePayment = async (e) => {
    if (e) e.preventDefault();
    if (!currentUser) {
      setError('Please sign in as a host to activate your subscription');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // Realistic NPCI / Bank Mandate Authorization simulation steps
      setProcessStep('Verifying bank VPA & e-Mandate parameters...');
      await new Promise(r => setTimeout(r, 650));

      setProcessStep('Connecting to NPCI UPI Autopay Gateway...');
      await new Promise(r => setTimeout(r, 700));

      setProcessStep('Authorizing ₹99 Initial Activation Payment...');
      await new Promise(r => setTimeout(r, 650));

      setProcessStep('Registering ₹99/30-day recurring mandate...');
      
      const paymentMethodLabel = selectedMethod === 'upi_autopay' 
        ? `UPI Autopay (${upiApp.toUpperCase()})` 
        : selectedMethod === 'card_mandate' 
          ? 'Card e-Mandate (Visa/Mastercard)' 
          : 'Net Banking e-Mandate';

      const res = await api.activateSubscription({
        userId: currentUser.id,
        paymentMethod: paymentMethodLabel,
        upiId: selectedMethod === 'upi_autopay' ? upiId : 'card-mandate@bank',
        amount: 99,
        recurringAmount: 99
      });

      setProcessStep('Mandate Authorized & Active!');
      await new Promise(r => setTimeout(r, 400));

      if (onSuccess) {
        onSuccess(res.subscription);
      }
      onClose();
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment mandate authorization failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 999999,
      background: 'rgba(2, 6, 23, 0.94)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      overflowY: 'auto'
    }}>
      <div style={{
        background: 'linear-gradient(145deg, #0f172a 0%, #090d16 100%)',
        border: '1px solid rgba(234, 179, 8, 0.3)',
        borderRadius: '24px',
        maxWidth: '560px',
        width: '100%',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 50px rgba(234, 179, 8, 0.15)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Top Gold Gradient Bar */}
        <div style={{
          height: '4px',
          background: 'linear-gradient(90deg, #eab308, #f59e0b, #ca8a04, #eab308)'
        }} />

        {/* Modal Header */}
        <div style={{
          padding: '24px 28px 16px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '999px',
              background: 'rgba(234, 179, 8, 0.12)',
              border: '1px solid rgba(234, 179, 8, 0.25)',
              color: '#facc15',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '8px'
            }}>
              <Sparkles size={12} />
              Host Partner Activation
            </div>
            <h2 style={{
              fontSize: '22px',
              fontWeight: 800,
              color: '#ffffff',
              margin: '0 0 4px',
              letterSpacing: '-0.02em',
              fontFamily: '"Plus Jakarta Sans", sans-serif'
            }}>
              Owner Subscription & Autopay Setup
            </h2>
            <p style={{
              fontSize: '13px',
              color: '#94a3b8',
              margin: 0,
              lineHeight: 1.4
            }}>
              Activate your verified listing dashboard with direct tenant leads & priority ranking.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '8px',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Plan Pricing Summary Card */}
        <div style={{ padding: '20px 28px 0' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.08) 0%, rgba(15, 23, 42, 0.6) 100%)',
            border: '1px solid rgba(234, 179, 8, 0.3)',
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '32px', fontWeight: 900, color: '#facc15', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                  ₹99
                </span>
                <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600 }}>
                  Initial 30-Day Activation
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#38bdf8', fontWeight: 700 }}>
                <RefreshCw size={13} style={{ animation: 'spin 8s linear infinite' }} />
                Next recurring autopay: ₹99 every 30 days
              </div>
            </div>

            <div style={{
              textAlign: 'right',
              background: 'rgba(234, 179, 8, 0.15)',
              padding: '8px 12px',
              borderRadius: '12px',
              border: '1px solid rgba(234, 179, 8, 0.3)'
            }}>
              <div style={{ fontSize: '11px', color: '#fde047', fontWeight: 800, textTransform: 'uppercase' }}>
                Cancel Anytime
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                1-Click in Dashboard
              </div>
            </div>
          </div>
        </div>

        {/* Benefits List */}
        <div style={{ padding: '16px 28px 0' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            fontSize: '12px',
            color: '#cbd5e1'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={14} color="#facc15" />
              <span>Unlimited Room & PG Listings</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={14} color="#facc15" />
              <span>Direct Bookings & 100% Rent Retained</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={14} color="#facc15" />
              <span>Direct WhatsApp & Call Inquiries</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={14} color="#facc15" />
              <span>Verified Host Trust Badge</span>
            </div>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div style={{ padding: '20px 28px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
            Choose Autopay Mandate Method
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
            <button
              type="button"
              onClick={() => setSelectedMethod('upi_autopay')}
              style={{
                background: selectedMethod === 'upi_autopay' ? 'rgba(234, 179, 8, 0.16)' : 'rgba(255, 255, 255, 0.03)',
                border: selectedMethod === 'upi_autopay' ? '1px solid #facc15' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '12px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                color: selectedMethod === 'upi_autopay' ? '#ffffff' : '#94a3b8'
              }}
            >
              <Smartphone size={20} color={selectedMethod === 'upi_autopay' ? '#facc15' : '#94a3b8'} />
              <span style={{ fontSize: '12px', fontWeight: 700 }}>UPI Autopay</span>
              <span style={{ fontSize: '10px', color: '#facc15', fontWeight: 800 }}>RECOMMENDED</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('card_mandate')}
              style={{
                background: selectedMethod === 'card_mandate' ? 'rgba(234, 179, 8, 0.16)' : 'rgba(255, 255, 255, 0.03)',
                border: selectedMethod === 'card_mandate' ? '1px solid #facc15' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '12px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                color: selectedMethod === 'card_mandate' ? '#ffffff' : '#94a3b8'
              }}
            >
              <CreditCard size={20} color={selectedMethod === 'card_mandate' ? '#facc15' : '#94a3b8'} />
              <span style={{ fontSize: '12px', fontWeight: 700 }}>Debit / Card</span>
              <span style={{ fontSize: '10px', color: '#64748b' }}>e-Mandate</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('netbanking')}
              style={{
                background: selectedMethod === 'netbanking' ? 'rgba(234, 179, 8, 0.16)' : 'rgba(255, 255, 255, 0.03)',
                border: selectedMethod === 'netbanking' ? '1px solid #facc15' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '12px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                color: selectedMethod === 'netbanking' ? '#ffffff' : '#94a3b8'
              }}
            >
              <Building2 size={20} color={selectedMethod === 'netbanking' ? '#facc15' : '#94a3b8'} />
              <span style={{ fontSize: '12px', fontWeight: 700 }}>Net Banking</span>
              <span style={{ fontSize: '10px', color: '#64748b' }}>NPCI Mandate</span>
            </button>
          </div>

          {/* Interactive Method Details */}
          {selectedMethod === 'upi_autopay' && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '14px 16px'
            }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, marginBottom: '8px' }}>
                Select Preferred UPI App or enter VPA:
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                {['gpay', 'phonepe', 'paytm', 'bhim'].map((app) => (
                  <button
                    key={app}
                    type="button"
                    onClick={() => {
                      setUpiApp(app);
                      setUpiId(`${currentUser?.name?.toLowerCase().replace(/\s+/g, '') || 'host'}@ok${app === 'phonepe' ? 'ybl' : app === 'paytm' ? 'paytm' : 'axis'}`);
                    }}
                    style={{
                      background: upiApp === app ? '#facc15' : 'rgba(255, 255, 255, 0.06)',
                      color: upiApp === app ? '#0f172a' : '#cbd5e1',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      textTransform: 'uppercase'
                    }}
                  >
                    {app}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@upi or mobile@upi"
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(234, 179, 8, 0.3)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '13px',
                  color: '#ffffff',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'monospace'
                }}
              />
            </div>
          )}

          {selectedMethod === 'card_mandate' && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '14px 16px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px' }}>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="Card Number"
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    color: '#ffffff',
                    fontFamily: 'monospace'
                  }}
                />
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  placeholder="MM/YY"
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    color: '#ffffff',
                    textAlign: 'center'
                  }}
                />
                <input
                  type="password"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  placeholder="CVV"
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    color: '#ffffff',
                    textAlign: 'center'
                  }}
                />
              </div>
            </div>
          )}

          {selectedMethod === 'netbanking' && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '14px 16px',
              fontSize: '12px',
              color: '#94a3b8'
            }}>
              Major banks supported for e-Mandate: HDFC Bank, ICICI Bank, State Bank of India (SBI), Axis Bank, Kotak Mahindra Bank.
            </div>
          )}

          {error && (
            <div style={{
              marginTop: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          {/* Action Button */}
          <div style={{ marginTop: '20px' }}>
            <button
              type="button"
              onClick={handleAuthorizePayment}
              disabled={processing}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '14px',
                background: processing 
                  ? 'rgba(234, 179, 8, 0.4)' 
                  : 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
                color: '#0f172a',
                border: 'none',
                fontSize: '15px',
                fontWeight: 800,
                cursor: processing ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 10px 25px -5px rgba(234, 179, 8, 0.4)',
                transition: 'all 0.2s',
                fontFamily: '"Plus Jakarta Sans", sans-serif'
              }}
            >
              {processing ? (
                <>
                  <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>{processStep || 'Processing Authorization...'}</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Authorize ₹99 & Activate Autopay (₹99/30-days)</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>

          <div style={{
            marginTop: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            fontSize: '11px',
            color: '#64748b'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Lock size={12} /> 256-bit Bank Grade Encrypted
            </span>
            <span>•</span>
            <span>NPCI / RBI Compliant e-Mandate</span>
          </div>
        </div>
      </div>
    </div>
  );
}
