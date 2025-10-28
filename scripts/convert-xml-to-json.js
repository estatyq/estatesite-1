/*
  XML → JSON converter for EstatyQ catalog

  Usage:
    node scripts/convert-xml-to-json.js "<XML_FEED_URL>" data/mapping.json [outputPath=data/listings.json] [itemsPath]

  Notes:
  - mapping.json: keys are source paths inside a listing item; values are target paths in normalized object.
  - itemsPath (optional): dot/bracket path to the array of listings inside parsed XML.
  - Replaces data/listings.json entirely each run (simple, reliable). Preserves createdAt if the id existed before.
*/

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const { XMLParser } = require('fast-xml-parser');

function log(...args) { console.log('[xml->json]', ...args); }

function readJsonIfExists(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (_) {}
  return null;
}

function writeJson(filePath, data) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function toNumber(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return value;
  const n = parseFloat(String(value).toString().replace(/[^0-9.\-]/g, ''));
  return Number.isFinite(n) ? n : null;
}

function getByPath(obj, dotPath) {
  if (!obj || !dotPath) return undefined;
  const parts = dotPath.replace(/\[(\d+)\]/g, '.$1').split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

function setByPath(obj, dotPath, value) {
  const parts = dotPath.replace(/\[(\d+)\]/g, '.$1').split('.');
  let cur = obj;
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    const isLast = i === parts.length - 1;
    if (isLast) {
      cur[p] = value;
    } else {
      if (!(p in cur) || typeof cur[p] !== 'object' || cur[p] === null) {
        // next is index?
        const next = parts[i + 1];
        cur[p] = /^\d+$/.test(next) ? [] : {};
      }
      cur = cur[p];
    }
  }
}

function findFirstArrayOfObjects(obj) {
  const queue = [obj];
  while (queue.length) {
    const cur = queue.shift();
    if (Array.isArray(cur) && cur.length && typeof cur[0] === 'object') return cur;
    if (cur && typeof cur === 'object') {
      for (const k of Object.keys(cur)) queue.push(cur[k]);
    }
  }
  return null;
}

function normalizeCityKey(cityNameRaw) {
  if (!cityNameRaw) return null;
  const s = String(cityNameRaw).toLowerCase();
  const map = {
    'київ': 'kyiv', 'киев': 'kyiv', 'м. київ': 'kyiv',
    'харків': 'kharkiv', 'харьков': 'kharkiv', 'м. харків': 'kharkiv',
    'одеса': 'odesa', 'одесса': 'odesa', 'м. одеса': 'odesa',
    'львів': 'lviv', 'львов': 'lviv', 'м. львів': 'lviv',
    'дніпро': 'dnipro', 'днепр': 'dnipro', 'м. дніпро': 'dnipro',
    'запоріжжя': 'zaporizhzhia', 'запорожье': 'zaporizhzhia', 'м. запоріжжя': 'zaporizhzhia',
    'івано-франківськ': 'ivano_frankivsk', 'ивано-франковск': 'ivano_frankivsk', 'м. івано-франківськ': 'ivano_frankivsk'
  };
  return map[s] || null;
}

function normalizeRecord(raw, mapping) {
  const rec = {
    id: null,
    type: null,
    transactionType: null,
    price: { value: null, currency: 'USD' },
    area: { total: null },
    rooms: null,
    floor: null,
    yearBuilt: null,
    location: { country: 'Україна', region: null, city: null, district: null, microdistrict: null, address: null },
    geo: null,
    amenities: {},
    images: [],
    cityKey: null
  };

  for (const [src, dst] of Object.entries(mapping)) {
    const val = getByPath(raw, src);
    if (val === undefined) continue;
    setByPath(rec, dst, val);
  }

  // Coerce numerics
  rec.rooms = toNumber(rec.rooms);
  if (rec.area) rec.area.total = toNumber(rec.area.total);
  if (rec.price) rec.price.value = toNumber(rec.price.value);
  rec.floor = toNumber(rec.floor);
  rec.yearBuilt = toNumber(rec.yearBuilt);

  // Ensure arrays
  if (!Array.isArray(rec.images)) rec.images = rec.images ? [rec.images] : [];

  // cityKey
  rec.cityKey = normalizeCityKey(rec.location && rec.location.city);

  // id to string for stability
  if (rec.id != null) rec.id = String(rec.id);

  return rec;
}

async function main() {
  const xmlUrl = process.argv[2];
  const mappingPath = process.argv[3] || 'data/mapping.json';
  const outputPath = process.argv[4] || 'data/listings.json';
  const itemsPath = process.argv[5];

  if (!xmlUrl) {
    console.error('Usage: node scripts/convert-xml-to-json.js <XML_URL> [mappingPath] [outputPath] [itemsPath]');
    process.exit(1);
  }

  const mapping = readJsonIfExists(mappingPath);
  if (!mapping) {
    console.error(`Mapping file not found or invalid: ${mappingPath}`);
    process.exit(1);
  }

  log('Fetching XML...', xmlUrl);
  const res = await fetch(xmlUrl);
  if (!res.ok) {
    console.error('Failed to fetch XML:', res.status, res.statusText);
    process.exit(1);
  }
  const xmlText = await res.text();

  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
  const parsed = parser.parse(xmlText);

  let items = itemsPath ? getByPath(parsed, itemsPath) : null;
  if (!Array.isArray(items)) items = findFirstArrayOfObjects(parsed);
  if (!Array.isArray(items)) {
    console.error('Unable to locate array of listings in XML. Provide itemsPath as 5th arg.');
    process.exit(1);
  }

  log(`Found ${items.length} raw items.`);

  const prev = readJsonIfExists(outputPath) || [];
  const prevById = new Map(prev.map(x => [x.id, x]));

  const normalized = [];
  for (const raw of items) {
    const rec = normalizeRecord(raw, mapping);
    if (!rec.id || !rec.type || !rec.transactionType || !rec.price || rec.price.value == null || !rec.location || !rec.location.city) {
      continue; // skip invalid
    }
    const existed = prevById.get(rec.id);
    rec.createdAt = existed?.createdAt || new Date().toISOString();
    rec.updatedAt = new Date().toISOString();
    normalized.push(rec);
  }

  writeJson(outputPath, normalized);
  log(`Wrote ${normalized.length} listings to ${outputPath}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

#!/usr/bin/env node

/**
 * EstatyQ XML to JSON Converter
 * Transforms CRM XML feed into unified JSON schema
 * Version: 1.0
 * Usage: node convert-xml-to-json.js [--input feed.xml] [--mapping mapping.json] [--output listings.json]
 */

const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

// ==================== CONFIG ====================

const DEFAULT_CONFIG = {
  inputFile: path.join(__dirname, '../data/feed.example.xml'),
  mappingFile: path.join(__dirname, '../data/mapping.example.json'),
  outputFile: path.join(__dirname, '../data/listings.json'),
  schemaFile: path.join(__dirname, '../data/listings.schema.json'),
  validateSchema: true,
  verbose: true
};

// City name to city key mapping
const CITY_MAPPING = {
  'київ': 'kyiv',
  'kyiv': 'kyiv',
  'киев': 'kyiv',
  'kharkiv': 'kharkiv',
  'харків': 'kharkiv',
  'харьков': 'kharkiv',
  'odesa': 'odesa',
  'одеса': 'odesa',
  'одесса': 'odesa',
  'lviv': 'lviv',
  'львів': 'lviv',
  'львов': 'lviv',
  'dnipro': 'dnipro',
  'дніпро': 'dnipro',
  'днепр': 'dnipro',
  'запоріжжя': 'zaporizhzhia',
  'zaporizhzhia': 'zaporizhzhia',
  'запорожье': 'zaporizhzhia',
  'івано-франківськ': 'ivano_frankivsk',
  'ivano-frankivsk': 'ivano_frankivsk',
  'ivano_frankivsk': 'ivano_frankivsk'
};

// ==================== VALIDATORS ====================

class DataValidator {
  static required(value, fieldName) {
    if (!value && value !== 0 && value !== false) {
      throw new Error(`Required field missing: ${fieldName}`);
    }
    return value;
  }

  static string(value) {
    return String(value || '').trim();
  }

  static number(value) {
    const num = parseFloat(value);
    if (isNaN(num)) throw new Error(`Invalid number: ${value}`);
    return num;
  }

  static integer(value) {
    const int = parseInt(value, 10);
    if (isNaN(int)) throw new Error(`Invalid integer: ${value}`);
    return int;
  }

  static boolean(value) {
    if (typeof value === 'boolean') return value;
    return String(value).toLowerCase() !== 'false' && value !== '0' && !!value;
  }

  static enum(value, allowedValues) {
    const val = String(value).toLowerCase();
    if (!allowedValues.map(v => String(v).toLowerCase()).includes(val)) {
      throw new Error(`Invalid enum value: ${value}. Allowed: ${allowedValues.join(', ')}`);
    }
    return val;
  }

  static cityKey(cityName) {
    const key = CITY_MAPPING[String(cityName).toLowerCase()];
    if (!key) throw new Error(`Unknown city: ${cityName}`);
    return key;
  }

  static phone(value) {
    if (!value) return null;
    const normalized = String(value).replace(/[^\d+\-\s()]/g, '');
    return /^\+?[0-9\-\s()]{10,}$/.test(normalized) ? normalized : null;
  }

  static email(value) {
    if (!value) return null;
    const email = String(value).toLowerCase();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
  }

  static geo(lat, lng) {
    if (!lat || !lng) return undefined;
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    if (latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
      throw new Error(`Invalid geo coordinates: ${lat}, ${lng}`);
    }
    return { lat: latNum, lng: lngNum };
  }
}

// ==================== TRANSFORMS ====================

const TRANSFORMS = {
  toFloat: (v) => parseFloat(v),
  toInt: (v) => parseInt(v, 10),
  toBoolean: (v) => DataValidator.boolean(v),
  toLowerCase: (v) => String(v).toLowerCase(),
  lowercase: (v) => String(v).toLowerCase(),
  toISO8601: (v) => new Date(v).toISOString(),
  normalizePhone: (v) => DataValidator.phone(v),
  cityNameToCityKey: (v) => DataValidator.cityKey(v)
};

// ==================== CONVERTER ====================

class XMLToJSONConverter {
  constructor(mappingConfig) {
    this.mapping = mappingConfig.mappings;
    this.transforms = mappingConfig.transforms || TRANSFORMS;
    this.cityMapping = mappingConfig.cityMapping || CITY_MAPPING;
    this.validationErrors = [];
    this.convertedCount = 0;
    this.skippedCount = 0;
  }

  /**
   * Get value from XML object using XPath-like notation
   */
  getValueByPath(obj, xpath) {
    if (!xpath || !obj) return undefined;
    
    const parts = xpath.split('/');
    let current = obj;
    
    for (const part of parts) {
      if (!current) return undefined;
      
      // Handle array elements
      if (Array.isArray(current)) {
        current = current[0];
      }
      
      current = current[part];
    }
    
    // Handle arrays (like features)
    if (Array.isArray(current)) {
      return current.map(item => {
        if (typeof item === 'object' && item._) return item._;
        return item;
      });
    }
    
    return current && current._ ? current._ : current;
  }

  /**
   * Set value in nested object using dot notation
   */
  setValueByDotPath(obj, dotPath, value) {
    const parts = dotPath.split('.');
    let current = obj;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current)) {
        current[part] = {};
      }
      current = current[part];
    }
    
    current[parts[parts.length - 1]] = value;
  }

  /**
   * Apply transformation to value
   */
  transform(value, transformName) {
    if (!transformName || !value) return value;
    
    const transformFn = this.transforms[transformName];
    if (!transformFn) {
      console.warn(`Unknown transform: ${transformName}`);
      return value;
    }
    
    try {
      if (typeof transformFn === 'function') {
        return transformFn(value);
      } else if (typeof transformFn === 'string') {
        // Execute string as function
        // eslint-disable-next-line no-new-func
        return new Function('value', 'return ' + transformFn)(value);
      }
    } catch (err) {
      console.error(`Transform error for "${transformName}": ${err.message}`);
      return value;
    }
    
    return value;
  }

  /**
   * Convert single XML listing to JSON
   */
  convertListing(xmlListing) {
    const jsonListing = {};
    const errors = [];
    
    try {
      // Process each mapping
      for (const [dotPath, config] of Object.entries(this.mapping)) {
        try {
          const xmlPath = config.xmlPath;
          let value = this.getValueByPath(xmlListing, xmlPath);
          
          // Apply default if missing
          if ((value === undefined || value === null || value === '') && config.default !== undefined) {
            value = config.default;
          }
          
          // Check required
          if (config.required && (value === undefined || value === null || value === '')) {
            errors.push(`Required field missing: ${dotPath}`);
            continue;
          }
          
          // Skip if no value
          if (value === undefined || value === null || value === '') {
            continue;
          }
          
          // Apply transformation
          if (config.transform) {
            value = this.transform(value, config.transform);
          }
          
          // Validate type
          if (config.type === 'number') {
            value = DataValidator.number(value);
          } else if (config.type === 'integer') {
            value = DataValidator.integer(value);
          } else if (config.type === 'boolean') {
            value = DataValidator.boolean(value);
          } else if (config.enum) {
            value = DataValidator.enum(value, config.enum);
          }
          
          // Set in result
          this.setValueByDotPath(jsonListing, dotPath, value);
          
        } catch (err) {
          errors.push(`${dotPath}: ${err.message}`);
        }
      }
      
      // Validate required fields
      const requiredFields = ['id', 'type', 'transactionType', 'price', 'location'];
      for (const field of requiredFields) {
        if (field === 'price') {
          if (!jsonListing.price || !jsonListing.price.value) {
            errors.push(`Required field missing: price.value`);
          }
        } else if (field === 'location') {
          if (!jsonListing.location || !jsonListing.location.city) {
            errors.push(`Required field missing: location.city`);
          }
        } else if (!jsonListing[field]) {
          errors.push(`Required field missing: ${field}`);
        }
      }
      
      if (errors.length > 0) {
        this.validationErrors.push({
          id: xmlListing.id?.[0] || 'unknown',
          errors
        });
        this.skippedCount++;
        return null;
      }
      
      // Add timestamps
      jsonListing.createdAt = jsonListing.createdAt || new Date().toISOString();
      jsonListing.updatedAt = new Date().toISOString();
      
      this.convertedCount++;
      return jsonListing;
      
    } catch (err) {
      this.validationErrors.push({
        id: xmlListing.id?.[0] || 'unknown',
        errors: [err.message]
      });
      this.skippedCount++;
      return null;
    }
  }

  /**
   * Convert XML to JSON
   */
  convert(xmlData) {
    const parser = new xml2js.Parser({ explicitArray: true });
    
    return new Promise((resolve, reject) => {
      parser.parseString(xmlData, (err, result) => {
        if (err) return reject(err);
        
        if (!result.feed || !result.feed.listing) {
          return reject(new Error('Invalid XML format: no feed/listing elements found'));
        }
        
        const listings = result.feed.listing.map(xmlListing => 
          this.convertListing(xmlListing)
        ).filter(listing => listing !== null);
        
        const metadata = {
          totalCount: listings.length,
          generatedAt: new Date().toISOString(),
          source: 'EstatyQ CRM',
          version: '1.0'
        };
        
        resolve({
          listings,
          metadata,
          stats: {
            total: result.feed.listing.length,
            converted: this.convertedCount,
            skipped: this.skippedCount,
            errors: this.validationErrors.length
          }
        });
      });
    });
  }
}

// ==================== MAIN ====================

async function main() {
  const args = process.argv.slice(2);
  const config = { ...DEFAULT_CONFIG };
  
  // Parse CLI arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--input') config.inputFile = args[++i];
    if (args[i] === '--mapping') config.mappingFile = args[++i];
    if (args[i] === '--output') config.outputFile = args[++i];
    if (args[i] === '--quiet') config.verbose = false;
  }
  
  try {
    if (config.verbose) console.log('📦 EstatyQ XML to JSON Converter\n');
    
    // Load mapping
    if (config.verbose) console.log(`📄 Loading mapping from: ${config.mappingFile}`);
    const mappingData = JSON.parse(fs.readFileSync(config.mappingFile, 'utf8'));
    
    // Load XML
    if (config.verbose) console.log(`📥 Reading XML from: ${config.inputFile}`);
    const xmlData = fs.readFileSync(config.inputFile, 'utf8');
    
    // Convert
    if (config.verbose) console.log('🔄 Converting XML to JSON...\n');
    const converter = new XMLToJSONConverter(mappingData);
    const result = await converter.convert(xmlData);
    
    // Save result
    if (config.verbose) console.log(`📤 Writing JSON to: ${config.outputFile}`);
    fs.writeFileSync(config.outputFile, JSON.stringify(result, null, 2));
    
    // Report
    console.log(`\n✅ Conversion completed!\n`);
    console.log(`📊 Statistics:`);
    console.log(`   Total processed:  ${result.stats.total}`);
    console.log(`   Successfully converted: ${result.stats.converted}`);
    console.log(`   Skipped: ${result.stats.skipped}`);
    console.log(`   Errors: ${result.stats.errors}\n`);
    
    if (result.stats.errors > 0) {
      console.log(`⚠️  Validation Errors:`);
      result.stats.errors > 0 && converter.validationErrors.forEach(err => {
        console.log(`   ${err.id}:`);
        err.errors.forEach(e => console.log(`     - ${e}`));
      });
    }
    
    console.log(`\n✨ Output: ${result.metadata.totalCount} valid listings saved`);
    console.log(`   File: ${config.outputFile}`);
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { XMLToJSONConverter, TRANSFORMS, CITY_MAPPING, DataValidator };
