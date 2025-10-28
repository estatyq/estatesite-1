-- ==========================================
-- EstatyQ PostgreSQL Initialization Script
-- Run this in PostgreSQL CLI as superuser
-- ==========================================

-- 1. Create database
CREATE DATABASE estatyq_db;
COMMENT ON DATABASE estatyq_db IS 'EstatyQ Real Estate Listings Database';

-- 2. Create role/user with password
CREATE USER estatyq_user WITH PASSWORD 'password123';
COMMENT ON ROLE estatyq_user IS 'EstatyQ application user';

-- 3. Grant privileges on database
GRANT ALL PRIVILEGES ON DATABASE estatyq_db TO estatyq_user;

-- 4. Connect to database (in psql: \c estatyq_db)
-- Then run the following:

-- ==========================================
-- Execute after connecting to estatyq_db:
-- ==========================================

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO estatyq_user;

-- Create listings table
CREATE TABLE IF NOT EXISTS listings (
  id VARCHAR(50) PRIMARY KEY,
  type VARCHAR(50),
  transaction_type VARCHAR(20),
  price_value NUMERIC,
  price_currency VARCHAR(10),
  area_total NUMERIC,
  area_living NUMERIC,
  area_plot NUMERIC,
  rooms INT,
  floor_current INT,
  floor_total INT,
  year_built INT,
  location_country VARCHAR(100),
  location_region VARCHAR(100),
  location_city VARCHAR(100),
  location_city_key VARCHAR(50),
  location_district VARCHAR(100),
  location_microdistrict VARCHAR(100),
  location_address VARCHAR(255),
  geo_lat NUMERIC,
  geo_lng NUMERIC,
  amenities_balcony BOOLEAN,
  amenities_parking BOOLEAN,
  amenities_metro VARCHAR(100),
  amenities_features TEXT[],
  images TEXT[],
  contact_phone VARCHAR(20),
  contact_email VARCHAR(100),
  contact_name VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_listings_city ON listings(location_city_key);
CREATE INDEX IF NOT EXISTS idx_listings_type ON listings(type);
CREATE INDEX IF NOT EXISTS idx_listings_transaction ON listings(transaction_type);
CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price_value);
CREATE INDEX IF NOT EXISTS idx_listings_active ON listings(is_active);

-- Grant table privileges
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO estatyq_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO estatyq_user;

-- Verify setup
SELECT * FROM pg_database_list WHERE datname = 'estatyq_db';
SELECT * FROM pg_user WHERE usename = 'estatyq_user';
SELECT COUNT(*) FROM pg_tables WHERE tablename = 'listings';
