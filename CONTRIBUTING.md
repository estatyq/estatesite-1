# 🤝 Вносим вклад в EstatyQ

Спасибо за интерес к проекту! Мы рады вашим предложениям по улучшению.

## 📋 Кодекс поведения

Мы придерживаемся принципов уважения и инклюзивности. Пожалуйста, будьте вежливы и конструктивны.

## 🚀 Как начать

### 1. Fork репозитория
```bash
git clone https://github.com/your-username/estatyq.git
cd estatyq
```

### 2. Создайте ветку для вашей функции
```bash
git checkout -b feature/your-feature-name
```

### 3. Внесите изменения
- Отредактируйте файлы
- Протестируйте изменения локально

### 4. Коммитьте ваши изменения
```bash
git add .
git commit -m "Add: description of your changes"
```

### 5. Отправьте Pull Request
- Опишите, что вы изменили и почему
- Ссылайтесь на связанные issues

## 📝 Рекомендации по коду

### HTML
```html
<!-- Используйте семантическую разметку -->
<section class="catalog">
  <h2>Заголовок</h2>
  <p>Описание</p>
</section>

<!-- Хорошие имена классов -->
<div class="property-card">
  <div class="property-image"></div>
  <div class="property-content"></div>
</div>
```

### CSS
```css
/* Используйте BEM методологию */
.component { }
.component__element { }
.component__element--modifier { }

/* Группируйте связанные правила */
.button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
}

.button:hover {
  background-color: #f0f0f0;
}
```

### JavaScript
```javascript
// Используйте понятные имена переменных
const filterProperties = () => {
  // код
};

// Комментируйте сложную логику
// Фильтруем объекты по цене и типу
const filtered = properties.filter(prop => 
  prop.price <= maxPrice && prop.type === selectedType
);

// Используйте const для неизменяемых значений
const MAX_PRICE = 500;
```

## 🔍 Процесс review

1. **CI Checks** - Проверяются синтаксис и лучшие практики
2. **Code Review** - Разработчики проверяют ваш код
3. **Testing** - Ваши изменения тестируются
4. **Merge** - После одобрения pull request объединяется

## 🐛 Сообщение об ошибках

### Создайте Issue с информацией:
```
Описание проблемы:
(ясное и кроткое описание)

Шаги для воспроизведения:
1. 
2. 
3. 

Ожидаемое поведение:
(что должно было произойти)

Фактическое поведение:
(что произошло на самом деле)

Окружение:
- ОС: 
- Браузер: 
- Версия: 
```

## ✨ Типы вкладов

### 🎨 Дизайн и UX
- Улучшение внешнего вида
- Оптимизация производительности
- Адаптивный дизайн

### 🐛 Баг-фиксы
- Исправление ошибок
- Совместимость браузеров
- Оптимизация

### 📚 Документация
- README и Guides
- Комментарии в коде
- Примеры

### ✨ Новые функции
- Калькулятор ипотеки
- Карта с объектами
- Чат с агентом
- Фильтры поиска

## 📖 Стиль коммитов

```
Format: Type: Subject

Type:
  Add     - Новая функция
  Fix     - Исправление ошибки
  Update  - Обновление кода
  Docs    - Документация
  Style   - Стилизация
  Refactor - Рефакторинг

Subject:
  - Используйте повелительное наклонение ("Add" не "Added")
  - Не заканчивайте точкой
  - Максимум 50 символов

Примеры:
  Add: property filter by price
  Fix: modal close button not working
  Update: homepage hero section styling
  Docs: add deployment guide
```

## 🔄 Workflow

```
1. Fork & Clone
   ↓
2. Create Branch (feature/...)
   ↓
3. Make Changes
   ↓
4. Test Locally
   ↓
5. Commit & Push
   ↓
6. Create Pull Request
   ↓
7. Review & Discuss
   ↓
8. Merge to Main
```

## ✅ Чек-лист перед отправкой

- [ ] Код протестирован локально
- [ ] Нет конфликтов слияния
- [ ] Описание PR ясное и полное
- [ ] Все commit сообщения хорошо оформлены
- [ ] Документация обновлена (если нужно)
- [ ] Нет копипасты кода
- [ ] Производительность не ухудшена

## 🎓 Полезные ресурсы

- [Git Guide](https://git-scm.com/book)
- [GitHub Pull Requests](https://docs.github.com/en/pull-requests)
- [Web Standards](https://www.w3.org/)
- [CSS Tricks](https://css-tricks.com)
- [MDN Web Docs](https://developer.mozilla.org)

## 🏆 Признание

Все контрибьюторы будут добавлены в:
- Файл CONTRIBUTORS.md
- README.md как благодарность
- GitHub contributors страница

## 📞 Связь

- **Issues** - Для вопросов и ошибок
- **Discussions** - Для идей и предложений
- **Email** - support@estatyq.ua
- **Telegram** - @estatyq_support

## 📜 Лицензия

Ваши вклады лицензируются под MIT License.

---

**Спасибо за помощь в развитии EstatyQ! 🙏**

Мрія стає реальністю! 🏠✨


