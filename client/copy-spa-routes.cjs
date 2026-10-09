const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, 'dist');
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('index.html not found in dist. Run vite build first.');
  process.exit(1);
}

// 1. Create 404.html for Vercel / static host fallback
fs.copyFileSync(indexPath, path.join(distDir, '404.html'));
console.log('Created dist/404.html');

// 2. Pre-generate physical folders with index.html for zero-redirect clean URLs
const routes = [
  'student',
  'owner',
  'explore',
  'nearme',
  'about',
  'contact',
  'blogs',
  'terms',
  'privacy',
  'superadmin',
  'admin-secret',
  'owner-portal',
  'student-home'
];

routes.forEach(route => {
  const targetDir = path.join(distDir, route);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  fs.copyFileSync(indexPath, path.join(targetDir, 'index.html'));
});

console.log(`Pre-generated static SPA routes for: ${routes.join(', ')}`);
