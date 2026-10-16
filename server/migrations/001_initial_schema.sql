-- ========================================================
-- VRUNDAVAN VENTURES - DATABASE MIGRATION 001
-- Master Normalized Schema with UPI AutoPay Subscriptions
-- ========================================================

-- 1. Subscription Plans Table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id VARCHAR(100) PRIMARY KEY,
  plan_code VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  amount_paise INT NOT NULL DEFAULT 9900,
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  billing_interval VARCHAR(50) NOT NULL DEFAULT 'monthly',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed default ₹99 plan if not present
INSERT INTO subscription_plans (id, plan_code, name, amount_paise, currency, billing_interval, is_active)
SELECT 'plan_vv_owner_99', 'owner_autopay_99', 'Vrundavan Ventures Owner Listing Subscription', 9900, 'INR', 'monthly', 1
WHERE NOT EXISTS (SELECT 1 FROM subscription_plans WHERE plan_code = 'owner_autopay_99');

-- 2. Users Table (Ensuring all required columns exist)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(100) PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  password VARCHAR(255),
  mobile VARCHAR(50) DEFAULT '',
  phone VARCHAR(50) DEFAULT '',
  role VARCHAR(50) NOT NULL DEFAULT 'tenant',
  email_verified_at TIMESTAMP NULL DEFAULT NULL,
  mobile_verified_at TIMESTAMP NULL DEFAULT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  subscription JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  createdAt VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Owner Profiles Table
CREATE TABLE IF NOT EXISTS owner_profiles (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL UNIQUE,
  owner_name VARCHAR(255) NOT NULL,
  business_name VARCHAR(255) DEFAULT '',
  city VARCHAR(100) DEFAULT '',
  state VARCHAR(100) DEFAULT '',
  contact_preferences JSON,
  profile_status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Properties Table
CREATE TABLE IF NOT EXISTS properties (
  id VARCHAR(100) PRIMARY KEY,
  owner_user_id VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  property_type VARCHAR(50) NOT NULL DEFAULT 'pg',
  description LONGTEXT,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  locality VARCHAR(100) DEFAULT '',
  address JSON,
  monthly_rent DECIMAL(10, 2) NOT NULL,
  security_deposit DECIMAL(10, 2) DEFAULT 0,
  maintenance_charges DECIMAL(10, 2) DEFAULT 0,
  furnishing VARCHAR(50) DEFAULT 'Furnished',
  amenities_json JSON,
  rooms_json JSON,
  rules_json JSON,
  bhk VARCHAR(50) DEFAULT '',
  gender VARCHAR(50) DEFAULT 'All',
  suitable_for VARCHAR(100) DEFAULT 'All',
  availability_status VARCHAR(50) DEFAULT 'available',
  publication_status VARCHAR(50) DEFAULT 'published',
  featured TINYINT(1) DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 5.0,
  reviews_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_owner (owner_user_id),
  INDEX idx_city (city),
  INDEX idx_property_type (property_type),
  INDEX idx_publication_status (publication_status),
  FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Property Images Table
CREATE TABLE IF NOT EXISTS property_images (
  id VARCHAR(100) PRIMARY KEY,
  property_id VARCHAR(100) NOT NULL,
  image_path TEXT NOT NULL,
  alt_text VARCHAR(255) DEFAULT '',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_property (property_id),
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
  id VARCHAR(100) PRIMARY KEY,
  owner_user_id VARCHAR(100) NOT NULL,
  plan_code VARCHAR(100) NOT NULL,
  amount_paise INT NOT NULL DEFAULT 9900,
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  billing_interval VARCHAR(50) NOT NULL DEFAULT 'monthly',
  provider VARCHAR(50) NOT NULL DEFAULT 'razorpay',
  provider_customer_id VARCHAR(255) DEFAULT NULL,
  provider_subscription_id VARCHAR(255) DEFAULT NULL UNIQUE,
  provider_mandate_reference VARCHAR(255) DEFAULT NULL,
  internal_status VARCHAR(50) NOT NULL DEFAULT 'PENDING_AUTHORIZATION',
  provider_status VARCHAR(50) DEFAULT 'created',
  started_at TIMESTAMP NULL DEFAULT NULL,
  current_period_start TIMESTAMP NULL DEFAULT NULL,
  current_period_end TIMESTAMP NULL DEFAULT NULL,
  next_billing_at TIMESTAMP NULL DEFAULT NULL,
  cancellation_requested_at TIMESTAMP NULL DEFAULT NULL,
  cancelled_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_owner_sub (owner_user_id),
  INDEX idx_internal_status (internal_status),
  INDEX idx_provider_sub (provider_subscription_id),
  FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_code) REFERENCES subscription_plans(plan_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(100) PRIMARY KEY,
  subscription_id VARCHAR(100) DEFAULT NULL,
  owner_user_id VARCHAR(100) NOT NULL,
  provider VARCHAR(50) NOT NULL DEFAULT 'razorpay',
  provider_payment_id VARCHAR(255) DEFAULT NULL UNIQUE,
  provider_order_id VARCHAR(255) DEFAULT NULL,
  amount_paise INT NOT NULL DEFAULT 9900,
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  payment_method VARCHAR(50) NOT NULL DEFAULT 'upi_autopay',
  payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
  billing_period_start TIMESTAMP NULL DEFAULT NULL,
  billing_period_end TIMESTAMP NULL DEFAULT NULL,
  failure_code VARCHAR(100) DEFAULT NULL,
  failure_reason TEXT DEFAULT NULL,
  paid_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_sub (subscription_id),
  INDEX idx_owner_payment (owner_user_id),
  INDEX idx_provider_payment (provider_payment_id),
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL,
  FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Payment Webhook Events Table (Idempotent tracking)
CREATE TABLE IF NOT EXISTS payment_webhook_events (
  id VARCHAR(100) PRIMARY KEY,
  provider VARCHAR(50) NOT NULL DEFAULT 'razorpay',
  provider_event_id VARCHAR(255) NOT NULL UNIQUE,
  event_type VARCHAR(100) NOT NULL,
  payload_json LONGTEXT,
  processing_status VARCHAR(50) NOT NULL DEFAULT 'processed',
  processed_at TIMESTAMP NULL DEFAULT NULL,
  received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_provider_event (provider, provider_event_id),
  INDEX idx_event_type (event_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Enquiries Table
CREATE TABLE IF NOT EXISTS enquiries (
  id VARCHAR(100) PRIMARY KEY,
  property_id VARCHAR(100) NOT NULL,
  tenant_user_id VARCHAR(100) DEFAULT NULL,
  name VARCHAR(255) NOT NULL,
  contact_details JSON,
  message TEXT,
  enquiry_status VARCHAR(50) NOT NULL DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_property_inq (property_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Favorites Table
CREATE TABLE IF NOT EXISTS favorites (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  property_id VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_property (user_id, property_id),
  INDEX idx_user_fav (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  notification_type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_notif (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(100) PRIMARY KEY,
  actor_user_id VARCHAR(100) DEFAULT NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(100) NOT NULL,
  metadata_json JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_actor (actor_user_id),
  INDEX idx_entity (entity_type, entity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
