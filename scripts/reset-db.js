require('dotenv').config({ path: '.env' });
const { Pool } = require('pg');

// PostgreSQL connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'estatyq_db',
  user: process.env.DB_USER || 'estatyq_user',
  password: process.env.DB_PASSWORD || 'password'
});

/**
 * Reset database
 */
async function resetDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('⚠️  Resetting database...');
    
    // Drop existing table
    await client.query('DROP TABLE IF EXISTS listings CASCADE');
    console.log('✅ Dropped existing tables');
    
    // Create table
    const CREATE_TABLE_SQL = `
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

      CREATE INDEX idx_listings_city ON listings(location_city_key);
      CREATE INDEX idx_listings_type ON listings(type);
      CREATE INDEX idx_listings_transaction ON listings(transaction_type);
      CREATE INDEX idx_listings_price ON listings(price_value);
      CREATE INDEX idx_listings_active ON listings(is_active);
    `;
    
    await client.query(CREATE_TABLE_SQL);
    console.log('✅ Created new tables with indexes');
    
    console.log('✅ Database reset successfully');
    
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run reset
resetDatabase().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
