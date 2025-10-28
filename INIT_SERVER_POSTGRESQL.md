# 🗄️ Initialize PostgreSQL on Remote Server

**Server:** 103.246.144.145  
**User:** statesite  
**Password:** admin777  

---

## ⚠️ ВАЖНО: База данных ещё не создана!

Ошибка: `database "estatyq_db" does not exist`

Вам нужно выполнить эти команды **на сервере 103.246.144.145** в PostgreSQL CLI:

---

## 📝 Команды для выполнения на сервере

### Вариант 1: Пошагово в psql

Подключитесь к PostgreSQL:

```bash
psql -h 103.246.144.145 -U postgres
```

Затем выполните по одной:

```sql
-- 1. Создать базу данных
CREATE DATABASE estatyq_db;

-- 2. Подключиться к базе
\c estatyq_db

-- 3. Создать таблицу listings
CREATE TABLE IF NOT EXISTS listings (
  id VARCHAR(50) PRIMARY KEY,
  type VARCHAR(50),
  transaction_type VARCHAR(20),
  price_value NUMERIC,
  price_currency VARCHAR(10),
  area_total NUMERIC,
  area_living NUMERIC,
  area_plot NUMERIC,
  rooms INT,
  floor_current INT,
  floor_total INT,
  year_built INT,
  location_country VARCHAR(100),
  location_region VARCHAR(100),
  location_city VARCHAR(100),
  location_city_key VARCHAR(50),
  location_district VARCHAR(100),
  location_microdistrict VARCHAR(100),
  location_address VARCHAR(255),
  geo_lat NUMERIC,
  geo_lng NUMERIC,
  amenities_balcony BOOLEAN,
  amenities_parking BOOLEAN,
  amenities_metro VARCHAR(100),
  amenities_features TEXT[],
  images TEXT[],
  contact_phone VARCHAR(20),
  contact_email VARCHAR(100),
  contact_name VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

-- 4. Создать индексы
CREATE INDEX idx_listings_city ON listings(location_city_key);
CREATE INDEX idx_listings_type ON listings(type);
CREATE INDEX idx_listings_transaction ON listings(transaction_type);
CREATE INDEX idx_listings_price ON listings(price_value);
CREATE INDEX idx_listings_active ON listings(is_active);

-- 5. Дать права пользователю estatesite
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO estatesite;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO estatesite;

-- 6. Проверить таблицу создана
\dt

-- 7. Выход
\q
```

---

## ✅ Когда готово на сервере, выполните:

На вашей машине (локально):

```bash
cd "C:\Users\User\Desktop\estatyQ site"

# Загрузить данные из XML
npm run db:seed

# Запустить сервер
npm start
```

---

## 🆘 Если при подключении ошибка

### Забыли пароль postgres?

На сервере (если есть доступ как root):

```bash
sudo -u postgres psql

# Измените пароль postgres
\password postgres

# Введите новый пароль дважды
```

### Нет доступа к серверу?

Вам нужно попросить администратора сервера выполнить SQL команды выше.

---

## 📋 Краткий чеклист

На сервере 103.246.144.145:
- [ ] Подключиться: `psql -h 103.246.144.145 -U postgres`
- [ ] Создать БД: `CREATE DATABASE estatyq_db;`
- [ ] Создать таблицу: `CREATE TABLE ...`
- [ ] Создать индексы: `CREATE INDEX ...`
- [ ] Дать права: `GRANT ALL PRIVILEGES ...`
- [ ] Проверить: `\dt` (должна показать `listings`)

После этого:
- [ ] Выполнить: `npm run db:seed`
- [ ] Запустить: `npm start`

---

**Статус:** Ожидаем создания БД на сервере

Дайте мне знать когда готово! 👍
