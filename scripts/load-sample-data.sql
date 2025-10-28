-- Load sample real estate data into listings table
-- Run this on server: psql -h 103.246.144.145 -U estatesite -d estatyq_db -f load-sample-data.sql

INSERT INTO listings (id, type, transaction_type, price_value, price_currency, area_total, rooms, floor_current, floor_total, year_built, location_country, location_region, location_city, location_city_key, location_district, location_address, geo_lat, geo_lng, amenities_balcony, amenities_parking, amenities_metro, description) VALUES
('apt-kyiv-001', 'apartment', 'sale', 150000, 'USD', 75.5, 2, 5, 9, 2015, 'Ukraine', 'Київська область', 'Київ', 'kyiv', 'Печерськ', 'вул. Хрещатик, 28, кв. 5', 50.4501, 30.5234, true, true, 'Хрещатик', 'Красива квартира в центрі Києва'),
('apt-kyiv-002', 'apartment', 'rent', 1500, 'USD', 65.0, 2, 3, 5, 2010, 'Ukraine', 'Київська область', 'Київ', 'kyiv', 'Шевченко', 'вул. Лесі Українки, 15', 50.4400, 30.5300, true, false, 'Золоті ворота', 'Оренда двокімнатної квартири'),
('apt-kharkiv-001', 'apartment', 'sale', 120000, 'USD', 55.0, 1, 7, 12, 2018, 'Ukraine', 'Харківська область', 'Харків', 'kharkiv', 'Центр', 'пр. Масла, 50', 50.0038, 36.2304, true, true, 'Площа Свободи', 'Новостройка в престижному районі'),
('apt-odesa-001', 'apartment', 'sale', 95000, 'USD', 50.0, 1, 4, 8, 2005, 'Ukraine', 'Одеська область', 'Одеса', 'odesa', 'Поділ', 'вул. Грибоєдова, 25', 46.4769, 30.7326, false, true, 'Художнього музею', 'Квартира біля морського порту'),
('house-lviv-001', 'house', 'sale', 200000, 'USD', 120.0, 3, 1, 2, 2012, 'Ukraine', 'Львівська область', 'Львів', 'lviv', 'Личаківський', 'вул. Княгині Ольги, 12', 49.8397, 24.0297, true, true, null, 'Приватний будинок з садом'),
('apt-dnipro-001', 'apartment', 'rent', 800, 'USD', 45.0, 1, 2, 5, 2008, 'Ukraine', 'Дніпропетровська область', 'Дніпро', 'dnipro', 'Ленінський', 'пр. Гагаріна, 80', 48.4538, 35.0596, false, false, 'Проспект', 'Недорога оренда з меблями'),
('office-kyiv-001', 'office', 'rent', 5000, 'USD', 200.0, null, 10, 15, 2020, 'Ukraine', 'Київська область', 'Київ', 'kyiv', 'Бізнес-центр', 'пр. Лесі Українки, 26', 50.4450, 30.5350, true, true, null, 'Сучасний офіс з усім обладнанням'),
('land-zaporizhzhia-001', 'land', 'sale', 50000, 'USD', 500.0, null, null, null, null, 'Ukraine', 'Запорізька область', 'Запоріжжя', 'zaporizhzhia', 'Комунарський', 'вул. Південна, località земельна', 47.8388, 35.1396, false, false, null, 'Земельна ділянка для будівництва'),
('commercial-ivano-001', 'commercial', 'rent', 3000, 'USD', 150.0, null, 1, 4, 2015, 'Ukraine', 'Івано-Франківська область', 'Івано-Франківськ', 'ivano_frankivsk', 'Центр', 'вул. Василя Стефаника, 1', 48.9215, 24.7100, false, true, null, 'Комерційний простір для магазину'),
('warehouse-kharkiv-001', 'warehouse', 'rent', 2000, 'USD', 300.0, null, 1, 2, 2010, 'Ukraine', 'Харківська область', 'Харків', 'kharkiv', 'Промзона', 'вул. Індустріальна, 100', 50.0000, 36.2000, false, true, null, 'Сховище для товарів');

-- Verify data loaded
SELECT COUNT(*) as total_listings FROM listings;
SELECT DISTINCT location_city FROM listings;
