/**
 * Real-time Yandex Feed Importer
 * 
 * Периодичний імпорт нерухомості з Яндекс.Нерухомості
 * 
 * Env (data/.env):
 *   FEED_URL=...        // основна лента
 *   MICRO_URL=...       // мікрорайони (збагачення)
 *   IMPORT_INTERVAL=...  // інтервал в хвилинах (за замовчуванням 60)
 * 
 * Run: node scripts/realtime-yandex-importer.js
 */

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const { XMLParser } = require('fast-xml-parser');
require('dotenv').config({ path: path.join(process.cwd(), 'data', '.env') });

function log(...args) { 
  const ts = new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' });
  console.log(`[${ts}]`, ...args); 
}

function writeJson(filePath, data) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function toNumber(val) {
  if (val == null) return null;
  if (typeof val === 'number') return val;
  const n = parseFloat(String(val).replace(/[^0-9.\-]/g, ''));
  return Number.isFinite(n) ? n : null;
}

function cityToKey(name) {
  if (!name) return null;
  const s = String(name).toLowerCase().trim();
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

function typeMap(rawCategory, rawPropType) {
  const s = [rawCategory, rawPropType].filter(Boolean).map(x => String(x).toLowerCase()).join(' ');
  if (/квартир|apartment/.test(s)) return 'apartment';
  if (/дом|house|коттедж/.test(s)) return 'house';
  if (/офис|office/.test(s)) return 'office';
  if (/коммер|free purpose|магазин|торгов/.test(s)) return 'commercial';
  if (/земл|участок|land/.test(s)) return 'land';
  if (/склад|warehouse|производ/.test(s)) return 'warehouse';
  return null;
}

function dealMap(rawType, maybeTextBlob) {
  const s = [rawType, maybeTextBlob].filter(Boolean).map(x => String(x).toLowerCase()).join(' ');
  if (/продажа|sale/.test(s)) return 'sale';
  if (/аренда|rent/.test(s)) return 'rent';
  if (/подобов|посуточ|daily/.test(s)) return 'daily';
  return null;
}

function ensureThousands(priceValue, currency) {
  const v = toNumber(priceValue);
  if (v == null) return null;
  if (v >= 10000) return Math.round(v / 1000);
  return v;
}

function getArray(x) { return Array.isArray(x) ? x : (x ? [x] : []); }

async function fetchXml(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed ${res.status} ${res.statusText}`);
  return await res.text();
}

function parseOffers(xmlText) {
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
  const parsed = parser.parse(xmlText);
  let offers = parsed?.['realty-feed']?.offer;
  if (!offers) {
    const queue = [parsed];
    while (queue.length) {
      const cur = queue.shift();
      if (Array.isArray(cur) && cur.length && typeof cur[0] === 'object') { offers = cur; break; }
      if (cur && typeof cur === 'object') for (const k of Object.keys(cur)) queue.push(cur[k]);
    }
  }
  return Array.isArray(offers) ? offers : [];
}

function pickFirstImage(images) {
  const arr = getArray(images);
  return arr.length ? arr[0] : null;
}

function normalizeMainOffer(off) {
  const internalId = off?.['internal-id'] != null ? String(off['internal-id']) : null;
  const url = off?.url || null;
  const category = off?.category || null;
  const propType = off?.['property-type'] || null;
  const rawType = off?.type || null;
  const textBlob = [category, propType, rawType, off?.name].filter(Boolean).join(' ');
  const t = typeMap(category, propType);
  const deal = dealMap(rawType, textBlob);
  const priceVal = off?.price?.value;
  const priceCur = off?.price?.currency || 'USD';
  const areaVal = off?.area?.value ?? off?.['living-space']?.value ?? off?.['lot-area']?.value;
  const images = getArray(off?.image);
  const loc = off?.location || {};
  const cityName = loc?.['locality-name'] || null;
  const district = loc?.['sub-locality-name'] || null;
  const regionName = loc?.region || null;

  return {
    id: internalId || (url ? url.split('/').pop()?.replace(/\..*$/, '') : null),
    url: url || null,
    title: off?.name || off?.title || null,
    type: t,
    transactionType: deal,
    price: { value: ensureThousands(priceVal, priceCur), currency: priceCur || 'USD' },
    area: { total: toNumber(areaVal) },
    rooms: toNumber(off?.rooms) || null,
    floor: toNumber(off?.floor) || null,
    floorsTotal: toNumber(off?.['floors-total']) || null,
    yearBuilt: toNumber(off?.builtyear || off?.year) || null,
    images: images,
    image: pickFirstImage(images),
    location: {
      country: loc?.country || 'Україна',
      region: regionName || null,
      city: cityToKey(cityName),
      district: district || null,
      microdistrict: null,
      address: off?.address || null
    },
    geo: {
      lat: toNumber(loc?.latitude || off?.latitude),
      lng: toNumber(loc?.longitude || off?.longitude)
    },
    amenities: {
      balcony: null,
      parking: null,
      metro: off?.metro || null
    },
    raw: { category, propType, rawType }
  };
}

function buildMicroMap(microOffers) {
  const map = new Map();
  for (const off of microOffers) {
    const id = off?.['internal-id'] != null ? String(off['internal-id']) : null;
    if (!id) continue;
    const loc = off?.location || {};
    const micro = loc?.['sub-locality-name'] || null;
    const district = loc?.district || null;
    if (micro || district) map.set(id, { microdistrict: micro || null, district: district || null });
  }
  return map;
}

async function importFeed() {
  const FEED_URL = process.env.FEED_URL;
  const MICRO_URL = process.env.MICRO_URL;

  if (!FEED_URL || !MICRO_URL) {
    log('❌ ПОМИЛКА: Set FEED_URL and MICRO_URL in data/.env');
    return { success: false, error: 'Missing env vars' };
  }

  try {
    log('📡 Завантаження основної ленти...');
    const mainXml = await fetchXml(FEED_URL);
    const mainOffers = parseOffers(mainXml);
    log(`✅ Основна лента: ${mainOffers.length} пропозицій`);

    log('📡 Завантаження ленти мікрорайонів...');
    const microXml = await fetchXml(MICRO_URL);
    const microOffers = parseOffers(microXml);
    log(`✅ Лента мікрорайонів: ${microOffers.length} пропозицій`);

    const microMap = buildMicroMap(microOffers);

    const normalized = [];
    let skipped = 0;

    for (const off of mainOffers) {
      const rec = normalizeMainOffer(off);
      
      // Фільтри якості
      if (!rec.id || !rec.type || !rec.transactionType || !rec.price?.value || !rec.location?.city) {
        skipped++;
        continue;
      }

      const m = microMap.get(rec.id);
      if (m) {
        rec.location.microdistrict = m.microdistrict || rec.location.microdistrict;
        rec.location.district = m.district || rec.location.district;
      }

      rec.city = rec.location.city;
      rec.locationString = rec.location.microdistrict || rec.location.district || null;
      rec.location = rec.locationString;
      normalized.push(rec);
    }

    // Статистика
    const report = {};
    for (const r of normalized) {
      const key = `${r.type}/${r.transactionType}`;
      if (!report[key]) report[key] = { count: 0 };
      report[key].count++;
    }

    // Збереження
    writeJson(path.join('data', 'listings.json'), normalized);
    writeJson(path.join('data', 'report.json'), report);

    log(`✅ Імпорт завершено: ${normalized.length} об'єктів, пропущено: ${skipped}`);
    log(`📊 Статистика: ${JSON.stringify(report)}`);

    return { success: true, count: normalized.length, skipped, report };
  } catch (err) {
    log(`❌ ПОМИЛКА: ${err.message}`);
    return { success: false, error: err.message };
  }
}

// === PERIODIC IMPORT ===

async function startImporter() {
  const INTERVAL = (parseInt(process.env.IMPORT_INTERVAL) || 60) * 60 * 1000; // хвилини → мс

  log('🚀 Запуск імпортера Яндекс нерухомості');
  log(`📋 Інтервал оновлення: ${INTERVAL / 60000} хвилин`);

  // Перший імпорт відразу
  await importFeed();

  // Подальші імпорти по розкладу
  setInterval(async () => {
    log('⏰ Час планового оновлення');
    await importFeed();
  }, INTERVAL);
}

startImporter().catch(err => {
  log(`❌ КРИТИЧНА ПОМИЛКА: ${err.message}`);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  log('🛑 Завершення роботи...');
  process.exit(0);
});
