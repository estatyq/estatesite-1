// ==================== ИНТЕРАКТИВНАЯ ЛУПА ВМЕСТО КУРСОРА ====================

function initializeMagnifierCursor() {
    const magnifier = document.getElementById('magnifier-cursor');
    
    document.body.classList.add('magnifier-active');
    
    document.addEventListener('mousemove', (e) => {
        magnifier.style.left = e.clientX + 'px';
        magnifier.style.top = e.clientY + 'px';
    });
    
    document.addEventListener('mousedown', () => {
        magnifier.style.transform = 'translate(-25px, -25px) scale(0.85)';
    });
    
    document.addEventListener('mouseup', () => {
        magnifier.style.transform = 'translate(-25px, -25px) scale(1)';
    });
}

// ==================== ДАНІ ПРО НЕРУХОМІСТЬ ====================

const properties = [
    {
        id: 1,
        title: "Затишна квартира в центрі",
        type: "apartment",
        transactionType: "sale",
        location: "Київ, вул. Хрещатик",
        price: 85,
        rooms: 2,
        area: 65,
        floor: 5,
        building: 2015
    },
    {
        id: 2,
        title: "Сучасний офіс класу А",
        type: "office",
        transactionType: "rent",
        location: "Київ, Бізнес-центр Гулівер",
        price: 45,
        rooms: 1,
        area: 150,
        floor: 10,
        building: 2020
    },
    {
        id: 3,
        title: "Розкішний заміський будинок",
        type: "house",
        transactionType: "sale",
        location: "Київська область, Козин",
        price: 450,
        rooms: 4,
        area: 350,
        floor: 2,
        building: 2022
    },
    {
        id: 4,
        title: "Світла двокімнатна квартира",
        type: "apartment",
        transactionType: "rent",
        location: "Київ, Печерськ",
        price: 25,
        rooms: 2,
        area: 58,
        floor: 3,
        building: 2018
    },
    {
        id: 5,
        title: "Комерційне приміщення",
        type: "commercial",
        transactionType: "sale",
        location: "Київ, вул. Саксаганського",
        price: 280,
        rooms: 3,
        area: 200,
        floor: 1,
        building: 2015
    },
    {
        id: 6,
        title: "Студія з терасою",
        type: "apartment",
        transactionType: "rent",
        location: "Київ, Поділ",
        price: 18,
        rooms: 1,
        area: 40,
        floor: 8,
        building: 2019
    },
    {
        id: 7,
        title: "Просторий офіс на Лівому березі",
        type: "office",
        transactionType: "sale",
        location: "Київ, вул. Харківське шосе",
        price: 120,
        rooms: 2,
        area: 180,
        floor: 15,
        building: 2021
    },
    {
        id: 8,
        title: "Приватний будинок з ділянкою",
        type: "house",
        transactionType: "sale",
        location: "Київська область, Вишневе",
        price: 320,
        rooms: 3,
        area: 250,
        floor: 2,
        building: 2019
    },
    {
        id: 9,
        title: "Трикімнатна квартира",
        type: "apartment",
        transactionType: "sale",
        location: "Київ, Оболонь",
        price: 95,
        rooms: 3,
        area: 85,
        floor: 6,
        building: 2016
    },
    {
        id: 10,
        title: "Магазин у торговому центрі",
        type: "commercial",
        transactionType: "rent",
        location: "Київ, ТРЦBlockbuster Mall",
        price: 60,
        rooms: 1,
        area: 80,
        floor: 1,
        building: 2017
    },
    {
        id: 11,
        title: "Новобудова біля метро",
        type: "apartment",
        transactionType: "sale",
        location: "Київ, Теремки",
        price: 75,
        rooms: 2,
        area: 62,
        floor: 12,
        building: 2023
    },
    {
        id: 12,
        title: "Котедж з басейном",
        type: "house",
        transactionType: "rent",
        location: "Київська область, Конча-Заспа",
        price: 150,
        rooms: 5,
        area: 420,
        floor: 2,
        building: 2021
    }
];

// ==================== ЗМІННІ ДЛЯ ФІЛЬТРАЦІЇ ====================

let currentTransaction = 'sale';
let currentPropertyType = 'apartment';
let filteredProperties = [...properties];

// ==================== ФУНКЦІЇ ІНІЦІАЛІЗАЦІЇ ====================

function initializeApp() {
    filterProperties();
    updatePriceValue();
    initializeMagnifier();
    initializeMagnifierCursor();
}

function scrollToCatalog() {
    const catalogElement = document.getElementById('catalog');
    if (catalogElement) {
        catalogElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function initializeMagnifier() {
    const magnifier = document.querySelector('.interactive-magnifier');
    if (magnifier) {
        magnifier.addEventListener('click', scrollToCatalog);
        magnifier.setAttribute('title', 'Натисніть для пошуку нерухомості');
    }
}

// ==================== ФУНКЦІЇ ПЕРЕМИКАННЯ ТАБІВ ====================

function changeTransaction(type) {
    currentTransaction = type;
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.transaction === type) {
            btn.classList.add('active');
        }
    });
    
    filterProperties();
}

function changePropertyType(type) {
    currentPropertyType = type;
    
    document.querySelectorAll('.type-tab').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.type === type) {
            btn.classList.add('active');
        }
    });
    
    filterProperties();
}

// ==================== РЕНДЕРИНГ ОБ'ЄКТІВ ====================

function renderProperties(propertiesToRender) {
    const grid = document.getElementById('properties-grid');
    grid.innerHTML = '';

    if (propertiesToRender.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; font-size: 18px; color: #d0d0d0;">За вашим запитом об\'єктів не знайдено</p>';
        return;
    }

    propertiesToRender.forEach(property => {
        const card = createPropertyCard(property);
        grid.appendChild(card);
    });
}

function createPropertyCard(property) {
    const card = document.createElement('div');
    card.className = 'property-card';
    
    const typeLabel = {
        apartment: 'Квартира',
        house: 'Будинок',
        office: 'Офіс',
        commercial: 'Комерційне'
    };

    const transactionLabel = {
        sale: 'Продаж',
        rent: 'Оренда'
    };

    card.innerHTML = `
        <div class="property-image ${property.type}">
            <div class="property-icon">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    ${property.type === 'apartment' ? `
                        <rect x="20" y="30" width="10" height="15" fill="none" stroke="#d4af37" stroke-width="1.5"/>
                        <rect x="35" y="30" width="10" height="15" fill="none" stroke="#d4af37" stroke-width="1.5"/>
                        <rect x="50" y="30" width="10" height="15" fill="none" stroke="#d4af37" stroke-width="1.5"/>
                        <rect x="65" y="30" width="10" height="15" fill="none" stroke="#d4af37" stroke-width="1.5"/>
                        <rect x="20" y="50" width="10" height="15" fill="none" stroke="#d4af37" stroke-width="1.5"/>
                        <rect x="35" y="50" width="10" height="15" fill="none" stroke="#d4af37" stroke-width="1.5"/>
                        <rect x="50" y="50" width="10" height="15" fill="none" stroke="#d4af37" stroke-width="1.5"/>
                        <rect x="65" y="50" width="10" height="15" fill="none" stroke="#d4af37" stroke-width="1.5"/>
                    ` : property.type === 'house' ? `
                        <polygon points="50,15 75,40 70,40 70,70 30,70 30,40 25,40" fill="none" stroke="#d4af37" stroke-width="1.5"/>
                        <rect x="42" y="48" width="8" height="12" fill="none" stroke="#d4af37" stroke-width="1.5"/>
                        <rect x="55" y="48" width="8" height="12" fill="none" stroke="#d4af37" stroke-width="1.5"/>
                    ` : property.type === 'office' ? `
                        <rect x="25" y="20" width="50" height="55" fill="none" stroke="#d4af37" stroke-width="1.5"/>
                        <line x1="40" y1="20" x2="40" y2="75" stroke="#d4af37" stroke-width="0.8"/>
                        <line x1="60" y1="20" x2="60" y2="75" stroke="#d4af37" stroke-width="0.8"/>
                        <line x1="25" y1="35" x2="75" y2="35" stroke="#d4af37" stroke-width="0.8"/>
                        <line x1="25" y1="50" x2="75" y2="50" stroke="#d4af37" stroke-width="0.8"/>
                        <line x1="25" y1="65" x2="75" y2="65" stroke="#d4af37" stroke-width="0.8"/>
                    ` : `
                        <rect x="20" y="30" width="60" height="40" fill="none" stroke="#d4af37" stroke-width="1.5"/>
                        <rect x="28" y="38" width="12" height="10" fill="none" stroke="#d4af37" stroke-width="1.2"/>
                        <rect x="45" y="38" width="12" height="10" fill="none" stroke="#d4af37" stroke-width="1.2"/>
                        <rect x="62" y="38" width="12" height="10" fill="none" stroke="#d4af37" stroke-width="1.2"/>
                        <rect x="28" y="54" width="12" height="10" fill="none" stroke="#d4af37" stroke-width="1.2"/>
                        <rect x="45" y="54" width="12" height="10" fill="none" stroke="#d4af37" stroke-width="1.2"/>
                        <rect x="62" y="54" width="12" height="10" fill="none" stroke="#d4af37" stroke-width="1.2"/>
                    `}
                </svg>
            </div>
            <div class="property-badge">${transactionLabel[property.transactionType]}</div>
        </div>
        <div class="property-content">
            <h3 class="property-title">${property.title}</h3>
            <p class="property-location">📍 ${property.location}</p>
            
            <div class="property-details">
                <div class="detail-item">
                    <div class="detail-item-value">${property.rooms}</div>
                    <div class="detail-item-label">Кімнат</div>
                </div>
                <div class="detail-item">
                    <div class="detail-item-value">${property.area}</div>
                    <div class="detail-item-label">м²</div>
                </div>
            </div>

            <div class="property-price">$ ${property.price} ${property.transactionType === 'rent' ? 'тис./міс' : 'тис.'}</div>

            <div class="property-action">
                <button class="btn-details" onclick="openModal(${property.id})">Детальніше</button>
                <button class="btn-like" onclick="toggleLike(event)">♡</button>
            </div>
        </div>
    `;

    return card;
}

// ==================== ФІЛЬТРАЦІЯ ====================

function filterProperties() {
    const priceFilter = parseFloat(document.getElementById('price-filter').value);
    const roomsFilter = document.getElementById('rooms-filter').value;
    const areaFilter = document.getElementById('area-filter').value;

    document.getElementById('price-value').textContent = priceFilter;

    filteredProperties = properties.filter(property => {
        const transactionMatch = property.transactionType === currentTransaction;
        const typeMatch = property.type === currentPropertyType;
        const priceMatch = property.price <= priceFilter;
        const roomsMatch = roomsFilter === '' || property.rooms === parseInt(roomsFilter);
        const areaMatch = areaFilter === '' || property.area >= parseInt(areaFilter);

        return transactionMatch && typeMatch && priceMatch && roomsMatch && areaMatch;
    });

    renderProperties(filteredProperties);
}

function resetFilters() {
    document.getElementById('price-filter').value = 500;
    document.getElementById('rooms-filter').value = '';
    document.getElementById('area-filter').value = '';

    document.getElementById('price-value').textContent = '500';
    
    filterProperties();
}

// ==================== МОДАЛЬНЕ ВІКНО ====================

function openModal(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;

    const typeLabel = {
        apartment: 'Квартира',
        house: 'Будинок',
        office: 'Офіс',
        commercial: 'Комерційне приміщення'
    };

    const transactionLabel = {
        sale: 'Продаж',
        rent: 'Оренда'
    };

    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <h2>${property.title}</h2>
        
        <div class="modal-icon-container">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="modal-icon">
                ${property.type === 'apartment' ? `
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#d4af37" stroke-width="1" opacity="0.2"/>
                    <rect x="20" y="30" width="10" height="15" fill="none" stroke="#d4af37" stroke-width="1.5"/>
                    <rect x="35" y="30" width="10" height="15" fill="none" stroke="#d4af37" stroke-width="1.5"/>
                    <rect x="50" y="30" width="10" height="15" fill="none" stroke="#d4af37" stroke-width="1.5"/>
                    <rect x="65" y="30" width="10" height="15" fill="none" stroke="#d4af37" stroke-width="1.5"/>
                    <rect x="20" y="50" width="10" height="15" fill="none" stroke="#d4af37" stroke-width="1.5"/>
                    <rect x="35" y="50" width="10" height="15" fill="none" stroke="#d4af37" stroke-width="1.5"/>
                    <rect x="50" y="50" width="10" height="15" fill="none" stroke="#d4af37" stroke-width="1.5"/>
                    <rect x="65" y="50" width="10" height="15" fill="none" stroke="#d4af37" stroke-width="1.5"/>
                ` : property.type === 'house' ? `
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#d4af37" stroke-width="1" opacity="0.2"/>
                    <polygon points="50,15 75,40 70,40 70,70 30,70 30,40 25,40" fill="none" stroke="#d4af37" stroke-width="1.5"/>
                    <rect x="42" y="48" width="8" height="12" fill="none" stroke="#d4af37" stroke-width="1.5"/>
                    <rect x="55" y="48" width="8" height="12" fill="none" stroke="#d4af37" stroke-width="1.5"/>
                ` : property.type === 'office' ? `
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#d4af37" stroke-width="1" opacity="0.2"/>
                    <rect x="25" y="20" width="50" height="55" fill="none" stroke="#d4af37" stroke-width="1.5"/>
                    <line x1="40" y1="20" x2="40" y2="75" stroke="#d4af37" stroke-width="0.8"/>
                    <line x1="60" y1="20" x2="60" y2="75" stroke="#d4af37" stroke-width="0.8"/>
                    <line x1="25" y1="35" x2="75" y2="35" stroke="#d4af37" stroke-width="0.8"/>
                    <line x1="25" y1="50" x2="75" y2="50" stroke="#d4af37" stroke-width="0.8"/>
                    <line x1="25" y1="65" x2="75" y2="65" stroke="#d4af37" stroke-width="0.8"/>
                ` : `
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#d4af37" stroke-width="1" opacity="0.2"/>
                    <rect x="20" y="30" width="60" height="40" fill="none" stroke="#d4af37" stroke-width="1.5"/>
                    <rect x="28" y="38" width="12" height="10" fill="none" stroke="#d4af37" stroke-width="1.2"/>
                    <rect x="45" y="38" width="12" height="10" fill="none" stroke="#d4af37" stroke-width="1.2"/>
                    <rect x="62" y="38" width="12" height="10" fill="none" stroke="#d4af37" stroke-width="1.2"/>
                    <rect x="28" y="54" width="12" height="10" fill="none" stroke="#d4af37" stroke-width="1.2"/>
                    <rect x="45" y="54" width="12" height="10" fill="none" stroke="#d4af37" stroke-width="1.2"/>
                    <rect x="62" y="54" width="12" height="10" fill="none" stroke="#d4af37" stroke-width="1.2"/>
                `}
            </svg>
        </div>

        <p style="color: #d0d0d0; margin-bottom: 30px; font-size: 16px;">
            <strong style="color: #d4af37;">📍 Адреса:</strong> ${property.location}
        </p>

        <div class="modal-details-grid">
            <div class="modal-detail-item">
                <div class="modal-detail-item-label">Тип нерухомості</div>
                <div class="modal-detail-item-value">${typeLabel[property.type]}</div>
            </div>
            <div class="modal-detail-item">
                <div class="modal-detail-item-label">Тип операції</div>
                <div class="modal-detail-item-value">${transactionLabel[property.transactionType]}</div>
            </div>
            <div class="modal-detail-item">
                <div class="modal-detail-item-label">Ціна</div>
                <div class="modal-detail-item-value">$ ${property.price} ${property.transactionType === 'rent' ? 'тис./міс' : 'тис.'}</div>
            </div>
            <div class="modal-detail-item">
                <div class="modal-detail-item-label">Кімнат</div>
                <div class="modal-detail-item-value">${property.rooms}</div>
            </div>
            <div class="modal-detail-item">
                <div class="modal-detail-item-label">Площа</div>
                <div class="modal-detail-item-value">${property.area} м²</div>
            </div>
            <div class="modal-detail-item">
                <div class="modal-detail-item-label">Поверх</div>
                <div class="modal-detail-item-value">${property.floor}</div>
            </div>
            <div class="modal-detail-item">
                <div class="modal-detail-item-label">Рік будівництва</div>
                <div class="modal-detail-item-value">${property.building}</div>
            </div>
        </div>

        <div style="margin-top: 30px; padding-top: 25px; border-top: 1px solid rgba(212, 175, 55, 0.2);">
            <h3 style="margin-bottom: 15px; color: #d4af37; font-size: 20px;">Опис об'єкта</h3>
            <p style="color: #d0d0d0; line-height: 1.9;">
                Відмінний об'єкт нерухомості, розташований у зручному місці. 
                Хороший стан, всі необхідні комунальні зручності. 
                Ідеальний для проживання або інвестицій. Можлива іпотека.
                Звертайтесь до наших спеціалістів для отримання додаткової інформації.
            </p>
        </div>

        <button class="btn btn-primary" style="width: 100%; margin-top: 30px;" onclick="contactAgent()">
            Зв'язатися з агентом
        </button>
    `;

    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// ==================== ДОДАТКОВІ ФУНКЦІЇ ====================

function toggleLike(event) {
    event.target.textContent = event.target.textContent === '♡' ? '♥' : '♡';
    event.target.style.color = event.target.textContent === '♥' ? '#d4af37' : '#d4af37';
}

function contactAgent() {
    alert('Дякуємо за ваш інтерес! Наш агент зв\'яжеться з вами найближчим часом.\nТелефон: +380 (44) 123-45-67\nEmail: info@estatyq.ua');
}

function updatePriceValue() {
    const priceFilter = document.getElementById('price-filter');
    document.getElementById('price-value').textContent = priceFilter.value;
}

// ==================== ІНІЦІАЛІЗАЦІЯ ====================

document.addEventListener('DOMContentLoaded', initializeApp);
