# 🐛 КРИТИЧНІ ПРОБЛЕМИ: Фільтри та Пагінація

> **Дата звіту**: October 28, 2025  
> **Область**: index.html + pages/catalog.html  
> **Пріоритет**: КРИТИЧНІ (🔴) + СЕРЙОЗНІ (🟡)

---

## 🔴 КРИТИЧНІ ПРОБЛЕМИ

### BUG-1: Відсутність синхронізації URL-State між index.html та pages/catalog.html

**Серйозність**: 🔴 **КРИТИЧНА**  
**Статус**: ❌ Не виправлено  
**Компонент**: `js/script.js` (index.html)

#### Опис
Функція `updateURLState()` на `index.html` не реалізована (строка 2147-2150):
```javascript
function updateURLState() {
  // TODO: Implement URL state management
  // This will serialize filters to URL and use history.pushState
}
```

Це призводить до:
- 🚫 Неможливості поділитися посиланням з фільтрами
- 🚫 При перезавантаженні сторінки фільтри втрачаються
- 🚫 Browser back/forward кнопки не працюють
- 🚫 Розбіжність з pages/catalog.html (де URLState працює)

#### Кроки воспроізведення
```
1. Перейти на index.html
2. Встановити фільтри (наприклад, місто=Київ, ціна=50-200)
3. Оновити сторінку (F5 або Ctrl+R)
4. ❌ Фільтри втрачені (порожня форма)
5. ❌ Лічильник результатів показує всі елементи
6. Копіюємо URL → він не містить параметрів фільтрів
```

#### Розв'язання
Реалізувати `updateURLState()` з використанням `URLState.replaceDebounced()`:

```javascript
function updateURLState() {
  const state = {
    q: filters.searchQuery,
    city: filters.city || '',
    type: filters.type || '',
    transaction: filters.transaction || '',
    priceMin: filters.priceMin || '',
    priceMax: filters.priceMax || '',
    areaMin: filters.areaMin || '',
    areaMax: filters.areaMax || '',
    rooms: filters.rooms || '',
    view: currentView
  };
  
  const qs = URLState.stringify(state);
  if (typeof history !== 'undefined' && typeof location !== 'undefined') {
    history.replaceState(null, '', `${location.pathname}${qs ? '?' + qs : ''}`);
  }
}
```

**Призвичайні вызивати**: `applyFilters()`, `setView()`, `toggleAdvancedFilters()`

---

### BUG-2: "Показати ще" (#load-more-btn) не синхронізує displayedCount з URL

**Серйозність**: 🔴 **КРИТИЧНА**  
**Статус**: ❌ Не виправлено  
**Компонент**: `js/script.js` (loadMoreProperties, index.html)

#### Опис
Коли користувач клікає "#load-more-btn", `displayedCount` збільшується, але:
- 🚫 URL не оновлюється (нема параметра offset або perPage)
- 🚫 При перезавантаженні обов'язково показується тільки 12 елементів
- 🚫 Якщо користувач скопіює посилання після "показати ще", новий користувач не побачить завантажених елементів

#### Кроки воспроізведення
```
1. Завантажити index.html з 50 елементами
2. Видно 12 елементів (displayedCount=12)
3. Клікнути #load-more-btn
4. Видно 24 елементи (displayedCount=24)
5. ❌ URL залишився: index.html (без параметрів)
6. Скопіюємо URL і відкриємо в новій вкладці
7. ❌ Показується тільки 12 елементів, не 24
```

#### Розв'язання
Додати збереження displayedCount в URL:

```javascript
function loadMoreProperties() {
  displayedCount += INCREMENT;
  renderProperties();
  
  // Синхронізуємо з URL
  const state = {
    // ... інші фільтри
    displayedCount: String(displayedCount)
  };
  URLState.replaceDebounced(state);
}
```

---

### BUG-3: Дублікування елементів при швидкому переключенні между "grid" та "list"

**Серйозність**: 🔴 **КРИТИЧНА**  
**Статус**: ❌ Не виправлено  
**Компонент**: `js/script.js` (renderProperties, setView)

#### Опис
Функція `renderProperties()` викликається **двічі** в коді (строки 1337 та 1497), що призводить до:
- 🚫 При швидкому переключенні view, елементи дублюються в сітці
- 🚫 Дублікати залишаються навіть після фільтрування
- 🚫 Лічильник результатів показує неправильно

#### Кроки воспроізведення
```
1. Перейти на index.html
2. Клікнути grid view button (⊞)
3. Негайно клікнути list view button (☰)
4. Знову клікнути grid view
5. ❌ У гриді видимо дублічні картки (елемент X з'являється 2+ разів)
6. console: Помилок бо grid.innerHTML не очищений пропорційно
```

#### Розв'язання
Видалити дублікат функції `renderProperties()` і залишити тільки одну версію з повною підтримкою обох видів:

```javascript
function setView(view) {
  currentView = view;
  localStorage.setItem('estatyq_view', view);
  
  document.querySelectorAll('.view-btn').forEach(btn => {
    const isActive = btn.getAttribute('data-view') === view;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
  
  const grid = document.getElementById('properties-grid');
  if (grid) {
    grid.className = (view === 'list') ? 'properties-list' : 'properties-grid';
  }
  
  // Викликаємо ТІЛЬКИ одну версію renderProperties
  renderPropertiesUnified();
}
```

---

### BUG-4: metroStations не інціалізований в filters об'єкті

**Серйозність**: 🟡 **СЕРЙОЗНА**  
**Статус**: ❌ Не виправлено  
**Компонент**: `js/script.js` (filters object, line 595)

#### Опис
У `filters` об'єкті бракує поля `metroStations`:

```javascript
// Рядок 595-631
let filters = {
  // ... інші поля
  metro: null,  // ✅ є
  // ❌ metroStations НЕ визначене!
};
```

Але в функціях такі посилання:
- Строка 863: `filters.metroStations.splice(index, 1)`
- Строка 864: `filters.metroStations.push(station)`
- Строка 881: `filters.metroStations = [...new Set(allStations)]`

#### Кроки воспроізведення
```
1. На index.html вибрати місто з метро (Київ, Харків, Дніпро)
2. Клікнути на лінію метро
3. Клікнути на станцію
4. 🔴 Console error: "Cannot read property 'splice' of undefined"
5. Фільтрація метро не працює
```

#### Розв'язання
Додати `metroStations: []` в ініціалізацію `filters`:

```javascript
let filters = {
  region: null,
  city: null,
  districts: [],
  microdistricts: [],
  metroStations: [],  // ← ДОДАТИ ЦЕ
  metro: null,
  transaction: null,
  // ... решта полів
};
```

---

### BUG-5: resetAllFilters() недостатньо очищує форму (не очищує range inputs)

**Серйозність**: 🟡 **СЕРЙОЗНА**  
**Статус**: ❌ Не виправлено  
**Компонент**: `js/script.js` (resetAllFilters, line 1822)

#### Опис
`resetAllFilters()` очищує `filters` об'єкт, але:
- ❌ Не очищує range inputs (price-range slider)
- ❌ Не очищує region-select / city-select / district-select
- ❌ Фільтри таблиці (#filters-table-container) можуть залишитися заповненими

#### Кроки воспроізведення
```
1. Встановити price-min=50, price-max=200
2. Встановити region=kyiv_region
3. Клікнути resetAllFilters()
4. ❌ Інпути НЕ очищені (показують 50 та 200)
5. ❌ region-select показує "Київська обл" замість "Виберіть область"
6. Фільтри таблиці все ще виконуються
```

#### Розв'язання
Розширити `resetAllFilters()`:

```javascript
function resetAllFilters() {
  filters = {
    region: null,
    city: null,
    // ... reset filter object
  };
  
  // Очистити всі input поля
  document.getElementById('global-search').value = '';
  document.getElementById('region-select').value = '';
  document.getElementById('city-select').value = '';
  document.getElementById('district-select').value = '';
  document.getElementById('price-min').value = '';
  document.getElementById('price-max').value = '';
  document.getElementById('price-range').value = '500';  // Reset slider
  document.getElementById('area-min').value = '';
  document.getElementById('area-max').value = '';
  
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
  
  // Перерендерити UI
  renderCityButtons();
  renderDistrictChips();
  renderMicrodistricts();
  renderMetro();
  updateTableFilters();
  applyFilters();
}
```

---

### BUG-6: Пагінація на pages/catalog.html: дублікати при швидкому клікуванню

**Серйозність**: 🟡 **СЕРЙОЗНА**  
**Статус**: ❌ Не виправлено  
**Компонент**: `js/catalog.js` (fetchAndRender, changePage)

#### Опис
При швидкому клікуванні на #next-page / #prev-page можуть бути запущені **кілька API запитів одночасно**:
- 🚫 Перший запит на page=2 не завершився
- 🚫 Користувач клікає ще раз → запит на page=3
- 🚫 Обидва запити повернули дані
- 🚫 Останній запит (page=3) був відображений першим (race condition)

#### Кроки воспроізведення
```
1. Завантажити pages/catalog.html (лента меда завантажується)
2. Швидко клікнути: #next-page → #next-page → #next-page
3. ❌ Grid міг вивести дані с page=3, потім page=2 (неправильний порядок)
4. 🚫 Користувач бачить неправильні дані
```

#### Розв'язання
Додати флаг `isLoading` для запобігання паралельних запитів:

```javascript
let isLoading = false;

function fetchAndRender() {
  if (isLoading) return;  // Запобігти паралельним запитам
  
  isLoading = true;
  const s = readState();
  
  // ... fetch data
  
  fetch(`/api/v2/listings?${qs}`)
    .then(/* ... */)
    .finally(() => {
      isLoading = false;  // Дозволити нові запити
    });
}
```

---

### BUG-7: aria-pressed не оновлюється у .quick-filter-btn при програмному вборі

**Серйозність**: 🟡 **СЕРЙОЗНА**  
**Статус**: ❌ Не виправлено  
**Компонент**: `js/script.js` (setupQuickFilters, line 2077)

#### Опис
Кнопки `.quick-filter-btn` мають `aria-pressed` атрибут, але він:
- ❌ Не синхронізується з `.active` класом
- ❌ При removeFilter() через chip, aria-pressed залишається старим
- ❌ Screen reader не розпізнає правильний стан кнопки

#### Кроки воспроізведення
```
1. Запустити screen reader (NVDA)
2. На index.html клікнути .quick-filter-btn[data-type="apartment"]
3. ✓ Screen reader: "Квартира, pressed"
4. Клікнути chip для видалення типу
5. ❌ Screen reader: "Квартира, pressed" (все ще висока!!)
6. Контролювати HTML: aria-pressed="true" (не змінився)
```

#### Розв'язання
Синхронізувати aria-pressed в setupQuickFilters():

```javascript
function setupQuickFilters() {
  document.querySelectorAll('.quick-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type');
      selectType(type);
      
      // Оновити aria-pressed для усіх кнопок
      document.querySelectorAll('.quick-filter-btn').forEach(b => {
        const isActive = b.getAttribute('data-type') === filters.type;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    });
  });
}
```

---

## 🟡 СЕРЙОЗНІ ПРОБЛЕМИ

### BUG-8: setView() не зберігає стан при applyFilters()

**Серйозність**: 🟡 **СЕРЙОЗНА**  
**Статус**: ❌ Не виправлено

#### Опис
Коли користувач встановлює view="list" і потім змінює фільтри:
- 🚫 applyFilters() викликає renderProperties()
- 🚫 renderProperties() не перевіряє currentView
- 🚫 Вид скидується на 'grid' (за замовчуванням)

#### Розв'язання
Перевіряти `currentView` в renderProperties() перед рендерингом

---

### BUG-9: #found-counter не оновлюється на pages/catalog.html

**Серйозність**: 🟡 **СЕРЙОЗНА**  
**Статус**: ❌ Не виправлено

#### Опис
На pages/catalog.html лічильник `#found-counter` не показує кількість знайдених елементів

#### Розв'язання
Додати `foundCounter.textContent = \`Знайдено: \${total}\`` в функцію render()

---

### BUG-10: Немає перевірки на empty options в select фільтрах

**Серйозність**: 🟡 **СЕРЙОЗНА**  
**Статус**: ❌ Не виправлено

#### Опис
Селекти (region, city, district) можуть бути пусті, якщо дані не завантажені

#### Розв'язання
Додати перевірку у renderCityButtons(), updateCitySelect() перед заповненням

---

## 🟢 НИЗЬКІ ПРІОРИТЕТИ

### BUG-11: Повідомлення про помилку недостатньо специфічне

**Серйозність**: 🟢 **НИЗЬКА**  
**Статус**: ⚠️ Частково

При помилці API, показується "Сталася помилка" без деталей.

**Розв'язання**: Додати специфічні повідомлення:
- "Проблема з мережею" - 0ms timeout
- "Сервер недоступний" - 500/503
- "Немає результатів" - 200 але пусто

---

## ✅ ДІЇ ДЛЯ ВИПРАВЛЕННЯ

### Етап 1: Критичні (🔴)
1. [ ] Реалізувати `updateURLState()` на index.html
2. [ ] Додати `metroStations: []` в filters
3. [ ] Видалити дублікат `renderProperties()`
4. [ ] Виправити loadMoreProperties() з URL-синхронізацією

### Етап 2: Серйозні (🟡)
5. [ ] Розширити `resetAllFilters()` + очистити селекти
6. [ ] Додати isLoading флаг для запобігання race conditions
7. [ ] Синхронізувати `aria-pressed` у setupQuickFilters()
8. [ ] Перевіряти currentView в renderProperties()

### Етап 3: Низькі (🟢)
9. [ ] Поліпшити повідомлення про помилки
10. [ ] Додати перевірки empty options

---

## 📝 ПЕРЕВІРКА ПІСЛЯ ВИПРАВЛЕННЯ

Після виправлення, запустити:

```bash
# Запустити тести
npm test tests/filters-pagination.test.js

# Перевірити console помилок
npm start  # та відкрити DevTools
```

---

## 📎 СКРИНИ / ВІДЕОЗАПИСИ

(Додати скрини помилок з Developer Tools console)
