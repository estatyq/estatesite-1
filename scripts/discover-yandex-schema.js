/*
  Discover all field paths present in Yandex Realty feeds (main + micro) and group them by deal/category.

  Env (data/.env): FEED_URL, MICRO_URL

  Output:
    data/schema.json  // union of paths with example values
*/

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const { XMLParser } = require('fast-xml-parser');
require('dotenv').config({ path: path.join(process.cwd(), 'data', '.env') });

function log(...args) { console.log('[schema]', ...args); }

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

function addExample(examples, key, value) {
  if (examples[key] !== undefined) return; // keep first
  if (typeof value === 'string' && value.length > 200) {
    examples[key] = value.slice(0, 200) + '…';
  } else {
    examples[key] = value;
  }
}

function walk(obj, base, pathsSet, examples) {
  if (obj == null) return;
  if (Array.isArray(obj)) {
    // For arrays, record the path itself and walk first element
    pathsSet.add(base);
    if (obj.length > 0) walk(obj[0], base, pathsSet, examples);
    return;
  }
  if (typeof obj !== 'object') {
    pathsSet.add(base);
    addExample(examples, base, obj);
    return;
  }
  for (const k of Object.keys(obj)) {
    const next = base ? base + '.' + k : k;
    walk(obj[k], next, pathsSet, examples);
  }
}

function toArray(x) { return Array.isArray(x) ? x : (x ? [x] : []); }

function writeJson(filePath, data) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

async function main() {
  const FEED_URL = process.env.FEED_URL;
  const MICRO_URL = process.env.MICRO_URL;
  if (!FEED_URL || !MICRO_URL) {
    throw new Error('Set FEED_URL and MICRO_URL in data/.env');
  }

  log('fetch main');
  const mainXml = await fetchXml(FEED_URL);
  const mainOffers = parseOffers(mainXml);
  log('main offers', mainOffers.length);

  log('fetch micro');
  const microXml = await fetchXml(MICRO_URL);
  const microOffers = parseOffers(microXml);
  log('micro offers', microOffers.length);

  const unionPaths = new Set();
  const unionExamples = {};
  const byDeal = {};            // deal (offer.type) -> set
  const byCategory = {};        // category -> set
  const byCategoryType = {};    // category|property-type -> set

  function ensure(map, key) {
    if (!map[key]) map[key] = { paths: new Set(), examples: {} };
    return map[key];
  }

  for (const off of mainOffers) {
    const root = { offer: off };
    walk(root, '', unionPaths, unionExamples);

    const deal = off?.type || 'UNKNOWN';
    const cat = off?.category || 'UNKNOWN';
    const ptype = off?.['property-type'] || 'UNKNOWN';
    const ckey = `${cat}|${ptype}`;

    const d = ensure(byDeal, deal);
    walk(root, '', d.paths, d.examples);

    const c = ensure(byCategory, cat);
    walk(root, '', c.paths, c.examples);

    const ct = ensure(byCategoryType, ckey);
    walk(root, '', ct.paths, ct.examples);
  }

  const microPaths = new Set();
  const microExamples = {};
  for (const off of microOffers) {
    const root = { offer: off };
    walk(root, '', microPaths, microExamples);
  }

  // Serialize Sets
  function ser(section) {
    const out = {};
    for (const key of Object.keys(section)) {
      out[key] = {
        paths: Array.from(section[key].paths).sort(),
        examples: section[key].examples
      };
    }
    return out;
  }

  const result = {
    main: {
      union: { paths: Array.from(unionPaths).sort(), examples: unionExamples },
      byDeal: ser(byDeal),
      byCategory: ser(byCategory),
      byCategoryType: ser(byCategoryType)
    },
    micro: {
      union: { paths: Array.from(microPaths).sort(), examples: microExamples }
    }
  };

  writeJson(path.join('data', 'schema.json'), result);
  log('wrote data/schema.json');
}

main().catch(err => { console.error(err); process.exit(1); });


