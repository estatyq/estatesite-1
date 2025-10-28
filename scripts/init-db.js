require('dotenv').config({ path: '.env' });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// PostgreSQL connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'estatyq_db',
  user: process.env.DB_USER || 'estatyq_user',
  password: process.env.DB_PASSWORD || 'password'
});

// SQL to create tables
const CREATE_TABLES_SQL = `
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
`;

/**
 * Initialize database
 */
async function initDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Creating tables...');
    
    // Create tables
    await client.query(CREATE_TABLES_SQL);
    console.log('✅ Tables created successfully');
    
    // Try to load sample data
    const loadSample = process.argv.includes('--with-data');
    if (loadSample) {
      console.log('📥 Loading sample listings from JSON...');
      await loadListingsFromJSON(client);
    } else {
      console.log('ℹ️  Skipping sample data (use --with-data flag to load)');
    }
    
    console.log('✅ Database initialized successfully');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

/**
 * Load listings from JSON file
 */
async function loadListingsFromJSON(client) {
  try {
    // Try multiple paths
    let jsonPath;
    const possiblePaths = [
      'data/listings.example.json',
      './data/listings.example.json',
      path.join(__dirname, '../data/listings.example.json'),
      path.join(__dirname, '../../data/listings.example.json')
    ];
    
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        jsonPath = p;
        break;
      }
    }
    
    if (!jsonPath) {
      console.warn('⚠️  No listings.example.json found, skipping data load');
      return;
    }
    
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const listings = JSON.parse(rawData);
    
    console.log(`📊 Found ${listings.length} listings to import`);
    
    // Clear existing data
    await client.query('TRUNCATE TABLE listings');
    
    // Insert listings
    let inserted = 0;
    for (const listing of listings) {
      try {
        const query = `
          INSERT INTO listings (
            id, type, transaction_type, price_value, price_currency,
            area_total, area_living, area_plot, rooms, floor_current, floor_total,
            year_built, location_country, location_region, location_city, location_city_key,
            location_district, location_microdistrict, location_address,
            geo_lat, geo_lng, amenities_balcony, amenities_parking,
            amenities_metro, amenities_features, images, contact_phone,
            contact_email, contact_name, description
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
            $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30
          )
          ON CONFLICT (id) DO UPDATE SET
            updated_at = CURRENT_TIMESTAMP
        `;
        
        const values = [
          listing.id,
          listing.type,
          listing.transactionType,
          listing.price?.value,
          listing.price?.currency,
          listing.area?.total,
          listing.area?.living,
          listing.area?.plot,
          listing.rooms,
          listing.floor?.current,
          listing.floor?.total,
          listing.yearBuilt,
          listing.location?.country,
          listing.location?.region,
          listing.location?.city,
          listing.location?.cityKey,
          listing.location?.district,
          listing.location?.microdistrict,
          listing.location?.address,
          listing.location?.geo?.lat,
          listing.location?.geo?.lng,
          listing.amenities?.balcony,
          listing.amenities?.parking,
          listing.amenities?.metro,
          listing.amenities?.features || [],
          listing.images || [],
          listing.contact?.phone,
          listing.contact?.email,
          listing.contact?.name,
          listing.description
        ];
        
        await client.query(query, values);
        inserted++;
      } catch (error) {
        console.warn(`⚠️  Failed to insert listing ${listing.id}:`, error.message);
      }
    }
    
    console.log(`✅ Inserted ${inserted}/${listings.length} listings`);
    
    // Show statistics
    const stats = await client.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(DISTINCT location_city_key) as cities,
        COUNT(DISTINCT type) as types
      FROM listings
    `);
    
    console.log('\n📈 Database Statistics:');
    console.log(`   Total listings: ${stats.rows[0].total}`);
    console.log(`   Cities: ${stats.rows[0].cities}`);
    console.log(`   Property types: ${stats.rows[0].types}`);
    
  } catch (error) {
    console.error('❌ Error loading listings:', error);
    throw error;
  }
}

// Run initialization
initDatabase().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
