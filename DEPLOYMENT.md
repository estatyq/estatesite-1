# 🚀 Руководство по развертыванию EstatyQ

## Локальное развертывание

### Требования
- Python 3.x или Node.js
- Git (опционально)

### Запуск на Python
```bash
cd "C:\Users\User\Desktop\estatyQ site"
python -m http.server 8000
```
Откройте в браузере: `http://localhost:8000`

### Запуск на Node.js
```bash
npm install
npm start
```

---

## Развертывание на Хостинге

### ✅ Vercel (Рекомендуется)
**Самый простой способ - полностью бесплатно**

1. Зайдите на [vercel.com](https://vercel.com)
2. Кликните "New Project"
3. Импортируйте репозиторий GitHub
4. Нажмите "Deploy"
5. Готово! Сайт доступен на `estatyq.vercel.app`

### ✅ Netlify
1. Зайдите на [netlify.com](https://netlify.com)
2. Нажмите "New site from Git"
3. Подключите GitHub
4. Выберите репозиторий
5. Настройки:
   - Build command: (оставьте пусто)
   - Publish directory: `.`
6. Deploy

### ✅ GitHub Pages
1. Создайте репозиторий `username.github.io`
2. Загрузите файлы проекта
3. Сайт будет доступен на `https://username.github.io`

### ✅ Shared Hosting (cPanel)

**Через FTP:**
1. Загрузите все файлы на сервер через FTP
2. Убедитесь что `.htaccess` загружен
3. Проверьте права доступа (755 для папок, 644 для файлов)
4. Готово!

**Файлы для загрузки:**
```
index.html
css/
js/
pages/
assets/
.htaccess
```

### ✅ AWS S3 + CloudFront

```bash
# 1. Создайте S3 бакет
aws s3 mb s3://estatyq-website

# 2. Загрузите файлы
aws s3 sync . s3://estatyq-website --exclude ".git/*"

# 3. Настройте CloudFront
# - Укажите S3 бакет как origin
# - Настройте кэширование
# - Установите SSL сертификат
```

### ✅ DigitalOcean

1. Создайте Droplet (Ubuntu 22.04)
2. SSH подключение
3. Установите Nginx:
```bash
sudo apt update
sudo apt install nginx
```

4. Скопируйте файлы:
```bash
scp -r ./ root@your_ip:/var/www/estatyq/
```

5. Настройте Nginx:
```nginx
server {
    listen 80;
    server_name estatyq.ua www.estatyq.ua;
    root /var/www/estatyq;
    index index.html;
}
```

6. Перезагрузите Nginx:
```bash
sudo systemctl restart nginx
```

### ✅ Docker развертывание

**Dockerfile:**
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
COPY .htaccess /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Запуск:**
```bash
docker build -t estatyq .
docker run -p 80:80 estatyq
```

---

## SSL Сертификат (HTTPS)

### Let's Encrypt (Бесплатно)

**На Linux сервере:**
```bash
# Установка Certbot
sudo apt install certbot python3-certbot-nginx

# Получение сертификата
sudo certbot certonly --nginx -d estatyq.ua -d www.estatyq.ua

# Автоматическое продление
sudo certbot renew --dry-run
```

**На Shared Hosting:**
- Обычно доступно через cPanel > AutoSSL

---

## Производительность и SEO

### 1. Оптимизация изображений
```bash
# Используйте WebP формат
cwebp image.jpg -o image.webp

# Сжимайте PNG
pngquant image.png
```

### 2. Минификация CSS/JS
- Используйте [minifier.org](https://minifier.org)
- Или инструменты вроде Terser/CSSNano

### 3. Кэширование
- `.htaccess` уже содержит правила кэширования
- Установите CDN (CloudFlare, BunnyCDN)

### 4. SEO Meta Tags
```html
<!-- Уже добавлены в index.html -->
<meta name="description" content="...">
<meta name="keywords" content="...">
<meta property="og:title" content="...">
<meta property="og:image" content="...">
```

---

## Мониторинг и Логирование

### Vercel/Netlify
- Встроенная аналитика
- Логи деплоймента
- Оповещения об ошибках

### Google Analytics
Добавьте в `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## Обновление сайта

### Локальные изменения
```bash
# 1. Отредактируйте файлы локально
# 2. Протестируйте на localhost
# 3. Загрузите на сервер (Git push / FTP upload)
```

### Через Git + GitHub
```bash
git add .
git commit -m "Update content"
git push origin main
# Автоматический деплой на Vercel/Netlify/GitHub Pages
```

---

## Проблемы и Решения

### 404 ошибки при переходе между страницами
**Решение:** Используйте `.htaccess` для переписывания URL

### Медленная загрузка
- Включите Gzip (в `.htaccess`)
- Используйте CDN
- Оптимизируйте изображения
- Кэшируйте ресурсы

### CORS ошибки
```nginx
add_header Access-Control-Allow-Origin "*";
```

### SSL не работает
- Убедитесь что сертификат установлен
- Очистите кэш браузера
- Используйте https:// во всех ссылках

---

## Документы для хостинга

**Требуется подготовить:**
- [ ] Домен
- [ ] SSL сертификат
- [ ] Хостинг с поддержкой HTTP/2
- [ ] Резервные копии
- [ ] Email аккаунты

**Контактная информация:**
- Email: support@estatyq.ua
- Phone: +380 (44) 123-45-67

---

**Помощь и поддержка:** 📧 support@estatyq.ua

Мрія стає реальністю! 🏠✨

