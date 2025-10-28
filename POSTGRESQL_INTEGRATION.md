# 🗄️ PostgreSQL Integration Guide

**Version:** 1.0  
**Last Updated:** October 28, 2025  
**Status:** Complete Setup

---

## 📋 Overview

EstatyQ now integrates with PostgreSQL database to:
1. **Fetch real estate data** from XML feed (LigaPro)
2. **Convert and normalize** data into database
3. **Serve via REST API** for frontend consumption
4. **Provide filtering and pagination** capabilities

---

## 🔧 Installation & Setup

### Step 1: Install Dependencies

```bash
npm install
```

This installs:
- `express` - Backend server
- `pg` - PostgreSQL client
- `dotenv` - Environment variables
- `cors` - Cross-origin requests
- `axios` - HTTP client for XML fetch
- `xml2js` - XML parsing

### Step 2: Create PostgreSQL Database

Open PostgreSQL CLI and run:

```sql
-- Create database
CREATE DATABASE estatyq_db;

-- Create user
CREATE USER estatyq_user WITH PASSWORD 'your_secure_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE estatyq_db TO estatyq_user;

-- Connect to database
\c estatyq_db

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO estatyq_user;
```

### Step 3: Configure .env

Edit `data/.env` (already exists with URLXML):

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

# XML Feed (already configured)
URLXML="https://estatyq.ligapro.ua/files/yandex_xml/ya_xml_base_32bbf_adf00.xml"
```

### Step 4: Initialize Database

```bash
npm run db:init
```

This creates tables and loads sample data from `data/listings.example.json`.

### Step 5: Sync Real Data from XML

```bash
npm run db:seed
# or use custom script
node scripts/sync-xml-to-db.js
```

This:
1. Fetches XML from `URLXML` in .env
2. Parses Yandex XML format
3. Converts to EstatyQ format
4. Loads into PostgreSQL
5. Shows statistics

---

## 🚀 Running the Server

### Development Mode

```bash
npm start
```

or

```bash
npm run server
```

Server runs on: `http://localhost:3000`

### Check Health

```bash
curl http://localhost:3000/api/health
```

Response:
```json
{
  "success": true,
  "message": "Server is running"
}
```

---

## 📊 Database Schema

### listings table

```
id (VARCHAR 50) - PRIMARY KEY - Unique listing ID
type (VARCHAR 50) - Property type: apartment, house, office, commercial, land, warehouse
transaction_type (VARCHAR 20) - sale, rent, daily
price_value (NUMERIC) - Price amount in thousands
price_currency (VARCHAR 10) - Currency: USD, UAH, EUR
area_total (NUMERIC) - Total area in m²
area_living (NUMERIC) - Living area in m²
area_plot (NUMERIC) - Plot area
rooms (INT) - Number of rooms
floor_current (INT) - Current floor
floor_total (INT) - Total floors in building
year_built (INT) - Construction year
location_country (VARCHAR 100) - Country
location_region (VARCHAR 100) - Region/Province
location_city (VARCHAR 100) - City name
location_city_key (VARCHAR 50) - City key: kyiv, kharkiv, odesa, lviv, dnipro, zaporizhzhia, ivano_frankivsk
location_district (VARCHAR 100) - District
location_microdistrict (VARCHAR 100) - Microdistrict
location_address (VARCHAR 255) - Full address
geo_lat (NUMERIC) - Latitude
geo_lng (NUMERIC) - Longitude
amenities_balcony (BOOLEAN) - Has balcony
amenities_parking (BOOLEAN) - Has parking
amenities_metro (VARCHAR 100) - Nearest metro station
amenities_features (TEXT[]) - Array of features
images (TEXT[]) - Array of image URLs
contact_phone (VARCHAR 20) - Contact phone
contact_email (VARCHAR 100) - Contact email
contact_name (VARCHAR 100) - Contact name/agent
description (TEXT) - Property description
created_at (TIMESTAMP) - Record creation date
updated_at (TIMESTAMP) - Last update date
is_active (BOOLEAN) - Active listing
```

### Indexes

- `idx_listings_city` - Fast city filtering
- `idx_listings_type` - Fast type filtering
- `idx_listings_transaction` - Fast transaction type filtering
- `idx_listings_price` - Fast price range filtering
- `idx_listings_active` - Fast active status filtering

---

## 🔌 API Endpoints

### Get All Listings

```bash
GET /api/listings
```

Query parameters:
- `city` (string) - Filter by city key (kyiv, kharkiv, etc.)
- `type` (string) - Filter by type (apartment, house, etc.)
- `transaction` (string) - Filter by transaction (sale, rent, daily)
- `priceMin` (number) - Minimum price (thousands)
- `priceMax` (number) - Maximum price
- `limit` (number) - Results per page (default: 50)
- `offset` (number) - Skip N records (default: 0)

**Examples:**

```bash
# All listings
curl http://localhost:3000/api/listings

# Apartments in Kyiv
curl "http://localhost:3000/api/listings?city=kyiv&type=apartment"

# With price filter
curl "http://localhost:3000/api/listings?priceMin=100&priceMax=500"

# Paginated
curl "http://localhost:3000/api/listings?limit=20&offset=40"

# Complex filter
curl "http://localhost:3000/api/listings?city=kyiv&type=apartment&transaction=sale&priceMin=100&priceMax=500"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "apt-kyiv-001",
      "type": "apartment",
      "transaction_type": "sale",
      "price_value": 150000,
      "price_currency": "USD",
      "area_total": 75.5,
      "rooms": 2,
      "floor_current": 5,
      "floor_total": 9,
      ...
    }
  ],
  "pagination": {
    "total": 245,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

### Get Specific Listing

```bash
GET /api/listings/:id
```

**Example:**
```bash
curl http://localhost:3000/api/listings/apt-kyiv-001
```

### Get Statistics

```bash
GET /api/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_listings": 245,
    "cities": 7,
    "property_types": 6,
    "avg_price": 125500.50,
    "min_price": 5000,
    "max_price": 500000
  }
}
```

### Get Available Cities

```bash
GET /api/cities
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "key": "kyiv",
      "name": "Київ",
      "count": 89
    },
    {
      "key": "kharkiv",
      "name": "Харків",
      "count": 45
    }
  ]
}
```

---

## 📡 Frontend Integration

### Update js/script.js

The frontend now fetches from API instead of using `generateProperties()`:

```javascript
async function fetchListingsFromAPI() {
  try {
    const query = new URLSearchParams(filters).toString();
    const response = await fetch(`http://localhost:3000/api/listings?${query}`);
    const result = await response.json();
    
    if (result.success) {
      allProperties = result.data;
      totalCount = result.pagination.total;
      displayedCount = result.data.length;
      renderProperties();
    }
  } catch (error) {
    console.error('❌ Error fetching listings:', error);
    // Fallback to local data
  }
}
```

### Replace generateProperties Call

**Before:**
```javascript
const allProperties = generateProperties();
```

**After:**
```javascript
let allProperties = [];
let totalCount = 0;

async function initializeListings() {
  await fetchListingsFromAPI();
}

// In DOMContentLoaded:
initializeListings().then(() => {
  renderProperties();
});
```

---

## 🔄 Data Sync Workflow

### One-time Sync from XML

```bash
npm run db:seed
```

Output example:
```
📥 Fetching XML from: https://estatyq.ligapro.ua/files/yandex_xml/ya_xml_base_32bbf_adf00.xml
✅ XML fetched (456789 bytes)
✅ XML parsed successfully
📊 Found 245 offers in XML
📤 Inserting 245 listings into database...
✅ Inserted 243 listings, 2 failed

📈 Database Statistics:
   Total listings: 243
   Cities: 7
   Property types: 6
```

### Automatic Sync (Optional - Future Enhancement)

Could be set up with cron job:

```bash
# Run sync every hour
0 * * * * cd /path/to/estatyq && npm run db:seed
```

---

## 🧪 Testing

### Test API Endpoints

```bash
# Test health check
curl http://localhost:3000/api/health

# Test listings
curl http://localhost:3000/api/listings | jq '.'

# Test filtering
curl "http://localhost:3000/api/listings?city=kyiv" | jq '.data | length'

# Test pagination
curl "http://localhost:3000/api/listings?limit=5&offset=0" | jq '.pagination'
```

### Test Frontend

1. Start server: `npm start`
2. Open `http://localhost:3000` in browser
3. Check console for API calls
4. Verify data loads and filters work
5. Test like/favorites with new data

---

## 🐛 Troubleshooting

### Connection Refused

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Solution:**
```bash
# Check PostgreSQL is running
pg_isready

# If not running, start it
# On macOS: brew services start postgresql
# On Ubuntu: sudo systemctl start postgresql
# On Windows: psql -U postgres
```

### Authentication Failed

**Error:** `Password authentication failed for user "estatyq_user"`

**Solution:**
1. Check .env credentials match PostgreSQL user
2. Reset user password:
   ```sql
   ALTER USER estatyq_user WITH PASSWORD 'new_password';
   ```

### No Data After Sync

**Error:** `SELECT COUNT(*) FROM listings;` returns 0

**Solution:**
```bash
# Re-run sync
npm run db:seed

# Or reset database
npm run db:reset
```

### XML Parsing Error

**Error:** `Error parsing XML`

**Solution:**
1. Check URLXML in .env is correct
2. Verify XML file is accessible
3. Check XML format is valid

---

## 📝 Environment Variables

Complete `.env` reference:

```env
# ========== PostgreSQL Configuration ==========
DB_HOST=localhost              # Database host
DB_PORT=5432                   # Database port
DB_NAME=estatyq_db             # Database name
DB_USER=estatyq_user           # Database user
DB_PASSWORD=password           # Database password

# ========== Server Configuration ==========
SERVER_PORT=3000               # Backend server port
NODE_ENV=development           # development or production

# ========== API Configuration ==========
API_BASE_URL=http://localhost:3000  # API base URL
CORS_ORIGIN=*                  # CORS origin

# ========== Data Source ==========
URLXML="https://estatyq.ligapro.ua/files/yandex_xml/ya_xml_base_32bbf_adf00.xml"
```

---

## 📚 File Structure

```
estatyQ site/
├── server.js                          # Express server with API
├── .env                               # Environment variables
├── scripts/
│   ├── init-db.js                    # Initialize database from JSON
│   └── sync-xml-to-db.js             # Sync XML → PostgreSQL
├── js/
│   └── script.js                      # Frontend (modified to use API)
├── data/
│   ├── .env                          # Data source URLs
│   ├── listings.example.json         # Sample data
│   └── listings.schema.json          # Data schema
└── package.json                      # Dependencies
```

---

## 🚀 Quick Start Checklist

- [ ] Install Node modules: `npm install`
- [ ] Create PostgreSQL database and user
- [ ] Set DB credentials in .env
- [ ] Run `npm run db:init` to create tables
- [ ] Run `npm run db:seed` to load XML data
- [ ] Start server: `npm start`
- [ ] Verify API: `curl http://localhost:3000/api/health`
- [ ] Open browser: `http://localhost:3000`
- [ ] Test filtering and pagination

---

## 📞 Support

For issues:
1. Check logs in terminal
2. Verify .env configuration
3. Test API endpoints manually
4. Check PostgreSQL is running
5. Reset database with `npm run db:reset`

---

**Status:** ✅ Ready to use with real data!
