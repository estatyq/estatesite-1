(function(){
  const grid = document.getElementById('grid');
  const errorBox = document.getElementById('error');
  const prevBtn = document.getElementById('prev-page');
  const nextBtn = document.getElementById('next-page');
  const pageInfo = document.getElementById('page-info');
  const foundCounter = document.getElementById('found-counter');
  
  // BUG-6 FIX: Add loading flag to prevent race conditions
  let isLoading = false;

  const el = {
    q: document.getElementById('f-q'),
    city: document.getElementById('f-city'),
    district: null,
    priceMin: document.getElementById('f-priceMin'),
    priceMax: document.getElementById('f-priceMax'),
    rooms: document.getElementById('f-rooms'),
    areaMin: document.getElementById('f-areaMin'),
    areaMax: document.getElementById('f-areaMax'),
    type: document.getElementById('f-type'),
    propertyType: document.getElementById('f-propertyType'),
    sort: document.getElementById('f-sort'),
    perPage: document.getElementById('f-perPage'),
    apply: document.getElementById('apply-filters'),
    reset: document.getElementById('reset-filters'),
    chips: document.getElementById('active-filters-chips'),
    chipsWrap: document.getElementById('active-filters')
  };

  function readState() {
    return URLState.parse(location.search);
  }

  function writeStateReplace() {
    URLState.replaceDebounced(getStateFromUI());
  }

  function writeStatePush() {
    URLState.push(getStateFromUI());
  }

  function getStateFromUI() {
    return {
      q: el.q.value.trim(),
      city: el.city.value,
      district: '',
      priceMin: el.priceMin.value,
      priceMax: el.priceMax.value,
      rooms: el.rooms.value,
      areaMin: el.areaMin.value,
      areaMax: el.areaMax.value,
      type: el.type.value,
      propertyType: el.propertyType.value,
      labels: '',
      sort: el.sort.value,
      page: readState().page || '1',
      perPage: el.perPage.value
    };
  }

  function setUIFromState(s) {
    el.q.value = s.q || '';
    el.city.value = s.city || '';
    el.priceMin.value = s.priceMin || '';
    el.priceMax.value = s.priceMax || '';
    el.rooms.value = s.rooms || '';
    el.areaMin.value = s.areaMin || '';
    el.areaMax.value = s.areaMax || '';
    el.type.value = s.type || '';
    el.propertyType.value = s.propertyType || '';
    el.sort.value = s.sort || 'date_desc';
    el.perPage.value = s.perPage || '20';
  }

  function onChangeReplace() {
    const next = getStateFromUI();
    next.page = '1'; // reset page on inline changes
    URLState.replaceDebounced(next);
  }

  function bindEvents() {
    ['q','city','priceMin','priceMax','rooms','areaMin','areaMax','type','propertyType','sort']
      .forEach(k => {
        const input = el[k];
        if (!input) return;
        input.addEventListener('input', onChangeReplace);
        input.addEventListener('change', onChangeReplace);
      });
    // perPage should push history to allow sharing "Показати N"
    if (el.perPage) {
      el.perPage.addEventListener('change', () => {
        const next = getStateFromUI();
        next.page = '1';
        URLState.push(next);
      });
    }
    el.apply.addEventListener('click', writeStatePush);
    el.reset.addEventListener('click', () => {
      // Clear URL entirely; defaults will be applied by parser
      URLState.clear();
    });
    window.addEventListener('popstate', () => {
      setUIFromState(readState());
      fetchAndRender();
    });
    window.addEventListener('catalog:urlstate', () => {
      setUIFromState(readState());
      fetchAndRender();
    });
    prevBtn.addEventListener('click', () => changePage(-1));
    nextBtn.addEventListener('click', () => changePage(1));
  }

  function changePage(delta) {
    const s = readState();
    const page = Math.max(1, (parseInt(s.page, 10) || 1) + delta);
    s.page = String(page);
    URLState.push(s);
    // Scroll to top of grid when paginating
    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function showSkeleton(count) {
    grid.setAttribute('aria-busy','true');
    grid.innerHTML = '';
    for (let i=0;i<count;i++) {
      const card = document.createElement('div');
      card.className = 'skeleton-card';
      card.innerHTML = `
        <div class="skeleton-image"></div>
        <div class="skeleton-content">
          <div class="skeleton-title skeleton-text"></div>
          <div class="skeleton-location skeleton-text"></div>
          <div class="skeleton-details">
            <div class="skeleton-detail-item"></div>
            <div class="skeleton-detail-item"></div>
            <div class="skeleton-detail-item"></div>
          </div>
          <div class="skeleton-price"></div>
          <div class="skeleton-buttons">
            <div class="skeleton-button"></div>
            <div class="skeleton-button"></div>
          </div>`;
      grid.appendChild(card);
    }
  }

  function renderChips(state) {
    const chips = [];
    function add(label, key) { chips.push({ label, key }); }
    if (state.city) add('Місто: ' + state.city, 'city');
    if (state.type) add('Угода: ' + state.type, 'type');
    if (state.propertyType) add('Тип: ' + state.propertyType, 'propertyType');
    if (state.rooms) add('Кімнат: ' + state.rooms, 'rooms');
    if (state.priceMin || state.priceMax) add(`Ціна: ${state.priceMin || 0}—${state.priceMax || '∞'}`, 'price');
    if (state.areaMin || state.areaMax) add(`Площа: ${state.areaMin || 0}—${state.areaMax || '∞'}`, 'area');
    if (state.q) add(`Пошук: "${state.q}"`, 'q');
    if (chips.length === 0) {
      el.chipsWrap.style.display = 'none';
      el.chips.innerHTML = '';
      return;
    }
    el.chipsWrap.style.display = 'block';
    el.chips.innerHTML = '';
    chips.forEach(c => {
      const n = document.createElement('div');
      n.className = 'active-filter-chip';
      n.innerHTML = `${c.label} <span class="remove">×</span>`;
      n.querySelector('.remove').addEventListener('click', () => removeChip(c.key));
      el.chips.appendChild(n);
    });
  }

  function removeChip(key) {
    const s = readState();
    if (key === 'price') { s.priceMin=''; s.priceMax=''; }
    else if (key === 'area') { s.areaMin=''; s.areaMax=''; }
    else { s[key] = ''; }
    s.page = '1';
    URLState.push(s);
  }

  function render(items, total, page, perPage) {
    grid.innerHTML = '';
    grid.setAttribute('aria-busy','false');
    errorBox.classList.remove('show');
    foundCounter.textContent = `Знайдено: ${total}`;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    pageInfo.textContent = `Сторінка ${page} з ${totalPages}`;
    prevBtn.disabled = page <= 1;
    nextBtn.disabled = page >= totalPages;

    if (!items || items.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.innerHTML = `
        <span class="empty-state-icon" aria-hidden="true">🔍</span>
        <div class="empty-state-title">Нічого не знайдено</div>
        <div class="empty-state-description">Змініть параметри фільтрів або скиньте їх</div>
        <div class="empty-state-actions">
          <button class="btn" id="reset-empty" aria-label="Скинути фільтри для нового пошуку">Скинути фільтри</button>
        </div>`;
      grid.appendChild(empty);
      const btn = empty.querySelector('#reset-empty');
      btn.addEventListener('click', () => URLState.push({ sort: 'date_desc', page: '1', perPage: String(readState().perPage || '20') }));
      return;
    }

    items.forEach((it, index) => {
      const card = document.createElement('div');
      card.className = 'property-card';
      const img = (it.photos && it.photos[0]) || 'https://via.placeholder.com/600x400?text=Немає+фото';
      const href = `listing.html?id=${encodeURIComponent(it.id)}`;
      
      // Generate proper image srcset for responsive images
      const imageSrcset = generateImageSrcset(img);
      const imageSizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
      
      card.innerHTML = `
        <div class="property-image" style="height:240px">
          <img 
            src="${img}" 
            ${imageSrcset ? `srcset="${imageSrcset}"` : ''}
            ${imageSrcset ? `sizes="${imageSizes}"` : ''}
            loading="lazy" 
            decoding="async"
            alt="${escapeHtml(it.title)} - ${it.city || 'нерухомість'}"
            aria-label="Фото нерухомості: ${escapeHtml(it.title)}"
          />
          <div class="property-badge" aria-hidden="true">${it.type === 'sale' ? 'Продаж' : (it.type === 'rent' ? 'Оренда' : 'Подобово')}</div>
        </div>
        <div class="property-content">
          <h3 class="property-title">${escapeHtml(it.title)}</h3>
          <p class="property-location">${escapeHtml(it.address || '')}${it.city ? (it.address ? ', ' : '') + escapeHtml(it.city) : ''}</p>
          <div class="property-details" role="list">
            ${it.rooms ? `<div class="detail-item" role="listitem"><div class="detail-item-value">${escapeHtml(String(it.rooms))}</div><div class="detail-item-label">Кімнат</div></div>` : ''}
            ${it.areaTotal ? `<div class="detail-item" role="listitem"><div class="detail-item-value">${Math.round(it.areaTotal)}</div><div class="detail-item-label">м²</div></div>` : ''}
            ${it.floor ? `<div class="detail-item" role="listitem"><div class="detail-item-value">${escapeHtml(String(it.floor))}${it.floorsTotal? ' / ' + escapeHtml(String(it.floorsTotal)): ''}</div><div class="detail-item-label">Поверх</div></div>` : ''}
          </div>
          <div class="property-price" aria-label="Ціна: ${escapeHtml(String(it.price))} ${it.currency === 'USD' ? 'доларів' : it.currency}">${it.currency === 'USD' ? '$' : ''}${Math.round(it.price)}${it.currency !== 'USD' ? ' ' + escapeHtml(it.currency) : ''}</div>
          <div class="property-action">
            <a class="btn-details" href="${href}" aria-label="Детали: ${escapeHtml(it.title)}">Детально</a>
          </div>
        </div>`;
      
      card.setAttribute('role', 'article');
      card.setAttribute('aria-label', `Нерухомість: ${escapeHtml(it.title)}, ${escapeHtml(it.city || '')} ${it.price}${it.currency === 'USD' ? '$' : ''}`);
      grid.appendChild(card);
    });
    
    // Update schema
    updateCatalogSchema(items, total, page, perPage);
  }

  // Helper: Generate srcset for responsive images
  function generateImageSrcset(url) {
    if (!url || url.includes('placeholder')) return '';
    try {
      const urlObj = new URL(url, window.location.href);
      // Only generate srcset for known image CDNs
      if (urlObj.hostname.includes('cloudinary') || urlObj.hostname.includes('imgix')) {
        return `${url}?w=400&q=75 400w, ${url}?w=600&q=75 600w, ${url}?w=800&q=75 800w`;
      }
    } catch (e) {
      return '';
    }
    return '';
  }

  // Helper: Escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Update JSON-LD schema for catalog
  function updateCatalogSchema(items, total, page, perPage) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Каталог нерухомості EstatyQ",
      "description": `Каталог з ${total} пропозицій нерухомості`,
      "url": window.location.href,
      "hasPart": {
        "@type": "ItemList",
        "name": "Пропозиції нерухомості",
        "itemListElement": items.map((item, idx) => ({
          "@type": "ListItem",
          "position": (page - 1) * perPage + idx + 1,
          "url": new URL(`listing.html?id=${encodeURIComponent(item.id)}`, window.location.origin).href,
          "name": item.title,
          "image": item.photos && item.photos[0] ? item.photos[0] : undefined,
          "description": `${item.address}, ${item.city || 'нерухомість'}`,
          "offers": {
            "@type": "Offer",
            "priceCurrency": item.currency || "USD",
            "price": item.price
          }
        })).filter(item => item.image !== undefined)
      }
    };
    
    let schemaScript = document.querySelector('script[data-catalog-schema]');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.setAttribute('data-catalog-schema', 'true');
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(schema);
  }

  function fetchAndRender() {
    // BUG-6 FIX: Prevent race conditions - don't allow simultaneous requests
    if (isLoading) return;
    
    isLoading = true;
    const s = readState();
    setUIFromState(s);
    renderChips(s);
    showSkeleton(8);
    const qs = URLState.stringify(s);
    return fetch(`/api/v2/listings?${qs}`, { headers: { 'Accept': 'application/json' } })
      .then(r => r.json())
      .then(data => {
        if (data && Array.isArray(data.items)) {
          render(data.items, data.total || 0, parseInt(s.page, 10) || 1, parseInt(s.perPage, 10) || 20);
        } else if (data && data.error) {
          throw new Error(data.error.message || 'Помилка запиту');
        } else {
          throw new Error('Некоректна відповідь API');
        }
      })
      .catch(e => {
        errorBox.textContent = e.message || 'Сталася помилка';
        errorBox.classList.add('show');
        grid.setAttribute('aria-busy','false');
        grid.innerHTML = '';
      })
      .finally(() => {
        // BUG-6 FIX: Release loading flag when request completes
        isLoading = false;
      });
  }

  // bootstrap
  const initial = readState();
  if (!initial.sort) initial.sort = 'date_desc';
  if (!initial.perPage) initial.perPage = '20';
  setUIFromState(initial);
  bindEvents();
  fetchAndRender();
})();


