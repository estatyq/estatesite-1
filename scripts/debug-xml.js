const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const axios = require('axios');
const { parseString } = require('xml2js');

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
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    envVars[key] = value;
  }
});

async function debugXML() {
  try {
    const xmlUrl = envVars.URLXML;
    
    if (!xmlUrl) {
      console.error('❌ URLXML not found in data/.env');
      return;
    }
    
    console.log(`📥 Fetching XML from: ${xmlUrl}`);
    const response = await axios.get(xmlUrl, { timeout: 30000 });
    console.log(`✅ XML fetched (${response.data.length} bytes)`);
    
    // Parse XML
    parseString(response.data, { 
      mergeAttrs: true,
      normalize: true,
      trim: true,
      explicitArray: false
    }, (err, result) => {
      if (err) {
        console.error('❌ Parse error:', err.message);
        return;
      }
      
      console.log('\n📊 XML Root Keys:');
      console.log(Object.keys(result));
      
      // Show structure
      const root = result[Object.keys(result)[0]];
      console.log('\n📊 Root Level Keys:');
      console.log(Object.keys(root || {}));
      
      if (root?.shop) {
        console.log('\n📊 Shop Keys:');
        console.log(Object.keys(root.shop || {}));
        
        if (root.shop?.offers) {
          console.log('\n📊 Offers Keys:');
          console.log(Object.keys(root.shop.offers || {}));
          
          const offers = root.shop.offers.offer;
          if (offers) {
            const offerArray = Array.isArray(offers) ? offers : [offers];
            console.log(`\n📊 Total Offers: ${offerArray.length}`);
            
            if (offerArray.length > 0) {
              console.log('\n📊 First Offer Keys:');
              console.log(Object.keys(offerArray[0] || {}));
              
              console.log('\n📊 First Offer Data:');
              console.log(JSON.stringify(offerArray[0], null, 2).substring(0, 500));
            }
          } else {
            console.log('\n⚠️  No offers found');
          }
        } else {
          console.log('\n⚠️  No shop.offers');
        }
      } else {
        console.log('\n⚠️  No shop structure');
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugXML();
