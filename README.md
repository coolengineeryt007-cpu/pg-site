# 👑 AURELIA | Luxury Paying Guest (PG) Accommodation Platform

A high-performance, 100% On-Page SEO optimized, luxury-themed Paying Guest portal built with **React**, **Node.js / Express**, and the **Google Maps Platform** API.

---

## 🎨 Luxury Aesthetic & Design Tokens
* **Dark Obsidian Background**: `#080808`
* **Crimson Ruby Accents**: `#B91C1C`
* **Imperial Gold Badges & Borders**: `#D4AF37`
* **Metallic Gold Gradients**: `linear-gradient(135deg, #F3E5AB 0%, #D4AF37 50%, #996515 100%)`
* **Typography**: *Cinzel* (Luxury Serif Headings) + *Plus Jakarta Sans* (Modern Sans-Serif Body)
* **Glassmorphism**: Frosted glass cards (`backdrop-filter: blur(16px)`), gold pulse indicators, and micro-hover shimmers.

---

## 🗺️ Google Maps & Geolocation Engine
* **API Key Configured**: `AIzaSyCjgqTAfnBmYWo-UZ-XLw_BslEvmfwywWs`
* **Enabled APIs**: Maps JavaScript API, Places Autocomplete, Geocoding & Geometry.
* **Owner PG Add Wizard**:
  * **"Near Me" GPS Button**: Uses satellite GPS + Google Reverse Geocoding to automatically populate:
    * Apartment / House / Society Name
    * Address Line 1 & Line 2
    * Area / Neighborhood
    * City, District, State, Pincode
    * Latitude & Longitude
  * **Places Autocomplete Search Bar**: Type any landmark or locality with instant field breakdown.
  * **Interactive Draggable Pin**: Drag the pin directly to the entrance gate to refine coordinates.
* **Student / Tenant Frontend**:
  * **Proximity Radius & Near Me**: Calculates road distance in kilometers using the Haversine formula (e.g., `0.8 km away`) and sorts by closest proximity.
  * **Live Turn-by-Turn Directions**: Direct integration with Google Maps navigation links.

---

## 🛡️ Multi-Tier Architecture & Moderation Workflow
1. **Public Frontend (Students & Working Professionals)**:
   * Home, Explore (split map + cards), PG Detail with room matrix, About Us (Founders), Contact Us, Blog & Blog Details, Terms & Conditions, Privacy Policy.
   * Only **approved** listings are displayed.
2. **PG Owner Admin Panel (Unlimited Hosts)**:
   * Host registration & login.
   * Add / Edit / Delete PG listings with Google Maps autofill.
   * Submits listings as `pending_review` (or `draft`).
   * Inquiry manager for prospective tenant visit bookings.
3. **Super Admin Control Center (2–3 Privileged Admins)**:
   * KPI Dashboard: Total PGs, Live listings, Approval Queue, Host count.
   * Moderation Queue: Inspect submitted photos, rent, and coordinates. Click **"Approve & Publish"** or **"Reject with Note"**.
   * Only approved listings appear on the public frontend.

---

## ⚡ 100% On-Page SEO Standard
* **Semantic HTML5**: Strict `<h1>` hierarchy, `<article>`, `<section>`, `<nav>`, `<footer>`.
* **Dynamic Meta & Social Cards**: Dynamic titles and meta descriptions per route, OpenGraph (`og:title`, `og:image`), and Twitter cards.
* **Structured Data (JSON-LD)**: Schema.org markup for `LodgingBusiness`, `PostalAddress`, and `GeoCoordinates`.
* **Live XML Sitemap**: Generated at `/sitemap.xml` with all approved PG detail links, blog posts, and static pages.
* **Robots.txt**: Live at `/robots.txt` referencing `/sitemap.xml`.
* **Lightning-Fast Load**: Production bundle is under **104 kB gzipped**, built with pure Vanilla CSS tokens and zero render-blocking bloat.

---

## 🔑 Pre-Configured Test Accounts (1-Click Login Available in Modal)

| Role | Email | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `superadmin@luxurypg.com` | `Super@123` | Root Moderation, Approve/Reject PGs, Global Stats |
| **Super Admin 2** | `admin2@luxurypg.com` | `Super@123` | Quality Verification & Content Publishing |
| **PG Owner 1** | `rajesh@royalpg.com` | `Owner@123` | Add/Edit PGs, Manage Inquiries |
| **PG Owner 2** | `priya@elitepg.com` | `Owner@123` | Manage Bangalore/Mumbai Listings |
| **Tenant** | `aakash@gmail.com` | `User@123` | Student / Resident Profile |

---

## 🚀 Running the Project Locally

### 1. Backend Server (Node.js Express)
```bash
cd server
node server.js
```
Runs on: `http://localhost:5050`

### 2. Frontend Client (React + Vite)
```bash
cd client
npm run dev
```
Runs on: `http://localhost:3050` (proxies `/api` directly to port `5050`)
