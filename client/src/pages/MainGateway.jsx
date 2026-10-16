import React from 'react';

export default function MainGateway({ onSelectStudent, onSelectOwner }) {
  return (
    <div className="gw">

      {/* Left ribbon script text */}
      <div className="gw-ribbon">
        Your<br />Perfect Stay<br />Starts Here
      </div>


      {/* Main content grid */}
      <div className="gw-content">
        <div className="gw-grid">

          {/* ===== LEFT COLUMN ===== */}
          <div className="gw-left">

            {/* Logo */}
            <div className="gw-logo">
              <img src="/logo.png" alt="Vrundavan Ventures" />
            </div>

            {/* Platform badge */}
            <div className="gw-badge">
              <span className="gw-badge-pill">
                <span className="gw-badge-star">★</span> DIRECT OWNER RENTAL PLATFORM
              </span>
            </div>

            {/* Main headline */}
            <h1 className="gw-headline">
              <span className="gw-hl-white">FIND VERIFIED PGS, HOSTELS &amp;</span><br />
              <span className="gw-hl-cyan">RENTAL ROOMS</span>
            </h1>

            {/* Subtitle */}
            <div className="gw-subtitle">
              <span className="gw-sub-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>Safe</span>
              </span>
              <span className="gw-sub-pipe">|</span>
              <span className="gw-sub-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Verified</span>
              </span>
              <span className="gw-sub-pipe">|</span>
              <span className="gw-sub-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="#38BDF8" stroke="#38BDF8" strokeWidth="1" aria-hidden="true">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                <span>Hassle-Free</span>
              </span>
              <div className="gw-sub-accent-bar"></div>
            </div>

            {/* Feature capsules */}
            <div className="gw-features">

              {/* 1: Direct Owner Contact */}
              <div className="gw-capsule">
                <div className="gw-cap-icon gw-cap-blue">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden="true">
                    <circle cx="12" cy="7.5" r="4.2" />
                    <path d="M4 20C4 16 7.5 13.5 12 13.5C16.5 13.5 20 16 20 20C20 20.8 19.3 21.5 18.5 21.5H5.5C4.7 21.5 4 20.8 4 20Z" />
                  </svg>
                </div>
                <div className="gw-cap-sep gw-sep-blue"></div>
                <div className="gw-cap-txt">
                  <div className="gw-cap-title">Direct Owner Contact:</div>
                  <div className="gw-cap-desc">Connect directly with genuine property hosts with zero broker commission.</div>
                </div>
              </div>

              {/* 2: 100% Verified Listings */}
              <div className="gw-capsule">
                <div className="gw-cap-icon gw-cap-amber">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden="true">
                    <path d="M12 2L4 5V11C4 16.5 7.4 21.6 12 23C16.6 21.6 20 16.5 20 11V5L12 2ZM10.5 16.2L6.8 12.5L8.2 11.1L10.5 13.4L15.8 8.1L17.2 9.5L10.5 16.2Z" />
                  </svg>
                </div>
                <div className="gw-cap-sep gw-sep-amber"></div>
                <div className="gw-cap-txt">
                  <div className="gw-cap-title">100% Verified Listings:</div>
                  <div className="gw-cap-desc">Explore genuine room photos, transparent monthly rents, and verified amenities.</div>
                </div>
              </div>

              {/* 3: For Students & Professionals */}
              <div className="gw-capsule">
                <div className="gw-cap-icon gw-cap-teal">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden="true">
                    <path d="M12 3L1 8.5L12 14L21.5 9.25V16H23V8.5L12 3Z" />
                    <path d="M5.5 12.5V17C5.5 19.5 8.4 21.5 12 21.5C15.6 21.5 18.5 19.5 18.5 17V12.5L12 16L5.5 12.5Z" />
                  </svg>
                </div>
                <div className="gw-cap-sep gw-sep-teal"></div>
                <div className="gw-cap-txt">
                  <div className="gw-cap-title">For Students &amp; Professionals:</div>
                  <div className="gw-cap-desc">Find single rooms, shared PGs, and student hostels near top hubs.</div>
                </div>
              </div>

            </div>

            {/* Trust pills */}
            <div className="gw-pills">
              <div className="gw-pill gw-pill-blue">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="11" fill="#FFFFFF" />
                  <polyline points="7 12 10.5 15.5 17 8.5" stroke="#0052CC" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>100% Verified Properties</span>
              </div>
              <div className="gw-pill gw-pill-amber">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden="true">
                  <path d="M12 2L4 5V11C4 16.5 7.4 21.6 12 23C16.6 21.6 20 16.5 20 11V5L12 2ZM10.5 16.2L6.8 12.5L8.2 11.1L10.5 13.4L15.8 8.1L17.2 9.5L10.5 16.2Z" />
                </svg>
                <span>Direct Owner Contact</span>
              </div>
              <div className="gw-pill gw-pill-green">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden="true">
                  <circle cx="7" cy="7" r="2.8" />
                  <circle cx="17" cy="7" r="2.8" />
                  <path d="M7 11.5C4.8 11.5 3 13.3 3 15.5V18.5H11V15.5C11 13.3 9.2 11.5 7 11.5Z" />
                  <path d="M17 11.5C14.8 11.5 13 13.3 13 15.5V18.5H21V15.5C21 13.3 19.2 11.5 17 11.5Z" />
                  <path d="M9.5 15.5L12 17.5L14.5 15.5" stroke="#008560" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
                <span>Zero Brokerage</span>
              </div>
            </div>

          </div>

          {/* ===== RIGHT COLUMN ===== */}
          <div className="gw-right">

            {/* Card 1: Students & Renters */}
            <div
              className="gw-card gw-card-student"
              onClick={onSelectStudent}
              role="button"
              tabIndex={0}
              aria-label="For Students and Renters - Find PGs, Rooms and Houses"
              onKeyDown={(e) => { if (e.key === 'Enter') onSelectStudent(); }}
            >
              {/* Bottom Left Metallic Ribbon */}
              <svg className="gw-corner-ribbon gw-corner-bl" viewBox="0 0 60 60" fill="none" aria-hidden="true">
                <defs>
                  <linearGradient id="cyanRibbonBL" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0047cc" />
                    <stop offset="35%" stopColor="#0084ff" />
                    <stop offset="52%" stopColor="#5ef5ff" />
                    <stop offset="70%" stopColor="#0077e6" />
                    <stop offset="92%" stopColor="#002b80" />
                    <stop offset="100%" stopColor="#001440" />
                  </linearGradient>
                </defs>
                <polygon points="0,16 0,60 44,60" fill="url(#cyanRibbonBL)" />
              </svg>

              {/* Bottom Right Metallic Ribbon */}
              <svg className="gw-corner-ribbon gw-corner-br" viewBox="0 0 60 60" fill="none" aria-hidden="true">
                <defs>
                  <linearGradient id="cyanRibbonBR" x1="100%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#0047cc" />
                    <stop offset="35%" stopColor="#0084ff" />
                    <stop offset="52%" stopColor="#5ef5ff" />
                    <stop offset="70%" stopColor="#0077e6" />
                    <stop offset="92%" stopColor="#002b80" />
                    <stop offset="100%" stopColor="#001440" />
                  </linearGradient>
                </defs>
                <polygon points="60,16 60,60 16,60" fill="url(#cyanRibbonBR)" />
              </svg>

              {/* Icon badge squircle with filled users icon */}
              <div className="gw-card-badge gw-card-badge-cyan">
                <svg width="34" height="34" viewBox="0 0 28 28" fill="#FFFFFF" aria-hidden="true">
                  <circle cx="10" cy="8" r="4.2" />
                  <path d="M2.5 21.5C2.5 17.4 6 14.2 10 14.2C14 14.2 17.5 17.4 17.5 21.5C17.5 22.3 16.8 23 16 23H4C3.2 23 2.5 22.3 2.5 21.5Z" />
                  <circle cx="18.5" cy="8.5" r="3.2" />
                  <path d="M16.5 14.8C17.6 15.6 18.8 16.8 19.4 18.2C19.8 19.2 20 20.2 20 21.5C20 22.2 19.5 22.7 18.8 22.8H22C22.8 22.8 23.5 22.1 23.5 21.3C23.5 17.9 20.5 15.2 16.5 14.8Z" />
                </svg>
              </div>

              <div className="gw-card-title">FOR STUDENTS &amp; RENTERS</div>

              <div className="gw-card-action">
                <span>Find PGs,Rooms &amp; Houses</span>
                <svg className="gw-action-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00D2FF" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="4" y1="12" x2="19" y2="12"></line>
                  <polyline points="13 6 19 12 13 18"></polyline>
                </svg>
              </div>
            </div>

            {/* Card 2: Property Owners & Hosts */}
            <div
              className="gw-card gw-card-owner"
              onClick={onSelectOwner}
              role="button"
              tabIndex={0}
              aria-label="For Property Owners and Hosts - Enter Owner Portal"
              onKeyDown={(e) => { if (e.key === 'Enter') onSelectOwner(); }}
            >
              {/* Bottom Left Metallic Ribbon */}
              <svg className="gw-corner-ribbon gw-corner-bl" viewBox="0 0 60 60" fill="none" aria-hidden="true">
                <defs>
                  <linearGradient id="goldRibbonBL" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#966000" />
                    <stop offset="35%" stopColor="#f5af00" />
                    <stop offset="52%" stopColor="#fff385" />
                    <stop offset="70%" stopColor="#cf9100" />
                    <stop offset="92%" stopColor="#523200" />
                    <stop offset="100%" stopColor="#2e1b00" />
                  </linearGradient>
                </defs>
                <polygon points="0,16 0,60 44,60" fill="url(#goldRibbonBL)" />
              </svg>

              {/* Bottom Right Metallic Ribbon */}
              <svg className="gw-corner-ribbon gw-corner-br" viewBox="0 0 60 60" fill="none" aria-hidden="true">
                <defs>
                  <linearGradient id="goldRibbonBR" x1="100%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#966000" />
                    <stop offset="35%" stopColor="#f5af00" />
                    <stop offset="52%" stopColor="#fff385" />
                    <stop offset="70%" stopColor="#cf9100" />
                    <stop offset="92%" stopColor="#523200" />
                    <stop offset="100%" stopColor="#2e1b00" />
                  </linearGradient>
                </defs>
                <polygon points="60,16 60,60 16,60" fill="url(#goldRibbonBR)" />
              </svg>

              {/* Icon badge squircle with filled house icon */}
              <div className="gw-card-badge gw-card-badge-gold">
                <svg width="36" height="36" viewBox="0 0 28 28" fill="#FFFFFF" aria-hidden="true">
                  <path d="M14 3.2L2 13.5H5.8V23.8C5.8 24.5 6.4 25 7.1 25H11.5V17.8C11.5 16.8 12.3 16 13.3 16H14.7C15.7 16 16.5 16.8 16.5 17.8V25H20.9C21.6 25 22.2 24.5 22.2 23.8V13.5H26L14 3.2Z" />
                </svg>
              </div>

              <div className="gw-card-title">FOR PROPERTY OWNERS &amp; HOSTS</div>

              <div className="gw-card-action">
                <span>Enter Owner Portal / List Property</span>
                <svg className="gw-action-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFCC00" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="4" y1="12" x2="19" y2="12"></line>
                  <polyline points="13 6 19 12 13 18"></polyline>
                </svg>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Footer copyright centered in background graphic gap */}
      <footer className="gw-footer">
        <span className="gw-footer-copy">© 2026 Vrundavan Ventures. All rights reserved.</span>
      </footer>

      {/* ========== ALL STYLES ========== */}
      <style>{`
        /* ===== RESET ===== */
        .gw *, .gw *::before, .gw *::after { box-sizing: border-box; }

        /* ===== PAGE CONTAINER ===== */
        .gw {
          width: 100vw;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: url('/gateway-bg.jpg') no-repeat center bottom / cover;
          position: relative;
          overflow-x: hidden;
          font-family: 'Plus Jakarta Sans', 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* Desktop: lock to viewport height */
        @media (min-width: 992px) and (min-height: 540px) {
          .gw { height: 100vh; overflow: hidden; }
        }

        /* ===== LEFT RIBBON SCRIPT ===== */
        .gw-ribbon {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%) rotate(-13deg);
          z-index: 6;
          pointer-events: none;
          font-family: 'Dancing Script', cursive;
          font-size: 1.40rem;
          font-weight: 700;
          font-style: italic;
          color: #FDE68A;
          line-height: 1.18;
          text-align: center;
          text-shadow: 0 2px 10px rgba(0,0,0,0.95), 0 0 20px rgba(245,197,66,0.85);
          white-space: nowrap;
        }


        /* ===== MAIN CONTENT ===== */
        .gw-content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px 40px 10px 55px;
          max-width: 1360px;
          width: 100%;
          margin: 0 auto;
          position: relative;
          z-index: 5;
        }

        .gw-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
          width: 100%;
        }

        /* ===== LEFT COLUMN (+5% BIGGER & ONE-LINE PILLS) ===== */
        .gw-left {
          justify-self: end;
          text-align: left;
          margin-left: auto;
          margin-right: 0;
          padding-left: 0;
          padding-right: 12px;
          max-width: 505px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        /* Logo */
        .gw-logo { 
          margin-bottom: 7px; 
        }
        .gw-logo img {
          height: 100px;
          width: auto;
          max-width: 100%;
          object-fit: contain;
          display: block;
          filter: drop-shadow(0 4px 12px rgba(0,0,0,0.85));
        }

        /* Badge */
        .gw-badge { 
          margin-bottom: 6px; 
        }
        .gw-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(2, 18, 53, 0.85);
          border: 1.5px solid #FFC800;
          color: #FFFFFF;
          padding: 4px 13px;
          border-radius: 9999px;
          font-size: 0.67rem;
          font-weight: 800;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          box-shadow: 0 0 10px rgba(255, 200, 0, 0.40);
        }
        .gw-badge-star { 
          color: #FFC800; 
          font-size: 0.81rem; 
          line-height: 1;
        }

        /* Headline */
        .gw-headline {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(1.68rem, 2.0vw, 2.15rem);
          font-weight: 950;
          line-height: 1.1;
          letter-spacing: -0.2px;
          text-transform: uppercase;
          margin: 0 0 6px 0;
        }
        .gw-hl-white {
          color: #FFFFFF;
          text-shadow: 0 2px 10px rgba(0,0,0,0.95);
        }
        .gw-hl-cyan {
          background: linear-gradient(180deg, #70E1FF 0%, #38BDF8 50%, #0284C7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 2px 10px rgba(0, 180, 255, 0.55));
        }

        /* Subtitle */
        .gw-subtitle {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.76rem;
          font-weight: 600;
          margin-bottom: 13px;
          width: 100%;
        }
        .gw-sub-item {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #FFFFFF;
          text-shadow: 0 1px 3px rgba(0,0,0,0.8);
          font-size: 0.76rem;
          font-weight: 600;
        }
        .gw-sub-pipe {
          color: rgba(56, 189, 248, 0.5);
          font-weight: 300;
          font-size: 0.76rem;
        }
        .gw-sub-accent-bar {
          flex: 1;
          max-width: 132px;
          height: 3.2px;
          border-radius: 2px;
          margin-left: 4px;
          background: linear-gradient(90deg, #00D2FF 0%, #38BDF8 35%, #FFD700 70%, transparent 100%);
          box-shadow: 0 0 8px rgba(0, 210, 255, 0.8);
        }

        /* ===== FEATURE CAPSULES ===== */
        .gw-features {
          display: flex;
          flex-direction: column;
          gap: 9.5px;
          max-width: 505px;
          width: 100%;
          margin-bottom: 15px;
        }
        .gw-capsule {
          display: flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(90deg, rgba(2, 44, 128, 0.82) 0%, rgba(1, 24, 76, 0.85) 100%);
          border: 1.4px solid rgba(0, 180, 255, 0.45);
          border-radius: 30px;
          padding: 7px 15px 7px 9px;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 
            0 4px 14px rgba(0,0,0,0.45), 
            inset 0 1px 2px rgba(255,255,255,0.22);
          transition: transform 0.25s ease, border-color 0.25s ease;
        }
        .gw-capsule:hover {
          transform: translateX(3px);
          border-color: rgba(0, 210, 255, 0.75);
        }

        .gw-cap-icon {
          width: 44px;
          height: 44px;
          min-width: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .gw-cap-blue {
          background: linear-gradient(180deg, #0088ff 0%, #004ecc 100%);
          border: 2px solid #00F0FF;
          box-shadow: 0 0 12px rgba(0, 240, 255, 0.85), inset 0 1px 3px rgba(255, 255, 255, 0.6);
        }
        .gw-cap-amber {
          background: radial-gradient(circle at 50% 25%, #ffe46a 0%, #f5a623 55%, #c87400 100%);
          border: 2px solid #FFF59D;
          box-shadow: 0 0 14px rgba(255, 193, 7, 0.9), inset 0 1px 3px rgba(255, 255, 255, 0.7);
        }
        .gw-cap-teal {
          background: linear-gradient(180deg, #00d29d 0%, #008f6b 100%);
          border: 2px solid #67F2CB;
          box-shadow: 0 0 14px rgba(0, 210, 157, 0.85), inset 0 1px 3px rgba(255, 255, 255, 0.7);
        }

        .gw-cap-sep {
          width: 1.7px;
          height: 31px;
          border-radius: 1px;
          flex-shrink: 0;
        }
        .gw-sep-blue {
          background: #00D2FF;
          box-shadow: 0 0 6px rgba(0, 210, 255, 0.85);
        }
        .gw-sep-amber {
          background: #FFD700;
          box-shadow: 0 0 6px rgba(255, 215, 0, 0.85);
        }
        .gw-sep-teal {
          background: #00D29D;
          box-shadow: 0 0 6px rgba(0, 210, 157, 0.85);
        }

        .gw-cap-txt {
          display: flex;
          flex-direction: column;
          gap: 1.5px;
          line-height: 1.3;
        }
        .gw-cap-title {
          font-family: 'Outfit', sans-serif;
          font-size: 0.83rem;
          font-weight: 850;
          color: #FFD700;
          letter-spacing: 0.15px;
        }
        .gw-cap-desc {
          font-size: 0.67rem;
          color: #FFFFFF;
          font-weight: 450;
          line-height: 1.3;
        }

        /* ===== TRUST PILLS (ALL 3 IN ONE SINGLE LINE) ===== */
        .gw-pills {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: nowrap;
          width: 100%;
        }
        .gw-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5.5px 11px;
          border-radius: 9999px;
          font-size: 0.66rem;
          font-weight: 750;
          color: #FFFFFF;
          white-space: nowrap;
          flex-shrink: 0;
          box-shadow: 0 3px 10px rgba(0,0,0,0.40);
          transition: transform 0.2s ease;
        }
        .gw-pill:hover {
          transform: translateY(-2px);
        }
        .gw-pill-blue {
          background: linear-gradient(180deg, #0077ff 0%, #004ecc 100%);
          border: 1.5px solid #00F0FF;
          box-shadow: 0 0 12px rgba(0, 240, 255, 0.75), 0 3px 8px rgba(0,0,0,0.4);
        }
        .gw-pill-amber {
          background: linear-gradient(180deg, #f5a623 0%, #cf8500 100%);
          border: 1.5px solid #FFE480;
          box-shadow: 0 0 12px rgba(245, 170, 30, 0.75), 0 3px 8px rgba(0,0,0,0.4);
        }
        .gw-pill-green {
          background: linear-gradient(180deg, #00c896 0%, #008560 100%);
          border: 1.5px solid #6DF0C8;
          box-shadow: 0 0 12px rgba(0, 200, 150, 0.75), 0 3px 8px rgba(0,0,0,0.4);
        }

        /* ===== RIGHT COLUMN: DECISION CARDS ===== */
        .gw-right {
          justify-self: start;
          margin-left: 0;
          margin-right: auto;
          padding-left: 12px;
          display: flex;
          flex-direction: column;
          gap: 22px;
          max-width: 440px;
          width: 100%;
          position: relative;
        }
        .gw-card {
          position: relative;
          border-radius: 26px;
          padding: 24px 26px 22px;
          min-height: 162px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          cursor: pointer;
          overflow: hidden;
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s cubic-bezier(0.16,1,0.3,1);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }
        /* Diagonal glassy gloss sheen across card surface */
        .gw-card::before {
          content: '';
          position: absolute;
          top: -30%;
          left: -15%;
          width: 130%;
          height: 160%;
          background: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0.22) 0%,
            rgba(255, 255, 255, 0.08) 24%,
            rgba(255, 255, 255, 0.01) 40%,
            transparent 55%
          );
          pointer-events: none;
          z-index: 1;
        }
        .gw-card-student {
          background: linear-gradient(135deg, #0050d8 0%, #003099 50%, #001e66 100%);
          border: 2.8px solid #00D2FF;
          box-shadow:
            0 0 25px rgba(0, 210, 255, 0.75),
            0 0 50px rgba(0, 140, 255, 0.35),
            0 14px 28px rgba(0, 0, 0, 0.6),
            inset 0 0 14px rgba(0, 210, 255, 0.3);
        }
        .gw-card-owner {
          background: linear-gradient(135deg, #072a74 0%, #04194a 50%, #020e2e 100%);
          border: 2.8px solid #FFCC00;
          box-shadow:
            0 0 25px rgba(255, 204, 0, 0.75),
            0 0 50px rgba(255, 160, 0, 0.35),
            0 14px 28px rgba(0, 0, 0, 0.6),
            inset 0 0 14px rgba(255, 204, 0, 0.25);
        }
        .gw-card:hover { 
          transform: translateY(-4px) scale(1.02); 
        }
        .gw-card-student:hover {
          box-shadow:
            0 0 38px rgba(0, 220, 255, 0.95),
            0 0 70px rgba(0, 160, 255, 0.5),
            0 18px 36px rgba(0, 0, 0, 0.7),
            inset 0 0 20px rgba(0, 230, 255, 0.45) !important;
        }
        .gw-card-owner:hover {
          box-shadow:
            0 0 38px rgba(255, 215, 0, 0.95),
            0 0 70px rgba(255, 175, 0, 0.5),
            0 18px 36px rgba(0, 0, 0, 0.7),
            inset 0 0 20px rgba(255, 220, 50, 0.4) !important;
        }

        /* 3D Metallic Corner Ribbons */
        .gw-corner-ribbon {
          position: absolute;
          bottom: 0;
          width: 58px;
          height: 58px;
          pointer-events: none;
          z-index: 3;
        }
        .gw-corner-bl { left: 0; }
        .gw-corner-br { right: 0; }

        /* Icon Badge Squircles */
        .gw-card-badge {
          width: 60px;
          height: 60px;
          border-radius: 19px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
          margin-bottom: 10px;
          flex-shrink: 0;
        }
        .gw-card-badge-cyan {
          background: linear-gradient(180deg, #0267eb 0%, #0045b3 100%);
          border: 2px solid #00F0FF;
          box-shadow: 
            0 0 18px rgba(0, 240, 255, 0.85),
            inset 0 1px 3px rgba(255, 255, 255, 0.7);
        }
        .gw-card-badge-gold {
          background: radial-gradient(circle at 50% 25%, #ffe46a 0%, #f5a623 55%, #c87400 100%);
          border: 2px solid #FFF59D;
          box-shadow: 
            0 0 20px rgba(255, 193, 7, 0.95),
            inset 0 2px 4px rgba(255, 255, 255, 0.85);
        }

        .gw-card-title {
          font-family: 'Outfit', 'Inter', -apple-system, sans-serif;
          font-size: 1.25rem;
          font-weight: 900;
          color: #FFFFFF;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          white-space: nowrap;
          margin-bottom: 6px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.85);
          position: relative;
          z-index: 2;
        }

        .gw-card-action {
          font-family: 'Outfit', 'Inter', -apple-system, sans-serif;
          font-size: 0.96rem;
          font-weight: 500;
          color: #FFFFFF;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          white-space: nowrap;
          text-shadow: 0 1px 6px rgba(0, 0, 0, 0.7);
          position: relative;
          z-index: 2;
        }
        .gw-action-arrow {
          display: inline-block;
          vertical-align: middle;
          transition: transform 0.25s ease;
        }
        .gw-card:hover .gw-action-arrow {
          transform: translateX(4px);
        }

        /* ===== FOOTER ===== */
        .gw-footer {
          position: absolute;
          bottom: clamp(32px, 3.65vh, 32px);
          left: 50%;
          transform: translate(-50%, 50%);
          z-index: 10;
          text-align: center;
          margin: 0;
          padding: 0;
          width: auto;
          white-space: nowrap;
          pointer-events: none;
        }
        .gw-footer-copy {
          font-weight: 500;
          color: rgba(226, 232, 240, 0.92);
          font-size: calc(0.76rem + 3px);
          line-height: 1.2;
          letter-spacing: 0.4px;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.95);
          white-space: nowrap;
          display: inline-block;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 991px) {
          .gw { height: auto; min-height: 100vh; overflow-y: auto; padding: 20px 0 14px; }
          .gw-ribbon { display: none; }
          .gw-content { padding: 0 18px; }
          .gw-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
          .gw-left {
            justify-self: center !important;
            margin: 0 auto !important;
            padding-right: 0 !important;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .gw-logo img { margin: 0 auto; }
          .gw-subtitle { justify-content: center; }
          .gw-features { max-width: 100%; }
          .gw-pills { justify-content: center; }
          .gw-right {
            justify-self: center !important;
            margin: 0 auto !important;
            padding-left: 0 !important;
            max-width: 440px !important;
            width: 100% !important;
          }
          .gw-footer {
            position: static;
            transform: none;
            margin-top: 24px;
            padding: 10px 18px 16px;
            width: 100%;
            pointer-events: auto;
          }
        }

        @media (max-width: 480px) {
          .gw-logo img { height: 52px; }
          .gw-headline { font-size: 1.65rem; }
          .gw-subtitle { flex-wrap: wrap; justify-content: center; gap: 8px; }
          .gw-sub-accent-bar { display: none; }
          .gw-capsule { padding: 6px 12px 6px 8px; border-radius: 28px; gap: 10px; }
          .gw-cap-icon { width: 44px; height: 44px; min-width: 44px; }
          .gw-cap-icon svg { width: 22px; height: 22px; }
          .gw-cap-sep { height: 30px; }
          .gw-cap-title { font-size: 0.88rem; }
          .gw-cap-desc { font-size: 0.74rem; }
          .gw-pills { gap: 8px; justify-content: center; }
          .gw-pill { padding: 6px 14px; font-size: 0.76rem; }
          .gw-card { padding: 18px 16px 16px; min-height: 145px; border-radius: 20px; }
          .gw-card-badge { width: 52px; height: 52px; border-radius: 16px; margin-bottom: 8px; }
          .gw-card-badge svg { width: 28px; height: 28px; }
          .gw-card-title { font-size: 1.05rem; }
          .gw-card-action { font-size: 0.88rem; }
          .gw-corner-ribbon { width: 44px; height: 44px; }
        }
      `}</style>

    </div>
  );
}
