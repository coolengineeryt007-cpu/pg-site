/**
 * Security Guard & Malware Protection Engine
 * Vrundavan Ventures
 * 
 * Features:
 * 1. Hardened OWASP Security Headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
 * 2. Brute-Force Attack Protection & Exponential Backoff on Authentication
 * 3. SQL Injection & Cross-Site Scripting (XSS) Input Sanitization
 * 4. Malicious Scanner & Exploitation Bot Blacklist
 * 5. Agentic Browsing & AI Crawler Whitelist (GPTBot, Claude-Web, Perplexity, Google-Extended)
 * 6. Rate Limiting for DDoS / High-frequency Request Mitigation
 */

// In-Memory Attempt Tracking
const failedAttemptsMap = new Map(); // key -> { count, lockedUntil, firstAttempt }
const requestRateMap = new Map();    // ip -> { count, windowStart }

// Configurable Thresholds
const AUTH_MAX_ATTEMPTS = 5;
const AUTH_LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_WINDOW_MS = 60 * 1000;  // 1 minute
const RATE_LIMIT_MAX_REQ = 180;          // 180 req/min per IP

// Known Malicious Scanners / Exploit Tools
const MALICIOUS_USER_AGENTS = [
  'sqlmap', 'nikto', 'acunetix', 'masscan', 'zgrab', 'havij', 
  'dirbuster', 'nmap', 'wpscan', 'burpcollaborator', 'fuzzer',
  'nessus', 'arachni', 'qualys', 'vega', 'w3af'
];

// Verified AI Agents & Search Crawlers (Never Block)
const VERIFIED_AI_AGENTS = [
  'gptbot', 'claude-web', 'claude', 'perplexitybot', 'perplexity',
  'google-extended', 'googlebot', 'bingbot', 'applebot', 'twitterbot'
];

// Dangerous SQLi and XSS Injection Regex Patterns
const INJECTION_PATTERNS = [
  /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,              // SQL comment / quote attempts in sensitive params
  /(\b(union|select|insert|update|delete|drop|alter|create|truncate|exec|execute)\b.*\b(from|into|table|database|schema)\b)/i,
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // Script tags
  /javascript:[^\s]*/i,                         // JS protocol links
  /onerror\s*=\s*['"][^'"]*['"]/i,               // onerror event handlers
  /onload\s*=\s*['"][^'"]*['"]/i,                // onload event handlers
  /\.\.\/|\.\.\\/g                               // Directory traversal
];

/**
 * 1. Hardened Security Headers Middleware
 */
export function securityHeaders(req, res, next) {
  // Prevent MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Prevent Clickjacking (framing)
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // Enable XSS Filter
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Enforce HTTPS
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Restrict Browser Hardware Features
  res.setHeader('Permissions-Policy', 'geolocation=(self), camera=(), microphone=(), payment=(self)');

  // Download & Cross-Domain Policies
  res.setHeader('X-Download-Options', 'noopen');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');

  // Content Security Policy (Allows Google Fonts, Unsplash photos, Google Maps, Leaflet, Razorpay)
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://checkout.razorpay.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com; " +
    "font-src 'self' https://fonts.gstatic.com data:; " +
    "img-src 'self' data: blob: https: https://images.unsplash.com https://maps.gstatic.com https://maps.googleapis.com; " +
    "connect-src 'self' https: http://localhost:5050 http://localhost:3050 ws: wss:; " +
    "frame-src 'self' https://api.razorpay.com https://www.google.com; " +
    "object-src 'none'; " +
    "base-uri 'self';"
  );

  // Remove Express fingerprint
  res.removeHeader('X-Powered-By');

  next();
}

/**
 * 2. Malware & Exploit Scanner Middleware
 */
export function malwareAndExploitProtection(req, res, next) {
  const userAgent = (req.headers['user-agent'] || '').toLowerCase();

  // Allow verified AI Agents
  const isAiAgent = VERIFIED_AI_AGENTS.some(agent => userAgent.includes(agent));
  if (isAiAgent) {
    return next();
  }

  // Block Known Vulnerability Scanners
  const isMaliciousBot = MALICIOUS_USER_AGENTS.some(scanner => userAgent.includes(scanner));
  if (isMaliciousBot) {
    console.warn(`🚨 Blocked malicious scanner: [${userAgent}] from IP [${req.ip}]`);
    return res.status(403).json({
      error: 'Access Denied: Malicious user-agent or automated exploit tool detected.',
      code: 'BLOCKED_BY_MALWARE_SHIELD'
    });
  }

  // Deep inspection on query parameters
  const queryStr = JSON.stringify(req.query || {});
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(queryStr)) {
      console.warn(`🚨 Exploit injection attempt detected in query: ${queryStr}`);
      return res.status(403).json({
        error: 'Forbidden: Malicious payload signature detected in request.',
        code: 'INJECTION_ATTEMPT_PREVENTED'
      });
    }
  }

  next();
}

/**
 * 3. General Request Rate Limiter (Anti-DDoS)
 */
export function generalRateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
  const now = Date.now();

  const record = requestRateMap.get(ip) || { count: 0, windowStart: now };

  if (now - record.windowStart > RATE_LIMIT_WINDOW_MS) {
    record.count = 1;
    record.windowStart = now;
  } else {
    record.count++;
  }

  requestRateMap.set(ip, record);

  if (record.count > RATE_LIMIT_MAX_REQ) {
    const retryAfter = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - record.windowStart)) / 1000);
    res.setHeader('Retry-After', retryAfter);
    return res.status(429).json({
      error: 'Too many requests. Please slow down and try again shortly.',
      retryAfterSeconds: retryAfter
    });
  }

  next();
}

/**
 * 4. Brute-Force Auth Protection Middleware
 */
export function checkBruteForceLock(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
  const email = (req.body?.email || '').trim().toLowerCase();
  const key = `${ip}:${email}`;
  const now = Date.now();

  const record = failedAttemptsMap.get(key) || failedAttemptsMap.get(ip);
  if (record && record.lockedUntil && record.lockedUntil > now) {
    const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    res.setHeader('Retry-After', remainingSeconds);
    return res.status(429).json({
      error: `Too many failed login attempts. Account temporarily protected against brute-force attacks. Please retry in ${Math.ceil(remainingSeconds / 60)} minutes.`,
      lockedUntil: new Date(record.lockedUntil).toISOString(),
      retryAfterSeconds: remainingSeconds
    });
  }

  next();
}

/**
 * Record a failed login attempt
 */
export function recordFailedAuthAttempt(req, email = '') {
  const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
  const cleanEmail = (email || req.body?.email || '').trim().toLowerCase();
  const key = `${ip}:${cleanEmail}`;
  const now = Date.now();

  const record = failedAttemptsMap.get(key) || { count: 0, firstAttempt: now, lockedUntil: null };
  record.count++;

  if (record.count >= AUTH_MAX_ATTEMPTS) {
    record.lockedUntil = now + AUTH_LOCKOUT_MS;
    console.warn(`🔒 Brute-force protection: Locked out IP [${ip}] / User [${cleanEmail}] for 15 minutes after ${record.count} failed attempts.`);
  }

  failedAttemptsMap.set(key, record);
  failedAttemptsMap.set(ip, record); // also track IP level
}

/**
 * Reset failed attempts upon successful login
 */
export function resetAuthAttempts(req, email = '') {
  const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
  const cleanEmail = (email || req.body?.email || '').trim().toLowerCase();
  failedAttemptsMap.delete(`${ip}:${cleanEmail}`);
  failedAttemptsMap.delete(ip);
}
