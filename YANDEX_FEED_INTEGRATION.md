# Яндекс Нерухомість: Інтеграція Фіда

## 📋 Огляд

Система eSitehouse підтримує імпорт нерухомості з **Яндекс.Нерухомості** через XML фіди з:
- ✅ Автоматичним парсингом структури
- ✅ Нормалізацією типів та угод
- ✅ Збагаченням даних мікрорайонів
- ✅ Периодичним оновленням в реальному часі

---

## 🚀 Швидкий старт

### 1. Налаштування環境 (`data/.env`)

```bash
# основна лента нерухомості
FEED_URL=https://example.com/export/realty-feed.xml

# лента для збагачення мікрорайонів
MICRO_URL=https://example.com/export/microdistricts.xml

# інтервал оновлення в хвилинах (за замовчуванням 60)
IMPORT_INTERVAL=60
```

### 2. Запуск імпортера

```bash
# Одноразовий імпорт
node scripts/parse-yandex-feed.js

# Периодичний імпорт в реальному часі
node scripts/realtime-yandex-importer.js

# Тестування парсера на вашіх XML структурах
node scripts/test-yandex-parser.js
```

---

## 📊 Структура Яндекс XML

### Приклад запис (offer):

```xml
<offer internal-id="213054095">
  <type>продажа</type>
  <property-type>жилая</property-type>
  <category>квартира</category>
  <url>http://example.com/property-123.html</url>
  <name>Двокімнатна квартира на вул. Лєніна</name>
  <price>
    <value>250000</value>
    <currency>USD</currency>
  </price>
  <area>
    <value>65</value>
  </area>
  <rooms>2</rooms>
  <floor>3</floor>
  <floors-total>12</floors-total>
  <building-year>2010</building-year>
  <location>
    <country>Україна</country>
    <region>Харківська область</region>
    <locality-name>Харків</locality-name>
    <sub-locality-name>Павлово Поле</sub-locality-name>
    <address>вул. Лєніна, 123</address>
    <latitude>49.9967</latitude>
    <longitude>36.2314</longitude>
  </location>
  <image>http://example.com/photo1.jpg</image>
  <image>http://example.com/photo2.jpg</image>
  <metro>м. Холодна Гора</metro>
</offer>
```

---

## 🔄 Парсинг та Нормалізація

### Таблиця відповідностей

| Яндекс поле | Значення | Результат | Пояснення |
|---|---|---|---|
| `<type>` | `аренда` | `transactionType: "rent"` | Угода оренди |
| `<type>` | `продажа` | `transactionType: "sale"` | Угода продажу |
| `<type>` | `подобово` | `transactionType: "daily"` | Посуточна оренда |
| `<category>` | `квартира` | `type: "apartment"` | Тип нерухомості |
| `<category>` | `дом` | `type: "house"` | Приватний будинок |
| `<category>` | `офис` | `type: "office"` | Комерційний офіс |
| `<property-type>` | `жилая` | використовується для уточнення типу | Житлова нерухомість |

### Приклад парсингу:

**Вхід (XML):**
```xml
<offer internal-id="111861165">
  <type>аренда</type>
  <property-type>жилая</property-type>
  <category>квартира</category>
</offer>
```

**Вихід (JSON):**
```json
{
  "id": "111861165",
  "type": "apartment",
  "transactionType": "rent",
  "title": null,
  "price": { "value": null, "currency": "USD" },
  "location": {
    "city": null,
    "district": null,
    "microdistrict": null
  }
}
```

---

## 🧪 Тестування парсера

### Запуск тестів:

```bash
node scripts/test-yandex-parser.js
```

### Результат успішного тесту:

```
🧪 ТЕСТУВАННЯ ЯНДЕКС ПАРСЕРА

✅ Тест 1: Аренда квартиры (мінімальні дані)
   typeMap("квартира", "жилая") → "apartment"
   dealMap("аренда", ...) → "rent"
   ✅ УСПІШНО: Парсинг пройшов без помилок

✅ Тест 2: Продажа квартиры (з URL и датами)
   typeMap("квартира", "жилая") → "apartment"
   dealMap("продажа", ...) → "sale"
   ✅ УСПІШНО: Парсинг пройшов без помилок

✅ Тест 3: Подобово оренда будинку
   typeMap("дом", "жилая") → "house"
   dealMap("подобово", ...) → "daily"
   ✅ УСПІШНО: Парсинг пройшов без помилок

✅ Тест 4: Коммерційна нерухомість
   typeMap("офис", "коммерческая") → "office"
   dealMap("продажа", ...) → "sale"
   ✅ УСПІШНО: Парсинг пройшов без помилок

📊 РЕЗУЛЬТАТИ ТЕСТУВАННЯ:
   ✅ Успішних: 4
   ❌ Невдалих: 0
   📈 Всього: 4

🎉 ВСІ ТЕСТИ ПРОЙДЕНІ!
```

---

## 📡 Real-time імпорт

### Як працює `realtime-yandex-importer.js`:

1. **Читає конфіг** з `data/.env`
2. **Завантажує основну лену** (`FEED_URL`)
3. **Завантажує лену мікрорайонів** (`MICRO_URL`)
4. **Парсить XML** та нормалізує дані
5. **Збагачує дані** мікрорайонами из другої ленти
6. **Зберігає** `data/listings.json` та `data/report.json`
7. **Чекає** на наступний інтервал оновлення

### Лог-вивід прикладу:

```
[14.01.2025, 10:30:15] 🚀 Запуск імпортера Яндекс нерухомості
[14.01.2025, 10:30:15] 📋 Інтервал оновлення: 60 хвилин
[14.01.2025, 10:30:15] 📡 Завантаження основної ленти...
[14.01.2025, 10:30:18] ✅ Основна лента: 1245 пропозицій
[14.01.2025, 10:30:18] 📡 Завантаження ленти мікрорайонів...
[14.01.2025, 10:30:21] ✅ Лента мікрорайонів: 856 пропозицій
[14.01.2025, 10:30:22] ✅ Імпорт завершено: 1150 об'єктів, пропущено: 95
[14.01.2025, 10:30:22] 📊 Статистика: {
  "apartment/rent": { "count": 650 },
  "apartment/sale": { "count": 300 },
  "house/rent": { "count": 150 },
  "office/sale": { "count": 50 }
}
```

---

## 🔍 Фільтри якості (Quality Filters)

Дані пропозиції **пропускаються** если:

- ❌ Немає `internal-id`
- ❌ Тип нерухомості не розпізнаний (`type === null`)
- ❌ Тип угоди не розпізнаний (`transactionType === null`)
- ❌ Немає ціни (`price.value === null`)
- ❌ Немає міста (`location.city === null`)

**Пример:** Если пропозиція без адреси, але з ціною і типом - вона буде збережена:

```json
{
  "id": "111861165",
  "type": "apartment",
  "transactionType": "rent",
  "price": { "value": 1000, "currency": "USD" },
  "location": { "city": "kyiv" },
  "address": null  // ← OK, пропозиція збережена
}
```

---

## 📁 Вихідні файли

### `data/listings.json`

Основний каталог нерухомості:

```json
[
  {
    "id": "213054095",
    "url": "http://example.com/...",
    "title": "Двокімнатна квартира...",
    "type": "apartment",
    "transactionType": "sale",
    "price": { "value": 250, "currency": "USD" },
    "area": { "total": 65 },
    "rooms": 2,
    "floor": 3,
    "floorsTotal": 12,
    "yearBuilt": 2010,
    "images": ["http://...", "http://..."],
    "location": {
      "city": "kyiv",
      "district": "Pavlovo Pole",
      "microdistrict": null,
      "address": "вул. Лєніна, 123"
    },
    "geo": { "lat": 49.9967, "lng": 36.2314 },
    "amenities": { "metro": "м. Холодна Гора" }
  }
]
```

### `data/report.json`

Статистика по типам і угодам:

```json
{
  "apartment/rent": { "count": 650 },
  "apartment/sale": { "count": 300 },
  "house/rent": { "count": 150 },
  "office/sale": { "count": 50 },
  "apartment/daily": { "count": 25 }
}
```

---

## 🛠️ Налаштування

### Зміна інтервалу оновлення

```bash
# data/.env
IMPORT_INTERVAL=30  # оновлювати кожні 30 хвилин
```

### Додання нового типу нерухомості

Редагуйте функцію `typeMap()`:

```javascript
function typeMap(rawCategory, rawPropType) {
  const s = [rawCategory, rawPropType].filter(Boolean).map(x => String(x).toLowerCase()).join(' ');
  if (/квартир|apartment/.test(s)) return 'apartment';
  if (/дом|house|коттедж/.test(s)) return 'house';
  // ✨ Добавить нову категорію:
  if (/вилла|villa/.test(s)) return 'villa';
  // ...
}
```

### Додання нового міста

Редагуйте функцію `cityToKey()`:

```javascript
function cityToKey(name) {
  const map = {
    // ...
    'полтава': 'poltava',  // ✨ Нове місто
    'м. полтава': 'poltava'
  };
  return map[s] || null;
}
```

---

## 📝 Приклади використання

### Імпорт и Оновлення

```bash
# 1. Налаштувати .env
echo "FEED_URL=https://..." > data/.env
echo "MICRO_URL=https://..." >> data/.env

# 2. Запустити тести парсера
node scripts/test-yandex-parser.js

# 3. Запустити імпортер (фон)
nohup node scripts/realtime-yandex-importer.js > logs/yandex-importer.log 2>&1 &

# 4. Перевірити результат
cat data/listings.json | head
cat data/report.json
```

### Інтеграція з Docker

```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install

# Запустити імпортер як сервіс
CMD ["node", "scripts/realtime-yandex-importer.js"]
```

---

## 🐛 Вирішення проблем

### Помилка: "Set FEED_URL and MICRO_URL"

```bash
# Перевірте наявність файлу
ls -la data/.env

# Переконайтесь в правильності змінних
cat data/.env
```

### Помилка: "Fetch failed 404"

```bash
# Перевірте URL-адреси у .env
# Переконайтесь що сервер доступний:
curl https://your-feed-url/realty-feed.xml
```

### Помилка: "Дані не оновлюються"

```bash
# Перевірте процес
ps aux | grep realtime-yandex-importer.js

# Переглядьте лог
tail -100 logs/yandex-importer.log

# Перезапустіть
pkill -f realtime-yandex-importer.js
nohup node scripts/realtime-yandex-importer.js > logs/yandex-importer.log 2>&1 &
```

---

## 📞 Контакти

Для питань або звітів про баги контактуйте команду розробки.

**Статус**: ✅ Протестовано на Яндекс XML форматі  
**Остання оновлення**: 2025-01-14
