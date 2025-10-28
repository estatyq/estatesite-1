# 🚀 PostgreSQL & XML Sync - Quick Start

## 📋 What's Configured

Your EstatyQ project now has:
- ✅ Express backend server (`server.js`)
- ✅ PostgreSQL database schema (`scripts/init-db.js`)
- ✅ XML → Database sync from LigaPro (`scripts/sync-xml-to-db.js`)
- ✅ REST API for listings
- ✅ Database reset utility (`scripts/reset-db.js`)

---

## ⚡ 5-Minute Setup

### 1️⃣ Install Dependencies

```bash
npm install
```

Installs: `express`, `pg`, `axios`, `xml2js`, `cors`, `dotenv`

### 2️⃣ PostgreSQL Setup

**Windows PowerShell:**
```powershell
# Install PostgreSQL if needed
# https://www.postgresql.org/download/windows/

# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE estatyq_db;
CREATE USER estatyq_user WITH PASSWORD 'your_password_here';
GRANT ALL PRIVILEGES ON DATABASE estatyq_db TO estatyq_user;
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql

# Create database
createdb -U postgres estatyq_db
```

**Ubuntu:**
```bash
sudo apt install postgresql
sudo systemctl start postgresql

# Create database
sudo -u postgres createdb estatyq_db
```

### 3️⃣ Configure Database Credentials

**Edit `.env` in project root:**

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=estatyq_db
DB_USER=estatyq_user
DB_PASSWORD=your_password_here
SERVER_PORT=3000
```

### 4️⃣ Initialize Database

```bash
npm run db:init
```

Output:
```
🔧 Creating tables...
✅ Tables created successfully
ℹ️  Skipping sample data (use --with-data flag to load)
✅ Database initialized successfully
```

### 5️⃣ Load Real Data from XML

```bash
npm run db:seed
```

This:
1. Reads `URLXML` from `data/.env`
2. Fetches XML from LigaPro
3. Parses Yandex XML format
4. Converts to EstatyQ format
5. Loads into PostgreSQL
6. Shows statistics

Output:
```
📝 Environment variables loaded from data/.env
📥 Fetching XML from: https://estatyq.ligapro.ua/files/yandex_xml/...
✅ XML fetched (456789 bytes)
✅ XML parsed successfully
📊 Found 245 offers in XML
📤 Inserting 245 listings into database...
✅ Inserted 243 listings, 2 failed

📈 Database Statistics:
   Total listings: 243
   Cities: 7
   Property types: 6

✅ Sync completed successfully!
```

### 6️⃣ Start Backend Server

```bash
npm start
```

Output:
```
🚀 EstateQ Backend Server running on http://localhost:3000
📊 API Base URL: http://localhost:3000/api
✅ Connected to PostgreSQL
```

### 7️⃣ Test API

```bash
# Check health
curl http://localhost:3000/api/health

# Get listings
curl http://localhost:3000/api/listings

# Get Kyiv apartments
curl "http://localhost:3000/api/listings?city=kyiv&type=apartment"
```

---

## 📱 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/listings` | Get all listings (with filters) |
| GET | `/api/listings/:id` | Get specific listing |
| GET | `/api/stats` | Database statistics |
| GET | `/api/cities` | Available cities |
| GET | `/api/health` | Server health check |

### Query Parameters

```bash
curl "http://localhost:3000/api/listings?city=kyiv&type=apartment&priceMin=100&priceMax=500&limit=20&offset=0"
```

- `city` - kyiv, kharkiv, odesa, lviv, dnipro, zaporizhzhia, ivano_frankivsk
- `type` - apartment, house, office, commercial, land, warehouse
- `transaction` - sale, rent, daily
- `priceMin` / `priceMax` - Price range in thousands
- `limit` - Results per page (default: 50)
- `offset` - Skip N records (default: 0)

---

## 🛠️ Useful Commands

```bash
# Install dependencies
npm install

# Initialize database (create tables only)
npm run db:init

# Initialize with sample data
npm run db:init --with-data

# Sync XML from LigaPro
npm run db:seed

# Reset database completely
npm run db:reset

# Start backend server
npm start

# Or run dev server
npm run server
```

---

## 🐛 Quick Troubleshooting

### PostgreSQL Won't Connect

```bash
# Check if running
psql --version

# Start it
# macOS: brew services start postgresql
# Ubuntu: sudo systemctl start postgresql
# Windows: Start PostgreSQL from Services
```

### Wrong Password Error

```sql
-- Reset user password in PostgreSQL
ALTER USER estatyq_user WITH PASSWORD 'new_password';
```

### Need Fresh Database

```bash
npm run db:reset
npm run db:seed
```

### Check Database Contents

```bash
# In PostgreSQL CLI
\c estatyq_db
SELECT COUNT(*) FROM listings;
SELECT DISTINCT location_city FROM listings;
```

---

## 📊 Database Schema

**listings table:**
- `id` - Unique identifier
- `type` - Property type (apartment, house, etc.)
- `price_value` - Price in thousands
- `location_city_key` - City key for filtering
- `amenities_balcony`, `amenities_parking` - Boolean flags
- `amenities_metro` - Nearest metro station
- `geo_lat`, `geo_lng` - Coordinates
- Plus 25+ other fields

**Indexes:** city, type, transaction, price, active status

---

## 🎯 Next Steps

1. ✅ Backend running on `http://localhost:3000`
2. ✅ API serving listings from PostgreSQL
3. ✅ Real data from LigaPro XML feed

**To integrate with frontend:**
- Update `js/script.js` to fetch from API instead of `generateProperties()`
- Change: `const allProperties = generateProperties();`
- To: `const allProperties = await fetch('http://localhost:3000/api/listings').then(r => r.json()).then(d => d.data);`

---

## 📚 Full Documentation

See `POSTGRESQL_INTEGRATION.md` for complete reference.

---

**Status:** ✅ Ready to use!

Start with: `npm install && npm run db:init && npm run db:seed && npm start`
