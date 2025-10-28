// ==================== ДАННЫЕ ====================

// Структура регіонів, міст та районів
const regions = {
  kyiv_region: {
    name: "Київська обл",
    cities: {
      kyiv: {
        name: "м. Київ",
        bot: "https://t.me/estatyq_kyiv",
        hasMetro: true,
        metroLines: {
          "Червона лінія": ["Академмістечко", "Житомирська", "Святошин", "Нивки", "Берестейська", "Шулявська", "Політехнічний інститут", "Вокзальна", "Університет", "Театральна", "Хрещатик", "Арсенальна", "Дніпро", "Гідропарк", "Лівобережна", "Дарниця", "Чернігівська", "Лісова"],
          "Синя лінія": ["Героїв Дніпра", "Мінська", "Оболонь", "Петрівка", "Тараса Шевченка", "Контрактова площа", "Поштова площа", "Майдан Незалежності", "Площа Льва Толстого", "Олімпійська", "Палац Україна", "Либідська", "Деміївська", "Голосіївська", "Васильківська", "Виставковий центр", "Іподром", "Теремки"],
          "Зелена лінія": ["Сирець", "Дорогожичі", "Лук'янівська", "Золоті ворота", "Палац спорту", "Кловська", "Печерська", "Дружби народів", "Видубичі", "Славутич", "Осокорки", "Позняки", "Харківська", "Вирлиця", "Бориспільська", "Червоний хутір"]
        },
        districts: ["Печерськ", "Оболонь", "Поділ", "Теремки", "Вишневе", "Центр"],
        microdistricts: {
          "Печерськ": ["Вул. Хрещатик", "Вул. Липки", "Поділ-Яблочний"],
          "Оболонь": ["Північна Оболонь", "Південна Оболонь", "Озерен"],
          "Поділ": ["Вул. Покровка", "Вул. Щоповиця", "Верхній Поділ"],
          "Теремки": ["Червоні Тераси", "Теремки-1", "Теремки-2"],
          "Вишневе": ["Вулиця Північна", "Вулиця Південна"],
          "Центр": ["Крещатик", "Майдан", "Європейська площа"]
        }
      }
    },
    settlements: ["Бучи", "Ірпінь", "Боярка", "Вишневе", "Гостомель", "Буча"]
  },
  kharkiv_region: {
    name: "Харківська обл",
    cities: {
      kharkiv: {
        name: "м. Харків",
        bot: "https://t.me/estatyq_kharkiv",
        hasMetro: true,
        metroLines: {
          "Холодногірсько-Заводська лінія": ["Холодна Гора", "Південний вокзал", "Центральний ринок", "Майдан Конституції", "Проспект Гагаріна", "Спортивна", "Завод ім. Малишева", "Тракторний завод", "Індустріальна"],
          "Салтівська лінія": ["Історичний музей", "Університет", "Пушкінська", "Київська", "Академіка Барабашова", "Академіка Павлова", "Студентська", "Героїв Праці"]
        },
        districts: ["Центр", "Нові Дома", "Шевченко", "Індустріальний", "Київський"],
        microdistricts: {
          "Центр": ["Площа Свободи", "Вулиця Сумська", "Вулиця Пушкіна"],
          "Нові Дома": ["Метро Академіка", "Алабін"],
          "Шевченко": ["Артема", "Бірюльки"],
          "Індустріальний": ["Завод ім. Малишева", "Немишлянська"],
          "Київський": ["Південна", "Північна"]
        }
      }
    },
    settlements: ["Чугуїв", "Люботин", "Вільшана", "Коротич", "Дергачі"]
  },
  odesa_region: {
    name: "Одеська обл",
    cities: {
      odesa: {
        name: "м. Одеса",
        bot: "https://t.me/estatyq_odesa",
        hasMetro: false,
        districts: ["Приморський", "Малиновський", "Суворовський"],
        microdistricts: {
          "Приморський": ["Арт-бульвар", "Французький бульвар"],
          "Малиновський": ["Малиновська площа", "Косметична"],
          "Суворовський": ["Шевченко", "Водоканал"]
        }
      }
    },
    settlements: ["Білгород-Дністровський", "Іванівка", "Сарата", "Татарбунари"]
  },
  lviv_region: {
    name: "Львівська обл",
    cities: {
      lviv: {
        name: "м. Львів",
        bot: "https://t.me/estatyq_lviv",
        hasMetro: false,
        districts: ["Галицький", "Франківський", "Залізничний"],
        microdistricts: {
          "Галицький": ["Центр", "Вірменський квартал"],
          "Франківський": ["Святошин", "Дикі ліщини"],
          "Залізничний": ["Залізниця", "Кульпарків"]
        }
      }
    },
    settlements: ["Дрогобич", "Моршин", "Трускавець", "Стебник"]
  },
  dnipro_region: {
    name: "Дніпропетровська обл",
    cities: {
      dnipro: {
        name: "м. Дніпро",
        bot: "https://t.me/estatyq_dnipro",
        hasMetro: true,
        metroLines: {
          "Центрально-Заводська лінія": ["Вокзальна", "Металургів", "Завод ім. Петровського", "Проспект Свободи", "Площа Соборна", "Театральна"]
        },
        districts: ["Центр", "Заводоуковський", "Совєтський"],
        microdistricts: {
          "Центр": ["Січеславський проспект", "Вулиця Ломоносова"],
          "Заводоуковський": ["Гідропарк", "Промзона"],
          "Совєтський": ["Північна", "Південна"]
        }
      }
    },
    settlements: ["Кривий Ріг", "Павлоград", "Марганець", "Запорізька"]
  },
  zaporizhzhia_region: {
    name: "Запоріська обл",
    cities: {
      zaporizhzhia: {
        name: "м. Запоріжжя",
        bot: "https://t.me/estatyq_zaporizhzhia",
        hasMetro: false,
        districts: ["Комунарський", "Хортицький", "Центр"],
        microdistricts: {
          "Комунарський": ["Красногвардійський", "Комунальний"],
          "Хортицький": ["Хортиця", "Острівна"],
          "Центр": ["Центральна", "Дніпровська"]
        }
      }
    },
    settlements: ["Енергодар", "Токмак", "Мелітополь", "Акимівка"]
  },
  ivano_frankivsk_region: {
    name: "Івано-Франківська обл",
    cities: {
      ivano_frankivsk: {
        name: "м. Івано-Франківськ",
        bot: "https://t.me/estatyq_ivano_frankivsk",
        hasMetro: false,
        districts: ["Центр", "Тис-гірський", "Прикарпатський", "Вовчинецький"],
        microdistricts: {
          "Центр": ["Центральна площа", "Вулиця Василяна"],
          "Тис-гірський": ["Північне", "Південне"],
          "Прикарпатський": ["Восток", "Запад"],
          "Вовчинецький": ["Вовчинці", "Околиця"]
        }
      }
    },
    settlements: ["Калуш", "Коломия", "Кут", "Снятин"]
  }
};

// Для сумісності: плаский масив міст
const cities = {
  kyiv: { name: "Київ", bot: "https://t.me/estatyq_kyiv", region: "kyiv_region" },
  kharkiv: { name: "Харків", bot: "https://t.me/estatyq_kharkiv", region: "kharkiv_region" },
  odesa: { name: "Одеса", bot: "https://t.me/estatyq_odesa", region: "odesa_region" },
  lviv: { name: "Львів", bot: "https://t.me/estatyq_lviv", region: "lviv_region" },
  dnipro: { name: "Дніпро", bot: "https://t.me/estatyq_dnipro", region: "dnipro_region" },
  zaporizhzhia: { name: "Запоріжжя", bot: "https://t.me/estatyq_zaporizhzhia", region: "zaporizhzhia_region" },
  ivano_frankivsk: { name: "Івано-Франківськ", bot: "https://t.me/estatyq_ivano_frankivsk", region: "ivano_frankivsk_region" }
};

const propertyTypes = {
  apartment: "Квартира",
  house: "Дім",
  commercial: "Комерція",
  land: "Земля",
  office: "Офіс",
  warehouse: "Склад"
};

// Доступные типы недвижимости для каждого раздела
const propertyTypesByTransaction = {
  sale: ["apartment", "house", "commercial", "land", "office", "warehouse"],
  rent: ["apartment", "house", "commercial", "land", "office", "warehouse"],
  daily: ["apartment", "house", "office"]
};

// ==================== КОНФИГ ФИЛЬТРОВ ДЛЯ КАЖДОГО ТИПА ====================

const filterConfigByType = {
  // Продаж квартир
  apartment_sale: [
    { id: "rooms", label: "Кімнат", type: "range", min: 0, max: 6 },
    { id: "area", label: "Площа загальна, м²", type: "range", min: 30, max: 300 },
    { id: "floor", label: "Поверх", type: "range", min: 1, max: 25 },
    { id: "floorNotLast", label: "Не останній поверх", type: "checkbox" },
    { id: "price", label: "Ціна ($)", type: "range", min: 0, max: 500 }
  ],
  
  // Оренда квартир
  apartment_rent: [
    { id: "rooms", label: "Кімнат", type: "range", min: 0, max: 6 },
    { id: "area", label: "Площа загальна, м²", type: "range", min: 30, max: 300 },
    { id: "floor", label: "Поверх", type: "range", min: 1, max: 25 },
    { id: "floorNotLast", label: "Не останній поверх", type: "checkbox" },
    { id: "price", label: "Ціна (грн.)", type: "range", min: 0, max: 500 },
    { id: "pets", label: "Домашні тварини", type: "select", options: ["не вибрано", "дозволені", "заборонені"] },
    { id: "monthlyRent", label: "Можна на 1-2 місяці", type: "checkbox" },
    { id: "waterHeater", label: "Водонагрівач", type: "select", options: ["не вказано", "так", "ні"] },
    { id: "microwave", label: "Мікрохвильова", type: "select", options: ["не вказано", "так", "ні"] },
    { id: "oven", label: "Духовка", type: "select", options: ["не вказано", "так", "ні"] }
  ],
  
  // Подобова оренда квартир
  apartment_daily: [
    { id: "rooms", label: "Кімнат", type: "range", min: 0, max: 6 },
    { id: "area", label: "Площа, м²", type: "range", min: 30, max: 300 },
    { id: "price", label: "Ціна (грн.)", type: "range", min: 0, max: 500 }
  ],
  
  // Продаж будинків
  house_sale: [
    { id: "area", label: "Площа будинку, м²", type: "range", min: 100, max: 500 },
    { id: "plotArea", label: "Ділянка (сот)", type: "range", min: 1, max: 100 },
    { id: "price", label: "Ціна ($)", type: "range", min: 0, max: 1000 }
  ],
  
  // Оренда будинків
  house_rent: [
    { id: "area", label: "Площа будинку, м²", type: "range", min: 100, max: 500 },
    { id: "plotArea", label: "Ділянка (сот)", type: "range", min: 1, max: 100 },
    { id: "price", label: "Ціна (грн.)", type: "range", min: 0, max: 1000 },
    { id: "monthlyRent", label: "Можна на місяць", type: "checkbox" }
  ],
  
  // Подобова оренда будинків
  house_daily: [
    { id: "area", label: "Площа будинку, м²", type: "range", min: 100, max: 500 },
    { id: "plotArea", label: "Ділянка (сот)", type: "range", min: 1, max: 100 },
    { id: "price", label: "Ціна (грн.)", type: "range", min: 0, max: 1000 }
  ],
  
  // Продаж офісів
  office_sale: [
    { id: "officeType", label: "Тип офісу", type: "select", options: ["не вибрано", "відкритий простір", "кабінет", "індивідуальний"] },
    { id: "area", label: "Площа, м²", type: "range", min: 20, max: 500 },
    { id: "price", label: "Ціна ($)", type: "range", min: 0, max: 1000 }
  ],
  
  // Оренда офісів
  office_rent: [
    { id: "officeType", label: "Тип офісу", type: "select", options: ["не вибрано", "відкритий простір", "кабінет", "індивідуальний"] },
    { id: "area", label: "Площа, м²", type: "range", min: 20, max: 500 },
    { id: "price", label: "Ціна (грн.)", type: "range", min: 0, max: 1000 }
  ],
  
  // Подобова оренда офісів
  office_daily: [
    { id: "officeType", label: "Тип офісу", type: "select", options: ["не вибрано", "відкритий простір", "кабінет", "індивідуальний"] },
    { id: "area", label: "Площа, м²", type: "range", min: 20, max: 500 },
    { id: "price", label: "Ціна (грн.)", type: "range", min: 0, max: 1000 }
  ],
  
  // Продаж комерції
  commercial_sale: [
    { id: "commercialType", label: "Тип об'єкту", type: "select", options: ["не вибрано", "магазин", "кафе", "сервіс", "інше"] },
    { id: "area", label: "Площа, м²", type: "range", min: 20, max: 500 },
    { id: "price", label: "Ціна ($)", type: "range", min: 0, max: 1000 }
  ],
  
  // Оренда комерції
  commercial_rent: [
    { id: "commercialType", label: "Тип об'єкту", type: "select", options: ["не вибрано", "магазин", "кафе", "сервіс", "інше"] },
    { id: "area", label: "Площа, м²", type: "range", min: 20, max: 500 },
    { id: "price", label: "Ціна (грн.)", type: "range", min: 0, max: 1000 }
  ],
  
  // Продаж землі
  land_sale: [
    { id: "landType", label: "Тип об'єкту", type: "select", options: ["не вибрано", "під забудову", "промислова", "сільськогосподарська"] },
    { id: "plotArea", label: "Площа (сот)", type: "range", min: 1, max: 500 },
    { id: "price", label: "Ціна ($)", type: "range", min: 0, max: 1000 }
  ],
  
  // Оренда землі
  land_rent: [
    { id: "landType", label: "Тип об'єкту", type: "select", options: ["не вибрано", "під забудову", "промислова", "сільськогосподарська"] },
    { id: "plotArea", label: "Площа (сот)", type: "range", min: 1, max: 500 },
    { id: "price", label: "Ціна (грн.)", type: "range", min: 0, max: 1000 }
  ],
  
  // Продаж виробничої/промислової нерухомості
  warehouse_sale: [
    { id: "warehouseType", label: "Тип об'єкту", type: "select", options: ["не вибрано", "склад", "виробництво", "логістика"] },
    { id: "area", label: "Площа, м²", type: "range", min: 100, max: 1000 },
    { id: "plotArea", label: "Ділянка (сот)", type: "range", min: 1, max: 100 },
    { id: "price", label: "Ціна ($)", type: "range", min: 0, max: 1000 }
  ],
  
  // Оренда виробничої/промислової нерухомості
  warehouse_rent: [
    { id: "warehouseType", label: "Тип об'єкту", type: "select", options: ["не вибрано", "склад", "виробництво", "логістика"] },
    { id: "area", label: "Площа, м²", type: "range", min: 100, max: 1000 },
    { id: "plotArea", label: "Ділянка (сот)", type: "range", min: 1, max: 100 },
    { id: "price", label: "Ціна (грн.)", type: "range", min: 0, max: 1000 }
  ]
};

const locations = {
  kyiv: ["Центр", "Оболонь", "Печерськ", "Поділ", "Теремки", "Вишневе"],
  kharkiv: ["Центр", "Мерефа", "Шевченко", "Нові Дома", "Індустріальний", "Київський"],
  odesa: ["Приморський", "Малиновський", "Суворовський"],
  lviv: ["Центр", "Галіцький", "Франківський", "Залізничний"],
  dnipro: ["Центр", "Ленінський", "Индустріальний", "Заводоуковський", "Совєтський"],
  zaporizhzhia: ["Центр", "Комунарський", "Хортицький"],
  ivano_frankivsk: ["Центр", "Тис-гірський", "Прикарпатський", "Вовчинецький"]
};

// ==================== ГЕНЕРАЦІЯ ДАНИХ ====================
// Функция generateProperties() больше не используется, данные загружаются с API
// Оставляем для справки, но она не вызывается при инициализации
/*
function generateProperties() {
  const properties = [];
  let id = 1;
  
  Object.entries(cities).forEach(([cityKey]) => {
    // Квартири
    for (let i = 0; i < 30; i++) {
      properties.push({
        id: id++,
        title: `Квартира ${id}`,
        city: cityKey,
        region: cities[cityKey].region,
        type: "apartment",
        transactionType: Math.random() > 0.6 ? "rent" : "sale",
        location: locations[cityKey][Math.floor(Math.random() * locations[cityKey].length)],
        price: Math.random() > 0.5 ? Math.floor(50 + Math.random() * 150) : Math.floor(15 + Math.random() * 30),
        rooms: Math.floor(Math.random() * 5),
        area: Math.floor(35 + Math.random() * 150),
        floor: Math.floor(1 + Math.random() * 20),
        building: 1990 + Math.floor(Math.random() * 35),
        image: `https://via.placeholder.com/400x300?text=Квартира+${id}`,
        daily: false,
        // Поля для оренди
        waterHeater: Math.random() > 0.5 ? "так" : "ні",
        microwave: Math.random() > 0.5 ? "так" : "ні",
        oven: Math.random() > 0.5 ? "так" : "ні",
        pets: ["дозволені", "заборонені"][Math.floor(Math.random() * 2)],
        monthlyRent: Math.random() > 0.7,
        floorNotLast: Math.random() > 0.6
      });
    }
    
    // Дома
    for (let i = 0; i < 15; i++) {
      properties.push({
        id: id++,
        title: `Дім ${id}`,
        city: cityKey,
        region: cities[cityKey].region,
        type: "house",
        transactionType: Math.random() > 0.7 ? "rent" : "sale",
        location: locations[cityKey][Math.floor(Math.random() * locations[cityKey].length)],
        price: Math.random() > 0.5 ? Math.floor(100 + Math.random() * 300) : Math.floor(50 + Math.random() * 150),
        rooms: Math.floor(2 + Math.random() * 4),
        area: Math.floor(150 + Math.random() * 300),
        floor: 2,
        building: 1985 + Math.floor(Math.random() * 40),
        image: `https://via.placeholder.com/400x300?text=Дім+${id}`,
        daily: false,
        plotArea: Math.floor(5 + Math.random() * 50),
        monthlyRent: Math.random() > 0.7
      });
    }
    
    // Подобово - Квартири (денна оренда)
    for (let i = 0; i < 15; i++) {
      properties.push({
        id: id++,
        title: `Квартира ${id} (подобово)`,
        city: cityKey,
        region: cities[cityKey].region,
        type: "apartment",
        transactionType: "daily",
        location: locations[cityKey][Math.floor(Math.random() * locations[cityKey].length)],
        price: Math.floor(30 + Math.random() * 100),
        rooms: Math.floor(Math.random() * 4),
        area: Math.floor(40 + Math.random() * 120),
        floor: Math.floor(1 + Math.random() * 20),
        building: 1990 + Math.floor(Math.random() * 35),
        image: `https://via.placeholder.com/400x300?text=Квартира+подобово+${id}`,
        daily: true
      });
    }
    
    // Подобово - Дома (денна оренда)
    for (let i = 0; i < 10; i++) {
      properties.push({
        id: id++,
        title: `Дім ${id} (подобово)`,
        city: cityKey,
        region: cities[cityKey].region,
        type: "house",
        transactionType: "daily",
        location: locations[cityKey][Math.floor(Math.random() * locations[cityKey].length)],
        price: Math.floor(80 + Math.random() * 200),
        rooms: Math.floor(2 + Math.random() * 3),
        area: Math.floor(180 + Math.random() * 250),
        floor: 2,
        building: 1985 + Math.floor(Math.random() * 40),
        image: `https://via.placeholder.com/400x300?text=Дім+подобово+${id}`,
        daily: true
      });
    }
    
    // Подобово - Офіси (денна оренда)
    for (let i = 0; i < 8; i++) {
      properties.push({
        id: id++,
        title: `Офіс ${id} (подобово)`,
        city: cityKey,
        region: cities[cityKey].region,
        type: "office",
        transactionType: "daily",
        location: locations[cityKey][Math.floor(Math.random() * locations[cityKey].length)],
        price: Math.floor(40 + Math.random() * 120),
        rooms: Math.floor(1 + Math.random() * 3),
        area: Math.floor(20 + Math.random() * 100),
        floor: Math.floor(1 + Math.random() * 15),
        building: 2000 + Math.floor(Math.random() * 25),
        image: `https://via.placeholder.com/400x300?text=Офіс+подобово+${id}`,
        daily: true
      });
    }
    
    // Офіси (продаж і оренда)
    for (let i = 0; i < 10; i++) {
      properties.push({
        id: id++,
        title: `Офіс ${id}`,
        city: cityKey,
        region: cities[cityKey].region,
        type: "office",
        transactionType: Math.random() > 0.6 ? "rent" : "sale",
        location: locations[cityKey][Math.floor(Math.random() * locations[cityKey].length)],
        price: Math.random() > 0.5 ? Math.floor(80 + Math.random() * 250) : Math.floor(30 + Math.random() * 100),
        area: Math.floor(20 + Math.random() * 200),
        floor: Math.floor(1 + Math.random() * 15),
        building: 2000 + Math.floor(Math.random() * 25),
        image: `https://via.placeholder.com/400x300?text=Офіс+${id}`,
        daily: false,
        officeType: ["відкритий простір", "кабінет", "індивідуальний"][Math.floor(Math.random() * 3)]
      });
    }
    
    // Комерція (продаж і оренда)
    for (let i = 0; i < 8; i++) {
      properties.push({
        id: id++,
        title: `Комерція ${id}`,
        city: cityKey,
        region: cities[cityKey].region,
        type: "commercial",
        transactionType: Math.random() > 0.6 ? "rent" : "sale",
        location: locations[cityKey][Math.floor(Math.random() * locations[cityKey].length)],
        price: Math.random() > 0.5 ? Math.floor(100 + Math.random() * 300) : Math.floor(40 + Math.random() * 150),
        area: Math.floor(20 + Math.random() * 300),
        floor: Math.floor(1 + Math.random() * 10),
        building: 1995 + Math.floor(Math.random() * 30),
        image: `https://via.placeholder.com/400x300?text=Комерція+${id}`,
        daily: false,
        commercialType: ["магазин", "кафе", "сервіс", "інше"][Math.floor(Math.random() * 4)]
      });
    }
    
    // Земля (продаж і оренда)
    for (let i = 0; i < 6; i++) {
      properties.push({
        id: id++,
        title: `Земля ${id}`,
        city: cityKey,
        region: cities[cityKey].region,
        type: "land",
        transactionType: Math.random() > 0.6 ? "rent" : "sale",
        location: locations[cityKey][Math.floor(Math.random() * locations[cityKey].length)],
        price: Math.random() > 0.5 ? Math.floor(200 + Math.random() * 500) : Math.floor(50 + Math.random() * 200),
        area: Math.floor(50 + Math.random() * 200),
        floor: 1,
        building: 2000,
        image: `https://via.placeholder.com/400x300?text=Земля+${id}`,
        daily: false,
        plotArea: Math.floor(10 + Math.random() * 100),
        landType: ["під забудову", "промислова", "сільськогосподарська"][Math.floor(Math.random() * 3)]
      });
    }
    
    // Виробничої/промислові приміщення (продаж і оренда)
    for (let i = 0; i < 6; i++) {
      properties.push({
        id: id++,
        title: `Склад/Виробництво ${id}`,
        city: cityKey,
        region: cities[cityKey].region,
        type: "warehouse",
        transactionType: Math.random() > 0.6 ? "rent" : "sale",
        location: locations[cityKey][Math.floor(Math.random() * locations[cityKey].length)],
        price: Math.random() > 0.5 ? Math.floor(150 + Math.random() * 400) : Math.floor(60 + Math.random() * 180),
        area: Math.floor(100 + Math.random() * 500),
        floor: 1,
        building: 1990 + Math.floor(Math.random() * 35),
        image: `https://via.placeholder.com/400x300?text=Склад+${id}`,
        daily: false,
        plotArea: Math.floor(5 + Math.random() * 100),
        warehouseType: ["склад", "виробництво", "логістика"][Math.floor(Math.random() * 3)]
      });
    }
  });
  
  return properties;
}
*/

// ==================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ====================

let allProperties = [];
let filteredProperties = [];

// Глобальні змінні для модального вікна фотографій
let currentPropertyImages = [];
let currentImageIndex = 0;
let lastFocusedElement = null;
let modalKeydownHandler = null;

// ==================== FORMATTERS & HELPERS ====================
const PLACEHOLDER = '—';

function formatNumber(value, options) {
  const num = Number(value);
  if (!Number.isFinite(num)) return PLACEHOLDER;
  return num.toLocaleString('uk-UA', options);
}

function currencySymbol(cur) {
  const c = (cur || '').toUpperCase();
  if (c === 'UAH' || c === '₴') return '₴';
  if (c === 'EUR' || c === '€') return '€';
  return '$';
}

function formatPrice(value, currency, isRent) {
  const num = Number(value);
  if (!Number.isFinite(num)) return PLACEHOLDER;
  const symbol = currencySymbol(currency);
  const formatted = formatNumber(Math.round(num));
  return isRent ? `${symbol}${formatted} /міс` : `${symbol}${formatted}`;
}

function formatInt(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return PLACEHOLDER;
  return formatNumber(Math.round(num));
}

function safeText(text) {
  if (text === undefined || text === null || text === '') return PLACEHOLDER;
  return String(text);
}

function primaryImage(prop) {
  if (Array.isArray(prop.images) && prop.images.length) return prop.images[0];
  return prop.image || 'https://via.placeholder.com/800x600?text=No+Image';
}

function showSkeletons(count = 12) {
  const grid = document.getElementById('properties-grid');
  if (!grid) return;
  grid.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const sk = document.createElement('div');
    sk.className = 'skeleton-card';
    sk.innerHTML = `
      <div class="skeleton-image"></div>
      <div class="skeleton-content">
        <div class="skeleton-title skeleton-text"></div>
        <div class="skeleton-location skeleton-text"></div>
        <div class="skeleton-details">
          <div class="skeleton-detail-item"></div>
          <div class="skeleton-detail-item"></div>
          <div class="skeleton-detail-item"></div>
        </div>
        <div class="skeleton-price skeleton-text"></div>
        <div class="skeleton-buttons">
          <div class="skeleton-button"></div>
          <div class="skeleton-button"></div>
        </div>
      </div>
    `;
    grid.appendChild(sk);
  }
}

async function loadProperties() {
  try {
    const res = await fetch('data/listings.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load listings.json');
    const data = await res.json();
    
    // Нормализуем данные - преобразуем вложенные структуры в плоские
    allProperties = (Array.isArray(data) ? data : []).map(item => ({
      id: item.id || `listing-${Math.random()}`,
      title: item.title || `Об'єкт ${item.id}`,
      description: item.description || '',
      location: item.location || item.locationString || item.location?.address || 'Київ',
      // 🔴 ИСПРАВЛЕНИЕ: Извлекаем цену правильно из объекта price
      price: (item.price && typeof item.price === 'object' && item.price.value) 
        ? Number(item.price.value) 
        : (typeof item.price === 'number' ? item.price : 0),
      currency: (item.price && item.price.currency) || item.currency || 'UAH',
      // 🔴 ИСПРАВЛЕНИЕ: Извлекаем площадь правильно из объекта area
      area: (item.area && typeof item.area === 'object' && item.area.total)
        ? Number(item.area.total)
        : (typeof item.area === 'number' ? item.area : null),
      rooms: item.rooms ? Number(item.rooms) : null,
      floor: item.floor ? (typeof item.floor === 'object' ? item.floor.current : item.floor) : null,
      floorsTotal: item.floorsTotal || (item.floor && typeof item.floor === 'object' ? item.floor.total : null),
      type: (item.type || 'apartment').toLowerCase(),
      transactionType: (item.transactionType || item.rawType === 'аренда' ? 'rent' : 'sale').toLowerCase(),
      images: item.images || [],
      image: (item.images && item.images[0]) || item.image || 'https://via.placeholder.com/400x300?text=No+Image',
      city: item.city || item.location?.cityKey || item.raw?.city || 'kyiv',
      year: item.yearBuilt ? Number(item.yearBuilt) : new Date().getFullYear(),
      building: item.yearBuilt ? Number(item.yearBuilt) : new Date().getFullYear(),
      locationString: item.locationString || item.location || '',
      amenities: item.amenities || {},
      daily: item.transactionType === 'daily' || false
    }));
    
    filteredProperties = [...allProperties];
    console.log(`✅ Загружено ${allProperties.length} объектів з listings.json`);
    applyFilters();
    renderProperties();
  } catch (e) {
    console.error('❌ loadProperties error', e);
  }
}

let filters = {
  region: null,
  city: null,
  districts: [],
  microdistricts: [],
  metroStations: [],
  metro: null, // Станція метро
  transaction: null,
  type: null,
  location: null,
  rooms: null,
  areaMin: null,
  areaMax: null,
  plotAreaMin: null,
  plotAreaMax: null,
  priceMin: null,
  priceMax: null,
  daily: false,
  floorMin: null,
  floorMax: null,
  floorNotLast: false,
  pets: null,
  monthlyRent: false,
  waterHeater: null,
  microwave: null,
  oven: null,
  officeType: null,
  commercialType: null,
  landType: null,
  warehouseType: null,
  // Нові фільтри
  searchQuery: '',
  newBuildings: false,
  metroNearby: false,
  parking: false,
  balcony: false,
  favorites: []
};

// Збереження улюблених у localStorage
let favorites = JSON.parse(localStorage.getItem('estatyq_favorites') || '[]');

// Стан для вибору типу районів/селищ
let districtType = 'city'; // 'city' або 'region'

// Стан для вибраної лінії метро
let selectedMetroLine = null;

let displayedCount = 12;
const INCREMENT = 12;

// ==================== API ФУНКЦИИ ====================

async function loadPropertiesFromAPI() {
  try {
    const response = await fetch('/api/listings?limit=1000');
    const result = await response.json();
    
    if (result.success && result.data) {
      // Преобразуем данные из API в формат приложения
      allProperties = result.data.map(item => ({
        id: item.id || `listing-${Math.random()}`,
        // Строим title из доступных данных: тип + адреса + район
        title: item.title || `${propertyTypes[item.type] || 'Нерухомість'} на ${item.location_district || item.location_address || item.location_city || 'невідомій адресі'}`,
        description: item.description || '',
        // Если адрес пусто, используем город по умолчанию
        location: item.location_address || item.location_district || 'Київ',
        price: item.price_value ? parseInt(item.price_value) : 0,
        currency: item.price_currency || 'USD',
        area: item.area_total ? parseInt(item.area_total) : null,
        rooms: item.rooms ? parseInt(item.rooms) : null,
        floor: item.floor_current ? parseInt(item.floor_current) : null,
        totalFloors: item.floor_total ? parseInt(item.floor_total) : null,
        type: (item.type || 'apartment').toLowerCase(),
        transaction: (item.transaction_type || 'sale').toLowerCase(),
        transactionType: (item.transaction_type || 'sale').toLowerCase(),  // Для обратной совместимости
        images: item.images || [],
        city: item.location_city_key || 'kyiv',  // Используем city_key как идентификатор города
        year: item.year_built ? parseInt(item.year_built) : new Date().getFullYear(),
        building: item.year_built ? parseInt(item.year_built) : new Date().getFullYear(),  // Alias для совместимости
        amenities: {
          balcony: item.amenities_balcony || false,
          parking: item.amenities_parking || false,
          metro: item.amenities_metro || null
        },
        image: (item.images && item.images[0]) || 'https://via.placeholder.com/400x300?text=No+Image'  // Для совместимости с renderProperties
      }));
      
      filteredProperties = [...allProperties];
      console.log(`Загружено ${allProperties.length} объектов с API`);
      return true;
    } else {
      console.error('Ошибка: API вернул некорректный результат');
      return false;
    }
  } catch (error) {
    console.error('Ошибка загрузки данных с API:', error);
    return false;
  }
}

// ==================== РЕНДЕРИНГ КНОПОЧНЫХ ФИЛЬТРОВ ====================

function renderCityButtons() {
  const container = document.getElementById("city-buttons");
  container.innerHTML = "";
  
  // Показуємо всі міста (без областей!)
  Object.entries(regions).forEach(([regionKey, regionData]) => {
    // Кнопка для кожного міста в регіону
    Object.entries(regionData.cities).forEach(([cityKey, cityData]) => {
      const cityBtn = document.createElement("button");
      cityBtn.className = "filter-btn" + (filters.city === cityKey ? " active" : "");
      cityBtn.textContent = cityData.name;
      cityBtn.onclick = () => selectCity(cityKey);
      container.appendChild(cityBtn);
    });
  });
}

function renderDistrictChips() {
  const container = document.getElementById("district-chips");
  const header = document.getElementById("district-header");
  
  if (!filters.city) {
    header.style.display = "none";
    return;
  }
  
  const cityData = getCityData();
  if (!cityData || cityData.type !== "city") {
    header.style.display = "none";
    return;
  }
  
  header.style.display = "block";
  container.innerHTML = "";
  
  let label, items;
  
  // Залежно від переключателя показуємо районы або селища
  if (districtType === 'city') {
    label = "🏘️ Район";
    items = cityData.data.districts;
  } else {
    label = "🏘️ Селище/Село";
    items = cityData.region.settlements || [];
  }
  
  // Оновити заголовок
  document.getElementById("region-label").textContent = label;
  const regionNameEl = document.getElementById("region-name");
  regionNameEl.textContent = cityData.data.name;
  
  // Додати чіпси
  items.forEach(item => {
    const chip = document.createElement("div");
    chip.className = "district-chip" + (filters.districts.includes(item) ? " active" : "");
    chip.innerHTML = `${item} <span class="chip-close">✕</span>`;
    chip.onclick = (e) => {
      e.stopPropagation();
      selectDistrict(item);
    };
    container.appendChild(chip);
  });
}

function renderMicrodistricts() {
  const container = document.getElementById("microdistrict-chips");
  const header = document.getElementById("microdistrict-header");
  
  const cityData = getCityData();
  
  // Показуємо мікрорайони тільки для МІСТ, не для областей
  if (!filters.city || !cityData || cityData.type !== "city" || filters.districts.length === 0) {
    header.style.display = "none";
    return;
  }
  
  header.style.display = "block";
  container.innerHTML = "";
  
  const microdistricts = cityData.data.microdistricts;
  
  // Збираємо всі мікрорайони з вибраних районів
  const availableMicrodistricts = [];
  filters.districts.forEach(district => {
    if (microdistricts[district]) {
      availableMicrodistricts.push(...microdistricts[district]);
    }
  });
  
  // Видаляємо дублікати
  const uniqueMicrodistricts = [...new Set(availableMicrodistricts)];
  
  // Додаємо чіпи мікрорайонів
  uniqueMicrodistricts.forEach(microdistrict => {
    const chip = document.createElement("div");
    chip.className = "district-chip" + (filters.microdistricts.includes(microdistrict) ? " active" : "");
    chip.innerHTML = `${microdistrict} <span class="chip-close">✕</span>`;
    chip.onclick = (e) => {
      e.stopPropagation();
      selectMicrodistrict(microdistrict);
    };
    container.appendChild(chip);
  });
}

function renderMetro() {
  const linesContainer = document.getElementById("metro-lines-toggle");
  const chipsContainer = document.getElementById("metro-chips");
  const header = document.getElementById("metro-header");
  const cityNameEl = document.getElementById("metro-city-name");
  
  // Перевірка на наявність елементів
  if (!linesContainer || !chipsContainer || !header) return;
  
  const cityData = getCityData();
  
  // Показуємо метро тільки для МІСТ з метро
  if (!filters.city || !cityData || cityData.type !== "city" || !cityData.data.hasMetro) {
    header.style.display = "none";
    return;
  }
  
  header.style.display = "block";
  
  // Показуємо назву міста
  if (cityNameEl) {
    cityNameEl.textContent = cityData.data.name;
  }
  
  // Рендеримо кнопки ліній метро
  const metroLines = cityData.data.metroLines || {};
  linesContainer.innerHTML = "";
  
  Object.keys(metroLines).forEach(lineName => {
    const lineBtn = document.createElement("button");
    lineBtn.className = "metro-line-btn" + (selectedMetroLine === lineName ? " active" : "");
    lineBtn.textContent = lineName;
    lineBtn.onclick = () => selectMetroLine(lineName);
    linesContainer.appendChild(lineBtn);
  });
  
  // Рендеримо чіпси станцій (якщо вибрана лінія)
  chipsContainer.innerHTML = "";
  
  if (selectedMetroLine && metroLines[selectedMetroLine]) {
    const stations = metroLines[selectedMetroLine];
    
    stations.forEach(station => {
      const chip = document.createElement("div");
      chip.className = "district-chip" + (filters.metroStations.includes(station) ? " active" : "");
      chip.innerHTML = `${station} <span class="chip-close">✕</span>`;
      chip.onclick = (e) => {
        e.stopPropagation();
        selectMetroStation(station);
      };
      chipsContainer.appendChild(chip);
    });
  }
}

function selectMetroLine(lineName) {
  selectedMetroLine = selectedMetroLine === lineName ? null : lineName;
  renderMetro();
}

function selectMetroStation(station) {
  const index = filters.metroStations.indexOf(station);
  if (index > -1) {
    filters.metroStations.splice(index, 1);
  } else {
    filters.metroStations.push(station);
  }
  renderMetro();
  applyFilters();
}

function selectAllMetroStations() {
  const cityData = getCityData();
  if (!cityData || !cityData.data.metroLines) return;
  
  const allStations = [];
  Object.values(cityData.data.metroLines).forEach(stations => {
    allStations.push(...stations);
  });
  
  filters.metroStations = [...new Set(allStations)];
  renderMetro();
  applyFilters();
}

function clearMetro() {
  filters.metroStations = [];
  selectedMetroLine = null;
  renderMetro();
  applyFilters();
}

// ==================== ВЫБОР ФИЛЬТРОВ ====================

function selectCity(cityKey) {
  filters.city = cityKey;
  filters.districts = [];
  filters.microdistricts = [];
  filters.metroStations = [];
  selectedMetroLine = null;
  
  renderCityButtons();
  renderDistrictChips();
  renderMicrodistricts();
  renderMetro();
  
  // Update Telegram button for new city
  updateTelegramButton();
  
  applyFilters();
}

function selectDistrict(district) {
  const index = filters.districts.indexOf(district);
  if (index > -1) {
    filters.districts.splice(index, 1);
  } else {
    filters.districts.push(district);
  }
  filters.microdistricts = []; // Сбрасываем микрорайоны при виборі району
  filters.location = null;
  displayedCount = 12;
  
  renderDistrictChips();
  updateTableFilters();
  applyFilters();
}

function selectMicrodistrict(microdistrict) {
  const index = filters.microdistricts.indexOf(microdistrict);
  if (index > -1) {
    filters.microdistricts.splice(index, 1);
  } else {
    filters.microdistricts.push(microdistrict);
  }
  filters.location = null;
  displayedCount = 12;
  
  renderMicrodistricts();
  updateTableFilters();
  applyFilters();
}

function selectAllDistricts() {
  // Отримуємо всі районы/селища поточного міста/області
  if (!filters.city) return;
  
  const cityData = getCityData();
  if (!cityData) return;
  
  let items = [];
  if (cityData.type === "city") {
    items = cityData.data.districts;
  } else {
    items = cityData.data.settlements || [];
  }
  
  filters.districts = [...items];
  displayedCount = 12;
  
  renderDistrictChips();
  renderMicrodistricts();
  updateTableFilters();
  applyFilters();
}

function selectAllMicrodistricts() {
  // Отримуємо всі мікрорайони поточного міста
  if (!filters.city) return;
  
  const cityData = getCityData();
  if (!cityData || cityData.type !== "city") return;
  
  const microdistricts = Object.values(cityData.data.microdistricts).flat();
  
  filters.microdistricts = [...new Set(microdistricts)]; // Видаляємо дублікати
  displayedCount = 12;
  
  renderMicrodistricts();
  updateTableFilters();
  applyFilters();
}

function clearDistricts() {
  filters.districts = [];
  filters.microdistricts = []; // Сбрасываем микрорайоны при очистці районів
  filters.location = null;
  displayedCount = 12;
  
  renderDistrictChips();
  renderMicrodistricts();
  updateTableFilters();
  applyFilters();
}

function clearMicrodistricts() {
  filters.microdistricts = [];
  filters.location = null;
  displayedCount = 12;
  
  renderMicrodistricts();
  updateTableFilters();
  applyFilters();
}

function selectType(type) {
  filters.type = filters.type === type ? null : type;
  filters.location = null;
  displayedCount = 12;
  
  updateTableFilters();
  applyFilters();
}

// ==================== ВЫБОР РАЙОНОВ/СЕЛИЩ ====================

function selectDistrictType(type) {
  districtType = type;
  filters.districts = [];
  filters.microdistricts = [];
  
  // Оновити активні кнопки переключення
  const typeButtons = document.querySelectorAll('.district-type-btn');
  typeButtons.forEach(btn => {
    if ((btn.textContent.trim() === 'Місто' && districtType === 'city') ||
        (btn.textContent.trim() === 'Область' && districtType === 'region')) {
      btn.classList.add('active');
      // BUG-07 FIX: Update aria-pressed
      btn.setAttribute('aria-pressed', 'true');
    } else {
      btn.classList.remove('active');
      // BUG-07 FIX: Update aria-pressed
      btn.setAttribute('aria-pressed', 'false');
    }
  });
  
  renderDistrictChips();
  renderMicrodistricts();
  applyFilters();
}

// ==================== ТАБЛИЦА ФИЛЬТРОВ ====================

function updateTableFilters() {
  const tableContainer = document.getElementById("filters-table-container");
  
  if (!filters.city || !filters.transaction || !filters.type) {
    tableContainer.style.display = "none";
    return;
  }
  
  tableContainer.style.display = "block";
  
  // Получаем конфигурацию фильтров для этого типа и раздела
  const configKey = `${filters.type}_${filters.transaction}`;
  const filterConfig = filterConfigByType[configKey] || [];
  
  // Очищаем контейнер
  tableContainer.innerHTML = '<div class="filters-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;"></div>';
  const grid = tableContainer.querySelector(".filters-grid");
  
  // Генерируем фильтры на основе конфига
  filterConfig.forEach(filterDef => {
    const filterGroup = document.createElement("div");
    filterGroup.style.cssText = "display: flex; flex-direction: column; gap: 5px;";
    
    const label = document.createElement("label");
    label.style.cssText = "font-size: 12px; font-weight: 600; color: #d4af37; text-transform: uppercase;";
    label.textContent = filterDef.label;
    filterGroup.appendChild(label);
    
    if (filterDef.type === "range") {
      // Range input
      const container = document.createElement("div");
      container.style.cssText = "display: flex; gap: 5px; align-items: center;";
      
      const minInput = document.createElement("input");
      minInput.type = "number";
      minInput.placeholder = `мін: ${filterDef.min}`;
      minInput.style.cssText = "flex: 1; padding: 8px; background: #0a0a0a; border: 1px solid #333; color: #fff; border-radius: 4px;";
      minInput.id = `${filterDef.id}-min`;
      
      const maxInput = document.createElement("input");
      maxInput.type = "number";
      maxInput.placeholder = `макс: ${filterDef.max}`;
      maxInput.style.cssText = "flex: 1; padding: 8px; background: #0a0a0a; border: 1px solid #333; color: #fff; border-radius: 4px;";
      maxInput.id = `${filterDef.id}-max`;
      
      container.appendChild(minInput);
      container.appendChild(maxInput);
      filterGroup.appendChild(container);
      
      minInput.oninput = () => {
        filters[`${filterDef.id}Min`] = minInput.value ? parseFloat(minInput.value) : null;
        displayedCount = 12;
        applyFilters();
      };
      
      maxInput.oninput = () => {
        filters[`${filterDef.id}Max`] = maxInput.value ? parseFloat(maxInput.value) : null;
        displayedCount = 12;
        applyFilters();
      };
    } else if (filterDef.type === "checkbox") {
      // Checkbox
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = filterDef.id;
      checkbox.style.cssText = "cursor: pointer;";
      
      checkbox.onchange = () => {
        filters[filterDef.id] = checkbox.checked;
        displayedCount = 12;
        applyFilters();
      };
      
      filterGroup.appendChild(checkbox);
    } else if (filterDef.type === "select") {
      // Select dropdown
      const select = document.createElement("select");
      select.id = filterDef.id;
      select.style.cssText = "padding: 8px; background: #0a0a0a; border: 1px solid #333; color: #fff; border-radius: 4px;";
      
      filterDef.options.forEach(option => {
        const opt = document.createElement("option");
        opt.value = option === "не вибрано" ? "" : option;
        opt.textContent = option;
        select.appendChild(opt);
      });
      
      select.onchange = () => {
        filters[filterDef.id] = select.value || null;
        displayedCount = 12;
        applyFilters();
      };
      
      filterGroup.appendChild(select);
    }
    
    grid.appendChild(filterGroup);
  });
}

// ==================== ПРИМЕНЕНИЕ ФИЛЬТРОВ ====================

function applyFilters() {
  let filtered = allProperties.filter(prop => {
    // Глобальний пошук
    if (filters.searchQuery) {
      // BUG-03 FIX: Safe access to cities[prop.city]
      const cityName = cities[prop.city]?.name || 'Невідоме місто';
      const searchText = `${prop.title} ${prop.location} ${cityName} ${propertyTypes[prop.type]}`.toLowerCase();
      if (!searchText.includes(filters.searchQuery)) return false;
    }
    
    // Фільтр по регіону (якщо вибран)
    if (filters.region) {
      const regionCities = Object.keys(regions[filters.region].cities);
      if (!regionCities.includes(prop.city)) return false;
    }
    
    // Фільтр по транзакції (безпечний фолбек для JSON і API)
    if (filters.transaction) {
      const tx = prop.transactionType || prop.transaction;
      if (tx !== filters.transaction) return false;
    }
    
    // Фільтр по типу
    if (filters.type && prop.type !== filters.type) return false;
    
    // Фільтр по місту
    if (filters.city && prop.city !== filters.city) return false;
    
    // Фільтр по районам/селищам (якщо вибрані)
    if (filters.districts.length > 0 && !filters.districts.includes(prop.location)) return false;
    
    // Фільтр по мікрорайонам (тільки для міст)
    if (filters.microdistricts.length > 0 && !filters.microdistricts.includes(prop.location)) return false;
    
    // Фільтр по станціям метро
    if (filters.metroStations && filters.metroStations.length > 0 && (!prop.metro || !filters.metroStations.includes(prop.metro))) return false;
    
    // Фільтр по локації
    if (filters.location && prop.location !== filters.location) return false;
    
    // Фільтр по кімнатах
    if (filters.rooms) {
      const rooms = parseInt(filters.rooms);
      if (rooms === 5) {
        if (prop.rooms < 5) return false;
      } else if (prop.rooms !== rooms) return false;
    }
    
    // Фільтри по площі
    if (filters.areaMin && prop.area < parseFloat(filters.areaMin)) return false;
    if (filters.areaMax && prop.area > parseFloat(filters.areaMax)) return false;
    
    // Фільтри по ціні
    if (filters.priceMin && prop.price < parseFloat(filters.priceMin)) return false;
    if (filters.priceMax && prop.price > parseFloat(filters.priceMax)) return false;
    
    // Фільтри по ділянці
    if (filters.plotAreaMin && prop.plotArea && prop.plotArea < parseFloat(filters.plotAreaMin)) return false;
    if (filters.plotAreaMax && prop.plotArea && prop.plotArea > parseFloat(filters.plotAreaMax)) return false;
    
    // Додаткові фільтри
    if (filters.daily && !prop.daily) return false;
    if (filters.floorMin && prop.floor < parseFloat(filters.floorMin)) return false;
    if (filters.floorMax && prop.floor > parseFloat(filters.floorMax)) return false;
    if (filters.floorNotLast && prop.floorsTotal && prop.floor === prop.floorsTotal) return false;
    
    // Нові фільтри
    if (filters.newBuildings && prop.building < 2020) return false;
    if (filters.metroNearby && !prop.metro) return false;
    if (filters.parking && !prop.parking) return false;
    if (filters.balcony && !prop.balcony) return false;
    
    // Старі фільтри
    if (filters.pets !== null && prop.pets !== filters.pets) return false;
    if (filters.waterHeater !== null && prop.waterHeater !== filters.waterHeater) return false;
    if (filters.microwave !== null && prop.microwave !== filters.microwave) return false;
    if (filters.oven !== null && prop.oven !== filters.oven) return false;
    if (filters.officeType && prop.officeType !== filters.officeType) return false;
    if (filters.commercialType && prop.commercialType !== filters.commercialType) return false;
    if (filters.landType && prop.landType !== filters.landType) return false;
    if (filters.warehouseType && prop.warehouseType !== filters.warehouseType) return false;
    
    return true;
  });

  // Оновлюємо активні фільтри
  updateActiveFilters();
  
  displayedCount = 12;
  // BUG-01 FIX: Set filteredProperties FIRST, then render
  filteredProperties = filtered;
  renderProperties();
  
  // Ensure Telegram button is up to date
  updateTelegramButton();
  
  // Update URL to reflect current state
  updateURLState();
}

// Оновлення відображення активних фільтрів
function updateActiveFilters() {
  const activeFiltersContainer = document.getElementById('active-filters');
  const activeFiltersChips = document.getElementById('active-filters-chips');
  
  const activeFilters = [];
  
  // Збираємо активні фільтри
  if (filters.searchQuery) activeFilters.push({ key: 'search', label: `Пошук: "${filters.searchQuery}"` });
  if (filters.region) activeFilters.push({ key: 'region', label: `Область: ${regions[filters.region].name}` });
  if (filters.city) activeFilters.push({ key: 'city', label: `Місто: ${cities[filters.city].name}` });
  if (filters.type) activeFilters.push({ key: 'type', label: `Тип: ${propertyTypes[filters.type]}` });
  if (filters.rooms) activeFilters.push({ key: 'rooms', label: `Кімнат: ${filters.rooms}` });
  if (filters.priceMin || filters.priceMax) {
    const priceLabel = `Ціна: ${filters.priceMin || 0} - ${filters.priceMax || '∞'} тис.$`;
    activeFilters.push({ key: 'price', label: priceLabel });
  }
  if (filters.areaMin || filters.areaMax) {
    const areaLabel = `Площа: ${filters.areaMin || 0} - ${filters.areaMax || '∞'} м²`;
    activeFilters.push({ key: 'area', label: areaLabel });
  }
  if (filters.newBuildings) activeFilters.push({ key: 'newBuildings', label: 'Новобудови' });
  if (filters.metroNearby) activeFilters.push({ key: 'metroNearby', label: 'Біля метро' });
  if (filters.parking) activeFilters.push({ key: 'parking', label: 'Паркінг' });
  if (filters.balcony) activeFilters.push({ key: 'balcony', label: 'Балкон' });
  
  if (activeFilters.length > 0) {
    activeFiltersContainer.style.display = 'block';
    activeFiltersChips.innerHTML = '';
    
    activeFilters.forEach(filter => {
      const chip = document.createElement('div');
      chip.className = 'active-filter-chip';
      chip.innerHTML = `${filter.label} <span class="remove" onclick="removeFilter('${filter.key}')">×</span>`;
      activeFiltersChips.appendChild(chip);
    });
  } else {
    activeFiltersContainer.style.display = 'none';
  }
}

// Видалення конкретного фільтра
function removeFilter(filterKey) {
  switch (filterKey) {
    case 'search':
      filters.searchQuery = '';
      document.getElementById('global-search').value = '';
      break;
    case 'region':
      filters.region = null;
      document.getElementById('region-select').value = '';
      updateCitySelect();
      break;
    case 'city':
      filters.city = null;
      document.getElementById('city-select').value = '';
      updateDistrictSelect();
      break;
    case 'type':
      filters.type = null;
      // BUG-7 FIX: Also update aria-pressed when removing filter
      document.querySelectorAll('.quick-filter-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });
      break;
    case 'rooms':
      filters.rooms = null;
      // BUG-7 FIX: Also update aria-pressed when removing filter
      document.querySelectorAll('.room-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });
      break;
    case 'price':
      filters.priceMin = null;
      filters.priceMax = null;
      document.getElementById('price-min').value = '';
      document.getElementById('price-max').value = '';
      break;
    case 'area':
      filters.areaMin = null;
      filters.areaMax = null;
      document.getElementById('area-min').value = '';
      document.getElementById('area-max').value = '';
      break;
    case 'newBuildings':
      filters.newBuildings = false;
      document.getElementById('new-buildings').checked = false;
      break;
    case 'metroNearby':
      filters.metroNearby = false;
      document.getElementById('metro-nearby').checked = false;
      break;
    case 'parking':
      filters.parking = false;
      document.getElementById('parking').checked = false;
      break;
    case 'balcony':
      filters.balcony = false;
      document.getElementById('balcony').checked = false;
      break;
  }
  
  applyFilters();
}

// ==================== РЕНДЕРИНГ СВОЙСТВ ====================

// Оновлена функція toggleLike
function toggleLike(propertyId) {
  toggleFavorite(propertyId);
  renderProperties(); // Перерендеруємо для оновлення відображення
}

// ==================== СОРТУВАННЯ ТА ВИДИ ====================

let currentSort = 'newest';
let currentView = 'grid';

function sortProperties() {
  const sortSelect = document.getElementById('sort-select');
  currentSort = sortSelect.value;
  
  switch (currentSort) {
    case 'newest':
      filteredProperties.sort((a, b) => b.id - a.id);
      break;
    case 'price-low':
      filteredProperties.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredProperties.sort((a, b) => b.price - a.price);
      break;
    case 'area-large':
      filteredProperties.sort((a, b) => b.area - a.area);
      break;
    case 'area-small':
      filteredProperties.sort((a, b) => a.area - b.area);
      break;
    case 'rooms':
      filteredProperties.sort((a, b) => (b.rooms || 0) - (a.rooms || 0));
      break;
  }
  
  displayedCount = 12;
  renderProperties();
}

function setView(view) {
  currentView = view;
  localStorage.setItem('estatyq_view', view);
  
  // Оновлюємо кнопки
  document.querySelectorAll('.view-btn').forEach(btn => {
    const isActive = btn.getAttribute('data-view') === view;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
  
  // Змінюємо контейнер
  const grid = document.getElementById('properties-grid');
  if (grid) {
    grid.className = (view === 'list') ? 'properties-list' : 'properties-grid';
  }
  
  renderProperties();
}

// Оновлена функція рендерингу з підтримкою списку
function renderProperties() {
  const grid = document.getElementById("properties-grid");
  grid.innerHTML = "";
  
  const toShow = filteredProperties.slice(0, displayedCount);
  
  if (toShow.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #d0d0d0;">
        <div style="font-size: 4rem; margin-bottom: 20px;">🔍</div>
        <h3 style="font-size: 1.5rem; margin-bottom: 15px; color: var(--primary-color);">Об'єктів не знайдено</h3>
        <p style="font-size: 1rem; margin-bottom: 30px;">Спробуйте змінити параметри пошуку або скинути фільтри</p>
        <button class="btn btn-primary" onclick="resetAllFilters()">Скинути фільтри</button>
      </div>
    `;
    document.getElementById("load-more-btn").style.display = "none";
    return;
  }
  
  toShow.forEach(prop => {
    const isFav = isFavorite(prop.id);
    const features = [];
    if (prop.building >= 2020) features.push('Новобудова');
    if (prop.metro) features.push('Метро');
    if (prop.parking) features.push('Паркінг');
    if (prop.balcony) features.push('Балкон');
    if (prop.daily) features.push('Подобово');
    
    const featuresHtml = features.map(feature => `<span class="feature-tag">${feature}</span>`).join('');
    const status = prop.daily ? 'Подобово' : (prop.transactionType === 'sale' ? 'Продаж' : 'Оренда');
    
    if (currentView === 'list') {
      // Рендеринг для списку
      const item = document.createElement("div");
      item.className = "property-list-item";
      item.innerHTML = `
        <div class="property-list-image">
          <img src="${primaryImage(prop)}" alt="${safeText(prop.title)}" loading="lazy" decoding="async" onerror="this.dataset.error='true'">
          <div class="property-badge">${status}</div>
        </div>
        <div class="property-list-content">
          <div class="property-list-header">
            <div>
              <h3 class="property-list-title">${safeText(prop.title)}</h3>
              <p class="property-list-location">📍 ${safeText(prop.location)}, ${cities[prop.city] ? cities[prop.city].name : PLACEHOLDER}</p>
            </div>
            <div class="property-list-price">${formatPrice(prop.price, prop.currency, prop.transactionType === 'rent')}</div>
          </div>
          
          <div class="property-list-details">
            ${Number(prop.rooms) > 0 ? `<div class="property-list-detail"><div class="property-list-detail-value">${formatInt(prop.rooms)}</div><div class="property-list-detail-label">Кімнат</div></div>` : ""}
            <div class="property-list-detail"><div class="property-list-detail-value">${formatInt(prop.area)}</div><div class="property-list-detail-label">м²</div></div>
            ${Number.isFinite(Number(prop.floor)) ? `<div class="property-list-detail"><div class="property-list-detail-value">${formatInt(prop.floor)}</div><div class="property-list-detail-label">Поверх</div></div>` : ""}
            ${Number.isFinite(Number(prop.plotArea)) ? `<div class="property-list-detail"><div class="property-list-detail-value">${formatInt(prop.plotArea)}</div><div class="property-list-detail-label">Сот</div></div>` : ""}
          </div>
          
          ${featuresHtml ? `<div class="property-features">${featuresHtml}</div>` : ''}
          
          <div class="property-list-footer">
            <div class="property-list-actions">
              <button class="btn-details" onclick="openModal(${prop.id})">Детально</button>
              <button class="btn-like ${isFav ? 'liked' : ''}" onclick="event.stopPropagation(); toggleLike(${prop.id})">${isFav ? '♥' : '♡'}</button>
            </div>
          </div>
        </div>
      `;
      item.addEventListener('click', () => openModal(prop.id));
      grid.appendChild(item);
    } else {
      // Рендеринг для сітки
      const card = document.createElement("div");
      card.className = "property-card";
      card.innerHTML = `
        <div class="property-image">
          <img src="${primaryImage(prop)}" alt="${safeText(prop.title)}" loading="lazy" decoding="async" onerror="this.dataset.error='true'" style="width: 100%; height: 100%; object-fit: cover;">
          <div class="property-badge">${status}</div>
          ${prop.building ? `<div class="property-status">${safeText(prop.building)} р.</div>` : ''}
        </div>
        <div class="property-content">
          <h3 class="property-title">${safeText(prop.title)}</h3>
          <p class="property-location">${safeText(prop.location)}, ${cities[prop.city] ? cities[prop.city].name : PLACEHOLDER}</p>
          
          <div class="property-details">
            ${Number(prop.rooms) > 0 ? `<div class="detail-item"><div class="detail-item-value">${formatInt(prop.rooms)}</div><div class="detail-item-label">Кімнат</div></div>` : ""}
            <div class="detail-item"><div class="detail-item-value">${formatInt(prop.area)}</div><div class="detail-item-label">м²</div></div>
            ${Number.isFinite(Number(prop.floor)) ? `<div class="detail-item"><div class="detail-item-value">${formatInt(prop.floor)}</div><div class="detail-item-label">Поверх</div></div>` : ""}
            ${Number.isFinite(Number(prop.plotArea)) ? `<div class="detail-item"><div class="detail-item-value">${formatInt(prop.plotArea)}</div><div class="detail-item-label">Сот</div></div>` : ""}
          </div>

          <div class="property-price">${formatPrice(prop.price, prop.currency, prop.transactionType === 'rent')}</div>
          
          ${featuresHtml ? `<div class="property-features">${featuresHtml}</div>` : ''}

          <div class="property-action">
            <button class="btn-details" onclick="openModal(${prop.id})">Детально</button>
            <button class="btn-like ${isFav ? 'liked' : ''}" onclick="event.stopPropagation(); toggleLike(${prop.id})">${isFav ? '♥' : '♡'}</button>
          </div>
        </div>
      `;
      card.addEventListener('click', () => openModal(prop.id));
      grid.appendChild(card);
    }
  });
  
  // Показываем/скрываем кнопку "Показати ще"
  const btn = document.getElementById("load-more-btn");
  if (displayedCount >= filteredProperties.length) {
    btn.style.display = "none";
  } else {
    btn.style.display = "block";
  }
  
  // Ховаємо/показуємо контейнер "Показати ще" для чистого лейаута
  const btnContainer = document.getElementById("load-more-container");
  if (btnContainer) {
    btnContainer.style.display = (btn.style.display === 'none') ? 'none' : 'block';
  }
  
  updateResultsCounter();
}

function loadMoreProperties() {
  displayedCount += INCREMENT;
  renderProperties();
  
  // Синхронізувати displayedCount в URL (BUG-2 FIX)
  if (typeof URLState !== 'undefined') {
    updateURLState();
  }
}

// ==================== МОДАЛЬНОЕ ОКНО ====================

function openModal(propId) {
  const prop = allProperties.find(p => p.id === propId);
  if (!prop) return;
  
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");
  
  // Зберігаємо фокусований елемент для повернення після закриття модалки
  lastFocusedElement = document.activeElement;
  
  // Зберігаємо зображення для перелистування
  currentPropertyImages = (Array.isArray(prop.images) && prop.images.length > 0) 
    ? prop.images 
    : (prop.image ? [prop.image] : ['https://via.placeholder.com/800x600?text=No+Image']);
  currentImageIndex = 0;
  
  // Генеруємо особливості
  const features = [];
  if (prop.building >= 2020) features.push('Новобудова');
  if (prop.metro) features.push('Біля метро');
  if (prop.parking) features.push('Паркінг');
  if (prop.balcony) features.push('Балкон');
  if (prop.daily) features.push('Подобово');
  if (prop.waterHeater === 'так') features.push('Водонагрівач');
  if (prop.microwave === 'так') features.push('Мікрохвильова');
  if (prop.oven === 'так') features.push('Духовка');
  if (prop.pets === 'дозволені') features.push('Домашні тварини');
  
  const featuresHtml = features.map(feature => `<span class="feature-tag">${feature}</span>`).join('');
  
  // Генеруємо HTML для галереї фото
  const photoGalleryHtml = `
    <div class="modal-photo-gallery">
      <div class="modal-photo-container">
        <img 
          id="modal-main-image" 
          src="${currentPropertyImages[0]}" 
          alt="${safeText(prop.title)}"
          style="width: 100%; height: 400px; object-fit: cover; border-radius: 8px;"
          loading="lazy"
          decoding="async"
        />
        ${currentPropertyImages.length > 1 ? `
          <button 
            class="modal-nav-btn modal-nav-prev" 
            onclick="previousPropertyImage()"
            aria-label="Попередня фотографія"
            title="Попередня фото"
          >❮</button>
          <button 
            class="modal-nav-btn modal-nav-next" 
            onclick="nextPropertyImage()"
            aria-label="Наступна фотографія"
            title="Наступна фото"
          >❯</button>
        ` : ''}
      </div>
      ${currentPropertyImages.length > 1 ? `
        <div class="modal-photo-counter">
          <span id="photo-count">Фото <span id="current-photo">${currentImageIndex + 1}</span> з <span id="total-photos">${currentPropertyImages.length}</span></span>
          <div class="modal-photo-thumbnails">
            ${currentPropertyImages.map((img, idx) => `
              <img 
                src="${img}" 
                alt="Фото ${idx + 1}"
                class="modal-thumb ${idx === 0 ? 'active' : ''}"
                onclick="goToPropertyImage(${idx})"
                style="cursor: pointer; width: 60px; height: 60px; object-fit: cover; border-radius: 4px; border: 2px solid ${idx === 0 ? '#d4af37' : 'transparent'}; margin: 0 5px;"
              />
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
  
  modalBody.innerHTML = `
    <div class="modal-header">
      <h2>${prop.title}</h2>
      <div class="modal-badges">
        <span class="modal-badge ${prop.transactionType === 'sale' ? 'sale' : 'rent'}">
          ${prop.transactionType === "sale" ? "Продаж" : "Оренда"}
        </span>
        ${prop.daily ? '<span class="modal-badge daily">Подобово</span>' : ''}
      </div>
    </div>
    
    <div class="modal-location">
      <span class="location-icon">📍</span>
      <span>${prop.location}, ${cities[prop.city].name}</span>
    </div>
    
    <div class="modal-image">
      ${photoGalleryHtml}
    </div>
    
    <div class="modal-price-section">
      <div class="modal-price">${formatPrice(prop.price, prop.currency, prop.transactionType === 'rent')}</div>
      <div class="modal-price-details">
        ${prop.transactionType === 'rent'
          ? `<div>За місяць: ${formatPrice(prop.price, prop.currency, false)}</div>
             <div>За день: ${formatPrice(Number(prop.price) / 30, prop.currency, false)}</div>`
          : (() => {
              const perM2 = (Number(prop.price) && Number(prop.area)) ? (Number(prop.price) / Number(prop.area)) : null;
              const sym = currencySymbol(prop.currency);
              return `<div>За м²: ${perM2 ? sym + formatNumber(Math.round(perM2)) : PLACEHOLDER}</div>`;
            })()
        }
      </div>
    </div>
    
    <div class="modal-details-grid">
      <div class="modal-detail-item">
        <div class="modal-detail-label">Тип нерухомості</div>
        <div class="modal-detail-value">${propertyTypes[prop.type]}</div>
      </div>
      ${prop.rooms > 0 ? `
      <div class="modal-detail-item">
        <div class="modal-detail-label">Кімнат</div>
        <div class="modal-detail-value">${formatInt(prop.rooms)}</div>
      </div>` : ''}
      <div class="modal-detail-item">
        <div class="modal-detail-label">Площа</div>
        <div class="modal-detail-value">${formatInt(prop.area)} м²</div>
      </div>
      ${prop.floor ? `
      <div class="modal-detail-item">
        <div class="modal-detail-label">Поверх</div>
        <div class="modal-detail-value">${formatInt(prop.floor)}</div>
      </div>` : ''}
      <div class="modal-detail-item">
        <div class="modal-detail-label">Рік будівництва</div>
        <div class="modal-detail-value">${safeText(prop.building)}</div>
      </div>
      ${prop.plotArea ? `
      <div class="modal-detail-item">
        <div class="modal-detail-label">Ділянка</div>
        <div class="modal-detail-value">${formatInt(prop.plotArea)} соток</div>
      </div>` : ''}
    </div>
    
    ${featuresHtml ? `
    <div class="modal-features">
      <h3>Особливості</h3>
      <div class="modal-features-list">${featuresHtml}</div>
    </div>` : ''}
    
    <div class="modal-actions">
      <button class="btn btn-primary" onclick="toggleLike(${prop.id}); closeModal();">
        ${isFavorite(prop.id) ? '♥ Видалити з улюблених' : '♡ Додати в улюблені'}
      </button>
      <a href="${cities[prop.city].bot}" target="_blank" class="btn btn-secondary">
        Написати в Telegram
      </a>
    </div>
  `;
  
  modal.style.display = "block";

  // Focus trap inside modal
  const focusableSelectors = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const focusables = Array.from(modal.querySelectorAll(focusableSelectors));
  if (focusables.length) {
    focusables[0].focus();
  }
  modalKeydownHandler = function(e) {
    if (modal.style.display !== 'block') return;
    if (e.key === 'Tab') {
      const items = Array.from(modal.querySelectorAll(focusableSelectors));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };
  document.addEventListener('keydown', modalKeydownHandler);
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
  // Повернути фокус на елемент, що мав його раніше
  if (lastFocusedElement && lastFocusedElement.focus) {
    lastFocusedElement.focus();
  }
  // Remove focus trap listener
  if (modalKeydownHandler) {
    document.removeEventListener('keydown', modalKeydownHandler);
    modalKeydownHandler = null;
  }
}

window.onclick = function(event) {
  const modal = document.getElementById("modal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
}

// Обробник Escape для закриття модалки
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape' || event.keyCode === 27) {
    const modal = document.getElementById("modal");
    if (modal && modal.style.display === 'block') {
      closeModal();
    }
  }
});

// ==================== TELEGRAM КНОПКА ====================

function updateTelegramButton() {
  const telegramBtn = document.getElementById("telegram-button");
  
  if (filters.city) {
    const botUrl = cities[filters.city].bot;
    telegramBtn.innerHTML = `<a href="${botUrl}" target="_blank" class="btn btn-primary">Перейти в Telegram</a>`;
    telegramBtn.style.display = "block";
  } else {
    telegramBtn.style.display = "none";
  }
}

// ==================== ДОПОМІЖНІ ФУНКЦІЇ ====================

function toggleLikeIconLocal(event) {
  event.target.textContent = event.target.textContent === "♡" ? "♥" : "♡";
}

function resetFilters() {
  filters = {
    region: null,
    city: null,
    districts: [],
    microdistricts: [],
    metroStations: [],
    metro: null,
    transaction: null,
    type: null,
    location: null,
    rooms: null,
    areaMin: null,
    areaMax: null,
    plotAreaMin: null,
    plotAreaMax: null,
    priceMin: null,
    priceMax: null,
    daily: false,
    floorMin: null,
    floorMax: null,
    floorNotLast: false,
    pets: null,
    monthlyRent: false,
    waterHeater: null,
    microwave: null,
    oven: null,
    officeType: null,
    commercialType: null,
    landType: null,
    warehouseType: null,
    searchQuery: '',
    newBuildings: false,
    metroNearby: false,
    parking: false,
    balcony: false,
    favorites: []
  };
  
  // Очистити форму фільтрів (якщо вони існують)
  const filterInputs = document.querySelectorAll("#filters-table-container input, #filters-table-container select");
  filterInputs.forEach(input => input.value = "");
  
  displayedCount = 12;
  renderCityButtons();
  renderDistrictChips();
  renderMicrodistricts();
  updateTableFilters();
  applyFilters();
}

// ==================== НОВІ ФУНКЦІЇ ФІЛЬТРАЦІЇ ====================

// Перемикання розширених фільтрів
function toggleAdvancedFilters() {
  const advancedFilters = document.getElementById('advanced-filters');
  const toggleText = document.getElementById('filters-toggle-text');
  const toggleBtn = event?.target?.closest('button') || document.querySelector('[onclick="toggleAdvancedFilters()"]');
  
  if (advancedFilters.style.display === 'none') {
    advancedFilters.style.display = 'block';
    toggleText.textContent = 'Приховати фільтри';
    // BUG-05 FIX: Update aria-expanded
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
  } else {
    advancedFilters.style.display = 'none';
    toggleText.textContent = 'Розширені фільтри';
    // BUG-05 FIX: Update aria-expanded
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
  }
}

// Глобальний пошук
function performSearch() {
  const searchInput = document.getElementById('global-search');
  filters.searchQuery = searchInput.value.toLowerCase();
  applyFilters();
}

// Скидання всіх фільтрів
function resetAllFilters() {
  // Скидаємо об'єкт фільтрів
  filters = {
    region: null,
    city: null,
    districts: [],
    microdistricts: [],
    metroStations: [],
    metro: null,
    transaction: null,
    type: null,
    location: null,
    rooms: null,
    areaMin: null,
    areaMax: null,
    plotAreaMin: null,
    plotAreaMax: null,
    priceMin: null,
    priceMax: null,
    daily: false,
    floorMin: null,
    floorMax: null,
    floorNotLast: false,
    pets: null,
    monthlyRent: false,
    waterHeater: null,
    microwave: null,
    oven: null,
    officeType: null,
    commercialType: null,
    landType: null,
    warehouseType: null,
    searchQuery: '',
    newBuildings: false,
    metroNearby: false,
    parking: false,
    balcony: false,
    favorites: []
  };
  
  // Очищаємо всі поля форми (BUG-5 FIX - EXPANDED)
  try {
    document.getElementById('global-search').value = '';
    document.getElementById('region-select').value = '';
    document.getElementById('city-select').value = '';
    document.getElementById('district-select').value = '';
    document.getElementById('price-min').value = '';
    document.getElementById('price-max').value = '';
    document.getElementById('price-range').value = '500';  // Reset slider
    document.getElementById('area-min').value = '';
    document.getElementById('area-max').value = '';
  } catch (e) {
    console.warn('Some filter inputs not found:', e);
  }
  
  // Скидаємо кнопки кімнат
  document.querySelectorAll('.room-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-pressed', 'false');
  });
  
  // Скидаємо швидкі фільтри типу
  document.querySelectorAll('.quick-filter-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-pressed', 'false');
  });
  
  // Скидаємо кнопки типу угоди
  document.querySelectorAll('.nav-transaction-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-pressed', 'false');
  });
  
  // Скидаємо чекбокси
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.checked = false;
  });
  
  // Очистити всі вибрані чіпси
  document.querySelectorAll('.district-chip.active').forEach(chip => {
    chip.classList.remove('active');
  });
  
  // Очистити таблицю фільтрів
  const tableContainer = document.getElementById('filters-table-container');
  if (tableContainer) {
    const inputs = tableContainer.querySelectorAll('input, select');
    inputs.forEach(input => input.value = '');
  }
  
  // Очищаємо активні фільтри
  const activeFilters = document.getElementById('active-filters');
  if (activeFilters) {
    activeFilters.style.display = 'none';
  }
  
  // Перерендеруємо все
  selectedMetroLine = null;
  displayedCount = 12;
  renderCityButtons();
  renderDistrictChips();
  renderMicrodistricts();
  renderMetro();
  updateTableFilters();
  applyFilters();
}

// Ініціалізація розширених фільтрів
function initializeAdvancedFilters() {
  // Заповнюємо селекти областей
  const regionSelect = document.getElementById('region-select');
  Object.entries(regions).forEach(([key, region]) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = region.name;
    regionSelect.appendChild(option);
  });
  
  // Слухачі для селектів
  regionSelect.addEventListener('change', function() {
    filters.region = this.value;
    updateCitySelect();
    applyFilters();
  });
  
  document.getElementById('city-select').addEventListener('change', function() {
    filters.city = this.value;
    updateDistrictSelect();
    applyFilters();
  });
  
  document.getElementById('district-select').addEventListener('change', function() {
    filters.location = this.value;
    applyFilters();
  });
  
  // Слухачі для ціни
  document.getElementById('price-min').addEventListener('input', function() {
    filters.priceMin = this.value ? parseFloat(this.value) : null;
    applyFilters();
  });
  
  document.getElementById('price-max').addEventListener('input', function() {
    filters.priceMax = this.value ? parseFloat(this.value) : null;
    applyFilters();
  });
  
  // Слухачі для площі
  document.getElementById('area-min').addEventListener('input', function() {
    filters.areaMin = this.value ? parseFloat(this.value) : null;
    applyFilters();
  });
  
  document.getElementById('area-max').addEventListener('input', function() {
    filters.areaMax = this.value ? parseFloat(this.value) : null;
    applyFilters();
  });
  
  // Слухачі для кімнат
  document.querySelectorAll('.room-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const rooms = this.getAttribute('data-rooms');
      if (filters.rooms === rooms) {
        filters.rooms = null;
        this.classList.remove('active');
        // BUG-06 FIX: Update aria-pressed
        this.setAttribute('aria-pressed', 'false');
      } else {
        filters.rooms = rooms;
        // BUG-06 FIX: Update aria-pressed for all buttons
        document.querySelectorAll('.room-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-pressed', 'true');
      }
      applyFilters();
    });
  });
  
  // Слухачі для чекбоксів
  document.getElementById('new-buildings').addEventListener('change', function() {
    filters.newBuildings = this.checked;
    applyFilters();
  });
  
  document.getElementById('metro-nearby').addEventListener('change', function() {
    filters.metroNearby = this.checked;
    applyFilters();
  });
  
  document.getElementById('parking').addEventListener('change', function() {
    filters.parking = this.checked;
    applyFilters();
  });
  
  document.getElementById('balcony').addEventListener('change', function() {
    filters.balcony = this.checked;
    applyFilters();
  });
  
  // Слухач для глобального пошуку
  document.getElementById('global-search').addEventListener('input', function() {
    filters.searchQuery = this.value.toLowerCase();
    applyFilters();
  });
}

// Оновлення селекту міст
function updateCitySelect() {
  const citySelect = document.getElementById('city-select');
  citySelect.innerHTML = '<option value="">Виберіть місто</option>';
  
  if (filters.region) {
    const regionData = regions[filters.region];
    Object.entries(regionData.cities).forEach(([key, city]) => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = city.name;
      citySelect.appendChild(option);
    });
  }
}

// Оновлення селекту районів
function updateDistrictSelect() {
  const districtSelect = document.getElementById('district-select');
  districtSelect.innerHTML = '<option value="">Виберіть район</option>';
  
  if (filters.city) {
    const cityData = getCityData();
    if (cityData && cityData.data.districts) {
      cityData.data.districts.forEach(district => {
        const option = document.createElement('option');
        option.value = district;
        option.textContent = district;
        districtSelect.appendChild(option);
      });
    }
  }
}

// Система улюблених
function toggleFavorite(propertyId) {
  const index = favorites.indexOf(propertyId);
  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(propertyId);
  }
  
  // Зберігаємо в localStorage
  localStorage.setItem('estatyq_favorites', JSON.stringify(favorites));
  
  // Оновлюємо відображення
  applyFilters();
}

// Перевірка чи об'єкт у улюблених
function isFavorite(propertyId) {
  return favorites.includes(propertyId);
}

// ==================== ІНЦІАЛІЗАЦІЯ ====================

document.addEventListener("DOMContentLoaded", function() {
  // Показуємо скелетони на час завантаження (якщо є каталог)
  const cityButtons = document.getElementById("city-buttons");
  if (cityButtons) {
    showSkeletons(12);
  }

  // 🔴 ИСПРАВЛЕНИЕ: Загружаем и нормализуем данные из JSON файла
  loadProperties().then(() => {
    // BUG-13 FIX: Restore filters from URL first
    restoreURLState();
    
    // BUG-10 FIX: Set transaction = 'sale' to match active button in HTML
    if (!filters.transaction) {
      filters.transaction = 'sale';  // Синхронізуємо з активною кнопкою
    }
    
    // Инициализируем основные фильтры (тільки якщо є каталог)
    if (cityButtons) {
      renderCityButtons();
      renderDistrictChips();
      updateTableFilters();
    }
    
    // Встановлюємо вид з localStorage або за замовчуванням
    const savedView = localStorage.getItem('estatyq_view') || 'grid';
    setView(savedView);
    
    // 🔴 ИСПРАВЛЕНИЕ: Добавляем слушатели для быстрых фильтров ВСЕГДА (не зависит от city-buttons)
    setupQuickFilters();

    // Ініціалізуємо розширені фільтри
    initializeAdvancedFilters();
    
    // Применяем фильтры для инициализации filteredProperties
    applyFilters();
    
    // Отображаем свойства
    renderProperties();
  }).catch(err => {
    console.error('❌ Ошибка при загрузке свойств:', err);
  });
});
// ==================== БЫСТРЫЕ ФИЛЬТРЫ ВВЕРХУ ====================

function setupQuickFilters() {
  // Слушатели для ГЛОБАЛЬНЫХ кнопок типа сделки (Продаж/Оренда/Подобово) в навигации
  document.querySelectorAll('.nav-transaction-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const transaction = btn.getAttribute('data-transaction');
      
      // Убираем active с других кнопок в этой группе и обновляем aria-pressed (BUG-7 FIX)
      document.querySelectorAll('.nav-transaction-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      
      // Добавляем active к этой кнопке и обновляем aria-pressed (BUG-7 FIX)
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      
      // Применяем фильтр
      filters.transaction = transaction;
      filters.type = null;  // Сбрасываем тип при смене угоды
      filters.location = null;
      displayedCount = 12;
      
      // Если город выбран, перерендеиваем типы
      if (filters.city) {
        updateTableFilters(); // Перерендериваем фильтры для новой угоды
      }
      applyFilters();
    });
  });
  
  // Слушатели для кнопок типов нерухомості (горизонтальное меню)
  document.querySelectorAll('.quick-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type');
      selectType(type);
      
      // Обновляем активный статус кнопки и aria-pressed (BUG-7 FIX)
      document.querySelectorAll('.quick-filter-btn').forEach(b => {
        const isActive = b.getAttribute('data-type') === filters.type;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    });
  });
}

// Допоміжна функція для отримання інформації про міст/область
function getCityData() {
  if (!filters.city) return null;
  
  if (filters.city.startsWith("region:")) {
    const regionKey = filters.city.replace("region:", "");
    return { type: "region", key: regionKey, data: regions[regionKey] };
  }
  
  // Пошук міста в регіонах
  for (const [regionKey, regionData] of Object.entries(regions)) {
    if (regionData.cities[filters.city]) {
      return { 
        type: "city", 
        key: filters.city, 
        data: regionData.cities[filters.city],
        regionKey: regionKey,
        region: regionData
      };
    }
  }
  return null;
}

// ==================== URL STATE MANAGEMENT ====================

function updateURLState() {
  if (typeof URLState === 'undefined' || !URLState || typeof URLState.stringify !== 'function') {
    return; // URLState not available on this page
  }
  const state = {
    q: filters.searchQuery || '',
    city: filters.city || '',
    type: filters.type || '',
    transaction: filters.transaction || '',
    priceMin: filters.priceMin || '',
    priceMax: filters.priceMax || '',
    areaMin: filters.areaMin || '',
    areaMax: filters.areaMax || '',
    rooms: filters.rooms || '',
    displayedCount: String(displayedCount),
    view: currentView
  };
  
  const qs = URLState.stringify(state);
  if (typeof history !== 'undefined' && typeof location !== 'undefined') {
    history.replaceState(null, '', `${location.pathname}${qs ? '?' + qs : ''}`);
  }
}

// Загрузити стан з URL при завантаженні сторінки
function restoreURLState() {
  if (typeof URLState === 'undefined' || !URLState || typeof URLState.parse !== 'function') {
    return;
  }
  const state = URLState.parse(location.search);
  
  if (state.q) filters.searchQuery = state.q;
  if (state.city) filters.city = state.city;
  if (state.type) filters.type = state.type;
  if (state.transaction) filters.transaction = state.transaction;
  if (state.priceMin) filters.priceMin = parseFloat(state.priceMin);
  if (state.priceMax) filters.priceMax = parseFloat(state.priceMax);
  if (state.areaMin) filters.areaMin = parseFloat(state.areaMin);
  if (state.areaMax) filters.areaMax = parseFloat(state.areaMax);
  if (state.rooms) filters.rooms = state.rooms;
  if (state.displayedCount) displayedCount = parseInt(state.displayedCount, 10) || 12;
  if (state.view) setView(state.view);
  
  // Оновити UI
  if (filters.city) {
    renderCityButtons();
    renderDistrictChips();
    renderMicrodistricts();
    renderMetro();
  }
  
  applyFilters();
}

// Функції для перелистування фото в модальному вікні
function previousPropertyImage() {
  if (currentPropertyImages.length === 0) return;
  
  currentImageIndex = (currentImageIndex - 1 + currentPropertyImages.length) % currentPropertyImages.length;
  updateModalImage();
}

function nextPropertyImage() {
  if (currentPropertyImages.length === 0) return;
  
  currentImageIndex = (currentImageIndex + 1) % currentPropertyImages.length;
  updateModalImage();
}

function goToPropertyImage(index) {
  if (index >= 0 && index < currentPropertyImages.length) {
    currentImageIndex = index;
    updateModalImage();
  }
}

function updateModalImage() {
  const mainImage = document.getElementById('modal-main-image');
  if (mainImage) {
    mainImage.src = currentPropertyImages[currentImageIndex];
  }
  
  // Оновити лічильник
  const currentPhotoSpan = document.getElementById('current-photo');
  if (currentPhotoSpan) {
    currentPhotoSpan.textContent = currentImageIndex + 1;
  }
  
  // Оновити thumbnails активний клас
  const thumbnails = document.querySelectorAll('.modal-thumb');
  thumbnails.forEach((thumb, idx) => {
    if (idx === currentImageIndex) {
      thumb.style.borderColor = '#d4af37';
    } else {
      thumb.style.borderColor = 'transparent';
    }
  });
}

// Додати keyboard навігацію для фото
document.addEventListener('keydown', function(event) {
  const modal = document.getElementById("modal");
  if (modal && modal.style.display === 'block' && currentPropertyImages.length > 1) {
    if (event.key === 'ArrowLeft') {
      previousPropertyImage();
    } else if (event.key === 'ArrowRight') {
      nextPropertyImage();
    }
  }
});

// Обновление счетчика результатов
function updateResultsCounter() {
  const counterEl = document.getElementById("results-counter");
  if (!counterEl) return;
  
  const foundCount = document.getElementById("found-count");
  const paginationInfo = document.getElementById("pagination-info");
  
  if (foundCount) {
    foundCount.textContent = `Знайдено: ${filteredProperties.length}`;
  }
  
  if (paginationInfo) {
    const displayed = Math.min(displayedCount, filteredProperties.length);
    const total = filteredProperties.length;
    paginationInfo.textContent = `Показано ${displayed} з ${total}`;
  }
}


