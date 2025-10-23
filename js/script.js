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

// ==================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ====================

const allProperties = generateProperties();
let filteredProperties = [...allProperties];

let filters = {
  region: null,
  city: null,
  districts: [],
  microdistricts: [],
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
  // Новые фильтры
  balcony: false,
  parking: false,
  elevator: false,
  furnished: false,
  searchQuery: ''
};

// Состояние UI
let currentView = 'grid';
let sortBy = 'newest';
let searchTimeout = null;

// Стан для вибору типу районів/селищ
let districtType = 'city'; // 'city' або 'region'

// Стан для вибраної лінії метро
let selectedMetroLine = null;

let displayedCount = 12;
const INCREMENT = 12;

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
    } else {
      btn.classList.remove('active');
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
  // Показываем загрузку
  showLoading();
  
  setTimeout(() => {
    let filtered = allProperties.filter(prop => {
      // Поиск по тексту
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchText = `${prop.title} ${prop.location} ${cities[prop.city].name} ${propertyTypes[prop.type]}`.toLowerCase();
        if (!searchText.includes(query)) return false;
      }
      
      // Фільтр по регіону (якщо вибран)
      if (filters.region) {
        const regionCities = Object.keys(regions[filters.region].cities);
        if (!regionCities.includes(prop.city)) return false;
      }
      
      // Фільтр по транзакції
      if (filters.transaction && prop.transactionType !== filters.transaction) return false;
      
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
      
      // ... інші фільтри (залишаємо як було)
      if (filters.location && prop.location !== filters.location) return false;
      if (filters.rooms && prop.rooms !== parseInt(filters.rooms)) return false;
      if (filters.areaMin && prop.area < parseFloat(filters.areaMin)) return false;
      if (filters.areaMax && prop.area > parseFloat(filters.areaMax)) return false;
      if (filters.plotAreaMin && prop.plotArea && prop.plotArea < parseFloat(filters.plotAreaMin)) return false;
      if (filters.plotAreaMax && prop.plotArea && prop.plotArea > parseFloat(filters.plotAreaMax)) return false;
      if (filters.priceMin && prop.price < parseFloat(filters.priceMin)) return false;
      if (filters.priceMax && prop.price > parseFloat(filters.priceMax)) return false;
      if (filters.daily && !prop.daily) return false;
      if (filters.floorMin && prop.floor < parseFloat(filters.floorMin)) return false;
      if (filters.floorMax && prop.floor > parseFloat(filters.floorMax)) return false;
      if (filters.floorNotLast && prop.floor === prop.floorsTotal) return false;
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

    // Применяем сортировку
    filtered = applySortingToArray(filtered);
    
    displayedCount = 12;
    filteredProperties = filtered;
    renderProperties();
    updateResultsCount();
    hideLoading();
  }, 300);
}

function applySortingToArray(array) {
  return [...array].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'area-large':
        return b.area - a.area;
      case 'area-small':
        return a.area - b.area;
      case 'newest':
      default:
        return b.id - a.id;
    }
  });
}

function showLoading() {
  const spinner = document.getElementById('loading-spinner');
  if (spinner) {
    spinner.style.display = 'flex';
  }
}

function hideLoading() {
  const spinner = document.getElementById('loading-spinner');
  if (spinner) {
    spinner.style.display = 'none';
  }
}

function updateResultsCount() {
  const resultsCount = document.getElementById('results-count');
  if (resultsCount) {
    const count = filteredProperties.length;
    resultsCount.textContent = `Знайдено ${count} об'єктів`;
  }
}

// ==================== РЕНДЕРИНГ СВОЙСТВ ====================

function renderProperties() {
  const grid = document.getElementById("properties-grid");
  const emptyState = document.getElementById("empty-state");
  const loadMoreContainer = document.getElementById("load-more-container");
  
  grid.innerHTML = "";
  
  const toShow = filteredProperties.slice(0, displayedCount);
  
  if (toShow.length === 0) {
    grid.style.display = "none";
    emptyState.style.display = "block";
    loadMoreContainer.style.display = "none";
    return;
  }
  
  grid.style.display = "grid";
  emptyState.style.display = "none";
  
  toShow.forEach(prop => {
    const card = document.createElement("div");
    card.className = `property-card ${currentView}-view`;
    
    const priceText = prop.transactionType === "rent" ? 
      `${Math.round(prop.price)} тис. грн/міс` : 
      `$${Math.round(prop.price)} тис.`;
    
    const statusText = prop.daily ? "Подобово" : 
      (prop.transactionType === "sale" ? "Продаж" : "Оренда");
    
    const details = getPropertyDetails(prop);
    
    card.innerHTML = `
      <div class="property-image">
        <img src="${prop.image}" alt="${prop.title}" loading="lazy">
        <div class="property-badge">${statusText}</div>
        <div class="property-status">${propertyTypes[prop.type]}</div>
      </div>
      <div class="property-content">
        <h3 class="property-title">${prop.title}</h3>
        <p class="property-location">📍 ${prop.location}, ${cities[prop.city].name}</p>
        
        <div class="property-details">
          ${details}
        </div>

        <div class="property-price">${priceText}</div>
        
        ${currentView === 'list' ? `<div class="property-description">${getPropertyDescription(prop)}</div>` : ''}

        <div class="property-action">
          <button class="btn-details" onclick="openModal(${prop.id})">
            <span>Детально</span>
            <span>→</span>
          </button>
          <button class="btn-like" onclick="toggleLike(event)">♡</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
  
  // Показываем/скрываем кнопку "Показати ще"
  if (displayedCount >= filteredProperties.length) {
    loadMoreContainer.style.display = "none";
  } else {
    loadMoreContainer.style.display = "block";
  }
}

function getPropertyDetails(prop) {
  const details = [];
  
  if (prop.rooms > 0) {
    details.push(`<div class="detail-item"><div class="detail-item-value">${prop.rooms}</div><div class="detail-item-label">Кімнат</div></div>`);
  }
  
  details.push(`<div class="detail-item"><div class="detail-item-value">${Math.round(prop.area)}</div><div class="detail-item-label">м²</div></div>`);
  
  if (prop.floor) {
    details.push(`<div class="detail-item"><div class="detail-item-value">${prop.floor}</div><div class="detail-item-label">Поверх</div></div>`);
  }
  
  if (prop.building) {
    details.push(`<div class="detail-item"><div class="detail-item-value">${prop.building}</div><div class="detail-item-label">Рік</div></div>`);
  }
  
  return details.join('');
}

function getPropertyDescription(prop) {
  const descriptions = [];
  
  if (prop.rooms > 0) {
    descriptions.push(`${prop.rooms}-кімнатна ${propertyTypes[prop.type].toLowerCase()}`);
  } else {
    descriptions.push(propertyTypes[prop.type]);
  }
  
  descriptions.push(`площею ${Math.round(prop.area)} м²`);
  
  if (prop.floor) {
    descriptions.push(`на ${prop.floor} поверсі`);
  }
  
  if (prop.building) {
    descriptions.push(`рік будівництва ${prop.building}`);
  }
  
  return descriptions.join(', ');
}

function loadMoreProperties() {
  displayedCount += INCREMENT;
  renderProperties();
  
  // Плавная прокрутка
  document.getElementById("properties-grid").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ==================== МОДАЛЬНОЕ ОКНО ====================

function openModal(propId) {
  const prop = allProperties.find(p => p.id === propId);
  if (!prop) return;
  
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");
  
  modalBody.innerHTML = `
    <h2>${prop.title}</h2>
    <p style="color: #d0d0d0; margin-bottom: 20px; font-size: 16px;">
      <strong style="color: #d4af37;">📍 ${prop.location}, ${cities[prop.city].name}</strong>
    </p>
    
    <div class="modal-details-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
      <div><strong>Тип:</strong> ${propertyTypes[prop.type]}</div>
      <div><strong>Угода:</strong> ${prop.transactionType === "sale" ? "Продаж" : "Оренда"}</div>
      <div><strong>Ціна:</strong> $ ${Math.round(prop.price)}</div>
      ${prop.rooms > 0 ? `<div><strong>Кімнат:</strong> ${prop.rooms}</div>` : ""}
      <div><strong>Площа:</strong> ${Math.round(prop.area)} м²</div>
      <div><strong>Поверх:</strong> ${prop.floor}</div>
      <div><strong>Рік:</strong> ${prop.building}</div>
    </div>
    
    <div style="margin-top: 30px; text-align: center;">
      <a href="${cities[prop.city].bot}" target="_blank" class="btn btn-primary" style="display: inline-block;">
        Написати в Telegram
      </a>
    </div>
  `;
  
  modal.style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

window.onclick = function(event) {
  const modal = document.getElementById("modal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
}

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

function toggleLike(event) {
  event.target.textContent = event.target.textContent === "♡" ? "♥" : "♡";
}

function resetFilters() {
  filters = {
    region: null,
    city: null,
    districts: [],
    microdistricts: [],
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
    warehouseType: null
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

// ==================== ІНЦІАЛІЗАЦІЯ ====================

// ==================== ПОИСК ====================

function setupSearch() {
  const searchInput = document.getElementById('search-input');
  const suggestionsContainer = document.getElementById('search-suggestions');
  
  if (!searchInput) return;
  
  searchInput.addEventListener('input', function() {
    const query = this.value.trim();
    filters.searchQuery = query;
    
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      if (query.length > 1) {
        showSuggestions(query);
      } else {
        hideSuggestions();
      }
      applyFilters();
    }, 300);
  });
  
  searchInput.addEventListener('focus', function() {
    if (this.value.trim().length > 1) {
      showSuggestions(this.value.trim());
    }
  });
  
  document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
      hideSuggestions();
    }
  });
}

function showSuggestions(query) {
  const suggestionsContainer = document.getElementById('search-suggestions');
  if (!suggestionsContainer) return;
  
  const suggestions = getSearchSuggestions(query);
  
  if (suggestions.length === 0) {
    hideSuggestions();
    return;
  }
  
  suggestionsContainer.innerHTML = suggestions.map(suggestion => `
    <div class="suggestion-item" onclick="selectSuggestion('${suggestion}')">
      ${suggestion}
    </div>
  `).join('');
  
  suggestionsContainer.style.display = 'block';
}

function hideSuggestions() {
  const suggestionsContainer = document.getElementById('search-suggestions');
  if (suggestionsContainer) {
    suggestionsContainer.style.display = 'none';
  }
}

function getSearchSuggestions(query) {
  const suggestions = new Set();
  const lowerQuery = query.toLowerCase();
  
  // Добавляем города
  Object.values(cities).forEach(city => {
    if (city.name.toLowerCase().includes(lowerQuery)) {
      suggestions.add(city.name);
    }
  });
  
  // Добавляем районы
  Object.values(regions).forEach(region => {
    Object.values(region.cities).forEach(city => {
      city.districts.forEach(district => {
        if (district.toLowerCase().includes(lowerQuery)) {
          suggestions.add(`${district}, ${city.name}`);
        }
      });
    });
  });
  
  return Array.from(suggestions).slice(0, 8);
}

function selectSuggestion(suggestion) {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.value = suggestion;
    filters.searchQuery = suggestion;
    hideSuggestions();
    applyFilters();
  }
}

function performSearch() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    filters.searchQuery = searchInput.value.trim();
    applyFilters();
  }
}

// ==================== СОРТИРОВКА И ВИДЫ ====================

function setupViewToggle() {
  const viewButtons = document.querySelectorAll('.view-btn');
  const propertiesGrid = document.getElementById('properties-grid');
  
  viewButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const view = this.getAttribute('data-view');
      currentView = view;
      
      // Обновляем активную кнопку
      viewButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Обновляем класс сетки
      if (propertiesGrid) {
        propertiesGrid.className = `properties-grid ${view}-view`;
      }
      
      renderProperties();
    });
  });
}

function setupSorting() {
  const sortSelect = document.getElementById('sort-select');
  if (!sortSelect) return;
  
  sortSelect.addEventListener('change', function() {
    sortBy = this.value;
    applySorting();
  });
}

function applySorting() {
  const sorted = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'area-large':
        return b.area - a.area;
      case 'area-small':
        return a.area - b.area;
      case 'newest':
      default:
        return b.id - a.id;
    }
  });
  
  filteredProperties = sorted;
  renderProperties();
}

// ==================== УЛУЧШЕННЫЕ ФИЛЬТРЫ ====================

function setupEnhancedFilters() {
  // Ценовой диапазон
  const priceRange = document.getElementById('price-range');
  const priceMin = document.getElementById('price-min');
  const priceMax = document.getElementById('price-max');
  
  if (priceRange && priceMin && priceMax) {
    priceRange.addEventListener('input', function() {
      const value = parseInt(this.value);
      priceMax.value = value;
      filters.priceMax = value;
      applyFilters();
    });
    
    priceMin.addEventListener('input', function() {
      filters.priceMin = this.value ? parseInt(this.value) : null;
      applyFilters();
    });
    
    priceMax.addEventListener('input', function() {
      filters.priceMax = this.value ? parseInt(this.value) : null;
      applyFilters();
    });
  }
  
  // Площадь
  const areaMin = document.getElementById('area-min');
  const areaMax = document.getElementById('area-max');
  
  if (areaMin && areaMax) {
    areaMin.addEventListener('input', function() {
      filters.areaMin = this.value ? parseInt(this.value) : null;
      applyFilters();
    });
    
    areaMax.addEventListener('input', function() {
      filters.areaMax = this.value ? parseInt(this.value) : null;
      applyFilters();
    });
  }
  
  // Количество комнат
  const roomButtons = document.querySelectorAll('.room-btn');
  roomButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const rooms = this.getAttribute('data-rooms');
      
      // Переключаем активность
      roomButtons.forEach(b => b.classList.remove('active'));
      this.classList.toggle('active');
      
      // Обновляем фильтр
      if (this.classList.contains('active')) {
        filters.rooms = parseInt(rooms);
      } else {
        filters.rooms = null;
      }
      
      applyFilters();
    });
  });
  
  // Чекбоксы
  const checkboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const filterName = this.id;
      filters[filterName] = this.checked;
      applyFilters();
    });
  });
}

function updateStats() {
  const totalProperties = document.getElementById('total-properties');
  const activeCities = document.getElementById('active-cities');
  const avgPrice = document.getElementById('avg-price');
  
  if (totalProperties) {
    totalProperties.textContent = allProperties.length.toLocaleString();
  }
  
  if (activeCities) {
    activeCities.textContent = Object.keys(cities).length;
  }
  
  if (avgPrice) {
    const avg = Math.round(allProperties.reduce((sum, prop) => sum + prop.price, 0) / allProperties.length);
    avgPrice.textContent = `$${avg}K`;
  }
}

function clearAllFilters() {
  resetFilters();
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.value = '';
  }
  filters.searchQuery = '';
  applyFilters();
}

document.addEventListener("DOMContentLoaded", function() {
  if (!document.getElementById("city-buttons")) return;
  
  // Устанавливаем транзакшн по умолчанию
  filters.transaction = 'sale';
  
  // Инициализируем основные фильтры
  renderCityButtons();
  renderDistrictChips();
  updateTableFilters();
  renderProperties();
  
  // Добавляем слушатели для быстрых фильтров вверху
  setupQuickFilters();
  
  // Новые функции
  setupSearch();
  setupViewToggle();
  setupSorting();
  setupEnhancedFilters();
  
  // Обновляем статистику
  updateStats();
});

// ==================== БЫСТРЫЕ ФИЛЬТРЫ ВВЕРХУ ====================

function setupQuickFilters() {
  // Слушатели для ГЛОБАЛЬНЫХ кнопок типа сделки (Продаж/Оренда/Подобово) в навигации
  document.querySelectorAll('.nav-transaction-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const transaction = btn.getAttribute('data-transaction');
      
      // Убираем active с других кнопок в этой группе
      document.querySelectorAll('.nav-transaction-btn').forEach(b => b.classList.remove('active'));
      
      // Добавляем active к этой кнопке
      btn.classList.add('active');
      
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
      
      // Обновляем активный статус кнопки
      document.querySelectorAll('.quick-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
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
