# 🎯 ТЕХНІЧНЕ ЗАВДАННЯ: Карусель фото в карточках та детальна сторінка

**Дата:** 28 жовтня 2025  
**Приоритет:** 🔴 ВИСОКИЙ  
**Час виконання:** 6-8 годин  
**Статус:** 📋 ГОТОВО ДО РЕАЛІЗАЦІЇ

---

## 📌 МЕТА

Реалізувати карусель фото для кожної карточки об'єкта нерухомості та створити повноцінну детальну сторінку з галереєю, відео та мапою.

### Основні цілі:

1. ✅ **Усунути баг:** Клік по фото НЕ повинен скролити сторінку вниз
2. ✅ **Додати карусель:** Кожна карточка має навігацію по фото (Prev/Next, крапки-індикатори)
3. ✅ **Детальна сторінка:** Клік по карточці відкриває повну інформацію в новій вкладці
4. ✅ **UX/A11y:** Доступність, клавіатура, touch-жести, SEO

---

## 🎨 ДИЗАЙН ТА ПОВЕДІНКА

### Карусель у карточці:

```
┌──────────────────────────────────────┐
│  ◀  [Фото 1 з 5]  ▶                 │  ← Кнопки Prev/Next
│                                      │
│  [      Зображення об'єкта      ]   │  ← Головне фото
│                                      │
│  ● ○ ○ ○ ○              1/5         │  ← Крапки + лічильник
└──────────────────────────────────────┘
   Назва об'єкта
   📍 Адреса, Місто
   2 кімнати • 45 м² • 5 поверх
   ₴8 000 /міс
   [Детально]  [♡]
```

### Детальна сторінка:

```
┌────────────────────────────────────────────────┐
│  [Назад до каталогу]  [Поділитися]            │
│                                                 │
│  ┌─────────────────────────────────────────┐  │
│  │  Головна галерея з thumbnails           │  │
│  └─────────────────────────────────────────┘  │
│                                                 │
│  Назва об'єкта             ₴8 000 /міс         │
│  📍 Адреса, Місто, Район                       │
│                                                 │
│  2 кімнати  •  45 м²  •  5/9 поверх            │
│                                                 │
│  📹 Відео (якщо є)                              │
│  🗺️ Мапа (якщо є координати)                  │
│                                                 │
│  📋 Повний опис та характеристики              │
└────────────────────────────────────────────────┘
```

---

## 📂 ФАЙЛИ ДЛЯ МОДИФІКАЦІЇ

### Обов'язкові зміни:

| Файл | Що змінити |
|------|-----------|
| `js/script.js` | Додати карусель в рендер карточок |
| `css/styles.css` | Стилі для каруселі та детальної сторінки |
| `pages/listing.html` | Розширити функціонал детальної сторінки |

### Опційні:

| Файл | Призначення |
|------|-------------|
| `js/carousel.js` | Окремий модуль для каруселі (якщо потрібна реюзабельність) |
| `js/listing.js` | Логіка детальної сторінки (замість inline script) |

---

## 🔧 ТЕХНІЧНА СПЕЦИФІКАЦІЯ

### ЧАСТИНА 1: Карусель у карточці

#### 1.1. Структура HTML (замість простого `<img>`)

```html
<div class="property-image">
  <!-- Карусель контейнер -->
  <div class="photo-carousel" data-property-id="123">
    <!-- Головне зображення -->
    <img 
      class="carousel-image" 
      src="photo1.jpg" 
      srcset="photo1.jpg 400w, photo1-800.jpg 800w"
      sizes="(max-width: 768px) 100vw, 400px"
      alt="Квартира в Києві"
      loading="lazy"
      decoding="async"
    >
    
    <!-- Навігація (показувати тільки якщо photos.length > 1) -->
    <button 
      class="carousel-btn carousel-prev" 
      type="button"
      aria-label="Попереднє фото"
      onclick="event.stopPropagation(); prevPhoto(this)"
    >
      ◀
    </button>
    
    <button 
      class="carousel-btn carousel-next" 
      type="button"
      aria-label="Наступне фото"
      onclick="event.stopPropagation(); nextPhoto(this)"
    >
      ▶
    </button>
    
    <!-- Індикатори знизу -->
    <div class="carousel-indicators" role="tablist">
      <button 
        class="carousel-dot active" 
        type="button"
        role="tab"
        aria-selected="true"
        aria-label="Фото 1"
        onclick="event.stopPropagation(); goToPhoto(this, 0)"
      ></button>
      <button 
        class="carousel-dot" 
        type="button"
        role="tab"
        aria-selected="false"
        aria-label="Фото 2"
        onclick="event.stopPropagation(); goToPhoto(this, 1)"
      ></button>
      <!-- ... інші крапки -->
    </div>
    
    <!-- Лічильник -->
    <div class="carousel-counter">1/5</div>
  </div>
  
  <!-- Існуючі бейджі -->
  <div class="property-badge">Продаж</div>
  <div class="property-status">2025 р.</div>
</div>
```

#### 1.2. CSS для каруселі

```css
/* Контейнер каруселі */
.photo-carousel {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Головне зображення */
.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

/* Кнопки навігації */
.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  z-index: 10;
}

.carousel-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

.carousel-btn:focus-visible {
  outline: 2px solid #d4af37;
  outline-offset: 2px;
}

.carousel-prev {
  left: 10px;
}

.carousel-next {
  right: 10px;
}

/* Приховати кнопки якщо тільки 1 фото */
.photo-carousel[data-photo-count="1"] .carousel-btn {
  display: none;
}

/* Індикатори (крапки) */
.carousel-indicators {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
}

.carousel-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s;
}

.carousel-dot:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: scale(1.2);
}

.carousel-dot.active {
  background: #d4af37;
  width: 24px;
  border-radius: 4px;
}

.carousel-dot:focus-visible {
  outline: 2px solid #d4af37;
  outline-offset: 2px;
}

/* Лічильник */
.carousel-counter {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  z-index: 10;
}

/* Приховати індикатори якщо 1 фото */
.photo-carousel[data-photo-count="1"] .carousel-indicators,
.photo-carousel[data-photo-count="1"] .carousel-counter {
  display: none;
}
```

#### 1.3. JavaScript для каруселі

```javascript
// Зберігаємо стан кожної каруселі
const carouselStates = new WeakMap();

// Ініціалізація каруселі для карточки
function initCarousel(carouselElement, photos) {
  if (!photos || photos.length === 0) {
    photos = ['https://via.placeholder.com/400x300?text=No+Photo'];
  }
  
  // Зберегти стан
  carouselStates.set(carouselElement, {
    photos: photos,
    currentIndex: 0
  });
  
  // Встановити data-атрибут для CSS
  carouselElement.setAttribute('data-photo-count', photos.length);
  
  // Оновити зображення
  updateCarouselImage(carouselElement);
  
  // Touch events для мобільних
  let touchStartX = 0;
  let touchEndX = 0;
  
  carouselElement.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  carouselElement.addEventListener('touchend', (e) => {
    e.stopPropagation();
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe(carouselElement, touchStartX, touchEndX);
  });
  
  // Keyboard navigation
  carouselElement.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      e.stopPropagation();
      prevPhoto(carouselElement);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      e.stopPropagation();
      nextPhoto(carouselElement);
    }
  });
}

// Функції навігації
function prevPhoto(btnOrCarousel) {
  const carousel = btnOrCarousel.closest('.photo-carousel') || btnOrCarousel;
  const state = carouselStates.get(carousel);
  if (!state) return;
  
  state.currentIndex = (state.currentIndex - 1 + state.photos.length) % state.photos.length;
  updateCarouselImage(carousel);
}

function nextPhoto(btnOrCarousel) {
  const carousel = btnOrCarousel.closest('.photo-carousel') || btnOrCarousel;
  const state = carouselStates.get(carousel);
  if (!state) return;
  
  state.currentIndex = (state.currentIndex + 1) % state.photos.length;
  updateCarouselImage(carousel);
}

function goToPhoto(btn, index) {
  const carousel = btn.closest('.photo-carousel');
  const state = carouselStates.get(carousel);
  if (!state) return;
  
  state.currentIndex = index;
  updateCarouselImage(carousel);
}

// Оновлення зображення та індикаторів
function updateCarouselImage(carousel) {
  const state = carouselStates.get(carousel);
  if (!state) return;
  
  const img = carousel.querySelector('.carousel-image');
  const counter = carousel.querySelector('.carousel-counter');
  const dots = carousel.querySelectorAll('.carousel-dot');
  
  // Оновити зображення
  img.src = state.photos[state.currentIndex];
  
  // Оновити лічильник
  if (counter) {
    counter.textContent = `${state.currentIndex + 1}/${state.photos.length}`;
  }
  
  // Оновити крапки
  dots.forEach((dot, idx) => {
    if (idx === state.currentIndex) {
      dot.classList.add('active');
      dot.setAttribute('aria-selected', 'true');
    } else {
      dot.classList.remove('active');
      dot.setAttribute('aria-selected', 'false');
    }
  });
}

// Обробка свайпу
function handleSwipe(carousel, startX, endX) {
  const diff = startX - endX;
  const threshold = 50; // мінімальна дистанція для свайпу
  
  if (Math.abs(diff) > threshold) {
    if (diff > 0) {
      // Свайп вліво → наступне фото
      nextPhoto(carousel);
    } else {
      // Свайп вправо → попереднє фото
      prevPhoto(carousel);
    }
  }
}

// Lazy initialization з IntersectionObserver
function initCarouselsOnVisible() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const carousel = entry.target;
        const propertyId = carousel.dataset.propertyId;
        const property = allProperties.find(p => p.id === propertyId);
        
        if (property && !carouselStates.has(carousel)) {
          initCarousel(carousel, property.photos || property.images);
        }
        
        // Відключити спостереження після ініціалізації
        observer.unobserve(carousel);
      }
    });
  }, {
    rootMargin: '50px' // Завантажувати трохи заздалегідь
  });
  
  // Спостерігати за всіма каруселями
  document.querySelectorAll('.photo-carousel').forEach(carousel => {
    observer.observe(carousel);
  });
}
```

---

### ЧАСТИНА 2: Клік по карточці → Детальна сторінка

#### 2.1. Модифікація рендеру карточки

```javascript
// В renderProperties() для grid view:

// БУЛО:
card.innerHTML = `...`;

// СТАЛО:
card.innerHTML = `
  <div class="property-image">
    ${renderCarousel(prop)}
  </div>
  <div class="property-content">
    ...
  </div>
`;

// Додати клік по карточці (НЕ по контролах каруселі)
card.addEventListener('click', (e) => {
  // Перевірити що клік НЕ по контролах
  if (e.target.closest('.carousel-btn') || 
      e.target.closest('.carousel-dot') ||
      e.target.closest('.btn-like')) {
    return; // Не відкривати деталку
  }
  
  // Відкрити детальну сторінку в новій вкладці
  window.open(`pages/listing.html?id=${prop.id}`, '_blank');
});

// Функція рендеру каруселі
function renderCarousel(prop) {
  const photos = prop.photos || prop.images || [];
  const hasPhotos = photos.length > 0;
  const photoCount = photos.length;
  
  if (!hasPhotos) {
    return `<img src="https://via.placeholder.com/400x300?text=No+Photo" alt="Без фото" loading="lazy">`;
  }
  
  // Рендер крапок-індикаторів
  const dots = photos.map((photo, idx) => `
    <button 
      class="carousel-dot ${idx === 0 ? 'active' : ''}" 
      type="button"
      role="tab"
      aria-selected="${idx === 0 ? 'true' : 'false'}"
      aria-label="Фото ${idx + 1}"
      onclick="event.stopPropagation(); goToPhoto(this, ${idx})"
    ></button>
  `).join('');
  
  return `
    <div class="photo-carousel" data-property-id="${prop.id}" data-photo-count="${photoCount}">
      <img 
        class="carousel-image" 
        src="${photos[0]}" 
        alt="${prop.title}"
        loading="lazy"
        decoding="async"
        onerror="this.src='https://via.placeholder.com/400x300?text=Error'"
      >
      
      ${photoCount > 1 ? `
        <button 
          class="carousel-btn carousel-prev" 
          type="button"
          aria-label="Попереднє фото"
          onclick="event.stopPropagation(); prevPhoto(this)"
        >◀</button>
        
        <button 
          class="carousel-btn carousel-next" 
          type="button"
          aria-label="Наступне фото"
          onclick="event.stopPropagation(); nextPhoto(this)"
        >▶</button>
        
        <div class="carousel-indicators" role="tablist">
          ${dots}
        </div>
        
        <div class="carousel-counter">1/${photoCount}</div>
      ` : ''}
    </div>
  `;
}
```

---

### ЧАСТИНА 3: Детальна сторінка

#### 3.1. Структура `pages/listing.html`

```html
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title id="page-title">Оголошення — EstatyQ</title>
    <link rel="icon" href="../assets/images/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="../css/styles.css">
    
    <!-- Leaflet для мапи -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
</head>
<body>
    <!-- Навігація -->
    <nav class="navbar">
        <!-- ... стандартна навігація ... -->
    </nav>

    <main id="listing-main" class="listing-detail container">
        <!-- Кнопки дій -->
        <div class="listing-actions">
            <a href="../index.html" class="btn btn-secondary">
                ← Назад до каталогу
            </a>
            <button class="btn btn-secondary" onclick="shareLink()">
                🔗 Поділитися
            </button>
        </div>

        <!-- Завантаження (skeleton) -->
        <div id="skeleton" class="listing-skeleton">
            <div class="skeleton-gallery"></div>
            <div class="skeleton-info"></div>
        </div>

        <!-- Основний контент (заповниться JS) -->
        <article id="listing-content" style="display: none;">
            <!-- Галерея -->
            <div class="listing-gallery">
                <div class="main-photo-carousel">
                    <!-- Головне фото з навігацією -->
                </div>
                <div class="photo-thumbnails">
                    <!-- Мініатюри -->
                </div>
            </div>

            <!-- Інформація -->
            <div class="listing-info">
                <h1 id="listing-title"></h1>
                <div id="listing-price" class="listing-price"></div>
                <div id="listing-location" class="listing-location"></div>
                <div id="listing-details" class="listing-details"></div>
            </div>

            <!-- Відео (якщо є) -->
            <div id="listing-video" class="listing-video" style="display: none;">
                <h3>📹 Відео огляд</h3>
                <div id="video-container"></div>
            </div>

            <!-- Мапа (якщо є координати) -->
            <div id="listing-map" class="listing-map" style="display: none;">
                <h3>🗺️ Місцезнаходження</h3>
                <div id="map-container" style="height: 400px;"></div>
            </div>

            <!-- Повний опис -->
            <div id="listing-description" class="listing-description"></div>
        </article>

        <!-- Помилка -->
        <div id="error-message" class="error-message" style="display: none;"></div>
    </main>

    <footer class="footer">
        <!-- ... стандартний footer ... -->
    </footer>

    <script src="../js/listing.js"></script>
</body>
</html>
```

#### 3.2. JavaScript для детальної сторінки (`js/listing.js`)

```javascript
(async function() {
  // Отримати ID з URL
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  
  const skeleton = document.getElementById('skeleton');
  const content = document.getElementById('listing-content');
  const errorEl = document.getElementById('error-message');
  
  if (!id) {
    showError('Не передано ідентифікатор оголошення');
    return;
  }
  
  try {
    // Завантажити дані
    const response = await fetch(`/api/v2/listings?id=${encodeURIComponent(id)}&perPage=1`);
    const data = await response.json();
    const item = data?.items?.[0];
    
    if (!item) {
      showError('Оголошення не знайдено');
      return;
    }
    
    // Рендер даних
    renderListing(item);
    
    // Приховати skeleton, показати контент
    skeleton.style.display = 'none';
    content.style.display = 'block';
    
  } catch (error) {
    console.error('Помилка завантаження:', error);
    showError('Помилка завантаження оголошення');
  }
  
  function showError(message) {
    skeleton.style.display = 'none';
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }
  
  function renderListing(item) {
    // Заголовок сторінки
    document.getElementById('page-title').textContent = `${item.title} — EstatyQ`;
    document.getElementById('listing-title').textContent = item.title;
    
    // Ціна
    const priceEl = document.getElementById('listing-price');
    const currency = item.currency === 'USD' ? '$' : item.currency;
    const priceText = `${currency}${Math.round(item.price).toLocaleString('uk-UA')}`;
    const suffix = item.type === 'rent' ? ' /міс' : '';
    priceEl.textContent = priceText + suffix;
    
    // Адреса
    const locationEl = document.getElementById('listing-location');
    locationEl.innerHTML = `📍 ${item.address || ''}${item.city ? ', ' + item.city : ''}`;
    
    // Деталі
    const detailsEl = document.getElementById('listing-details');
    detailsEl.innerHTML = `
      ${item.rooms ? `<div class="detail-item"><strong>${item.rooms}</strong> кімнат</div>` : ''}
      ${item.areaTotal ? `<div class="detail-item"><strong>${Math.round(item.areaTotal)}</strong> м²</div>` : ''}
      ${item.floor ? `<div class="detail-item"><strong>${item.floor}${item.floorsTotal ? '/' + item.floorsTotal : ''}</strong> поверх</div>` : ''}
    `;
    
    // Галерея
    renderGallery(item.photos || item.images || []);
    
    // Відео (якщо є)
    if (item.videoUrl) {
      renderVideo(item.videoUrl);
    }
    
    // Мапа (якщо є координати)
    if (item.lat && item.lng) {
      renderMap(item.lat, item.lng, item.title);
    }
    
    // SEO: JSON-LD
    addJsonLD(item);
  }
  
  function renderGallery(photos) {
    if (!photos || photos.length === 0) {
      photos = ['https://via.placeholder.com/960x540?text=No+Photo'];
    }
    
    const gallery = document.querySelector('.listing-gallery');
    const mainCarousel = gallery.querySelector('.main-photo-carousel');
    const thumbnails = gallery.querySelector('.photo-thumbnails');
    
    // Головне фото з каруселлю
    mainCarousel.innerHTML = `
      <div class="photo-carousel-large" data-photo-count="${photos.length}">
        <img class="carousel-image" src="${photos[0]}" alt="Головне фото">
        ${photos.length > 1 ? `
          <button class="carousel-btn carousel-prev" onclick="prevMainPhoto()">◀</button>
          <button class="carousel-btn carousel-next" onclick="nextMainPhoto()">▶</button>
          <div class="carousel-counter">1/${photos.length}</div>
        ` : ''}
      </div>
    `;
    
    // Thumbnails
    if (photos.length > 1) {
      thumbnails.innerHTML = photos.map((photo, idx) => `
        <img 
          class="thumbnail ${idx === 0 ? 'active' : ''}" 
          src="${photo}" 
          alt="Мініатюра ${idx + 1}"
          loading="lazy"
          onclick="goToMainPhoto(${idx})"
        >
      `).join('');
    }
    
    // Ініціалізувати стан
    window.mainGalleryState = {
      photos: photos,
      currentIndex: 0
    };
  }
  
  function renderVideo(videoUrl) {
    const videoSection = document.getElementById('listing-video');
    const container = document.getElementById('video-container');
    
    // YouTube
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      const videoId = extractYouTubeId(videoUrl);
      container.innerHTML = `
        <iframe 
          width="100%" 
          height="400" 
          src="https://www.youtube.com/embed/${videoId}" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen
        ></iframe>
      `;
    } else {
      // Прямий MP4
      container.innerHTML = `
        <video controls width="100%" height="400">
          <source src="${videoUrl}" type="video/mp4">
          Ваш браузер не підтримує відео.
        </video>
      `;
    }
    
    videoSection.style.display = 'block';
  }
  
  function renderMap(lat, lng, title) {
    const mapSection = document.getElementById('listing-map');
    const container = document.getElementById('map-container');
    
    mapSection.style.display = 'block';
    
    // Leaflet map
    const map = L.map('map-container').setView([lat, lng], 15);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);
    
    L.marker([lat, lng])
      .addTo(map)
      .bindPopup(title)
      .openPopup();
  }
  
  function extractYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }
  
  function addJsonLD(item) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': item.title,
      'image': item.photos || item.images,
      'description': item.address || '',
      'offers': {
        '@type': 'Offer',
        'priceCurrency': item.currency || 'USD',
        'price': item.price || 0,
        'availability': 'https://schema.org/InStock'
      }
    });
    document.head.appendChild(script);
  }
})();

// Глобальні функції для навігації по галереї
function prevMainPhoto() {
  const state = window.mainGalleryState;
  state.currentIndex = (state.currentIndex - 1 + state.photos.length) % state.photos.length;
  updateMainGallery();
}

function nextMainPhoto() {
  const state = window.mainGalleryState;
  state.currentIndex = (state.currentIndex + 1) % state.photos.length;
  updateMainGallery();
}

function goToMainPhoto(index) {
  window.mainGalleryState.currentIndex = index;
  updateMainGallery();
}

function updateMainGallery() {
  const state = window.mainGalleryState;
  const img = document.querySelector('.carousel-image');
  const counter = document.querySelector('.carousel-counter');
  const thumbnails = document.querySelectorAll('.thumbnail');
  
  img.src = state.photos[state.currentIndex];
  if (counter) {
    counter.textContent = `${state.currentIndex + 1}/${state.photos.length}`;
  }
  
  thumbnails.forEach((thumb, idx) => {
    thumb.classList.toggle('active', idx === state.currentIndex);
  });
}

function shareLink() {
  if (navigator.share) {
    navigator.share({
      title: document.getElementById('listing-title').textContent,
      url: window.location.href
    }).catch(() => {});
  } else {
    // Fallback: копіювати в буфер
    navigator.clipboard.writeText(window.location.href);
    alert('Посилання скопійовано!');
  }
}
```

---

## 🎯 ACCEPTANCE CRITERIA (Критерії прийомки)

### ✅ Карусель у карточці:

- [ ] Клік по фото НЕ скролить сторінку вниз
- [ ] Кнопки Prev/Next змінюють фото
- [ ] Крапки-індикатори показують поточне фото та дозволяють перемикатися
- [ ] Лічильник показує "2/5" і оновлюється
- [ ] Свайп на мобільному працює (ліво/право)
- [ ] Клавіші Left/Right працюють у фокусі каруселі
- [ ] Якщо 1 фото — контроли приховані
- [ ] Якщо 0 фото — показується placeholder
- [ ] `aria-label` та `aria-selected` оновлюються
- [ ] Lazy loading працює (IntersectionObserver)

### ✅ Клік по карточці:

- [ ] Клік по карточці (НЕ по контролах) відкриває `pages/listing.html?id=123`
- [ ] Відкривається в НОВІЙ вкладці (`target="_blank"`)
- [ ] Клік по Prev/Next/крапках НЕ відкриває деталку
- [ ] Клік по "лайк" НЕ відкриває деталку
- [ ] Клік по "Детально" відкриває деталку

### ✅ Детальна сторінка:

- [ ] Завантажує об'єкт за ID з API
- [ ] Показує галерею з thumbnails
- [ ] Показує відео (якщо `videoUrl` є)
- [ ] Показує мапу (якщо `lat/lng` є)
- [ ] Приховує відео/мапу якщо даних немає
- [ ] Кнопка "Назад до каталогу" працює
- [ ] Кнопка "Поділитися" копіює URL або відкриває share dialog
- [ ] SEO: правильний `<title>`, мета-теги, JSON-LD
- [ ] A11y: доступна навігація, фокус видимий, aria-атрибути
- [ ] Консоль без помилок

### ✅ Без регресій:

- [ ] Фільтри працюють як раніше
- [ ] Лайк працює як раніше
- [ ] URLState працює як раніше
- [ ] Сортування працює як раніше

---

## 📊 КОНТРАКТ ДАНИХ

### Об'єкт з API/JSON:

```typescript
interface Listing {
  id: string;
  title: string;
  address?: string;
  city?: string;
  district?: string;
  price: number;
  currency: 'USD' | 'UAH' | 'EUR';
  type: 'sale' | 'rent' | 'daily';
  propertyType: 'apartment' | 'house' | 'land' | 'office' | 'commercial';
  rooms?: number;
  areaTotal?: number;  // або area
  floor?: number;
  floorsTotal?: number;  // або totalFloors
  photos?: string[];  // або images
  images?: string[];
  videoUrl?: string;
  lat?: number;
  lng?: number;
  description?: string;
  amenities?: object;
  yearBuilt?: number;
}
```

---

## 🧪 ТЕСТ-КЕЙСИ

### TC-1: Карусель з 5 фото

**Кроки:**
1. Відкрити каталог
2. Знайти карточку з 5 фото
3. Клік по Prev
4. Клік по Next
5. Клік по 3-й крапці
6. Свайп вліво на мобільному

**Очікуваний результат:**
- Фото змінюються
- Крапки оновлюються
- Лічильник показує 1/5, 2/5, 3/5...
- Сторінка НЕ скролить

---

### TC-2: Карточка з 1 фото

**Кроки:**
1. Знайти карточку з 1 фото

**Очікуваний результат:**
- Кнопки Prev/Next приховані
- Крапки приховані
- Лічильник прихований
- Фото відображається нормально

---

### TC-3: Клік по карточці

**Кроки:**
1. Клікнути по тексту назви об'єкта
2. Клікнути по ціні
3. Клікнути по порожній області карточки

**Очікуваний результат:**
- Відкривається `pages/listing.html?id=123` в новій вкладці
- Попередня вкладка залишається без змін

---

### TC-4: Клік по контролах каруселі

**Кроки:**
1. Клікнути по кнопці Prev
2. Клікнути по кнопці Next
3. Клікнути по крапці
4. Клікнути по "лайк"

**Очікуваний результат:**
- Детальна сторінка НЕ відкривається
- Виконується тільки дія контролу

---

### TC-5: Детальна сторінка з мапою та відео

**Кроки:**
1. Відкрити детальну сторінку об'єкта з `lat/lng` та `videoUrl`

**Очікуваний результат:**
- Галерея показує всі фото
- Мапа відображає маркер в правильному місці
- Відео програється (YouTube iframe або video)
- Всі дані коректні

---

### TC-6: Детальна сторінка БЕЗ мапи та відео

**Кроки:**
1. Відкрити детальну сторінку об'єкта без `lat/lng` та `videoUrl`

**Очікуваний результат:**
- Блок мапи прихований
- Блок відео прихований
- Решта даних відображається нормально

---

## 📦 DELIVERABLES (Що повинно бути на виході)

### Код:

1. ✅ `js/script.js` (або `js/catalog.js`) - карусель в карточках
2. ✅ `css/styles.css` - стилі для каруселі та детальної сторінки
3. ✅ `pages/listing.html` - оновлена детальна сторінка
4. ✅ `js/listing.js` (новий) - логіка детальної сторінки

### Документація:

5. ✅ `CAROUSEL_README.md` - як працює карусель, де оновлювати
6. ✅ Коментарі в коді - всі функції документовані

### Тестування:

7. ✅ Скринкасти (3 шт):
   - Взаємодія з каруселлю на карточці
   - Перехід у детальну сторінку
   - Робота відео та мапи

8. ✅ Lighthouse report:
   - Performance ≥ 85
   - Accessibility ≥ 90
   - Best Practices ≥ 90
   - SEO ≥ 90

---

## ⚠️ ВАЖЛИВІ ЗАСТЕРЕЖЕННЯ

### 🚫 ЩО НЕ МОЖНА РОБИТИ:

1. ❌ Використовувати `href="#"` в контролах каруселі
2. ❌ Забувати `event.stopPropagation()` на контролах
3. ❌ Відкривати деталку при кліку на Prev/Next/крапки/лайк
4. ❌ Завантажувати всі каруселі одразу (використати IntersectionObserver)
5. ❌ Ігнорувати accessibility (aria-атрибути обов'язкові)

### ✅ ЩО ОБОВ'ЯЗКОВО:

1. ✅ Всі контроли каруселі - `<button type="button">`
2. ✅ Кожен контроль має `event.stopPropagation()`
3. ✅ Lazy loading для зображень
4. ✅ Responsive srcset/sizes
5. ✅ Keyboard navigation (Left/Right arrows)
6. ✅ Touch swipe для мобільних
7. ✅ Приховувати контроли якщо 1 фото
8. ✅ Fallback для відсутніх фото/відео/мапи

---

## 🔍 ПЕРЕВІРКА ЯКОСТІ

### Перед відправкою на review:

```bash
# 1. Перевірити що немає console.log
grep -r "console.log" js/script.js js/listing.js

# 2. Перевірити що всі події мають stopPropagation
grep -r "stopPropagation" js/script.js

# 3. Запустити linter
npm run lint

# 4. Перевірити Lighthouse
# Chrome DevTools → Lighthouse → Generate report

# 5. Перевірити на мобільному
# Chrome DevTools → Toggle device toolbar → iPhone/Android
```

### Чеклист коду:

- [ ] Код відформатований (2 пробіли, послідовний стиль)
- [ ] Немає закоментованого коду
- [ ] Всі функції документовані JSDoc
- [ ] Немає magic numbers (використовувати константи)
- [ ] Обробка помилок (try-catch де потрібно)
- [ ] Немає XSS вразливостей (escape user input)

---

## 📞 ПІДТРИМКА

### Якщо виникнуть питання:

1. **Де знайти дані про фото?**
   - В `allProperties` кожен об'єкт має `photos` або `images` (Array)

2. **Як тестувати на мобільному?**
   - Chrome DevTools → Device toolbar → Емуляція touch events

3. **Що робити якщо немає координат?**
   - Приховати блок мапи (`display: none`)

4. **Як обробляти помилки завантаження фото?**
   - Використати `onerror="this.src='placeholder.jpg'"`

5. **Чи потрібен jQuery?**
   - НІ. Використовувати vanilla JavaScript

---

## ⏱️ ЧАСОВА ОЦІНКА

| Задача | Час | Складність |
|--------|-----|-----------|
| Карусель в карточці | 2-3 год | Середня |
| Детальна сторінка | 2-3 год | Середня |
| Стилі CSS | 1 год | Низька |
| Тестування | 1 год | Низька |
| Документація | 0.5 год | Низька |
| **РАЗОМ** | **6-8 год** | |

---

## 🎓 РЕКОМЕНДАЦІЇ

### Best Practices:

1. **Продуктивність:**
   - Використати IntersectionObserver для lazy init
   - Оптимізувати srcset для responsive images
   - Мінімізувати reflows/repaints

2. **Accessibility:**
   - Всі інтерактивні елементи доступні з клавіатури
   - Screen reader friendly (aria-labels)
   - Видимий focus indicator

3. **UX:**
   - Плавні анімації (transition: 0.3s)
   - Миттєвий feedback на дії
   - Зрозумілі іконки та підказки

4. **Безпека:**
   - Escape всі user-generated data
   - Валідація URL перед відкриттям
   - CSP headers для iframe

---

## 📋 DEFINITION OF DONE

Задача вважається завершеною коли:

- ✅ Всі acceptance criteria виконані
- ✅ Код пройшов code review
- ✅ Немає console errors/warnings
- ✅ Lighthouse accessibility ≥ 90
- ✅ Протестовано на Chrome, Firefox, Safari
- ✅ Протестовано на iOS та Android
- ✅ Документація оновлена
- ✅ Скринкасти підготовлені
- ✅ Без регресій існуючого функціоналу

---

**Автор ТЗ:** Product Owner  
**Дата:** 28 жовтня 2025  
**Версія:** 1.0  
**Статус:** 📋 READY FOR DEVELOPMENT

---

## 🚀 ПОЧАТИ РОБОТУ

### Крок 1: Створити гілку
```bash
git checkout -b feature/carousel-and-listing-page
```

### Крок 2: Почати з каруселі в карточці
- Модифікувати `renderProperties()` в `js/script.js`
- Додати стилі в `css/styles.css`
- Тестувати на 1, 3, 5 фото

### Крок 3: Детальна сторінка
- Оновити `pages/listing.html`
- Створити `js/listing.js`
- Додати галерею, мапу, відео

### Крок 4: Тестування
- Пройти всі test cases
- Перевірити на різних пристроях
- Lighthouse audit

### Крок 5: Code Review
- Створити Pull Request
- Додати скринкасти
- Описати зміни

---

**Успіхів у реалізації! 🎉**

