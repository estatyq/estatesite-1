// ==================== УЛУЧШЕННЫЙ КАТАЛОГ НЕДВИЖИМОСТИ ====================

// Глобальные переменные
let currentView = 'grid'; // 'grid' или 'list'
let currentPage = 1;
let itemsPerPage = 12;
let currentSort = 'newest';
let searchQuery = '';

// Обновленные фильтры
let filters = {
    metroStations: [], // Добавляем для совместимости
    region: null,
    city: null,
    districts: [],
    microdistricts: [],
    metro: null,
    transaction: 'sale',
    type: 'all',
    location: null,
    rooms: null,
    areaMin: null,
    areaMax: null,
    plotAreaMin: null,
    plotAreaMax: null,
    priceMin: null,
    priceMax: null,
    priceCurrency: 'usd',
    daily: false,
    floorMin: null,
    floorMax: null,
    floorNotLast: false,
    pets: false,
    monthlyRent: false,
    waterHeater: null,
    microwave: null,
    oven: null,
    officeType: null,
    commercialType: null,
    landType: null,
    warehouseType: null,
    parking: false,
    balcony: false,
    furniture: false
};

// ==================== ИНИЦИАЛИЗАЦИЯ ====================

document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('properties-grid')) return;
    
    initializeFilters();
    initializeSearch();
    initializeViewToggle();
    initializeSortDropdown();
    initializeQuickFilters();
    initializeScrollEffects();
    initializeAnimations();
    
    // Инициализируем существующие функции из script.js
    renderCityButtons();
    renderProperties();
    updateResultsCount();
});

// ==================== ЭФФЕКТЫ ПРОКРУТКИ ====================

function initializeScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Кнопка "Наверх"
    createScrollTopButton();
}

function createScrollTopButton() {
    const button = document.createElement('button');
    button.className = 'scroll-top-btn';
    button.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
    `;
    button.onclick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    document.body.appendChild(button);
    
    // Показываем/скрываем кнопку
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    });
}

// ==================== АНИМАЦИИ ====================

function initializeAnimations() {
    // Intersection Observer для анимации появления элементов
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('fade-in');
                }, index * 100); // Задержка для каскадного эффекта
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Наблюдаем за карточками
    document.querySelectorAll('.property-card').forEach(card => {
        observer.observe(card);
    });
}

// Перерендеринг с анимацией
function renderPropertiesWithAnimation() {
    renderProperties();
    
    // Добавляем анимацию для новых карточек
    setTimeout(() => {
        const cards = document.querySelectorAll('.property-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.transition = 'all 0.5s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            }, index * 50);
        });
    }, 10);
}

// ==================== ПОИСК ====================

function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const searchClear = document.getElementById('search-clear');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function(e) {
        searchQuery = e.target.value;
        
        if (searchQuery.length > 0) {
            searchClear.style.display = 'block';
        } else {
            searchClear.style.display = 'none';
        }
        
        // Поиск в реальном времени с небольшой задержкой
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            applyFilters();
        }, 300);
    });
    
    searchClear.addEventListener('click', function() {
        searchInput.value = '';
        searchQuery = '';
        this.style.display = 'none';
        applyFilters();
    });
}

function performSearch() {
    applyFilters();
}

// ==================== ФИЛЬТРЫ ====================

function initializeFilters() {
    // Цена
    const priceMin = document.getElementById('price-min');
    const priceMax = document.getElementById('price-max');
    
    if (priceMin) {
        priceMin.addEventListener('input', () => {
            filters.priceMin = priceMin.value ? parseFloat(priceMin.value) : null;
            debounceFilter();
        });
    }
    
    if (priceMax) {
        priceMax.addEventListener('input', () => {
            filters.priceMax = priceMax.value ? parseFloat(priceMax.value) : null;
            debounceFilter();
        });
    }
    
    // Площадь
    const areaMin = document.getElementById('area-min');
    const areaMax = document.getElementById('area-max');
    
    if (areaMin) {
        areaMin.addEventListener('input', () => {
            filters.areaMin = areaMin.value ? parseFloat(areaMin.value) : null;
            debounceFilter();
        });
    }
    
    if (areaMax) {
        areaMax.addEventListener('input', () => {
            filters.areaMax = areaMax.value ? parseFloat(areaMax.value) : null;
            debounceFilter();
        });
    }
    
    // Валюта
    const currencyBtns = document.querySelectorAll('.currency-btn');
    currencyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currencyBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filters.priceCurrency = this.dataset.currency;
            applyFilters();
        });
    });
    
    // Комнаты
    const roomBtns = document.querySelectorAll('.room-btn');
    roomBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const rooms = this.dataset.rooms;
            
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                filters.rooms = null;
            } else {
                roomBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                filters.rooms = rooms === '4+' ? '4+' : parseInt(rooms);
            }
            
            applyFilters();
        });
    });
    
    // Дополнительные фильтры (чекбоксы)
    const checkboxes = ['parking', 'balcony', 'furniture', 'pets'];
    checkboxes.forEach(id => {
        const checkbox = document.getElementById(`filter-${id}`);
        if (checkbox) {
            checkbox.addEventListener('change', function() {
                filters[id] = this.checked;
                applyFilters();
            });
        }
    });
}

let filterTimeout;
function debounceFilter() {
    clearTimeout(filterTimeout);
    filterTimeout = setTimeout(() => {
        applyFilters();
    }, 500);
}

function toggleAdvancedFilters() {
    const advFilters = document.getElementById('advanced-filters');
    const toggle = document.querySelector('.filter-toggle');
    
    if (advFilters.style.display === 'none' || !advFilters.style.display) {
        advFilters.style.display = 'flex';
        toggle.classList.add('active');
    } else {
        advFilters.style.display = 'none';
        toggle.classList.remove('active');
    }
}

// ==================== БЫСТРЫЕ ФИЛЬТРЫ ====================

function initializeQuickFilters() {
    const typeButtons = document.querySelectorAll('.quick-filter-btn');
    
    typeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.dataset.type;
            
            typeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            filters.type = type;
            
            // Показываем/скрываем фильтр комнат
            const roomsFilter = document.getElementById('rooms-filter');
            if (roomsFilter) {
                if (type === 'apartment' || type === 'all') {
                    roomsFilter.style.display = 'block';
                } else {
                    roomsFilter.style.display = 'none';
                }
            }
            
            applyFilters();
        });
    });
}

// ==================== ВИД И СОРТИРОВКА ====================

function initializeViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.dataset.view;
            
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentView = view;
            updateGridView();
        });
    });
}

function updateGridView() {
    const grid = document.getElementById('properties-grid');
    if (!grid) return;
    
    if (currentView === 'list') {
        grid.classList.add('list-view');
    } else {
        grid.classList.remove('list-view');
    }
}

function initializeSortDropdown() {
    const sortSelect = document.getElementById('sort-select');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            applyFilters();
        });
    }
}

// ==================== ПРИМЕНЕНИЕ ФИЛЬТРОВ ====================

function applyFilters() {
    let filtered = [...allProperties];
    
    // Поиск
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(prop => {
            return prop.title.toLowerCase().includes(query) ||
                   prop.location.toLowerCase().includes(query) ||
                   (cities[prop.city] && cities[prop.city].name.toLowerCase().includes(query));
        });
    }
    
    // Тип сделки
    if (filters.transaction) {
        filtered = filtered.filter(prop => prop.transactionType === filters.transaction);
    }
    
    // Тип недвижимости
    if (filters.type && filters.type !== 'all') {
        filtered = filtered.filter(prop => prop.type === filters.type);
    }
    
    // Город
    if (filters.city) {
        filtered = filtered.filter(prop => prop.city === filters.city);
    }
    
    // Районы
    if (filters.districts.length > 0) {
        filtered = filtered.filter(prop => filters.districts.includes(prop.location));
    }
    
    // Цена
    if (filters.priceMin) {
        filtered = filtered.filter(prop => prop.price >= filters.priceMin);
    }
    if (filters.priceMax) {
        filtered = filtered.filter(prop => prop.price <= filters.priceMax);
    }
    
    // Площадь
    if (filters.areaMin) {
        filtered = filtered.filter(prop => prop.area >= filters.areaMin);
    }
    if (filters.areaMax) {
        filtered = filtered.filter(prop => prop.area <= filters.areaMax);
    }
    
    // Комнаты
    if (filters.rooms) {
        if (filters.rooms === '4+') {
            filtered = filtered.filter(prop => prop.rooms >= 4);
        } else {
            filtered = filtered.filter(prop => prop.rooms === filters.rooms);
        }
    }
    
    // Дополнительные фильтры
    if (filters.parking) {
        filtered = filtered.filter(prop => prop.parking === true);
    }
    if (filters.balcony) {
        filtered = filtered.filter(prop => prop.balcony === true);
    }
    if (filters.furniture) {
        filtered = filtered.filter(prop => prop.furniture === true);
    }
    if (filters.pets) {
        filtered = filtered.filter(prop => prop.pets === 'дозволені');
    }
    
    // Сортировка
    filtered = sortProperties(filtered);
    
    filteredProperties = filtered;
    currentPage = 1;
    renderProperties();
    updateResultsCount();
    updatePagination();
}

// ==================== СОРТИРОВКА ====================

function sortProperties(properties) {
    const sorted = [...properties];
    
    switch(currentSort) {
        case 'newest':
            sorted.sort((a, b) => b.id - a.id);
            break;
        case 'price-asc':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'area-asc':
            sorted.sort((a, b) => a.area - b.area);
            break;
        case 'area-desc':
            sorted.sort((a, b) => b.area - a.area);
            break;
    }
    
    return sorted;
}

// ==================== РЕНДЕРИНГ ОБЪЕКТОВ ====================

function renderProperties() {
    const grid = document.getElementById('properties-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const toShow = filteredProperties.slice(start, end);
    
    if (toShow.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="color: var(--gold-color); opacity: 0.3; margin-bottom: 20px;">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
                <h3 style="color: var(--text-dark); margin-bottom: 10px;">Нічого не знайдено</h3>
                <p style="color: var(--text-light);">Спробуйте змінити параметри пошуку</p>
            </div>
        `;
        return;
    }
    
    toShow.forEach(prop => {
        const card = createPropertyCard(prop);
        grid.appendChild(card);
    });
    
    updateGridView();
}

function createPropertyCard(prop) {
    const card = document.createElement('div');
    card.className = 'property-card';
    card.setAttribute('data-id', prop.id);
    
    const transactionText = prop.transactionType === 'sale' ? 'Продаж' : 
                          prop.transactionType === 'rent' ? 'Оренда' : 'Подобово';
    
    const priceUnit = prop.transactionType === 'sale' ? 'тис.' : 
                     prop.transactionType === 'rent' ? 'тис./міс' : 'грн/день';
    
    card.innerHTML = `
        <div class="property-image">
            <img src="${prop.image}" alt="${prop.title}" loading="lazy">
            <div class="property-badge">${transactionText}</div>
            <button class="property-favorite" onclick="toggleFavorite(event, ${prop.id})">
                <span>♡</span>
            </button>
        </div>
        <div class="property-content">
            <h3 class="property-title">${prop.title}</h3>
            <p class="property-location">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
                ${prop.location}, ${cities[prop.city].name}
            </p>
            
            <div class="property-details">
                ${prop.rooms > 0 ? `
                    <div class="detail-item">
                        <div class="detail-item-value">${prop.rooms}</div>
                        <div class="detail-item-label">Кімнат</div>
                    </div>
                ` : ''}
                <div class="detail-item">
                    <div class="detail-item-value">${Math.round(prop.area)}</div>
                    <div class="detail-item-label">м²</div>
                </div>
                ${prop.floor ? `
                    <div class="detail-item">
                        <div class="detail-item-value">${prop.floor}</div>
                        <div class="detail-item-label">Поверх</div>
                    </div>
                ` : ''}
            </div>

            <div class="property-price">$ ${Math.round(prop.price)} ${priceUnit}</div>

            <div class="property-action">
                <button class="btn-details" onclick="openModal(${prop.id})">Детально</button>
                <button class="btn-like" onclick="toggleLike(event, ${prop.id})">♡</button>
            </div>
        </div>
    `;
    
    return card;
}

// ==================== ИЗБРАННОЕ ====================

function toggleFavorite(event, propId) {
    event.stopPropagation();
    const button = event.currentTarget;
    button.classList.toggle('active');
    
    // Здесь можно добавить сохранение в localStorage
    const favorites = getFavorites();
    const index = favorites.indexOf(propId);
    
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(propId);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function getFavorites() {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
}

// ==================== МОДАЛЬНОЕ ОКНО ====================

function openModal(propId) {
    const prop = allProperties.find(p => p.id === propId);
    if (!prop) return;
    
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    const transactionText = prop.transactionType === 'sale' ? 'Продаж' : 
                          prop.transactionType === 'rent' ? 'Оренда' : 'Подобово';
    
    const priceUnit = prop.transactionType === 'sale' ? 'тис.' : 
                     prop.transactionType === 'rent' ? 'тис./міс' : 'грн/день';
    
    modalBody.innerHTML = `
        <div class="modal-gallery">
            <img src="${prop.image}" alt="${prop.title}">
            <div class="gallery-nav">
                <button class="gallery-btn">‹</button>
                <button class="gallery-btn">›</button>
            </div>
        </div>
        
        <div class="modal-header">
            <h2 class="modal-title">${prop.title}</h2>
            <p class="modal-location">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
                ${prop.location}, ${cities[prop.city].name}
            </p>
            <div class="modal-price-badge">$ ${Math.round(prop.price)} ${priceUnit}</div>
        </div>
        
        <div class="modal-details-grid">
            <div class="modal-detail-item">
                <div class="modal-detail-item-label">Тип</div>
                <div class="modal-detail-item-value">${propertyTypes[prop.type]}</div>
            </div>
            <div class="modal-detail-item">
                <div class="modal-detail-item-label">Угода</div>
                <div class="modal-detail-item-value">${transactionText}</div>
            </div>
            ${prop.rooms > 0 ? `
                <div class="modal-detail-item">
                    <div class="modal-detail-item-label">Кімнат</div>
                    <div class="modal-detail-item-value">${prop.rooms}</div>
                </div>
            ` : ''}
            <div class="modal-detail-item">
                <div class="modal-detail-item-label">Площа</div>
                <div class="modal-detail-item-value">${Math.round(prop.area)} м²</div>
            </div>
            ${prop.floor ? `
                <div class="modal-detail-item">
                    <div class="modal-detail-item-label">Поверх</div>
                    <div class="modal-detail-item-value">${prop.floor}</div>
                </div>
            ` : ''}
            <div class="modal-detail-item">
                <div class="modal-detail-item-label">Рік побудови</div>
                <div class="modal-detail-item-value">${prop.building}</div>
            </div>
        </div>
        
        <div style="margin-top: 30px; text-align: center;">
            <a href="${cities[prop.city].bot}" target="_blank" class="btn btn-primary" style="display: inline-block; text-decoration: none;">
                Написати в Telegram
            </a>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ==================== УТИЛИТЫ ====================

function updateResultsCount() {
    const countEl = document.getElementById('results-count');
    if (countEl) {
        const count = filteredProperties.length;
        const word = count === 1 ? 'об\'єкт' : count < 5 ? 'об\'єкти' : 'об\'єктів';
        countEl.textContent = `${count} ${word}`;
    }
}

function updatePagination() {
    // Пока используем кнопку "Показать еще"
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (!loadMoreBtn) return;
    
    const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
    
    if (currentPage >= totalPages) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
}

function loadMoreProperties() {
    currentPage++;
    renderProperties();
    
    // Плавная прокрутка
    const grid = document.getElementById('properties-grid');
    if (grid) {
        const lastCard = grid.lastElementChild;
        if (lastCard) {
            lastCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
}

function resetFilters() {
    filters = {
        metroStations: [],
        region: null,
        city: null,
        districts: [],
        microdistricts: [],
        metro: null,
        transaction: 'sale',
        type: 'all',
        location: null,
        rooms: null,
        areaMin: null,
        areaMax: null,
        plotAreaMin: null,
        plotAreaMax: null,
        priceMin: null,
        priceMax: null,
        priceCurrency: 'usd',
        daily: false,
        floorMin: null,
        floorMax: null,
        floorNotLast: false,
        pets: false,
        monthlyRent: false,
        waterHeater: null,
        microwave: null,
        oven: null,
        officeType: null,
        commercialType: null,
        landType: null,
        warehouseType: null,
        parking: false,
        balcony: false,
        furniture: false
    };
    
    // Очистить все инпуты
    document.querySelectorAll('.price-input').forEach(input => input.value = '');
    document.querySelectorAll('.room-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('.quick-filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.quick-filter-btn[data-type="all"]').classList.add('active');
    
    searchQuery = '';
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
    
    currentPage = 1;
    applyFilters();
}

function toggleLike(event, propId) {
    event.stopPropagation();
    const button = event.currentTarget;
    button.classList.toggle('liked');
    button.textContent = button.classList.contains('liked') ? '♥' : '♡';
}

// Закрытие модального окна по клику вне его
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
}

// Закрытие по Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// ==================== УТИЛИТЫ UX ====================

// Показать тост-уведомление
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// Показать индикатор загрузки
function showLoadingSpinner(container) {
    if (!container) return;
    
    container.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <div class="loading-text">Завантаження...</div>
        </div>
    `;
}

// Плавная прокрутка к элементу
function smoothScrollTo(element, offset = 0) {
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// Debounce функция
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle функция
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Сохранение состояния фильтров в URL
function updateURL() {
    const params = new URLSearchParams();
    
    if (filters.type && filters.type !== 'all') params.set('type', filters.type);
    if (filters.city) params.set('city', filters.city);
    if (filters.priceMin) params.set('priceMin', filters.priceMin);
    if (filters.priceMax) params.set('priceMax', filters.priceMax);
    if (filters.rooms) params.set('rooms', filters.rooms);
    if (searchQuery) params.set('search', searchQuery);
    
    const newURL = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newURL);
}

// Восстановление фильтров из URL
function restoreFiltersFromURL() {
    const params = new URLSearchParams(window.location.search);
    
    if (params.has('type')) filters.type = params.get('type');
    if (params.has('city')) filters.city = params.get('city');
    if (params.has('priceMin')) filters.priceMin = parseFloat(params.get('priceMin'));
    if (params.has('priceMax')) filters.priceMax = parseFloat(params.get('priceMax'));
    if (params.has('rooms')) filters.rooms = params.get('rooms');
    if (params.has('search')) searchQuery = params.get('search');
    
    // Применяем восстановленные фильтры
    if (Object.keys(params).length > 0) {
        applyFilters();
    }
}

// Копирование ссылки на объект
function copyPropertyLink(propId) {
    const url = `${window.location.origin}/property-detail.html?id=${propId}`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            showToast('Посилання скопійовано!', 'success');
        });
    } else {
        // Fallback для старых браузеров
        const input = document.createElement('input');
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        showToast('Посилання скопійовано!', 'success');
    }
}

// Поделиться объектом
function shareProperty(propId) {
    const prop = allProperties.find(p => p.id === propId);
    if (!prop) return;
    
    const url = `${window.location.origin}/property-detail.html?id=${propId}`;
    const text = `${prop.title} - ${prop.location}`;
    
    if (navigator.share) {
        navigator.share({
            title: prop.title,
            text: text,
            url: url
        }).catch(() => {
            // Если не поддерживается, копируем ссылку
            copyPropertyLink(propId);
        });
    } else {
        copyPropertyLink(propId);
    }
}

// Инициализация при загрузке
if (document.getElementById('properties-grid')) {
    restoreFiltersFromURL();
}
