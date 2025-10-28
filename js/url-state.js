(function(global){
  const DEBOUNCE_MS = 250;

  // Keys that should serialize as comma-separated lists
  const listKeys = new Set(['labels']);

  function normalizeValue(v) {
    if (v === undefined || v === null) return '';
    const s = String(v).trim();
    return s;
  }

  function parse(queryString) {
    const src = typeof queryString === 'string' ? queryString : (typeof location !== 'undefined' ? location.search : '');
    const p = new URLSearchParams(src);
    const get = (k) => p.get(k) || '';
    const num = (k) => {
      const v = p.get(k);
      return v === null ? '' : v;
    };
    // Parse list values
    const rawLabels = get('labels');
    const labels = rawLabels ? rawLabels.split(',').map(s => s.trim()).filter(Boolean) : [];
    return {
      q: get('q'),
      city: get('city'),
      district: get('district'),
      priceMin: num('priceMin'),
      priceMax: num('priceMax'),
      rooms: num('rooms'),
      areaMin: num('areaMin'),
      areaMax: num('areaMax'),
      type: get('type'),
      propertyType: get('propertyType'),
      labels,
      sort: get('sort') || 'date_desc',
      page: get('page') || '1',
      perPage: get('perPage') || '20',
      // BUG-09 FIX: Add displayedCount and view
      displayedCount: num('displayedCount') || '12',
      view: get('view') || 'grid'
    };
  }

  function stringify(state) {
    const p = new URLSearchParams();
    const add = (k, v) => {
      if (listKeys.has(k)) {
        // Arrays -> comma-separated, ensure no duplicates/empties
        const arr = Array.isArray(v) ? v : (typeof v === 'string' ? v.split(',') : []);
        const cleaned = Array.from(new Set(arr.map(normalizeValue).filter(Boolean)));
        if (cleaned.length > 0) p.set(k, cleaned.join(','));
        return;
      }
      const s = normalizeValue(v);
      if (s !== '') p.set(k, s);
    };
    add('q', state.q);
    add('city', state.city);
    add('district', state.district);
    add('priceMin', state.priceMin);
    add('priceMax', state.priceMax);
    add('rooms', state.rooms);
    add('areaMin', state.areaMin);
    add('areaMax', state.areaMax);
    add('type', state.type);
    add('propertyType', state.propertyType);
    add('labels', state.labels);
    add('sort', state.sort || 'date_desc');
    add('page', state.page || '1');
    add('perPage', state.perPage || '20');
    // BUG-09 FIX: Add displayedCount and view
    add('displayedCount', state.displayedCount || '12');
    add('view', state.view || 'grid');
    return p.toString();
  }

  let _timer = null;
  function replaceDebounced(state) {
    clearTimeout(_timer);
    _timer = setTimeout(() => {
      const qs = stringify(state);
      if (typeof history !== 'undefined' && typeof location !== 'undefined') {
        history.replaceState(null, '', `${location.pathname}${qs ? '?' + qs : ''}`);
      }
      if (global && typeof global.dispatchEvent === 'function') {
        global.dispatchEvent(new Event('catalog:urlstate'));
      }
    }, DEBOUNCE_MS);
  }

  function push(state) {
    const qs = stringify(state);
    if (typeof history !== 'undefined' && typeof location !== 'undefined') {
      history.pushState(null, '', `${location.pathname}${qs ? '?' + qs : ''}`);
    }
    if (global && typeof global.dispatchEvent === 'function') {
      global.dispatchEvent(new Event('catalog:urlstate'));
    }
  }

  function clear() {
    if (typeof history !== 'undefined' && typeof location !== 'undefined') {
      history.pushState(null, '', `${location.pathname}`);
    }
    if (global && typeof global.dispatchEvent === 'function') {
      global.dispatchEvent(new Event('catalog:urlstate'));
    }
  }

  const api = { parse, stringify, replaceDebounced, push, clear };
  global.URLState = api;
  // Node/CommonJS export for tests
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);


