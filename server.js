require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

// Initialize Express app
const app = express();
const PORT = process.env.SERVER_PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// PostgreSQL Pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'estatyq_db',
  user: process.env.DB_USER || 'estatyq_user',
  password: process.env.DB_PASSWORD || 'password'
});

// Log connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

// ==================== API ENDPOINTS ====================

/**
 * GET /api/listings - Get all listings with optional filters
 * Query params: city, type, transaction, priceMin, priceMax, limit, offset
 */
app.get('/api/listings', async (req, res) => {
  try {
    const { city, type, transaction, priceMin, priceMax, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM listings WHERE is_active = true';
    const params = [];
    let paramIndex = 1;
    
    // Apply filters
    if (city) {
      query += ` AND location_city_key = $${paramIndex}`;
      params.push(city);
      paramIndex++;
    }
    
    if (type) {
      query += ` AND type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }
    
    if (transaction) {
      query += ` AND transaction_type = $${paramIndex}`;
      params.push(transaction);
      paramIndex++;
    }
    
    if (priceMin) {
      query += ` AND price_value >= $${paramIndex}`;
      params.push(parseFloat(priceMin));
      paramIndex++;
    }
    
    if (priceMax) {
      query += ` AND price_value <= $${paramIndex}`;
      params.push(parseFloat(priceMax));
      paramIndex++;
    }
    
    // Add sorting and pagination
    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), parseInt(offset));
    
    // Get total count (for pagination info)
    let countQuery = 'SELECT COUNT(*) as total FROM listings WHERE is_active = true';
    const countParams = [];
    let countParamIndex = 1;
    
    if (city) {
      countQuery += ` AND location_city_key = $${countParamIndex}`;
      countParams.push(city);
      countParamIndex++;
    }
    if (type) {
      countQuery += ` AND type = $${countParamIndex}`;
      countParams.push(type);
      countParamIndex++;
    }
    if (transaction) {
      countQuery += ` AND transaction_type = $${countParamIndex}`;
      countParams.push(transaction);
      countParamIndex++;
    }
    if (priceMin) {
      countQuery += ` AND price_value >= $${countParamIndex}`;
      countParams.push(parseFloat(priceMin));
      countParamIndex++;
    }
    if (priceMax) {
      countQuery += ` AND price_value <= $${countParamIndex}`;
      countParams.push(parseFloat(priceMax));
      countParamIndex++;
    }
    
    const [listingsResult, countResult] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, countParams)
    ]);
    
    const total = parseInt(countResult.rows[0].total);
    
    res.json({
      success: true,
      data: listingsResult.rows,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + parseInt(limit)) < total
      }
    });
  } catch (error) {
    console.error('❌ Error fetching listings:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * ==================== V2 LISTINGS ENDPOINT (FILE-BASED, CONTRACT-COMPLIANT) ====================
 * GET /api/v2/listings
 * Query params: q, city, district, priceMin, priceMax, rooms, areaMin, areaMax,
 *               type (sale|rent|daily), propertyType (flat|house|land|office), labels,
 *               sort (price_asc|price_desc|date_desc|area_desc), page (>=1), perPage (<=50)
 * Response: { items: Listing[], total: number, page: number, perPage: number }
 */
let __v2Cache = {
  data: null,
  ts: 0
};
const V2_CACHE_TTL_MS = 60 * 1000;

function normalizePropertyType(t) {
  if (!t) return null;
  const map = { apartment: 'flat', house: 'house', land: 'land', office: 'office' };
  return map[t] || (t === 'commercial' || t === 'warehouse' ? 'office' : t);
}

function normalizeListing(item) {
  return {
    id: item.id,
    title: item.location?.address || `${item.type || 'Listing'} ${item.id}`,
    price: item.price?.value ?? 0,
    currency: item.price?.currency || 'USD',
    address: item.location?.address || '',
    city: item.location?.cityKey || item.location?.city || '',
    district: item.location?.district || '',
    lat: item.location?.geo?.lat ?? null,
    lng: item.location?.geo?.lng ?? null,
    areaTotal: item.area?.total ?? null,
    rooms: item.rooms ?? null,
    floor: item.floor?.current ?? null,
    floorsTotal: item.floor?.total ?? null,
    type: item.transactionType || 'sale',
    propertyType: normalizePropertyType(item.type) || 'flat',
    photos: Array.isArray(item.images) ? item.images : [],
    publishedAt: item.createdAt || null,
    updatedAt: item.updatedAt || null,
    labels: []
  };
}

function getV2Data() {
  const now = Date.now();
  if (__v2Cache.data && (now - __v2Cache.ts) < V2_CACHE_TTL_MS) {
    return __v2Cache.data;
  }
  try {
    const raw = fs.readFileSync(path.join(__dirname, 'data', 'listings.example.json'), 'utf8');
    const arr = JSON.parse(raw);
    const normalized = Array.isArray(arr) ? arr.map(normalizeListing) : [];
    __v2Cache = { data: normalized, ts: now };
    return normalized;
  } catch (e) {
    __v2Cache = { data: [], ts: now };
    return [];
  }
}

function applyV2Filters(items, q) {
  let result = items;
  const {
    id,
    q: search,
    city,
    district,
    priceMin,
    priceMax,
    rooms,
    areaMin,
    areaMax,
    type,
    propertyType
  } = q;

  if (id) {
    result = result.filter(it => String(it.id) === String(id));
  }
  if (search) {
    const s = String(search).toLowerCase();
    result = result.filter(it => (
      `${it.title} ${it.address} ${it.city} ${it.district}`.toLowerCase().includes(s)
    ));
  }
  if (city) {
    result = result.filter(it => String(it.city) === String(city));
  }
  if (district) {
    result = result.filter(it => (it.district || '') === String(district));
  }
  if (priceMin) {
    const v = Number(priceMin);
    if (!Number.isNaN(v)) result = result.filter(it => (it.price ?? 0) >= v);
  }
  if (priceMax) {
    const v = Number(priceMax);
    if (!Number.isNaN(v)) result = result.filter(it => (it.price ?? 0) <= v);
  }
  if (rooms) {
    const v = Number(rooms);
    if (!Number.isNaN(v)) result = result.filter(it => (it.rooms ?? -1) === v);
  }
  if (areaMin) {
    const v = Number(areaMin);
    if (!Number.isNaN(v)) result = result.filter(it => (it.areaTotal ?? 0) >= v);
  }
  if (areaMax) {
    const v = Number(areaMax);
    if (!Number.isNaN(v)) result = result.filter(it => (it.areaTotal ?? 0) <= v);
  }
  if (type) {
    const allowed = ['sale', 'rent', 'daily'];
    if (allowed.includes(String(type))) {
      result = result.filter(it => it.type === String(type));
    }
  }
  if (propertyType) {
    result = result.filter(it => it.propertyType === String(propertyType));
  }

  return result;
}

function applyV2Sort(items, sort) {
  const allowed = ['price_asc', 'price_desc', 'date_desc', 'area_desc'];
  if (!sort) return items;
  if (!allowed.includes(sort)) return null; // invalid
  const arr = [...items];
  switch (sort) {
    case 'price_asc':
      arr.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      break;
    case 'price_desc':
      arr.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      break;
    case 'date_desc':
      arr.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
      break;
    case 'area_desc':
      arr.sort((a, b) => (b.areaTotal ?? 0) - (a.areaTotal ?? 0));
      break;
  }
  return arr;
}

/**
 * Input validation and normalization middleware for /api/v2/listings
 * Ensures parameters are safe and within acceptable ranges
 */
function validateV2ListingsParams(req, res, next) {
  try {
    // Normalize perPage parameter
    const perPageRaw = req.query.perPage ?? '20';
    const perPageInt = parseInt(perPageRaw, 10) || 20;
    req.query.perPage = Math.max(1, Math.min(50, perPageInt));

    // Normalize page parameter  
    const pageInt = parseInt(req.query.page, 10) || 1;
    req.query.page = Math.max(1, pageInt);

    // Validate sort parameter - whitelist only
    const allowedSorts = ['price_asc', 'price_desc', 'date_desc', 'area_desc'];
    if (req.query.sort && !allowedSorts.includes(req.query.sort)) {
      req.query.sort = 'date_desc'; // fallback to default
    }

    // Normalize numeric parameters
    if (req.query.priceMin) {
      const v = parseFloat(req.query.priceMin);
      req.query.priceMin = Number.isNaN(v) ? undefined : v;
    }
    if (req.query.priceMax) {
      const v = parseFloat(req.query.priceMax);
      req.query.priceMax = Number.isNaN(v) ? undefined : v;
    }
    if (req.query.areaMin) {
      const v = parseFloat(req.query.areaMin);
      req.query.areaMin = Number.isNaN(v) ? undefined : v;
    }
    if (req.query.areaMax) {
      const v = parseFloat(req.query.areaMax);
      req.query.areaMax = Number.isNaN(v) ? undefined : v;
    }
    if (req.query.rooms) {
      const v = parseInt(req.query.rooms, 10);
      req.query.rooms = Number.isNaN(v) ? undefined : v;
    }

    // Validate type parameter - whitelist
    const allowedTypes = ['sale', 'rent', 'daily'];
    if (req.query.type && !allowedTypes.includes(req.query.type)) {
      req.query.type = undefined;
    }

    // Validate propertyType parameter - whitelist
    const allowedPropertyTypes = ['flat', 'house', 'land', 'office'];
    if (req.query.propertyType && !allowedPropertyTypes.includes(req.query.propertyType)) {
      req.query.propertyType = undefined;
    }

    next();
  } catch (e) {
    res.status(400).json({ error: { code: 'INVALID_PARAMS', message: 'Invalid parameters' } });
  }
}

app.get('/api/v2/listings', validateV2ListingsParams, (req, res) => {
  try {
    const perPage = req.query.perPage;
    const page = req.query.page;
    const sort = req.query.sort || 'date_desc';

    let items = getV2Data();
    items = applyV2Filters(items, req.query);

    const sorted = applyV2Sort(items, sort);
    if (sorted === null) {
      return res.status(400).json({ 
        error: { code: 'INVALID_SORT', message: 'Unsupported sort parameter' } 
      });
    }

    const total = (sorted || items).length;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paged = (sorted || items).slice(start, end);

    // Set cache headers for catalog responses
    res.set({
      'Cache-Control': 'public, max-age=60',
      'X-Total-Count': String(total),
      'X-Page-Size': String(perPage),
      'X-Page-Number': String(page)
    });

    return res.json({ 
      items: paged,
      total,
      page,
      perPage,
      hasMore: (page * perPage) < total
    });
  } catch (e) {
    console.error('Error in /api/v2/listings:', e);
    return res.status(500).json({ 
      error: { code: 'INTERNAL', message: 'Unexpected error' } 
    });
  }
});

/**
 * GET /api/listings/:id - Get specific listing
 */
app.get('/api/listings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM listings WHERE id = $1 AND is_active = true',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('❌ Error fetching listing:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/stats - Get statistics
 */
app.get('/api/stats', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_listings,
        COUNT(DISTINCT location_city_key) as cities,
        COUNT(DISTINCT type) as property_types,
        AVG(price_value) as avg_price,
        MIN(price_value) as min_price,
        MAX(price_value) as max_price
      FROM listings
      WHERE is_active = true
    `);
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/cities - Get available cities
 */
app.get('/api/cities', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT 
        location_city_key as key,
        location_city as name,
        COUNT(*) as count
      FROM listings
      WHERE is_active = true
      GROUP BY location_city_key, location_city
      ORDER BY count DESC
    `);
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('❌ Error fetching cities:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// ==================== START SERVER ====================

const server = app.listen(PORT, () => {
  console.log(`🚀 EstateQ Backend Server running on http://localhost:${PORT}`);
  console.log(`📊 API Base URL: http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('⏹️  Shutting down gracefully...');
  server.close(() => {
    pool.end();
    process.exit(0);
  });
});

module.exports = app;
