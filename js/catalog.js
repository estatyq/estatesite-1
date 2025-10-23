// ==================== ДАННЫЕ И КОНФИГУРАЦИЯ ====================

// Данные о городах и районах
const citiesData = {
    kyiv: {
        name: "Київ",
        districts: ["Печерськ", "Оболонь", "Поділ", "Теремки", "Вишневе", "Центр", "Деснянський", "Дарницький", "Святошинсько-Броварський", "Солом'янський"],
        metro: {
            lines: {
                "Червона лінія": ["Академмістечко", "Житомирська", "Святошин", "Нивки", "Берестейська", "Шулявська", "Політехнічний інститут", "Вокзальна", "Університет", "Театральна", "Хрещатик", "Арсенальна", "Дніпро", "Гідропарк", "Лівобережна", "Дарниця", "Чернігівська", "Лісова"],
                "Синя лінія": ["Героїв Дніпра", "Мінська", "Оболонь", "Петрівка", "Тараса Шевченка", "Контрактова площа", "Поштова площа", "Майдан Незалежності", "Площа Льва Толстого", "Олімпійська", "Палац Україна", "Либідська", "Деміївська", "Голосіївська", "Васильківська", "Виставковий центр", "Іподром", "Теремки"],
                "Зелена лінія": ["Сирець", "Дорогожичі", "Лук'янівська", "Золоті ворота", "Палац спорту", "Кловська", "Печерська", "Дружби народів", "Видубичі", "Славутич", "Осокорки", "Позняки", "Харківська", "Вирлиця", "Бориспільська", "Червоний хутір"]
            }
        },
        bot: "https://t.me/estatyq_kyiv"
    },
    kharkiv: {
        name: "Харків",
        districts: ["Центр", "Нові Дома", "Шевченко", "Індустріальний", "Київський"],
        metro: {
            lines: {
                "Холодногірсько-Заводська лінія": ["Холодна Гора", "Південний вокзал", "Центральний ринок", "Майдан Конституції", "Проспект Гагаріна", "Спортивна", "Завод ім. Малишева", "Тракторний завод", "Індустріальна"],
                "Салтівська лінія": ["Історичний музей", "Університет", "Пушкінська", "Київська", "Академіка Барабашова", "Академіка Павлова", "Студентська", "Героїв Праці"]
            }
        },
        bot: "https://t.me/estatyq_kharkiv"
    },
    odesa: {
        name: "Одеса",
        districts: ["Приморський", "Малиновський", "Суворовський"],
        metro: null,
        bot: "https://t.me/estatyq_odesa"
    },
    lviv: {
        name: "Львів",
        districts: ["Галицький", "Франківський", "Залізничний"],
        metro: null,
        bot: "https://t.me/estatyq_lviv"
    },
    dnipro: {
        name: "Дніпро",
        districts: ["Центр", "Заводоуковський", "Совєтський"],
        metro: {
            lines: {
                "Центрально-Заводська лінія": ["Вокзальна", "Металургів", "Завод ім. Петровського", "Проспект Свободи", "Площа Соборна", "Театральна"]
            }
        },
        bot: "https://t.me/estatyq_dnipro"
    },
    zaporizhzhia: {
        name: "Запоріжжя",
        districts: ["Комунарський", "Хортицький", "Центр"],
        metro: null,
        bot: "https://t.me/estatyq_zaporizhzhia"
    }
};

// Типы недвижимости
const propertyTypes = {
    apartment: { name: "Квартира", icon: "fas fa-building" },
    house: { name: "Будинок", icon: "fas fa-home" },
    commercial: { name: "Комерція", icon: "fas fa-store" },
    office: { name: "Офіс", icon: "fas fa-briefcase" },
    land: { name: "Земля", icon: "fas fa-tree" },
    warehouse: { name: "Склад", icon: "fas fa-warehouse" }
};

// Типы сделок
const transactionTypes = {
    sale: "Продаж",
    rent: "Оренда",
    daily: "Подобово"
};

// ==================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ====================

let allProperties = [];
let filteredProperties = [];
let currentFilters = {
    search: "",
    type: null,
    city: null,
    district: null,
    metroLine: null,
    metroStation: null,
    rooms: null,
    priceMin: null,
    priceMax: null,
    areaMin: null,
    areaMax: null,
    floorMin: null,
    floorMax: null,
    yearMin: null,
    yearMax: null,
    balcony: false,
    parking: false,
    elevator: false,
    furnished: false
};

let currentPage = 1;
let itemsPerPage = 12;
let currentView = 'grid';
let sortBy = 'price-asc';

// ==================== ИНИЦИАЛИЗАЦИЯ ====================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    generateSampleData();
    setupEventListeners();
    renderProperties();
    updateResultsCount();
}

// ==================== ГЕНЕРАЦИЯ ДАННЫХ ====================

function generateSampleData() {
    allProperties = [];
    let id = 1;

    Object.keys(citiesData).forEach(cityKey => {
        const city = citiesData[cityKey];
        
        // Генерируем разные типы недвижимости
        Object.keys(propertyTypes).forEach(typeKey => {
            const count = typeKey === 'apartment' ? 20 : typeKey === 'house' ? 10 : 5;
            
            for (let i = 0; i < count; i++) {
                const property = generateProperty(id++, cityKey, typeKey);
                allProperties.push(property);
            }
        });
    });

    filteredProperties = [...allProperties];
}

function generateProperty(id, cityKey, typeKey) {
    const city = citiesData[cityKey];
    const type = propertyTypes[typeKey];
    const transactionType = Math.random() > 0.6 ? 'rent' : 'sale';
    
    // Базовые параметры
    const basePrice = getBasePrice(typeKey, transactionType);
    const price = basePrice + Math.random() * basePrice * 0.5;
    const area = getArea(typeKey);
    const rooms = typeKey === 'apartment' ? Math.floor(Math.random() * 4) + 1 : 
                  typeKey === 'house' ? Math.floor(Math.random() * 3) + 2 : 0;
    const floor = typeKey === 'land' ? 0 : Math.floor(Math.random() * 20) + 1;
    const year = 1990 + Math.floor(Math.random() * 35);
    
    return {
        id,
        title: `${type.name} ${id}`,
        city: cityKey,
        cityName: city.name,
        type: typeKey,
        typeName: type.name,
        transactionType,
        district: city.districts[Math.floor(Math.random() * city.districts.length)],
        price: Math.round(price),
        area: Math.round(area),
        rooms,
        floor,
        year,
        image: `https://picsum.photos/400/300?random=${id}`,
        balcony: Math.random() > 0.5,
        parking: Math.random() > 0.6,
        elevator: Math.random() > 0.4,
        furnished: Math.random() > 0.7,
        metro: city.metro ? getRandomMetroStation(city.metro) : null,
        description: generateDescription(typeKey, transactionType),
        features: generateFeatures(typeKey)
    };
}

function getBasePrice(type, transaction) {
    const basePrices = {
        apartment: { sale: 50, rent: 15, daily: 5 },
        house: { sale: 100, rent: 30, daily: 10 },
        commercial: { sale: 80, rent: 25, daily: 8 },
        office: { sale: 60, rent: 20, daily: 6 },
        land: { sale: 30, rent: 5, daily: 0 },
        warehouse: { sale: 70, rent: 22, daily: 7 }
    };
    return basePrices[type][transaction] || 50;
}

function getArea(type) {
    const areas = {
        apartment: 40 + Math.random() * 100,
        house: 150 + Math.random() * 200,
        commercial: 30 + Math.random() * 150,
        office: 25 + Math.random() * 100,
        land: 100 + Math.random() * 500,
        warehouse: 200 + Math.random() * 300
    };
    return areas[type] || 50;
}

function getRandomMetroStation(metro) {
    const lines = Object.keys(metro.lines);
    const randomLine = lines[Math.floor(Math.random() * lines.length)];
    const stations = metro.lines[randomLine];
    const randomStation = stations[Math.floor(Math.random() * stations.length)];
    return { line: randomLine, station: randomStation };
}

function generateDescription(type, transaction) {
    const descriptions = {
        apartment: [
            "Сучасна квартира в новобудові з панорамними вікнами",
            "Затишна квартира в історичному центрі міста",
            "Стильна квартира з європейським ремонтом",
            "Просторна квартира з балконом та гарним видом"
        ],
        house: [
            "Затишний будинок з садом та гаражем",
            "Сучасний будинок в екологічно чистому районі",
            "Двоповерховий будинок з терасою",
            "Будинок з каміном та великим двором"
        ],
        commercial: [
            "Приміщення під магазин в прохідному місці",
            "Офісне приміщення в бізнес-центрі",
            "Приміщення під кафе з терасою",
            "Складське приміщення з під'їздом"
        ],
        office: [
            "Сучасний офіс в бізнес-центрі",
            "Офісне приміщення з панорамними вікнами",
            "Коворкінг простір для стартапів",
            "Офіс з конференц-залом"
        ],
        land: [
            "Земельна ділянка під забудову",
            "Земля для сільськогосподарських цілей",
            "Ділянка в екологічно чистому районі",
            "Земля з підведеними комунікаціями"
        ],
        warehouse: [
            "Складське приміщення з під'їздом",
            "Виробниче приміщення з високими стелями",
            "Логістичний центр з кранами",
            "Склад з холодильними камерами"
        ]
    };
    
    const typeDescriptions = descriptions[type] || descriptions.apartment;
    return typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
}

function generateFeatures(type) {
    const allFeatures = [
        "Кондиціонер", "Інтернет", "Безпека", "Паркінг", 
        "Ліфт", "Балкон", "Тераса", "Камін", "Сауна", "Бассейн"
    ];
    
    const numFeatures = Math.floor(Math.random() * 4) + 2;
    return allFeatures.sort(() => 0.5 - Math.random()).slice(0, numFeatures);
}

// ==================== ОБРАБОТЧИКИ СОБЫТИЙ ====================

function setupEventListeners() {
    // Поиск
    const searchInput = document.getElementById('main-search');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }

    // Кнопка поиска
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }

    // Фильтры типов недвижимости
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', handleTypeFilter);
    });

    // Выбор города
    const citySelect = document.getElementById('city-select');
    if (citySelect) {
        citySelect.addEventListener('change', handleCityFilter);
    }

    // Ценовые фильтры
    document.getElementById('price-min')?.addEventListener('input', debounce(handlePriceFilter, 300));
    document.getElementById('price-max')?.addEventListener('input', debounce(handlePriceFilter, 300));
    document.getElementById('price-currency')?.addEventListener('change', handlePriceFilter);

    // Фильтры площади
    document.getElementById('area-min')?.addEventListener('input', debounce(handleAreaFilter, 300));
    document.getElementById('area-max')?.addEventListener('input', debounce(handleAreaFilter, 300));

    // Расширенные фильтры
    const advancedFiltersBtn = document.querySelector('.advanced-filters-btn');
    if (advancedFiltersBtn) {
        advancedFiltersBtn.addEventListener('click', toggleAdvancedFilters);
    }

    // Фильтры районов
    document.addEventListener('click', handleDistrictFilter);

    // Метро
    document.getElementById('metro-line')?.addEventListener('change', handleMetroLineFilter);
    document.getElementById('metro-station')?.addEventListener('change', handleMetroStationFilter);

    // Комнаты
    document.querySelectorAll('.room-btn').forEach(btn => {
        btn.addEventListener('click', handleRoomsFilter);
    });

    // Фильтры этажа
    document.getElementById('floor-min')?.addEventListener('input', debounce(handleFloorFilter, 300));
    document.getElementById('floor-max')?.addEventListener('input', debounce(handleFloorFilter, 300));

    // Фильтры года
    document.getElementById('year-min')?.addEventListener('input', debounce(handleYearFilter, 300));
    document.getElementById('year-max')?.addEventListener('input', debounce(handleYearFilter, 300));

    // Чекбоксы
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', handleCheckboxFilter);
    });

    // Сортировка
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSort);
    }

    // Переключение вида
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', handleViewToggle);
    });

    // Пагинация
    document.addEventListener('click', handlePagination);

    // Модальное окно
    document.addEventListener('click', handleModal);

    // Кнопки транзакций в навигации
    document.querySelectorAll('.nav-transaction-btn').forEach(btn => {
        btn.addEventListener('click', handleTransactionFilter);
    });
}

// ==================== ОБРАБОТЧИКИ ФИЛЬТРОВ ====================

function handleSearch() {
    const searchInput = document.getElementById('main-search');
    currentFilters.search = searchInput.value.toLowerCase();
    applyFilters();
}

function handleTypeFilter(e) {
    const type = e.currentTarget.dataset.type;
    
    // Убираем активный класс с других кнопок
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    
    // Добавляем активный класс к выбранной кнопке
    e.currentTarget.classList.add('active');
    
    currentFilters.type = type;
    applyFilters();
}

function handleCityFilter(e) {
    currentFilters.city = e.target.value || null;
    currentFilters.district = null;
    currentFilters.metroLine = null;
    currentFilters.metroStation = null;
    
    updateDistrictChips();
    updateMetroFilters();
    applyFilters();
}

function handlePriceFilter() {
    const priceMin = document.getElementById('price-min').value;
    const priceMax = document.getElementById('price-max').value;
    
    currentFilters.priceMin = priceMin ? parseFloat(priceMin) : null;
    currentFilters.priceMax = priceMax ? parseFloat(priceMax) : null;
    applyFilters();
}

function handleAreaFilter() {
    const areaMin = document.getElementById('area-min').value;
    const areaMax = document.getElementById('area-max').value;
    
    currentFilters.areaMin = areaMin ? parseFloat(areaMin) : null;
    currentFilters.areaMax = areaMax ? parseFloat(areaMax) : null;
    applyFilters();
}

function handleDistrictFilter(e) {
    if (e.target.classList.contains('district-chip')) {
        const district = e.target.textContent.trim();
        
        if (e.target.classList.contains('active')) {
            e.target.classList.remove('active');
            currentFilters.district = null;
        } else {
            document.querySelectorAll('.district-chip').forEach(chip => {
                chip.classList.remove('active');
            });
            e.target.classList.add('active');
            currentFilters.district = district;
        }
        
        applyFilters();
    }
}

function handleMetroLineFilter(e) {
    const line = e.target.value;
    currentFilters.metroLine = line || null;
    currentFilters.metroStation = null;
    
    updateMetroStations();
    applyFilters();
}

function handleMetroStationFilter(e) {
    currentFilters.metroStation = e.target.value || null;
    applyFilters();
}

function handleRoomsFilter(e) {
    const rooms = e.currentTarget.dataset.rooms;
    
    // Убираем активный класс с других кнопок
    document.querySelectorAll('.room-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Добавляем активный класс к выбранной кнопке
    e.currentTarget.classList.add('active');
    
    currentFilters.rooms = rooms === '5+' ? 5 : parseInt(rooms);
    applyFilters();
}

function handleFloorFilter() {
    const floorMin = document.getElementById('floor-min').value;
    const floorMax = document.getElementById('floor-max').value;
    
    currentFilters.floorMin = floorMin ? parseInt(floorMin) : null;
    currentFilters.floorMax = floorMax ? parseInt(floorMax) : null;
    applyFilters();
}

function handleYearFilter() {
    const yearMin = document.getElementById('year-min').value;
    const yearMax = document.getElementById('year-max').value;
    
    currentFilters.yearMin = yearMin ? parseInt(yearMin) : null;
    currentFilters.yearMax = yearMax ? parseInt(yearMax) : null;
    applyFilters();
}

function handleCheckboxFilter(e) {
    const checkbox = e.target;
    const filterName = checkbox.id;
    
    currentFilters[filterName] = checkbox.checked;
    applyFilters();
}

function handleSort(e) {
    sortBy = e.target.value;
    applyFilters();
}

function handleViewToggle(e) {
    const view = e.currentTarget.dataset.view;
    
    // Убираем активный класс с других кнопок
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Добавляем активный класс к выбранной кнопке
    e.currentTarget.classList.add('active');
    
    currentView = view;
    renderProperties();
}

function handleTransactionFilter(e) {
    const transaction = e.currentTarget.dataset.transaction;
    
    // Убираем активный класс с других кнопок
    document.querySelectorAll('.nav-transaction-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Добавляем активный класс к выбранной кнопке
    e.currentTarget.classList.add('active');
    
    // Фильтруем по типу сделки
    currentFilters.transactionType = transaction;
    applyFilters();
}

function handlePagination(e) {
    if (e.target.classList.contains('pagination-btn')) {
        const page = parseInt(e.target.dataset.page);
        if (page && page !== currentPage) {
            currentPage = page;
            renderProperties();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
}

function handleModal(e) {
    if (e.target.classList.contains('property-card') || e.target.closest('.property-card')) {
        const card = e.target.closest('.property-card');
        const propertyId = parseInt(card.dataset.id);
        openPropertyModal(propertyId);
    }
    
    if (e.target.classList.contains('close-btn') || e.target.closest('.close-btn')) {
        closeModal();
    }
    
    if (e.target.id === 'property-modal') {
        closeModal();
    }
}

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

function toggleAdvancedFilters() {
    const advancedFilters = document.getElementById('advanced-filters');
    const btn = document.querySelector('.advanced-filters-btn');
    
    if (advancedFilters.classList.contains('active')) {
        advancedFilters.classList.remove('active');
        btn.innerHTML = '<i class="fas fa-sliders-h"></i> Розширені фільтри';
    } else {
        advancedFilters.classList.add('active');
        btn.innerHTML = '<i class="fas fa-chevron-up"></i> Приховати фільтри';
    }
}

function updateDistrictChips() {
    const container = document.getElementById('district-chips');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (currentFilters.city && citiesData[currentFilters.city]) {
        const city = citiesData[currentFilters.city];
        city.districts.forEach(district => {
            const chip = document.createElement('div');
            chip.className = 'district-chip';
            chip.textContent = district;
            container.appendChild(chip);
        });
    }
}

function updateMetroFilters() {
    const lineSelect = document.getElementById('metro-line');
    const stationSelect = document.getElementById('metro-station');
    
    if (!lineSelect || !stationSelect) return;
    
    // Очищаем опции
    lineSelect.innerHTML = '<option value="">Виберіть лінію</option>';
    stationSelect.innerHTML = '<option value="">Виберіть станцію</option>';
    
    if (currentFilters.city && citiesData[currentFilters.city]?.metro) {
        const metro = citiesData[currentFilters.city].metro;
        
        Object.keys(metro.lines).forEach(lineName => {
            const option = document.createElement('option');
            option.value = lineName;
            option.textContent = lineName;
            lineSelect.appendChild(option);
        });
    }
}

function updateMetroStations() {
    const stationSelect = document.getElementById('metro-station');
    if (!stationSelect) return;
    
    stationSelect.innerHTML = '<option value="">Виберіть станцію</option>';
    
    if (currentFilters.city && currentFilters.metroLine && citiesData[currentFilters.city]?.metro) {
        const metro = citiesData[currentFilters.city].metro;
        const stations = metro.lines[currentFilters.metroLine] || [];
        
        stations.forEach(station => {
            const option = document.createElement('option');
            option.value = station;
            option.textContent = station;
            stationSelect.appendChild(option);
        });
    }
}

function clearAllFilters() {
    // Сбрасываем все фильтры
    currentFilters = {
        search: "",
        type: null,
        city: null,
        district: null,
        metroLine: null,
        metroStation: null,
        rooms: null,
        priceMin: null,
        priceMax: null,
        areaMin: null,
        areaMax: null,
        floorMin: null,
        floorMax: null,
        yearMin: null,
        yearMax: null,
        balcony: false,
        parking: false,
        elevator: false,
        furnished: false
    };
    
    // Очищаем форму
    document.getElementById('main-search').value = '';
    document.getElementById('city-select').value = '';
    document.getElementById('price-min').value = '';
    document.getElementById('price-max').value = '';
    document.getElementById('area-min').value = '';
    document.getElementById('area-max').value = '';
    document.getElementById('floor-min').value = '';
    document.getElementById('floor-max').value = '';
    document.getElementById('year-min').value = '';
    document.getElementById('year-max').value = '';
    
    // Сбрасываем активные кнопки
    document.querySelectorAll('.filter-chip').forEach(chip => chip.classList.remove('active'));
    document.querySelectorAll('.room-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.district-chip').forEach(chip => chip.classList.remove('active'));
    
    // Сбрасываем чекбоксы
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Обновляем интерфейс
    updateDistrictChips();
    updateMetroFilters();
    applyFilters();
}

// ==================== ПРИМЕНЕНИЕ ФИЛЬТРОВ ====================

function applyFilters() {
    filteredProperties = allProperties.filter(property => {
        // Поиск по тексту
        if (currentFilters.search) {
            const searchText = `${property.title} ${property.cityName} ${property.district} ${property.description}`.toLowerCase();
            if (!searchText.includes(currentFilters.search)) return false;
        }
        
        // Фильтр по типу
        if (currentFilters.type && property.type !== currentFilters.type) return false;
        
        // Фильтр по городу
        if (currentFilters.city && property.city !== currentFilters.city) return false;
        
        // Фильтр по району
        if (currentFilters.district && property.district !== currentFilters.district) return false;
        
        // Фильтр по метро
        if (currentFilters.metroStation && (!property.metro || property.metro.station !== currentFilters.metroStation)) return false;
        
        // Фильтр по комнатам
        if (currentFilters.rooms !== null) {
            if (currentFilters.rooms === 5) {
                if (property.rooms < 5) return false;
            } else {
                if (property.rooms !== currentFilters.rooms) return false;
            }
        }
        
        // Фильтр по цене
        if (currentFilters.priceMin !== null && property.price < currentFilters.priceMin) return false;
        if (currentFilters.priceMax !== null && property.price > currentFilters.priceMax) return false;
        
        // Фильтр по площади
        if (currentFilters.areaMin !== null && property.area < currentFilters.areaMin) return false;
        if (currentFilters.areaMax !== null && property.area > currentFilters.areaMax) return false;
        
        // Фильтр по этажу
        if (currentFilters.floorMin !== null && property.floor < currentFilters.floorMin) return false;
        if (currentFilters.floorMax !== null && property.floor > currentFilters.floorMax) return false;
        
        // Фильтр по году
        if (currentFilters.yearMin !== null && property.year < currentFilters.yearMin) return false;
        if (currentFilters.yearMax !== null && property.year > currentFilters.yearMax) return false;
        
        // Фильтры по опциям
        if (currentFilters.balcony && !property.balcony) return false;
        if (currentFilters.parking && !property.parking) return false;
        if (currentFilters.elevator && !property.elevator) return false;
        if (currentFilters.furnished && !property.furnished) return false;
        
        return true;
    });
    
    // Сортировка
    sortProperties();
    
    // Сброс пагинации
    currentPage = 1;
    
    // Рендеринг
    renderProperties();
    updateResultsCount();
}

function sortProperties() {
    filteredProperties.sort((a, b) => {
        switch (sortBy) {
            case 'price-asc':
                return a.price - b.price;
            case 'price-desc':
                return b.price - a.price;
            case 'area-asc':
                return a.area - b.area;
            case 'area-desc':
                return b.area - a.area;
            case 'newest':
                return b.year - a.year;
            case 'oldest':
                return a.year - b.year;
            default:
                return 0;
        }
    });
}

// ==================== РЕНДЕРИНГ ====================

function renderProperties() {
    const container = document.getElementById('properties-container');
    const grid = document.getElementById('properties-grid');
    
    if (!container || !grid) return;
    
    // Показываем загрузку
    grid.innerHTML = '<div class="loading"><div class="loading-spinner"></div></div>';
    
    setTimeout(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const propertiesToShow = filteredProperties.slice(startIndex, endIndex);
        
        if (propertiesToShow.length === 0) {
            grid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>Об'єктів не знайдено</h3>
                    <p>Спробуйте змінити параметри пошуку</p>
                </div>
            `;
        } else {
            grid.innerHTML = propertiesToShow.map(property => createPropertyCard(property)).join('');
        }
        
        renderPagination();
    }, 300);
}

function createPropertyCard(property) {
    const type = propertyTypes[property.type];
    const transaction = transactionTypes[property.transactionType];
    
    return `
        <div class="property-card" data-id="${property.id}">
            <div class="property-image">
                <img src="${property.image}" alt="${property.title}" loading="lazy">
                <div class="property-badge">${transaction}</div>
                <button class="property-favorite" onclick="toggleFavorite(${property.id})">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            <div class="property-content">
                <h3 class="property-title">${property.title}</h3>
                <div class="property-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${property.district}, ${property.cityName}</span>
                </div>
                
                <div class="property-details">
                    ${property.rooms > 0 ? `
                        <div class="detail-item">
                            <div class="detail-item-value">${property.rooms}</div>
                            <div class="detail-item-label">Кімнат</div>
                        </div>
                    ` : ''}
                    <div class="detail-item">
                        <div class="detail-item-value">${property.area}</div>
                        <div class="detail-item-label">м²</div>
                    </div>
                    ${property.floor > 0 ? `
                        <div class="detail-item">
                            <div class="detail-item-value">${property.floor}</div>
                            <div class="detail-item-label">Поверх</div>
                        </div>
                    ` : ''}
                </div>
                
                <div class="property-price">
                    $${property.price.toLocaleString()} ${property.transactionType === 'rent' ? '/міс' : ''}
                </div>
                
                <div class="property-actions">
                    <button class="btn-details" onclick="openPropertyModal(${property.id})">
                        Детальніше
                    </button>
                    <button class="btn-contact" onclick="contactProperty(${property.id})">
                        <i class="fas fa-phone"></i>
                        Зв'язатися
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Кнопка "Назад"
    paginationHTML += `
        <button class="pagination-btn" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    // Номера страниц
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">
                ${i}
            </button>
        `;
    }
    
    // Кнопка "Вперед"
    paginationHTML += `
        <button class="pagination-btn" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    pagination.innerHTML = paginationHTML;
}

function updateResultsCount() {
    const countElement = document.getElementById('results-count');
    if (countElement) {
        countElement.textContent = filteredProperties.length.toLocaleString();
    }
    
    const queryElement = document.getElementById('search-query');
    if (queryElement) {
        const query = currentFilters.search ? `"${currentFilters.search}"` : 'всі об\'єкти';
        queryElement.textContent = `Показано ${query}`;
    }
}

// ==================== МОДАЛЬНОЕ ОКНО ====================

function openPropertyModal(propertyId) {
    const property = allProperties.find(p => p.id === propertyId);
    if (!property) return;
    
    const modal = document.getElementById('property-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    const contactBtn = document.getElementById('contact-btn');
    
    if (!modal || !title || !body || !contactBtn) return;
    
    title.textContent = property.title;
    
    body.innerHTML = `
        <div class="property-modal-content">
            <div class="property-modal-image">
                <img src="${property.image}" alt="${property.title}">
            </div>
            
            <div class="property-modal-info">
                <div class="property-modal-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${property.district}, ${property.cityName}</span>
                </div>
                
                <div class="property-modal-description">
                    <p>${property.description}</p>
                </div>
                
                <div class="property-modal-details">
                    <div class="detail-grid">
                        <div class="detail-item">
                            <span class="detail-label">Тип:</span>
                            <span class="detail-value">${property.typeName}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Угода:</span>
                            <span class="detail-value">${transactionTypes[property.transactionType]}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Ціна:</span>
                            <span class="detail-value">$${property.price.toLocaleString()} ${property.transactionType === 'rent' ? '/міс' : ''}</span>
                        </div>
                        ${property.rooms > 0 ? `
                            <div class="detail-item">
                                <span class="detail-label">Кімнат:</span>
                                <span class="detail-value">${property.rooms}</span>
                            </div>
                        ` : ''}
                        <div class="detail-item">
                            <span class="detail-label">Площа:</span>
                            <span class="detail-value">${property.area} м²</span>
                        </div>
                        ${property.floor > 0 ? `
                            <div class="detail-item">
                                <span class="detail-label">Поверх:</span>
                                <span class="detail-value">${property.floor}</span>
                            </div>
                        ` : ''}
                        <div class="detail-item">
                            <span class="detail-label">Рік:</span>
                            <span class="detail-value">${property.year}</span>
                        </div>
                    </div>
                    
                    <div class="property-modal-features">
                        <h4>Особливості:</h4>
                        <div class="features-list">
                            ${property.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    contactBtn.onclick = () => contactProperty(propertyId);
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('property-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function toggleFavorite(propertyId) {
    const btn = document.querySelector(`[data-id="${propertyId}"] .property-favorite`);
    if (btn) {
        btn.classList.toggle('active');
        const icon = btn.querySelector('i');
        if (btn.classList.contains('active')) {
            icon.className = 'fas fa-heart';
        } else {
            icon.className = 'far fa-heart';
        }
    }
}

function contactProperty(propertyId) {
    const property = allProperties.find(p => p.id === propertyId);
    if (!property) return;
    
    const city = citiesData[property.city];
    if (city?.bot) {
        window.open(city.bot, '_blank');
    } else {
        alert('Контактна інформація недоступна');
    }
}

// ==================== УТИЛИТЫ ====================

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

// ==================== ЭКСПОРТ ДЛЯ ГЛОБАЛЬНОГО ДОСТУПА ====================

window.openPropertyModal = openPropertyModal;
window.closeModal = closeModal;
window.toggleFavorite = toggleFavorite;
window.contactProperty = contactProperty;
window.clearAllFilters = clearAllFilters;