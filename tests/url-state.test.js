const assert = (cond, msg) => { if (!cond) throw new Error(msg); };

// Load module
const URLState = require('../js/url-state.js');

function run(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (e) {
    console.error(`✗ ${name}: ${e.message}`);
    process.exitCode = 1;
  }
}

run('stringify omits empty fields and dedupes keys', () => {
  const qs = URLState.stringify({ q: 'центр', city: '', priceMin: '', labels: [] });
  assert(qs.includes('q=%D1%86%D0%B5%D0%BD%D1%82%D1%80'), 'q must be present');
  assert(!qs.includes('city='), 'city must be omitted');
  assert(!qs.includes('priceMin='), 'priceMin must be omitted');
  const occurrences = qs.split('q=').length - 1;
  assert(occurrences === 1, 'no duplicate q params');
});

run('labels arrays serialize as comma-separated and parse back', () => {
  const state = {
    labels: ['new', ' hot ', 'new', ''],
    sort: 'date_desc',
    page: '1',
    perPage: '20'
  };
  const qs = URLState.stringify(state);
  assert(qs.includes('labels=new,hot'), 'labels should be comma separated without spaces/duplicates');
  const parsed = URLState.parse('?' + qs);
  assert(Array.isArray(parsed.labels), 'labels parsed as array');
  assert(parsed.labels.length === 2 && parsed.labels.includes('new') && parsed.labels.includes('hot'), 'labels round-trip');
});

run('parse applies defaults for sort/page/perPage when missing', () => {
  const parsed = URLState.parse('?q=test');
  assert(parsed.sort === 'date_desc', 'default sort');
  assert(parsed.page === '1', 'default page');
  assert(parsed.perPage === '20', 'default perPage');
});

run('round-trip preserves key fields', () => {
  const s1 = {
    q: 'metro',
    city: 'kharkiv',
    priceMin: '100',
    priceMax: '500',
    rooms: '2',
    areaMin: '30',
    areaMax: '80',
    type: 'rent',
    propertyType: 'flat',
    sort: 'price_desc',
    page: '3',
    perPage: '50'
  };
  const qs = URLState.stringify(s1);
  const s2 = URLState.parse('?' + qs);
  ['q','city','priceMin','priceMax','rooms','areaMin','areaMax','type','propertyType','sort','page','perPage'].forEach(k => {
    assert(String(s1[k]) === String(s2[k]), `field ${k} should match`);
  });
});

if (process.exitCode) {
  console.error('Some tests failed');
  process.exit(process.exitCode);
} else {
  console.log('All URLState tests passed');
}


