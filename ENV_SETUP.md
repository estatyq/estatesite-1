# 🗄️ PostgreSQL Integration Setup Guide

## 📋 Prerequisites

You need to have installed:
- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

## 🔧 Step 1: Create Environment File

Create a `.env` file in your project root:

```env
# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=estatyq_db
DB_USER=estatyq_user
DB_PASSWORD=your_secure_password_here

# Server Configuration
SERVER_PORT=3000
NODE_ENV=development

# API Configuration
API_BASE_URL=http://localhost:3000
```

## 🗄️ Step 2: Create PostgreSQL Database

Run in PostgreSQL:

```sql
-- Create database
CREATE DATABASE estatyq_db;

-- Create user
CREATE USER estatyq_user WITH PASSWORD 'your_secure_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE estatyq_db TO estatyq_user;

-- Connect to database
\c estatyq_db

-- Create schema
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO estatyq_user;
```

## 📦 Step 3: Install Dependencies

```bash
npm install pg express dotenv cors
```

**Packages:**
- `pg` - PostgreSQL client
- `express` - Backend server
- `dotenv` - Environment variables
- `cors` - Cross-Origin Resource Sharing

## 🚀 Step 4: Create Backend Server

See: `server.js` (will be created with init script)

## 📊 Step 5: Initialize Database & Load Data

```bash
node scripts/init-db.js
```

This will:
1. Create all tables
2. Load data from `data/listings.example.json`
3. Create indexes
4. Show status

## ✅ Step 6: Start Server

```bash
node server.js
```

Server runs on `http://localhost:3000`

## 🔗 Step 7: Update Frontend

Frontend will automatically fetch from:
```
http://localhost:3000/api/listings
```

---

## 📝 Database Schema

### listings table

```sql
CREATE TABLE listings (
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

-- Indexes for performance
CREATE INDEX idx_listings_city ON listings(location_city_key);
CREATE INDEX idx_listings_type ON listings(type);
CREATE INDEX idx_listings_transaction ON listings(transaction_type);
CREATE INDEX idx_listings_price ON listings(price_value);
```

## 🧪 Test the API

```bash
# Get all listings
curl http://localhost:3000/api/listings

# Get listings by city
curl http://localhost:3000/api/listings?city=kyiv

# Get listings by type
curl http://localhost:3000/api/listings?type=apartment

# Combined filters
curl "http://localhost:3000/api/listings?city=kyiv&type=apartment&priceMin=100&priceMax=500"
```

## 🐛 Troubleshooting

### Connection refused
- Check PostgreSQL is running: `pg_isready`
- Check .env credentials

### Table exists error
- Database already initialized, run: `npm run reset-db`

### No data showing
- Check data loaded: `SELECT COUNT(*) FROM listings;`
- Run init script again: `node scripts/init-db.js`

---

See server implementation files for details.
