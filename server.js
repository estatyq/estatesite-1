require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

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
