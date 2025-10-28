# 🛠️ ПЛАН ДЕЙСТВИЙ ДЛЯ РАЗРАБОТЧИКА

**Приоритет:** 🔴 КРИТИЧЕСКИЙ  
**Дата:** 28 октября 2025  
**Версия:** 1.0.0

---

## 🎯 ЧТО НУЖНО СДЕЛАТЬ

### ШАГ 1: Исправить URLState [5 минут]

**Проблема:** `ReferenceError: URLState is not defined` в консоли  
**Файлы:** `index.html`, `pages/*.html`  
**Действие:**

```html
<!-- В index.html добавить ПЕРЕД script.js -->
<script src="js/url-state.js"></script>
<script src="js/script.js?v=8"></script>
```

**Проверить:**
```javascript
// В консоли браузера:
typeof URLState !== 'undefined'  // должно быть true
```

---

### ШАГ 2: Исправить фильтр типа сделки [30 минут]

**Проблема:** Фильтры "Оренда" и "Подобово" не работают

**Местоположение:** `js/script.js` функция `filterByTransaction()` (ищите по названию)

**Что проверить:**

```javascript
// 1. Найти где обрабатывается клик по "Оренда", "Подобово", "Продаж"
const navTransactionBtns = document.querySelectorAll('.nav-transaction-btn');
navTransactionBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    const transaction = this.dataset.transaction; // sale, rent, daily
    console.log('Selected transaction:', transaction); // ДОЛЖНА ЛОГИРОВАТЬСЯ!
    
    // 2. ДОЛЖЕН ВЫЗВАТЬСЯ ФИЛЬТР И ПЕРЕЗАГРУЗИТЬСЯ КАТАЛОГ
    loadProperties(transaction); // или filterProperties()
  });
});
```

**Правильный API вызов:**
```javascript
// Проверить что API вызывается с правильным параметром:
fetch('/api/v2/listings?type=rent')  // ДОЛЖНО РАБОТАТЬ!
  .then(r => r.json())
  .then(data => {
    console.log('Rent listings:', data);
    // должно вернуть объекты с transactionType: "rent"
  });
```

**Тестирование:**
```javascript
// После исправления в консоли:
typeof loadProperties === 'function'  // true
typeof filterProperties === 'function'  // true
```

---

### ШАГ 3: Синхронизировать счетчик результатов [20 минут]

**Проблема:** Счетчик показывает 369, но результаты пустые

**Файлы:** `js/script.js`

**Найти функцию:**
```javascript
// Ищите функцию updateResultsCounter() или похожую
function updateResultsCounter(total, shown) {
  const counter = document.getElementById('found-count');
  const pagination = document.getElementById('pagination-info');
  
  // ВАЖНО: Обновлять КАЖДЫЙ раз когда применяется фильтр
  counter.textContent = `Знайдено: ${total}`;
  pagination.textContent = `Показано ${shown} з ${total}`;
}

// Вызывать ЭТУ ФУНКЦИЮ в filterProperties(), sortProperties() и других местах
```

**Правильный порядок:**
```javascript
function filterProperties(transaction) {
  // 1. Отправить запрос на API
  fetch(`/api/v2/listings?type=${transaction}`)
    .then(r => r.json())
    .then(data => {
      // 2. Получить количество результатов
      const total = data.total;  // ИЛИ data.length
      
      // 3. СРАЗУ ЖЕ обновить счетчик
      updateResultsCounter(total, Math.min(12, total));
      
      // 4. Отобразить результаты
      displayProperties(data.items || data);
    });
}
```

---

### ШАГ 4: Проверить комбинированные фильтры [45 минут]

**Проблема:** Когда применяется 2+ фильтра - результат пуст

**Чек-лист:**

```javascript
// 1. Проверить как хранятся выбранные фильтры:
const activeFilters = {
  transaction: 'sale',      // или 'rent', 'daily'
  type: 'apartment',        // или 'house', 'land', 'office'
  city: 'kyiv',             // или другой город
  priceMin: 0,
  priceMax: 1000000,
  // ... другие
};

// 2. При фильтрации обновлять activeFilters:
function applyFilter(filterName, filterValue) {
  activeFilters[filterName] = filterValue;
  
  // 3. Отправить ВСЕ активные фильтры в API:
  const params = new URLSearchParams(activeFilters);
  fetch(`/api/v2/listings?${params}`)
    .then(r => r.json())
    .then(displayResults);
}
```

**API должен поддерживать:**
```javascript
// Это должно работать:
fetch('/api/v2/listings?type=house&priceMin=50000&priceMax=500000&city=kyiv')
  .then(r => r.json())
  .then(data => {
    if (data.items && data.items.length === 0) {
      showNoResults(); // "Об'єктів не знайдено"
    }
  });
```

---

### ШАГ 5: Найти и исправить 404 на контактах [15 минут]

**Проблема:** Ошибка 404 на странице `/pages/contact.html`

**Как найти:**

1. Открыть F12 (Developer Tools)
2. Перейти на вкладку "Network"
3. Открыть страницу контактов
4. Найти красный запрос с 404 статусом
5. Посмотреть URL и проверить файл

**Вероятные причины:**
```html
<!-- Неправильно (из папки pages/): -->
<script src="js/script.js"></script>  <!-- ❌ путь неправильный -->

<!-- Правильно: -->
<script src="../js/script.js"></script>  <!-- ✅ подняться на уровень выше -->
```

---

## 🧪 ТЕСТИРОВАНИЕ ПОСЛЕ ИСПРАВЛЕНИЯ

### Чек-лист тестирования:

```javascript
// 1. URLState
console.log('1. URLState:', typeof URLState === 'object' ? '✅' : '❌');

// 2. Фильтры работают
console.log('2. Фильтры:');
console.log('   - Продаж должна показать объекты типа sale');
console.log('   - Оренда должна показать объекты типа rent');
console.log('   - Подобово должна показать объекты типа daily');

// 3. Счетчик синхронизирован
console.log('3. Счетчик совпадает с количеством объектов на странице?');

// 4. Комбинированные фильтры
console.log('4. Могу ли я одновременно выбрать:');
console.log('   - Тип "Дім" + Сортировка "Ціна від високої"?');
console.log('   - Результаты должны отобразиться или показать "Об\'єктів не знайдено"');

// 5. Контакты
console.log('5. Страница контактов загружается без ошибок 404?');
```

---

## 🐛 ОТЛАДКА

### Включить debug режим:

```javascript
// Добавить в начало script.js:
const DEBUG = true;

function log(...args) {
  if (DEBUG) console.log('🐛 DEBUG:', ...args);
}

// Использовать везде:
log('Применен фильтр:', transaction);
log('API запрос:', url);
log('Результаты:', data);
```

### DevTools команды:

```javascript
// В консоли браузера:

// Проверить все активные фильтры
console.table(activeFilters);

// Отправить тестовый запрос
fetch('/api/v2/listings?type=rent')
  .then(r => r.json())
  .then(d => console.log('Результаты:', d.total, 'объектов'));

// Проверить какой API вызывается
// Открыть Network вкладку, применить фильтр, посмотреть запросы
```

---

## 📋 ПРИМЕЧАНИЯ

### О данных:

- `data/listings.json` содержит корректные данные (проверено)
- Объекты имеют цены и площади
- Проблема только в отображении и фильтрации, не в данных

### О файлах:

- `js/url-state.js` существует (нужно подключить в HTML)
- `js/script.js` содержит логику фильтрации (нужно отладить)
- `pages/contact.html` имеет неправильные пути (нужно исправить)

### О времени:

- Все исправления займут **~2 часа максимум**
- После исправления нужно 30 минут на тестирование
- Рекомендуется добавить unit тесты для фильтрации

---

## ✅ CHECKLIST ГОТОВНОСТИ

- [ ] URLState загружен и инициализирован
- [ ] Фильтр "Оренда" работает
- [ ] Фильтр "Подобово" работает
- [ ] Счетчик синхронизирован
- [ ] Комбинированные фильтры работают
- [ ] 404 на контактах исправлен
- [ ] Нет ошибок в консоли
- [ ] Все кнопки работают
- [ ] URL сохраняет фильтры

---

## 📞 ПОДДЕРЖКА

Если нужна помощь:
1. Проверьте консоль браузера (F12 > Console)
2. Посмотрите Network запросы (F12 > Network)
3. Используйте отладку выше
4. Сравните свой код с recommendations

---

**Успехов! 🚀**
