# 🗄️ PostgreSQL Server Setup Guide

**For:** Server Installation & Initialization  
**Status:** Step-by-step guide for fresh PostgreSQL  
**Time:** ~15 minutes

---

## 📋 Overview

This guide covers:
1. Installing PostgreSQL on your server
2. Initializing database and user
3. Creating tables and indexes
4. Configuring for Node.js application

---

## 🚀 Step 1: Install PostgreSQL

### Linux (Ubuntu/Debian)

```bash
# Update package manager
sudo apt update
sudo apt upgrade -y

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
psql --version
pg_isready
```

### Linux (CentOS/RHEL)

```bash
# Install PostgreSQL
sudo yum install -y postgresql-server postgresql-contrib

# Initialize database
sudo /usr/pgsql-14/bin/postgresql-14-setup initdb

# Start service
sudo systemctl start postgresql-14
sudo systemctl enable postgresql-14

# Verify
psql --version
```

### macOS

```bash
# Install using Homebrew
brew install postgresql

# Start PostgreSQL
brew services start postgresql

# Verify
psql --version
pg_isready
```

### Windows

1. Download: https://www.postgresql.org/download/windows/
2. Run installer
3. Set password for `postgres` user (remember it!)
4. Select default port 5432
5. Complete installation

---

## 🔑 Step 2: Connect to PostgreSQL

### Linux/macOS

```bash
# Connect as postgres superuser
sudo -u postgres psql

# Or if password is set
psql -U postgres -h localhost
```

### Windows

```bash
# Open PowerShell or CMD
psql -U postgres -h localhost
```

**You should see:** `postgres=#` prompt

---

## 📝 Step 3: Run Initialization Commands

Copy and paste these commands in psql one by one:

### 3.1 Create Database

```sql
CREATE DATABASE estatyq_db;
```

✅ Expected: `CREATE DATABASE`

### 3.2 Create User

```sql
CREATE USER estatyq_user WITH PASSWORD 'password123';
```

✅ Expected: `CREATE ROLE`

### 3.3 Grant Privileges on Database

```sql
GRANT ALL PRIVILEGES ON DATABASE estatyq_db TO estatyq_user;
```

✅ Expected: `GRANT`

### 3.4 Connect to Database

```sql
\c estatyq_db
```

✅ Expected: `You are now connected to database "estatyq_db"`

### 3.5 Grant Schema Privileges

```sql
GRANT ALL ON SCHEMA public TO estatyq_user;
```

✅ Expected: `GRANT`

### 3.6 Create Listings Table

```sql
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
```

✅ Expected: `CREATE TABLE`

### 3.7 Create Indexes

```sql
CREATE INDEX IF NOT EXISTS idx_listings_city ON listings(location_city_key);
CREATE INDEX IF NOT EXISTS idx_listings_type ON listings(type);
CREATE INDEX IF NOT EXISTS idx_listings_transaction ON listings(transaction_type);
CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price_value);
CREATE INDEX IF NOT EXISTS idx_listings_active ON listings(is_active);
```

✅ Expected: `CREATE INDEX` (5 times)

### 3.8 Grant Table Privileges

```sql
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO estatyq_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO estatyq_user;
```

✅ Expected: `GRANT` (2 times)

---

## ✅ Step 4: Verify Setup

Run these commands to verify everything is correct:

### Check Database

```sql
\l
```

**Look for:** `estatyq_db | estatyq_user`

### Check User

```sql
\du
```

**Look for:** `estatyq_user` with role `Superuser`? No

### Check Tables

```sql
\dt
```

**Look for:** `listings` table

### Check Indexes

```sql
\di
```

**Look for:** 5 indexes starting with `idx_listings_`

### Count Rows

```sql
SELECT COUNT(*) FROM listings;
```

**Expected:** `0` (empty table, will be filled by app)

---

## 🔓 Step 5: Exit PostgreSQL CLI

```sql
\q
```

Or press: `Ctrl+D`

---

## 🔐 Step 6: Configure PostgreSQL for Remote Access (Optional)

If Node.js will run on different server:

### Edit postgresql.conf

```bash
# Linux/macOS
sudo nano /etc/postgresql/14/main/postgresql.conf

# Change:
listen_addresses = '*'
```

### Edit pg_hba.conf

```bash
# Linux/macOS
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Add line:
host    estatyq_db    estatyq_user    0.0.0.0/0    md5
```

### Restart PostgreSQL

```bash
sudo systemctl restart postgresql
```

---

## 🧪 Step 7: Test Connection from Node.js

On your Node.js server, test connection:

```bash
# Update .env with correct values
DB_HOST=your.postgresql.server.com
DB_PORT=5432
DB_NAME=estatyq_db
DB_USER=estatyq_user
DB_PASSWORD=password123

# Run initialization from Node.js
npm run db:init
```

Expected output:
```
🔧 Creating tables...
✅ Tables created successfully
ℹ️  Skipping sample data (use --with-data flag to load)
✅ Database initialized successfully
```

---

## 📋 SQL Script (All-in-One)

If you want to run all at once, use file: `scripts/init-postgresql.sql`

```bash
# Linux/macOS
psql -U postgres < scripts/init-postgresql.sql

# Windows
psql -U postgres -f scripts\init-postgresql.sql
```

---

## 🆘 Troubleshooting

### Connection Refused

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Start if needed
sudo systemctl start postgresql
```

### Permission Denied

```bash
# Use sudo
sudo -u postgres psql

# Or set password for postgres user
sudo -u postgres psql
\password postgres
# Enter new password twice
```

### User Already Exists

```sql
-- Drop existing user
DROP USER IF EXISTS estatyq_user;

-- Create again
CREATE USER estatyq_user WITH PASSWORD 'password123';
```

### Database Already Exists

```sql
-- Drop existing database
DROP DATABASE IF EXISTS estatyq_db;

-- Create again
CREATE DATABASE estatyq_db;
```

### Wrong Password

```sql
-- Change password
ALTER USER estatyq_user WITH PASSWORD 'password123';
```

### Port Already in Use

```sql
-- Check which port (usually 5432)
-- If different, update .env:
DB_PORT=5433
```

---

## 📊 Expected Final State

After all steps:

| Component | Status | Value |
|-----------|--------|-------|
| Database | ✅ Created | `estatyq_db` |
| User | ✅ Created | `estatyq_user` |
| Table | ✅ Created | `listings` |
| Indexes | ✅ Created | 5 indexes |
| Rows | ✅ Empty | 0 rows |
| Status | ✅ Ready | Ready for data |

---

## 🚀 Next Steps

Once PostgreSQL is ready:

```bash
# 1. From Node.js server, load data from XML
npm run db:seed

# Expected output:
# 📥 Fetching XML from: https://estatyq.ligapro.ua/...
# ✅ XML fetched (456789 bytes)
# 📊 Found 245 offers in XML
# ✅ Inserted 243 listings

# 2. Start backend server
npm start

# 3. Test API
curl http://localhost:3000/api/listings?city=kyiv
```

---

## 📞 Help

**Still having issues?** Check:
1. PostgreSQL is running: `pg_isready`
2. User exists: `psql -U estatyq_user -d estatyq_db`
3. Tables exist: `\dt` in psql
4. Firewall allows port 5432

---

**Setup Date:** October 28, 2025  
**Status:** Ready to Initialize  
**Time Needed:** ~15 minutes  

See: `INSTALL_VERIFICATION.md` for Node.js verification
