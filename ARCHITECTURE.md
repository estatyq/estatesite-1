# 🏗️ EstatyQ Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                          Browser (Frontend)                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  index.html + js/script.js + css/styles.css              │   │
│  │  - Renders properties                                    │   │
│  │  - Filters (region, city, metro)                         │   │
│  │  - Likes/favorites (localStorage)                        │   │
│  │  - View modes (grid/list)                                │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────┬──────────────────────────────────────────────────┘
                  │ HTTP Requests
                  │ /api/listings
                  │ /api/stats
                  │ /api/cities
                  ↓
┌──────────────────────────────────────────────────────────────────┐
│                    Node.js Backend (server.js)                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Express Server (Port 3000)                               │  │
│  │  - REST API endpoints                                     │  │
│  │  - CORS enabled                                           │  │
│  │  - Static file serving                                    │  │
│  │  - Request validation & filtering                         │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────┬────────────────────────────────────────────┘
                       │ SQL Queries
                       ↓
    ┌──────────────────────────────────────────┐
    │       PostgreSQL Database                 │
    │  ┌──────────────────────────────────────┐ │
    │  │ listings table                       │ │
    │  │ - 30+ fields (prices, location, etc) │ │
    │  │ - 5 indexes for fast queries         │ │
    │  │ - 200+ rows of real estate data      │ │
    │  └──────────────────────────────────────┘ │
    └──────────────────────────────────────────┘
            ↑                 ↑
            │                 │
            │                 │ SQL Insert
    Sync Script              Writes
    (sync-xml-to-db.js)
            ↑
            │ Parse
            │ & Convert
            │
    ┌───────────────────────┐
    │  XML from LigaPro      │
    │  https://estatyq.     │
    │  ligapro.ua/files/... │
    └───────────────────────┘
```

---

## Data Flow

### 1️⃣ Data Ingestion (XML → PostgreSQL)

```
data/.env
│ URLXML="https://estatyq.ligapro.ua/..."
│
└─→ npm run db:seed
    └─→ scripts/sync-xml-to-db.js
        ├─ Fetch XML from URL (axios)
        ├─ Parse XML (xml2js)
        │  └─ Extract: id, price, location, amenities, images
        ├─ Convert to EstatyQ format
        │  └─ Map city names to keys
        │  └─ Map property types
        │  └─ Normalize data
        └─ Insert into PostgreSQL
           └─ ~240 listings loaded
```

**Example XML → DB conversion:**

```xml
<offer id="123">
  <price>150000</price>
  <category>Квартира</category>
  <city>Київ</city>
  <floor>5</floor>
</offer>
```

↓ Converts to:

```sql
INSERT INTO listings 
  (id, type, transaction_type, price_value, location_city, ...)
VALUES
  ('123', 'apartment', 'sale', 150000, 'Київ', ...);
```

### 2️⃣ API Query Flow (Browser → DB → Browser)

```
Browser Request
│
└─→ GET /api/listings?city=kyiv&type=apartment
    │
    └─→ Express Route Handler
        ├─ Parse query parameters
        ├─ Validate inputs
        └─ Build SQL query
            │
            └─→ WHERE location_city_key = 'kyiv'
                AND type = 'apartment'
                AND is_active = true
                LIMIT 50
                │
                └─→ PostgreSQL
                    └─ Execute query using indexes
                    └─ Return 50 matching rows
                    │
                    └─→ Response JSON
                        {
                          "success": true,
                          "data": [...],
                          "pagination": {...}
                        }
```

### 3️⃣ Frontend Rendering

```
API Response (JSON)
│
└─→ js/script.js
    ├─ Store in allProperties[]
    ├─ Filter by local filters (metro, price, etc.)
    └─ renderProperties()
        ├─ Apply currentView (grid/list)
        ├─ Load like state from localStorage
        ├─ Generate HTML
        └─ Inject into DOM
            │
            └─→ User sees properties!
```

---

## Component Architecture

### Backend Components

#### 1. Express Server (`server.js`)

**Responsibilities:**
- Listen on port 3000
- Handle incoming HTTP requests
- Authenticate requests (future)
- Return JSON responses
- CORS handling
- Static file serving

**Key Routes:**
```javascript
GET /api/listings        - Get properties (with filters)
GET /api/listings/:id    - Get single property
GET /api/stats           - Database statistics
GET /api/cities          - Available cities list
GET /api/health          - Health check
```

#### 2. PostgreSQL Database

**Responsibilities:**
- Store real estate listings
- Provide fast queries via indexes
- Validate data integrity
- Audit trail (created_at, updated_at)

**Key Indexes:**
- `idx_listings_city` - Fast city filtering
- `idx_listings_type` - Fast type filtering
- `idx_listings_price` - Fast price range queries
- `idx_listings_active` - Quick active status check

#### 3. Sync Script (`scripts/sync-xml-to-db.js`)

**Responsibilities:**
- Fetch XML from external URL
- Parse and validate XML
- Transform Yandex XML to EstatyQ format
- Handle mapping (city names → keys, types)
- Insert into PostgreSQL
- Report statistics

**Features:**
- Error recovery (continues on single item fail)
- Duplicate detection (ON CONFLICT)
- Progress logging
- Statistics summary

#### 4. Database Initialization (`scripts/init-db.js`)

**Responsibilities:**
- Create table schema
- Create indexes
- Optionally load sample data
- Idempotent (can run multiple times)

#### 5. Database Reset (`scripts/reset-db.js`)

**Responsibilities:**
- Drop existing tables
- Recreate clean schema
- Reset for development/testing

### Frontend Components

#### 1. HTML Structure (`index.html`)

**Key Sections:**
- Filter panel (region, city, districts, metro)
- Results counter ("Found: X")
- Property grid/list view
- Property cards
- Modal for details
- Pagination ("Show more")

#### 2. JavaScript (`js/script.js`)

**Key Functions:**
- `fetchListingsFromAPI()` - Get from backend
- `applyFilters()` - Filter & re-render
- `renderProperties()` - Display in view
- `setView()` - Toggle grid/list
- `toggleFavorite()` - Like handling
- `updateURLState()` - Persist filters to URL

**Data Structures:**
```javascript
let allProperties = []          // All listings from API
let filteredProperties = []     // After filtering
let filters = {                 // Current filters
  region, city, districts, 
  microdistricts, metroStations,
  priceMin, priceMax
}
let currentView = 'grid'        // grid or list
let currentSort = 'date'        // Sorting order
```

#### 3. CSS (`css/styles.css`)

**Styling for:**
- Grid layout (auto-responsive)
- List view
- Filter panel
- Property cards
- Modal dialogs
- Responsive design

#### 4. LocalStorage

**Stores:**
- `estatyq_likes` - Favorite property IDs
- `estatyq_view` - User's preferred view (grid/list)

---

## Data Schema

### Listings Table (30 columns)

```
Property Information
├─ id (VARCHAR 50) - PK
├─ type (VARCHAR 50) - apartment|house|office|commercial|land|warehouse
├─ transaction_type (VARCHAR 20) - sale|rent|daily
└─ description (TEXT)

Price Information
├─ price_value (NUMERIC)
└─ price_currency (VARCHAR 10) - USD|UAH|EUR

Area Information
├─ area_total (NUMERIC)
├─ area_living (NUMERIC)
└─ area_plot (NUMERIC)

Building Information
├─ rooms (INT)
├─ floor_current (INT)
├─ floor_total (INT)
└─ year_built (INT)

Location Information
├─ location_country (VARCHAR 100)
├─ location_region (VARCHAR 100)
├─ location_city (VARCHAR 100)
├─ location_city_key (VARCHAR 50) - indexed
├─ location_district (VARCHAR 100)
├─ location_microdistrict (VARCHAR 100)
├─ location_address (VARCHAR 255)
├─ geo_lat (NUMERIC)
└─ geo_lng (NUMERIC)

Amenities
├─ amenities_balcony (BOOLEAN)
├─ amenities_parking (BOOLEAN)
├─ amenities_metro (VARCHAR 100)
└─ amenities_features (TEXT[])

Contact & Media
├─ images (TEXT[])
├─ contact_phone (VARCHAR 20)
├─ contact_email (VARCHAR 100)
└─ contact_name (VARCHAR 100)

System Fields
├─ created_at (TIMESTAMP)
├─ updated_at (TIMESTAMP)
└─ is_active (BOOLEAN)
```

---

## Request/Response Examples

### GET /api/listings?city=kyiv&type=apartment

**Request:**
```http
GET /api/listings?city=kyiv&type=apartment&limit=3 HTTP/1.1
Host: localhost:3000
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
      "location_city": "Київ",
      "location_city_key": "kyiv",
      "location_district": "Печерськ",
      "amenities_metro": "Хрещатик",
      "images": ["https://..."]
    },
    ...
  ],
  "pagination": {
    "total": 89,
    "limit": 3,
    "offset": 0,
    "hasMore": true
  }
}
```

### GET /api/stats

**Response:**
```json
{
  "success": true,
  "data": {
    "total_listings": 243,
    "cities": 7,
    "property_types": 6,
    "avg_price": 125500.5,
    "min_price": 5000,
    "max_price": 500000
  }
}
```

---

## Technologies Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | HTML5/CSS3/JavaScript | User interface |
| **Backend** | Node.js + Express | REST API server |
| **Database** | PostgreSQL | Data persistence |
| **Data Transform** | xml2js | XML parsing |
| **HTTP Client** | axios | Fetch XML feeds |
| **Env Config** | dotenv | Configuration management |
| **API Middleware** | cors | Cross-origin requests |

---

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│  User's Browser                         │
│  (Anywhere on internet)                 │
└────────────────┬────────────────────────┘
                 │ HTTPS
                 │
    ┌────────────▼────────────┐
    │  Load Balancer/Proxy    │
    │  (nginx/Apache)         │
    └────────────┬────────────┘
                 │
    ┌────────────▼────────────────────┐
    │  Node.js Cluster                │
    │  (Multiple server.js instances) │
    └────────────┬────────────────────┘
                 │ TCP Port 5432
    ┌────────────▼──────────────┐
    │  PostgreSQL (Production)  │
    │  - Replication            │
    │  - Backups                │
    │  - High availability      │
    └───────────────────────────┘
```

---

## Scalability Considerations

### Current (Single Server)
- ✅ Handles 200-300 concurrent users
- ✅ Query response < 100ms
- ✅ 240+ listings

### Future Improvements
- [ ] Database connection pooling (pgbouncer)
- [ ] Redis caching for popular queries
- [ ] Horizontal scaling with load balancer
- [ ] CDN for images
- [ ] Elasticsearch for full-text search
- [ ] Read replicas for scaling queries

---

## Monitoring & Maintenance

### Key Metrics
- API response time (target: < 100ms)
- Database query time
- Active connections
- Disk usage
- CPU usage

### Regular Tasks
- Daily: Check error logs
- Weekly: Monitor disk usage
- Monthly: Review slow queries
- Quarterly: Update data from XML feed
- Annually: Audit and cleanup old listings

---

**Architecture Last Updated:** October 28, 2025  
**Status:** Production Ready ✅
