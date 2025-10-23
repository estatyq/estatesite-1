# 🎨 Руководство по кастомизации EstatyQ

Полное руководство по персонализации сайта под ваши нужды.

## 📝 Содержание
1. [Изменение цветов](#изменение-цветов)
2. [Редактирование текста](#редактирование-текста)
3. [Добавление объектов](#добавление-объектов)
4. [Изменение логотипа](#изменение-логотипа)
5. [Настройка формы контактов](#настройка-формы-контактов)
6. [Продвинутые изменения](#продвинутые-изменения)

---

## 🎨 Изменение цветов

### Шаг 1: Откройте `styles.css`

Найдите раздел `:root` в начале файла:

```css
:root {
    --primary-color: #d4af37;        /* Основной цвет (золото) */
    --secondary-color: #b8960f;      /* Вторичный цвет */
    --accent-color: #f4d03f;         /* Акцентный цвет */
    --dark-bg: #0a0a0a;              /* Темный фон */
    --light-bg: #1a1a1a;             /* Светлый фон */
    --text-dark: #ffffff;            /* Темный текст (белый) */
    --text-light: #d0d0d0;           /* Светлый текст */
    --border-color: #333333;         /* Цвет границ */
}
```

### Шаг 2: Измените нужные цвета

Примеры:

**Пример 1: Синяя тема**
```css
--primary-color: #2563eb;        /* Синий */
--accent-color: #3b82f6;         /* Светлый синий */
```

**Пример 2: Зелёная тема (эко)**
```css
--primary-color: #10b981;        /* Зелёный */
--accent-color: #34d399;         /* Светлый зелёный */
```

**Пример 3: Розовая тема (люкс)**
```css
--primary-color: #ec4899;        /* Розовый */
--accent-color: #f472b6;         /* Светлый розовый */
```

### Шаг 3: Сохраните и обновите браузер

Все цвета обновятся автоматически по всему сайту.

---

## 📝 Редактирование текста

### Изменение названия компании

В файле `index.html`, `about.html`, `contact.html`:

**Было:**
```html
<h1>ESTATYQ</h1>
<p class="logo-tagline">МРІЯ СТАЄ РЕАЛЬНІСТЮ</p>
```

**Станет:**
```html
<h1>ВАША КОМПАНИЯ</h1>
<p class="logo-tagline">ВАШ ДЕВИЗ</p>
```

### Изменение описания компании

В файле `about.html`:

**Было:**
```html
<p>EstatyQ - это сучасне агентство нерухомості...</p>
```

**Станет:**
```html
<p>Ваше описание компании здесь...</p>
```

### Изменение контактной информации

В файле `contact.html`:

```html
<!-- Телефон -->
<p><a href="tel:+380999999999">+380 99 999 99 99</a></p>

<!-- Email -->
<p><a href="mailto:info@estatyq.ua">info@estatyq.ua</a></p>

<!-- Адрес -->
<p>м. Київ, вул. Хрещатик, 1</p>
```

---

## 🏠 Добавление объектов

### Шаг 1: Откройте `script.js`

Найдите массив `properties` (примерно на строке 27):

```javascript
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
    // ... другие объекты
];
```

### Шаг 2: Добавьте новый объект

Скопируйте последний объект и добавьте его в конец массива:

```javascript
{
    id: 13,                          // Новый ID (увеличьте на 1)
    title: "Шикарная квартира",      // Название
    type: "apartment",               // Тип: apartment, house, office, commercial
    transactionType: "sale",         // Тип операции: sale, rent
    location: "Киев, ул. Крещатик", // Адрес
    price: 120,                      // Цена (в тысячах $)
    rooms: 3,                        // Количество комнат
    area: 95,                        // Площадь в м²
    floor: 10,                       // Этаж
    building: 2023                   // Год постройки
}
```

### Типы недвижимости

- `apartment` - Квартира
- `house` - Дом
- `office` - Офис
- `commercial` - Коммерческое помещение

### Типы операций

- `sale` - Продажа
- `rent` - Аренда

---

## 🖼️ Изменение логотипа

### Шаг 1: Подготовьте изображение логотипа

- Размер: 55x55 пикселей (для navbar)
- Формат: PNG с прозрачностью
- Имя: `обрезаный_логотип-removebg-preview.png`

### Шаг 2: Замените файл

Поместите новое изображение в ту же папку, где находится `index.html`.

### Шаг 3: (Опционально) Изменение пути в HTML

Если вы назвали файл по-другому, обновите в `index.html`:

```html
<!-- Было -->
<img src="обрезаный_логотип-removebg-preview.png" alt="ESTATYQ" />

<!-- Стало -->
<img src="ваш-логотип.png" alt="ESTATYQ" />
```

---

## 📧 Настройка формы контактов

### Изменение обработки формы

В файле `contact.html`, в конце перед `</body>`:

**Текущий код:**
```javascript
function handleFormSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    alert(`Дякуємо, ${name}! Ваше повідомлення отримано...`);
    event.target.reset();
}
```

**Для отправки по email (требуется бэкенд):**
```javascript
function handleFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    fetch('/send-email', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert('Спасибо! Ваше сообщение отправлено.');
        event.target.reset();
    })
    .catch(error => console.error('Error:', error));
}
```

### Добавление новых полей формы

В файле `contact.html` добавьте:

```html
<div class="form-group">
    <label for="company">Компания</label>
    <input type="text" id="company" name="company" placeholder="Название компании">
</div>
```

---

## 🚀 Продвинутые изменения

### Изменение количества колонок в каталоге

В файле `styles.css`, найдите:

```css
.properties-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 35px;
}
```

**Для 2 колонок:**
```css
grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
```

**Для 4 колонок:**
```css
grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
```

### Изменение анимаций

В файле `styles.css`:

**Увеличить скорость анимаций:**
```css
--transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); /* было 0.4s */
```

**Изменить тип анимации:**
```css
/* Было */
animation: slideInDown 1s ease-out;

/* Стало */
animation: slideInDown 0.5s ease-in; /* быстрее и другой эффект */
```

### Изменение размера шрифта

В файле `styles.css`:

```css
.hero-title {
    font-size: clamp(2rem, 6vw, 4rem); /* было clamp(2.5rem, 8vw, 5rem) */
}
```

### Добавление новой секции

1. Добавьте HTML в `index.html`
2. Создайте CSS класс в `styles.css`
3. Добавьте JavaScript функции если нужно в `script.js`

Пример:

```html
<section class="testimonials">
    <div class="container">
        <h2>Отзывы клиентов</h2>
        <div class="testimonials-grid">
            <!-- Отзывы здесь -->
        </div>
    </div>
</section>
```

```css
.testimonials {
    padding: 100px 20px;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 100%);
}

.testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 35px;
}
```

---

## 🔧 Полезные советы

### 1. Тестирование на мобильных
- Откройте DevTools в Chrome (F12)
- Нажмите на иконку мобильного устройства
- Тестируйте на разных размерах

### 2. Оптимизация изображений
- Используйте инструменты вроде TinyPNG для сжатия
- PNG для логотипов с прозрачностью
- JPG для фотографий

### 3. Резервная копия
- Всегда делайте резервную копию перед внесением больших изменений
- Используйте Git для версионирования

### 4. Проверка кроссбраузерности
- Тестируйте в Chrome, Firefox, Safari, Edge
- Используйте сайты вроде Can I Use для проверки поддержки

---

## 📚 Дополнительные ресурсы

- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS Tricks](https://css-tricks.com/)
- [JavaScript.info](https://javascript.info/)
- [Unsplash для изображений](https://unsplash.com/)
- [Google Fonts](https://fonts.google.com/)

---

## ❓ Часто задаваемые вопросы

**Q: Как изменить шрифт?**
A: В `styles.css` измените `@import` в начале или измените `font-family` в правилах CSS.

**Q: Как добавить Google Ads?**
A: Добавьте тег `<script>` в `<head>` раздел и разместите `<ins>` теги где нужны объявления.

**Q: Как интегрировать платежи?**
A: Используйте Stripe или другой платежный сервис - требуется бэкенд.

**Q: Как сделать SEO оптимизацию?**
A: Добавьте meta теги, используйте правильные заголовки, создайте sitemap.xml и robots.txt.

---

**Удачи с кастомизацией! 🚀**

