require('dotenv').config({ path: path.join(__dirname, '../.env') });
const axios = require('axios');
const { parseString } = require('xml2js');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

// Read .env from data folder
const envPath = path.join(__dirname, '../data/.env');
const envContent = fs.readFileSync(envPath, 'utf8');

// Parse .env manually
const envVars = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    let value = valueParts.join('=').trim();
    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    envVars[key] = value;
  }
});

console.log('📝 Environment variables loaded from data/.env');

// PostgreSQL connection - use process.env for DB config (set separately or defaults)
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'estatyq_db',
  user: process.env.DB_USER || 'estatyq_user',
  password: process.env.DB_PASSWORD || 'password'
});

/**
 * Fetch XML from URL
 */
async function fetchXML(url) {
  console.log(`📥 Fetching XML from: ${url}`);
  
  try {
    const response = await axios.get(url, { 
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    console.log(`✅ XML fetched (${response.data.length} bytes)`);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching XML:', error.message);
    throw error;
  }
}

/**
 * Parse XML to JSON
 */
async function parseXML(xmlData) {
  return new Promise((resolve, reject) => {
    parseString(xmlData, { 
      mergeAttrs: true,
      normalize: true,
      trim: true,
      explicitArray: false
    }, (err, result) => {
      if (err) {
        console.error('❌ XML Parse Error:', err.message);
        reject(err);
      } else {
        console.log('✅ XML parsed successfully');
        resolve(result);
      }
    });
  });
}

/**
 * Convert parsed XML to listings format
 */
function convertXMLToListings(xmlJson) {
  const listings = [];
  
  try {
    // Extract shop > offers > offer from Yandex XML format
    if (xmlJson?.yml_catalog?.shop?.offers?.offer) {
      const offers = Array.isArray(xmlJson.yml_catalog.shop.offers.offer)
        ? xmlJson.yml_catalog.shop.offers.offer
        : [xmlJson.yml_catalog.shop.offers.offer];
      
      console.log(`📊 Found ${offers.length} offers in XML`);
      
      offers.forEach((offer, index) => {
        try {
          // Map Yandex XML fields to our listing format
          const listing = {
            id: offer.id || `listing-${index}`,
            type: mapPropertyType(offer.category),
            transactionType: 'sale', // Default, could be extracted from description
            price: {
              value: parseFloat(offer.price) || 0,
              currency: offer.currencyId || 'USD'
            },
            area: {
              total: parseFloat(offer.area) || null,
              living: null,
              plot: null
            },
            rooms: parseInt(offer.rooms) || null,
            floor: {
              current: parseInt(offer.floor) || null,
              total: parseInt(offer.floorCount) || null
            },
            yearBuilt: parseInt(offer.buildYear) || new Date().getFullYear(),
            location: {
              country: 'Ukraine',
              region: offer.region || '',
              city: offer.city || 'Kyiv',
              cityKey: mapCityKey(offer.city),
              district: offer.district || '',
              microdistrict: offer.microdistrict || '',
              address: offer.address || offer.name || '',
              geo: {
                lat: parseFloat(offer.latitude) || null,
                lng: parseFloat(offer.longitude) || null
              }
            },
            amenities: {
              balcony: offer.balcony === 'true' || offer.balcony === true,
              parking: offer.parking === 'true' || offer.parking === true,
              metro: offer.metro || null,
              features: offer.features ? (Array.isArray(offer.features) ? offer.features : [offer.features]) : []
            },
            images: offer.image ? (Array.isArray(offer.image) ? offer.image : [offer.image]) : [],
            contact: {
              phone: offer.phone || '',
              email: offer.email || '',
              name: offer.seller || ''
            },
            description: offer.description || offer.name || ''
          };
          
          listings.push(listing);
        } catch (error) {
          console.warn(`⚠️  Error converting offer ${index}:`, error.message);
        }
      });
    }
  } catch (error) {
    console.error('❌ Error converting XML to listings:', error.message);
  }
  
  return listings;
}

/**
 * Map property category to our types
 */
function mapPropertyType(category) {
  if (!category) return 'apartment';
  
  const cat = String(category).toLowerCase();
  
  if (cat.includes('квартира') || cat.includes('apartment')) return 'apartment';
  if (cat.includes('дом') || cat.includes('house')) return 'house';
  if (cat.includes('офис') || cat.includes('office')) return 'office';
  if (cat.includes('комерч') || cat.includes('commercial')) return 'commercial';
  if (cat.includes('земля') || cat.includes('land')) return 'land';
  if (cat.includes('склад') || cat.includes('warehouse')) return 'warehouse';
  
  return 'apartment';
}

/**
 * Map city name to city key
 */
function mapCityKey(cityName) {
  if (!cityName) return 'kyiv';
  
  const city = String(cityName).toLowerCase();
  
  if (city.includes('київ')) return 'kyiv';
  if (city.includes('харків')) return 'kharkiv';
  if (city.includes('одеса')) return 'odesa';
  if (city.includes('львів')) return 'lviv';
  if (city.includes('дніпро')) return 'dnipro';
  if (city.includes('запоріжжя')) return 'zaporizhzhia';
  if (city.includes('івано')) return 'ivano_frankivsk';
  
  return 'kyiv';
}

/**
 * Load listings into database
 */
async function loadListingsToDatabase(listings) {
  const client = await pool.connect();
  
  try {
    console.log(`📤 Inserting ${listings.length} listings into database...`);
    
    let inserted = 0;
    let failed = 0;
    
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
        failed++;
      }
    }
    
    console.log(`✅ Inserted ${inserted} listings, ${failed} failed`);
    
    // Show statistics
    const stats = await client.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(DISTINCT location_city_key) as cities,
        COUNT(DISTINCT type) as types
      FROM listings
      WHERE is_active = true
    `);
    
    console.log('\n📈 Database Statistics:');
    console.log(`   Total listings: ${stats.rows[0].total}`);
    console.log(`   Cities: ${stats.rows[0].cities}`);
    console.log(`   Property types: ${stats.rows[0].types}`);
    
  } finally {
    client.release();
  }
}

/**
 * Main sync process
 */
async function syncXMLToDatabase() {
  try {
    // Get URL from .env in data folder
    const xmlUrl = envVars.URLXML;
    
    if (!xmlUrl) {
      console.error('❌ URLXML not found in data/.env file');
      process.exit(1);
    }
    
    // Fetch and parse XML
    const xmlData = await fetchXML(xmlUrl);
    const xmlJson = await parseXML(xmlData);
    
    // Convert to listings
    const listings = convertXMLToListings(xmlJson);
    
    if (listings.length === 0) {
      console.warn('⚠️  No listings found in XML');
      process.exit(0);
    }
    
    // Load to database
    await loadListingsToDatabase(listings);
    
    console.log('\n✅ Sync completed successfully!');
    
  } catch (error) {
    console.error('❌ Sync failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run sync
syncXMLToDatabase();
