# 📋 Детальное описание структуры проекта EstatyQ

## 🗂️ Организация папок

```
estatyQ site/
│
├── 📄 index.html                 ← Главная страница (точка входа)
├── 📄 .gitignore                 ← Git игноры
├── 📄 README.md                  ← Основная документация
├── 📄 STRUCTURE.md               ← Этот файл (структура проекта)
│
├── 📁 css/
│   └── 📄 styles.css             ← Все стили (~775 строк)
│
├── 📁 js/
│   └── 📄 script.js              ← Вся функциональность (~500 строк)
│
├── 📁 pages/
│   ├── 📄 about.html             ← Страница "О нас"
│   ├── 📄 contact.html           ← Страница контактов и форма
│   └── 📄 services.html          ← Услуги (опционально)
│
├── 📁 assets/
│   ├── 📁 images/
│   │   ├── logo.svg
│   │   ├── logo-icon-only.svg
│   │   ├── обрезаный_логотип-removebg-preview.png
│   │   └── photo_*.jpg
│   │
│   └── 📁 icons/
│       └── favicon.ico           ← Иконка сайта (TODO)
```

## 📄 Описание файлов

### 🏠 **index.html** (≈200 строк)

**Назначение**: Главная страница сайта

**Структура**:
1. **Навигация** (navbar)
   - Логотип с tagline "МРІЯ СТАЄ РЕАЛЬНІСТЮ"
   - Ссылки: Главная, Каталог, Про нас, Контакти

2. **Hero секция** 
   - Большой заголовок с gradient текстом
   - Subtitle
   - Search input + Search button

3. **Статистика** (Stats section)
   - 4 карточки: 5000+ объектов, 1500+ клиентов, 150+ специалистов, 24/7 поддержка

4. **Каталог** (Catalog section)
   - Таби выбора типа операции (Продаж/Оренда)
   - Таби выбора типа нерухомості (Квартира/Дом/Офис/Коммерческое)
   - Фильтры: Цена, Количество комнат, Площа
   - Кнопка "Скинути фільтри"
   - Сетка с карточками объектов

5. **Преимущества** (Advantages section)
   - 4 карточки: Прозорість, Точність, Швидкість, Безпека

6. **Модальное окно** для деталей объектов

7. **Футер**
   - EstatyQ информация
   - Быстрое меню
   - Контакты
   - Copyright

8. **Интерактивный курсор** (magnifier cursor)

**Ссылки**:
```html
<link rel="stylesheet" href="css/styles.css">
<script src="js/script.js"></script>
<a href="pages/about.html">Про нас</a>
<a href="pages/contact.html">Контакти</a>
```

---

### 🎨 **css/styles.css** (≈775 строк)

**Назначение**: Все стили для сайта

**Структура CSS**:

1. **Google Fonts Import**
   - Roboto шрифт (400, 500, 700)

2. **CSS Переменные** (:root)
   ```css
   --primary-color: #d4af37;     /* Золото */
   --accent-color: #f4d03f;      /* Светлое золото */
   --dark-bg: #0a0a0a;           /* Черный фон */
   --light-bg: #1a1a1a;          /* Светлый фон */
   --text-dark: #ffffff;         /* Белый текст */
   --text-light: #d0d0d0;        /* Серебристый текст */
   ```

3. **Базовые стили**
   - Reset (margin, padding, box-sizing)
   - Body (font, background, color)
   - Контейнер (max-width: 1200px)
   - Headings

4. **Компоненты**
   - Buttons (.btn, .btn-primary, .btn-secondary)
   - Navbar
   - Logo и навигационные ссылки
   - Hero секция
   - Statistics cards
   - Catalog (tabs, filters)
   - Property cards
   - Modal windows
   - Advantages cards
   - Footer

5. **Адаптивность** (@media)
   - Tablet (768px)
   - Mobile (480px)

6. **Интерактивная лупа** (#magnifier-cursor)

**Цветовая палитра**:
- Основной: #d4af37 (золото)
- Акцент: #f4d03f (светлое золото)
- Фон: #0a0a0a черный, #1a1a1a 
- Текст: #ffffff белый, #d0d0d0 серебристый

---

### ⚙️ **js/script.js** (≈500 строк)

**Назначение**: Вся динамическая функциональность

**Основные функции**:

1. **Инициализация**
   - `initializeFilters()` - загрузка объектов на страницу
   - `initializeMagnifierCursor()` - интерактивный курсор-лупа

2. **Фильтрация**
   - `changeTransaction(type)` - переключение Продаж/Оренды
   - `changePropertyType(type)` - выбор типа нерухомості
   - `filterProperties()` - применение всех фильтров
   - `resetFilters()` - сброс фильтров

3. **Модальные окна**
   - `openModal(propertyId)` - открыть детали объекта
   - `closeModal()` - закрыть модальное окно

4. **Интерактивность**
   - `scrollToCatalog()` - скролл к каталогу
   - `toggleLike(id)` - добавить/удалить из избранного
   - `handleFormSubmit()` - обработка формы контакта

5. **Данные**
   - Массив `properties` с 12+ объектами недвижимости
   - Каждый объект: id, title, type, transactionType, location, price, rooms, area, floor, building

6. **Event Listeners**
   - Click события на кнопки
   - Change события на фильтры
   - Window onclick для закрытия модала

---

### 📄 **pages/about.html** (≈150 строк)

**Назначение**: Информация о компании

**Структура**:
1. Навигация (с относительными путями ../css, ../js)
2. Hero/Header с информацией о компании
3. О компании (основной текст)
4. Наши преимущества (6 карточек)
5. Наша миссия (Миссия, Бачення, Цінності)
6. Футер

**CSS пути**:
```html
<link rel="stylesheet" href="../css/styles.css">
```

**JS пути**:
```html
<script src="../js/script.js"></script>
```

---

### 📞 **pages/contact.html** (≈200 строк)

**Назначение**: Контакты и форма обратной связи

**Структура**:
1. Навигация
2. Контактная информация
   - Телефон
   - Email
   - Адрес
3. График работы
4. Форма контакта
   - Имя
   - Email
   - Телефон
   - Тема
   - Сообщение
   - Кнопка отправки
5. Встроенный JavaScript обработчик формы
6. Футер

**Форма обработка**:
```javascript
function handleFormSubmit(event) {
    // Валидация и alert уведомление
}
```

---

### 🖼️ **assets/images/** 

**Содержит изображения**:
- `logo.svg` - полный логотип
- `logo-icon-only.svg` - только иконка
- `обрезаный_логотип-removebg-preview.png` - обрезанный логотип
- `photo_*.jpg` - фотографии объектов

**Использование в HTML**:
```html
<img src="assets/images/logo.svg" alt="ESTATYQ">
<!-- В pages/ -->
<img src="../assets/images/logo.svg" alt="ESTATYQ">
```

---

### 🎯 **assets/icons/**

**Должен содержать**:
- `favicon.ico` - иконка сайта

**Использование в HTML**:
```html
<link rel="icon" href="assets/icons/favicon.ico">
<!-- В pages/ -->
<link rel="icon" href="../assets/icons/favicon.ico">
```

---

## 🔗 Пути в проекте

### Из index.html (корень):
```html
<!-- CSS -->
<link rel="stylesheet" href="css/styles.css">

<!-- JS -->
<script src="js/script.js"></script>

<!-- Изображения -->
<img src="assets/images/logo.svg">

<!-- Ссылки -->
<a href="pages/about.html">Про нас</a>
<a href="pages/contact.html">Контакти</a>
```

### Из pages/*.html (подпапка):
```html
<!-- CSS -->
<link rel="stylesheet" href="../css/styles.css">

<!-- JS -->
<script src="../js/script.js"></script>

<!-- Изображения -->
<img src="../assets/images/logo.svg">

<!-- Ссылки -->
<a href="../index.html">Главная</a>
<a href="about.html">Про нас</a>
```

---

## 📊 Статистика проекта

| Файл | Строк | Назначение |
|------|-------|-----------|
| index.html | ~200 | Главная страница |
| css/styles.css | ~775 | Все стили |
| js/script.js | ~500 | Функциональность |
| pages/about.html | ~150 | О компании |
| pages/contact.html | ~200 | Контакты и форма |
| **ИТОГО** | **~1825** | Готовый проект |

---

## ✅ Статус файлов

- ✅ `index.html` - Готов, все работает
- ✅ `css/styles.css` - Готов, адаптивен
- ✅ `js/script.js` - Готов, все функции работают
- ✅ `pages/about.html` - Готов
- ✅ `pages/contact.html` - Готов
- ⏳ `assets/icons/favicon.ico` - TODO
- ⏳ `pages/services.html` - TODO (опционально)

---

## 🚀 Развертывание

### Локальный сервер:
```bash
python -m http.server 8000
```

### Откройте:
```
http://localhost:8000
```

### На продакшене:
Загрузить на хостинг (Vercel, Netlify, GitHub Pages или обычный хостинг)

---

**Проект готов к использованию и расширению!** 🎉

Мрія стає реальністю! 🏠✨

