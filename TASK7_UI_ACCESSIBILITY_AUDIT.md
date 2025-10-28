
# TASK 7: Аудит Листинга, Контактів, Модалок та Доступності
**Дата**: октябрь 2025  
**Статус**: 🔴 CRITICAL  
**Області**: pages/listing.html, pages/contact.html, contact.html, js/script.js, логотипи-кнопки

---

## 📋 ЧЕК-ЛИСТ КНОПОК ПО ВСІХ СТОРІНКАХ

### 1. **index.html** (Каталог)
- ✅ Логотип: `onclick="location.href='index.html'"` + `role="button" tabindex="0"`
  - **Проблема**: Не обробляє Enter/Space для клавіатури
  - **Вирішення**: Додати обробник `onkeydown` або змінити на `<a>`
- ✅ Nav links: `<a>` теги (коректно)
- ✅ Transaction buttons: `aria-pressed`, але немає `aria-label`
- ✅ Quick filter buttons: `aria-pressed` + `data-type`
- ✅ Room buttons: `data-rooms` + `aria-pressed`
- ✅ Sort select: `aria-label="Сортування"` (коректно)
- ✅ View buttons: `aria-pressed`, `aria-label` (коректно)
- ✅ "Детально": `onclick="openModal()"` (модалка)
- ✅ Like buttons: `onclick="toggleLike()"` (серце)
- ✅ "Показати ще": `id="load-more-btn"` (коректно)

### 2. **pages/listing.html** (Одиночне оголошення)
- ✅ Логотип: `onclick="location.href='catalog.html'"` + `role="button" tabindex="0"`
  - **Проблема**: Того ж - клавіатура не працює
- ✅ Nav links: `<a>` теги (коректно)
- ✅ "Назад до каталогу": `<a href="catalog.html">` (коректно!)

### 3. **pages/contact.html** (Контакти)
- ✅ Логотип: `<div class="logo">` без `role`, без `tabindex`, без `onclick`
  - **КРИТИЧНО**: Логотип взагалі не є кнопкою!
- ✅ Nav links: `<a>` теги (коректно)
- ✅ Contact links: `<a href="tel:">`, `<a href="mailto:">` (коректно)
- ✅ Contact form inputs: мають `id`, `for` в label (коректно)
- ✅ Submit button: `type="submit"` без `aria-label` (мог бы бути краще)

### 4. **contact.html** (Корінь - старий файл)
- ⚠️ Дублікат pages/contact.html
- ✅ Логотип: `<div class="logo">` - те ж саме
- ✅ Nav links: `<a>` теги (коректно)
- ✅ Form: стандартна HTML форма (коректно)

### 5. **pages/landing.html** (Про нас)
- ✅ Логотип: `onclick="location.href='../index.html'"` + `role="button" tabindex="0" aria-label="Логотип EstatyQ"`
  - **КРАЩЕ**: має `aria-label`!
- ✅ Nav links: `<a>` теги + `aria-current="page"` на активному
- ✅ Skip link: `<a class="skip-link" href="#main-content">` (чудово!)

---

## 🐛 БАГ-РЕПОРТИ (Міні-формат)

### **BUG-001: Логотип не активується на Enter/Space**
**Приоритет**: P2 (Medium)

| Аспект | Опис |
|--------|------|
| **Шаги** | 1. Відкрити index.html / pages/listing.html<br>2. Табуляцією перейти на логотип<br>3. Натиснути Enter/Space |
| **Ожидание** | Перенаправлення на каталог / сторінку вибору |
| **Факт** | Нічого не відбувається (потребує клієнта мишею) |
| **Скрин** | Логотип має `role="button"` але обробляє тільки `onclick` |
| **Браузер** | Chrome/Firefox, 1920px, ОС: Windows |
| **Корінь** | `pages/listing.html:16` та `pages/landing.html:58` |

**Мікрофікс**:
```html
<!-- Із -->
<div class="logo" onclick="location.href='catalog.html'" role="button" tabindex="0">

<!-- В -->
<a href="catalog.html" class="logo" aria-label="Перейти до каталогу">
```

---

### **BUG-002: Логотип на contact.html не є кнопкою**
**Приоритет**: P2 (Medium)

| Аспект | Опис |
|--------|------|
| **Шаги** | 1. Відкрити pages/contact.html<br>2. Спробувати натиснути табуляцію<br>3. Логотип не фокусується |
| **Ожидание** | Логотип має бути активною кнопкою / посиланням |
| **Факт** | Логотип просто текст, не активний |
| **Розташування** | pages/contact.html:90-95, contact.html:89-94 |
| **Браузер** | Chrome, 1920px, ОС: Windows |

**Мікрофікс**:
```html
<!-- Із -->
<div class="logo">
  <img src="../assets/images/обрезаный_логотип-removebg-preview.png" alt="ESTATYQ" class="logo-icon-image"/>
  ...
</div>

<!-- В -->
<a href="../index.html" class="logo" aria-label="Логотип EstatyQ - На головну">
  <img src="../assets/images/обрезаный_логотип-removebg-preview.png" alt="ESTATYQ" class="logo-icon-image"/>
  ...
</a>
```

---

### **BUG-003: Контактна форма не має SUCCESS-повідомлення**
**Приоритет**: P1 (High)

| Аспект | Опис |
|--------|------|
| **Шаги** | 1. Відкрити pages/contact.html<br>2. Заповнити форму коректно<br>3. Клацнути "Відправити повідомлення" |
| **Ожидание** | Повідомлення "Дякуємо! Ваше повідомлення отримано" та очищена форма |
| **Факт** | Показується `alert()` замість нормального повідомлення в форміι<br>Для екрана читача це не доступно |
| **Розташування** | pages/contact.html:255-260 |
| **Консоль** | Помилок немає, але UX поганий |
| **Браузер** | Chrome, 768px (мобіль), ОС: iOS |

**Мікрофікс**:
```javascript
// Із
function handleFormSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    alert(`Дякуємо, ${name}! ...`);
    event.target.reset();
}

// В
function handleFormSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    
    const successMsg = document.createElement('div');
    successMsg.role = 'alert';
    successMsg.className = 'success-message';
    successMsg.textContent = `Дякуємо, ${name}! Ваше повідомлення отримано. Ми зв'яжемося найскоріше.`;
    successMsg.style.cssText = `
        background: #2d7a3a; color: #fff; padding: 15px 20px;
        border-radius: 8px; margin-bottom: 20px;
        animation: slideIn 0.3s ease-out;
    `;
    
    const form = event.target;
    form.parentNode.insertBefore(successMsg, form);
    form.reset();
    
    setTimeout(() => successMsg.remove(), 5000);
}
```

---

### **BUG-004: Модалка не закривається на Escape**
**Приоритет**: P2 (Medium)

| Аспект | Опис |
|--------|------|
| **Шаги** | 1. Відкрити index.html<br>2. Клацнути "Детально" на якійсь карті<br>3. Натиснути Escape |
| **Ожидание** | Модалка закривається |
| **Факт** | Нічого не відбувається (Escape не обробляється) |
| **Розташування** | js/script.js:1728-1733 |
| **Доступність** | Користувачі тільки на клавіатурі застрягають |

**Мікрофікс**:
```javascript
// Додати обробник Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('modal');
        if (modal && modal.style.display === 'block') {
            closeModal();
        }
    }
});

// Також: перевірити, що модалка має role="dialog" та aria-modal="true" ✅
```

---

### **BUG-005: Модалка не повертає фокус після закриття**
**Приоритет**: P2 (Medium)

| Аспект | Опис |
|--------|------|
| **Шаги** | 1. Табуляцією перейти на кнопку "Детально"<br>2. Натиснути Enter (відкриється модалка)<br>3. Закрити модалку (Escape або кнопка X)<br>4. Где знаходиться фокус? |
| **Ожидание** | Фокус повертається на кнопку "Детально" |
| **Факт** | Фокус перейшов на `<body>` або невідомо де |
| **Розташування** | js/script.js:1724-1726 |
| **Доступність** | WCAG 2.1 Level AA забороняє втрату фокусу |

**Мікрофікс**:
```javascript
let lastFocusedElement; // Глобальна змінна

function openModal(propId) {
    lastFocusedElement = document.activeElement; // Зберегти фокус
    // ... решта коду ...
    const modal = document.getElementById("modal");
    modal.style.display = "block";
    modal.focus(); // Перенести фокус в модалку
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
    if (lastFocusedElement) {
        lastFocusedElement.focus(); // Повернути фокус
    }
}
```

---

### **BUG-006: Form inputs без autocomplete атрибутів**
**Приоритет**: P3 (Low)

| Аспект | Опис |
|--------|------|
| **Шаги** | 1. Відкрити pages/contact.html на мобілі<br>2. Клацнути на поле "Ім'я"<br>3. Перевірити, пропонує ли браузер автозавершення |
| **Ожидание** | Браузер пропонує зберігти дані / автозавершити |
| **Факт** | Без атрибутів - браузер не знає, що це имя/email |
| **Розташування** | pages/contact.html:191-214 |

**Мікрофікс**:
```html
<input type="text" id="name" name="name" required 
       placeholder="Ваше ім'я"
       autocomplete="name">

<input type="email" id="email" name="email" required 
       placeholder="your@email.com"
       autocomplete="email">

<input type="tel" id="phone" name="phone" 
       placeholder="+380 (__)___ __ __"
       autocomplete="tel">
```

---

### **BUG-007: Посилання на Telegram не має aria-label**
**Приоритет**: P3 (Low)

| Аспект | Опис |
|--------|------|
| **Шаги** | 1. Відкрити index.html<br>2. Клацнути "Детально"<br>3. Зчитувач екрану читає "Кнопка" замість "Написати в Telegram" |
| **Ожидание** | Jaws/NVDA читає "Написати в Telegram, посилання" |
| **Факт** | Без тексту (тільки тег `<a>` без змісту) |
| **Розташування** | js/script.js:1715-1717 |

**Мікрофікс**:
```javascript
<a href="${cities[prop.city].bot}" target="_blank" 
   class="btn btn-secondary"
   aria-label="Написати нам у Telegram">
  Написати в Telegram
</a>
```

---

### **BUG-008: Мобільна адаптивність - кнопки на contact.html не響ивают**
**Приоритет**: P1 (High)

| Аспект | Опис |
|--------|------|
| **Шаги** | 1. Відкрити pages/contact.html на ширині 375px (iPhone SE)<br>2. Спробувати таплнути кнопку "Відправити"<br>3. На екранах < 600px кнопка обрізується |
| **Ожидание** | Кнопка повна ширина, піддержує сенсорні жесты |
| **Факт** | `.submit-btn { width: 100%; }` але `.contact-form { padding: 50px; }` занадто велика<br>На мобілі: padding + form-width > 100vw |
| **Розташування** | pages/contact.html:65-83 |
| **Мобільні браузери** | Safari iOS 14+, Chrome Android |

**Мікрофікс**:
```css
/* В styles.css */
@media (max-width: 768px) {
    .contact-form {
        padding: 25px; /* Зменшити з 50px */
    }
    
    .submit-btn {
        min-height: 44px; /* Для сенсорних девайсів */
        font-size: 16px; /* Запобігти zoom на iOS */
    }
}
```

---

### **BUG-009: listing.html - Error alert не звичається автоматично**
**Приоритет**: P2 (Medium)

| Аспект | Опис |
|--------|------|
| **Шаги** | 1. Відкрити pages/listing.html?id=INVALID_ID<br>2. Спостерігати сообщение про помилку<br>3. Помилка залишається на екрані назавжди |
| **Ожидание** | Помилка відображається 5 сек, потім зникає |
| **Факт** | `err.classList.add('show')` але немає `setTimeout(() => err.classList.remove('show'), 5000)` |
| **Розташування** | pages/listing.html:49-119 |

**Мікрофікс**:
```javascript
const err = document.getElementById('error');
if (!id) {
    err.textContent = 'Не передано ідентифікатор оголошення';
    err.classList.add('show');
    err.setAttribute('role', 'alert');
    card.setAttribute('aria-busy', 'false');
    
    // Додати автозакриття
    setTimeout(() => {
        err.classList.remove('show');
    }, 5000);
    
    return;
}
```

---

### **BUG-010: Нормалізація навігації до логотипу - дублювання логіки**
**Приоритет**: P3 (Low)

| Аспект | Опис |
|--------|------|
| **Шаги** | Аналіз кодової бази |
| **Проблема** | На різних сторінках логотип реалізований по-різному:<br>- index.html: onclick в div (потребує role/tabindex)<br>- pages/landing.html: onclick в div + aria-label<br>- pages/contact.html: просто div без onclick<br>**Рішення**: Уніфікувати - всюди робити `<a>` |

---

## ✅ ПОШАГОВИЙ ПЛАН ТЕСТУВАННЯ

### **Фаза 1: Функціональність (День 1-2)**

#### 1.1 Логотипи та навігація
- [ ] Перевірити логотип на кожній сторінці (5 місць):
  - [ ] index.html
  - [ ] pages/listing.html
  - [ ] pages/landing.html
  - [ ] pages/contact.html
  - [ ] contact.html
- [ ] Клавіатура: Tab → логотип → Enter → перенаправлення?
- [ ] Миша: клік на логотип → перенаправлення?
- [ ] Mobile: тап на логотип → перенаправлення?

#### 1.2 Контактна форма (pages/contact.html)
- [ ] Заповнити коректно → submit
  - [ ] Окремо тестувати кожне поле (name, email, phone, subject, message)
  - [ ] На Desktop (1920px)
  - [ ] На Tablet (768px)
  - [ ] На Mobile (375px)
- [ ] Негативні кейси:
  - [ ] Email: `test` (невалідний) → перевірити браузерну валідацію
  - [ ] Phone: залишити пусто (опціональне поле) → submit скоро?
  - [ ] Message: пустий → помилка?
- [ ] Success-повідомлення після submit:
  - [ ] Видиме з текстом "Дякуємо"?
  - [ ] Форма очищена?
  - [ ] Доступне для екрана читача (role="alert")?

#### 1.3 Листинг (pages/listing.html)
- [ ] Кнопка "Назад до каталогу":
  - [ ] Клік → перенаправляє на pages/catalog.html?
  - [ ] Клавіатура (Enter)?
  - [ ] Мобіль (тап)?
- [ ] Error states:
  - [ ] Без ID параметра → помилка?
  - [ ] ID неіснуючого товару → помилка?
  - [ ] Помилка завантаження API → помилка?
- [ ] Skeleton loaders:
  - [ ] Показуються під час завантаження?
  - [ ] Приховуються після завантаження?

#### 1.4 Модалки (index.html)
- [ ] Відкриття:
  - [ ] Клік на "Детально" → модалка?
  - [ ] Клавіатура (Enter на кнопці)?
- [ ] Закриття:
  - [ ] Клік X → закривається?
  - [ ] Клік поза модалкою → закривається?
  - [ ] Escape → закривається?
  - [ ] Кнопка "Додати в улюблені" → закривається?
- [ ] Like button in modal:
  - [ ] Клік → фаворит додається?
  - [ ] Icon змінюється (♡ ↔ ♥)?
  - [ ] localStorage оновлюється?
- [ ] Telegram link:
  - [ ] Відкриває нову вкладку?
  - [ ] Посилання коректне для міста?

---

### **Фаза 2: Доступність (День 3)**

#### 2.1 Клавіатурна навігація
- [ ] **Tab order** (повинен бути логічний):
  - [ ] Skip link спочатку?
  - [ ] Nav links → Logo → Search → Filters → Cards → Footer?
- [ ] **Фокус видиме?**
  - [ ] Контрастність фокусу ≥ 3:1?
  - [ ] Фокусний контур товщиною ≥ 2px?
- [ ] **Фокус ловушка?**
  - [ ] Модалка: фокус в межах модалки?
  - [ ] Закриття модалки: фокус повертається?
- [ ] **Shift+Tab** назад:
  - [ ] Tab + Shift+Tab = повернення?

#### 2.2 Екран читача (Jaws / NVDA)
- [ ] Логотип:
  - [ ] NVDA читає: "Логотип EstatyQ, кнопка" або "посилання"?
  - [ ] Без магічних текстів типу "onclick"?
- [ ] Форма контактів:
  - [ ] Label правильно пов'язана з input (`<label for="name">` → `<input id="name">`)?
  - [ ] Required поля правильно позначені (`required` атрибут)?
  - [ ] Error повідомлення читаються (role="alert")?
  - [ ] Success повідомлення читаються (role="alert")?
- [ ] Модалка:
  - [ ] `role="dialog"` + `aria-modal="true"`?
  - [ ] Title читається (aria-labelledby)?
  - [ ] Нема ловушки (фокус тільки в модалці)?
- [ ] Карти:
  - [ ] Заголовок читається?
  - [ ] Ціна читається?
  - [ ] Like button читається правильно (♥ = улюблене)?

#### 2.3 Контрастність
- [ ] Color contrast ≥ 4.5:1 для текста 14px?
- [ ] Перевірити:
  - [ ] Текст на золотому фоні (#d4af37)?
  - [ ] Текст на темному фоні (#0a0a0a)?
  - [ ] Активні/неактивні кнопки?

#### 2.4 Zoom та масштабування
- [ ] Браузерний zoom 200% → все читається?
- [ ] Текст не виходить за межі екрану?
- [ ] Кнопки залишаються кліькабельні?

---

### **Фаза 3: Мобільна адаптивність (День 4)**

#### 3.1 Ширини
- [ ] 320px (iPhone SE):
  - [ ] Логотип + nav одинарний рядок?
  - [ ] Форма контактів не обрізується?
  - [ ] Кнопки мінімум 44x44px?
- [ ] 768px (iPad):
  - [ ] Сітка 2 колони?
  - [ ] Фільтри розібрані логічно?
- [ ] 1920px (Desktop):
  - [ ] Сітка 3-4 колони?

#### 3.2 Touch
- [ ] Кнопки мінімум 44x44px (діючі області)?
- [ ] Між кнопками ≥ 8px зазору?
- [ ] Форма: поля 44px висота (шрифт 16px запобігає zoom на iOS)?

#### 3.3 Ориєнтація
- [ ] Portrait 375px:
  - [ ] Логотип зменшується?
  - [ ] Форма адаптується?
- [ ] Landscape 667px:
  - [ ] 2 колони форми?

---

### **Фаза 4: Браузери та ОС (День 5)**

#### 4.1 Desktop
- [ ] Chrome 120+ (Windows)
- [ ] Firefox 121+ (Windows)
- [ ] Safari 17+ (macOS)

#### 4.2 Mobile
- [ ] Safari iOS 17+ (iPhone 12 Pro, iPhone SE)
- [ ] Chrome Android 120+ (Pixel 8, Samsung S24)

#### 4.3 Экран читача
- [ ] NVDA (Windows)
- [ ] Jaws (Windows)
- [ ] VoiceOver (macOS/iOS)
- [ ] TalkBack (Android)

---

## 📦 ПРОМПТИ ЗАДАЧ ДЛЯ РОЗРОБНИКІВ A/B/C

---

## **ПРОМПТ A: Логотипи та навігація (Priority P1)**

### Завдання
Уніфікувати логотип та кнопки навігації на всіх сторінках з дотриманням доступності (WCAG 2.1 Level AA).

### Критерії готовності
✅ Логотип на всіх 5 сторінках є активною кнопкою/посиланням
✅ Клавіатурна навігація (Tab + Enter) працює
✅ Екран читача читає "Логотип EstatyQ, посилання" або кнопку
✅ Фокус видиме (box-shadow або outline)
✅ Немає дублювання onclick обробників

### План реалізації
1. **Шаг 1** (20 хв): Змінити всі `<div class="logo" onclick=...>` на `<a href="..." class="logo">`
   - Файли: index.html, pages/listing.html, pages/landing.html, pages/contact.html, contact.html
   - Додати `aria-label="Логотип EstatyQ - На головну"`

2. **Шаг 2** (10 хв): Додати CSS для фокусу логотипу
   ```css
   .logo:focus {
       outline: 2px solid #d4af37;
       outline-offset: 2px;
   }
   ```

3. **Шаг 3** (15 хв): Тестування
   - Tab → на логотип → Enter → перенаправлення?
   - NVDA: читає "Логотип EstatyQ, посилання"?
   - Мобіль (375px): тап прямує?

### Дата завершення
**Готово до**: 29.10.2025 18:00

### Файли
```
index.html              (line 75-81)
pages/listing.html      (line 16-22)
pages/landing.html      (line 58-64)
pages/contact.html      (line 90-96)
contact.html            (line 89-95)
css/styles.css          (додати .logo:focus)
```

---

## **ПРОМПТ B: Контактна форма та User Feedback (Priority P1)**

### Завдання
Покращити контактну форму: валідація, success/error повідомлення, мобільна адаптивність.

### Критерії готовності
✅ Form submit показує success-повідомлення (не alert)
✅ Error state для невалідних email/phone
✅ Autocomplete атрибути на всіх полях
✅ Мобіль (375px): кнопка 44x44px, padding розумне
✅ Форма доступна для екрана читача

### План реалізації
1. **Шаг 1** (30 хв): Додати success/error UI
   - Замість `alert()` створити div з `role="alert"`
   - Додати CSS анімацію (slideIn)
   - Auto-hide через 5 сек

2. **Шаг 2** (20 хв): Валідація на фронтенді
   - Email: перевірити формат (regexp або HTML5)
   - Phone: якщо заповнено - валідувати (простий regexp)
   - Всі required поля мають `required` атрибут

3. **Шаг 3** (15 хв): Мобільна адаптивність
   ```css
   @media (max-width: 768px) {
       .contact-form { padding: 25px; }
       .submit-btn { min-height: 44px; font-size: 16px; }
       .form-group input, textarea { font-size: 16px; }
   }
   ```

4. **Шаг 4** (15 хв): Autocomplete
   - `autocomplete="name"` на ім'я
   - `autocomplete="email"` на email
   - `autocomplete="tel"` на телефон

5. **Шаг 5** (15 хв): Тестування
   - Desktop: форма submit → success?
   - Mobile (375px): кнопка тапається?
   - NVDA: error читається?

### Дата завершення
**Готово до**: 29.10.2025 20:00

### Файли
```
pages/contact.html      (line 188-217)
contact.html            (line 136-165)
js/script.js            (додати handleFormSubmit, валідацію)
css/styles.css          (додати @media для мобіля, анімації)
```

---

## **ПРОМПТ C: Модалки та доступність Escape (Priority P2)**

### Завдання
Удосконалити модальне вікно: Escape закриття, фокус ловушка, фокус повернення, ARIA атрибути.

### Критерії готовності
✅ Escape закриває модалку
✅ Фокус залишається в межах модалки (Tab циклюється)
✅ Після закриття фокус повертається на кнопку що його відкрила
✅ role="dialog" + aria-modal="true" + aria-labelledby
✅ Like button у модалці доступне для екрана читача

### План реалізації
1. **Шаг 1** (25 хв): Escape обробник
   ```javascript
   document.addEventListener('keydown', function(event) {
       if (event.key === 'Escape' && 
           document.getElementById('modal').style.display === 'block') {
           closeModal();
       }
   });
   ```

2. **Шаг 2** (20 хв): Фокус management
   ```javascript
   let lastFocusedElement;
   
   function openModal(propId) {
       lastFocusedElement = document.activeElement;
       // ... render modal ...
       document.getElementById('modal').focus();
   }
   
   function closeModal() {
       document.getElementById('modal').style.display = 'none';
       if (lastFocusedElement) lastFocusedElement.focus();
   }
   ```

3. **Шаг 3** (20 хв): Фокус ловушка (Tab циклюється)
   ```javascript
   const modal = document.getElementById('modal');
   const focusableElements = modal.querySelectorAll(
       'a, button, [tabindex]:not([tabindex="-1"])'
   );
   
   modal.addEventListener('keydown', function(e) {
       if (e.key === 'Tab') {
           const firstElement = focusableElements[0];
           const lastElement = focusableElements[focusableElements.length - 1];
           
           if (e.shiftKey && document.activeElement === firstElement) {
               lastElement.focus();
               e.preventDefault();
           } else if (!e.shiftKey && document.activeElement === lastElement) {
               firstElement.focus();
               e.preventDefault();
           }
       }
   });
   ```

4. **Шаг 4** (15 хв): ARIA + HTML
   - modal: `role="dialog" aria-modal="true" aria-labelledby="modal-title"`
   - X button: `aria-label="Закрити модальне вікно"`
   - Like button: `aria-label="♥ Видалити з улюблених"` або `aria-label="♡ Додати в улюблені"`

5. **Шаг 5** (20 хв): Тестування
   - Клавіатура: Tab циклюється в межах модалки?
   - Escape закриває?
   - Фокус повертається?
   - NVDA: читає "модальне вікно, діалог"?

### Дата завершення
**Готово до**: 29.10.2025 22:00

### Файли
```
js/script.js            (line 1619-1733)
index.html              (line 339-344)
css/styles.css          (додати :focus-visible стилі)
```

---

## 📊 МАТРИЦЯ ТЕСТУВАННЯ

| Функція | Desktop | Mobile | Keyboard | Screen Reader | Escape | Status |
|---------|---------|--------|----------|---------------|--------|--------|
| Логотип | ✅ | ⚠️ | ❌ | ⚠️ | N/A | 🔴 P1 |
| Contact Form | ✅ | ❌ | ✅ | ⚠️ | N/A | 🔴 P1 |
| Modal Open | ✅ | ✅ | ✅ | ⚠️ | N/A | ✅ P2 |
| Modal Close | ✅ | ✅ | ⚠️ | ✅ | ❌ | 🔴 P2 |
| Modal Focus | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ | 🔴 P2 |
| Like Button | ✅ | ✅ | ✅ | ⚠️ | N/A | ✅ P3 |
| Listing Back | ✅ | ✅ | ✅ | ✅ | N/A | ✅ P3 |

---

## 📝 РЕЗЮМЕ

### Знайдено проблем: 10
- **P1 (Critical)**: 3 (логотип, форма, мобіль)
- **P2 (High)**: 4 (модалка, Escape, фокус)
- **P3 (Low)**: 3 (labels, autocomplete, Telegram link)

### Кількість файлів до зміни: 6
- index.html
- pages/listing.html
- pages/landing.html
- pages/contact.html
- contact.html
- js/script.js
- css/styles.css (додати)

### Бюджет часу: 8 годин
- **Dev A** (Логотипи): 1 год
- **Dev B** (Форма): 1.5 год
- **Dev C** (Модалки): 1.5 год
- **QA**: 2 год
- **Reserve**: 2 год

### Дата готовності: **30.10.2025**
