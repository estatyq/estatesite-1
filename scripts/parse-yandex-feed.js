/*
  Parse Yandex Realty XML feeds (main + microdistrict enrichment) → data/listings.json

  Env (data/.env):
    FEED_URL=...        // main feed
    MICRO_URL=...       // enrichment feed (bulk). If you have per-offer template, adapt code.

  Run:
    node scripts/parse-yandex-feed.js
*/

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const { XMLParser } = require('fast-xml-parser');
require('dotenv').config({ path: path.join(process.cwd(), 'data', '.env') });

function log(...args) { console.log('[yandex-xml]', ...args); }

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
  // If values look like large (>= 10000), assume full amount and convert to thousands
  if (v >= 10000) return Math.round(v / 1000);
  return v; // already thousands
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
  // Typical path: realty-feed.offer
  let offers = parsed?.['realty-feed']?.offer;
  if (!offers) {
    // Fallback: find first array of objects
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
  // In main feed: sub-locality-name is district (per user), district tag may be absent
  const cityName = loc?.['locality-name'] || null;
  const district = loc?.['sub-locality-name'] || null; // treat as district
  const regionName = loc?.region || null;
  const microdistrict = null; // enrich later

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
      microdistrict: microdistrict,
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
    const micro = loc?.['sub-locality-name'] || null; // per user: microdistrict in second feed
    const district = loc?.district || null;          // district if present
    if (micro || district) map.set(id, { microdistrict: micro || null, district: district || null });
  }
  return map;
}

async function main() {
  const FEED_URL = process.env.FEED_URL;
  const MICRO_URL = process.env.MICRO_URL;
  if (!FEED_URL || !MICRO_URL) {
    console.error('Set FEED_URL and MICRO_URL in data/.env');
    process.exit(1);
  }

  log('Fetching main feed...');
  const mainXml = await fetchXml(FEED_URL);
  const mainOffers = parseOffers(mainXml);
  log('Main offers:', mainOffers.length);

  log('Fetching micro feed...');
  const microXml = await fetchXml(MICRO_URL);
  const microOffers = parseOffers(microXml);
  log('Micro offers:', microOffers.length);

  const microMap = buildMicroMap(microOffers);

  const normalized = [];
  for (const off of mainOffers) {
    const rec = normalizeMainOffer(off);
    if (!rec.id || !rec.type || !rec.transactionType || !rec.price?.value || !rec.location?.city) continue;
    const m = microMap.get(rec.id);
    if (m) {
      // If main had only district in sub-locality, take micro from second
      rec.location.microdistrict = m.microdistrict || rec.location.microdistrict;
      // Prefer district from second if present
      rec.location.district = m.district || rec.location.district;
    }
    // Duplicate for current UI expectations
    // Top-level city key used by UI: cities[rec.city]
    rec.city = rec.location.city;
    // Top-level location string used by filters/chips in current UI
    rec.locationString = rec.location.microdistrict || rec.location.district || null;
    rec.location = rec.locationString; // maintain backward-compat for UI prop.location
    normalized.push(rec);
  }

  // Grouping report (per type/deal)
  const report = {};
  for (const r of normalized) {
    const key = `${r.type}/${r.transactionType}`;
    if (!report[key]) report[key] = { count: 0 };
    report[key].count++;
  }

  writeJson(path.join('data', 'listings.json'), normalized);
  writeJson(path.join('data', 'report.json'), report);
  log('Wrote data/listings.json', normalized.length);
}

main().catch(err => { console.error(err); process.exit(1); });


