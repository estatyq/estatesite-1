# 📄 XML Интеграция для EstatyQ Каталога

## 🎯 Обзор

Данный документ описывает структуру XML файла для интеграции с каталогом недвижимости EstatyQ. XML файл будет содержать все данные о недвижимости, включая фотографии, характеристики и контактную информацию.

## 📋 Структура XML

### Основная структура

```xml
<?xml version="1.0" encoding="UTF-8"?>
<estatyq_catalog version="1.0" last_updated="2025-01-20T10:30:00Z">
    <cities>
        <city id="kyiv" name="Київ" region="Київська область">
            <districts>
                <district id="pechersk" name="Печерськ">
                    <microdistricts>
                        <microdistrict id="khreshchatyk" name="Вул. Хрещатик"/>
                        <microdistrict id="lipky" name="Вул. Липки"/>
                    </microdistricts>
                </district>
                <!-- Другие районы -->
            </districts>
            <metro>
                <line id="red" name="Червона лінія" color="#FF0000">
                    <station id="akademmistechko" name="Академмістечко"/>
                    <station id="zhytomyrska" name="Житомирська"/>
                    <!-- Другие станции -->
                </line>
                <!-- Другие линии -->
            </metro>
        </city>
        <!-- Другие города -->
    </cities>
    
    <properties>
        <property id="1" type="apartment" transaction="sale" city="kyiv" district="pechersk">
            <title>Сучасна квартира в центрі</title>
            <description>Розкішна квартира з панорамними вікнами в історичному центрі міста</description>
            <price currency="USD">85000</price>
            <area total="85" living="65" kitchen="12"/>
            <rooms>3</rooms>
            <floor current="5" total="9"/>
            <year>2020</year>
            <features>
                <feature>Балкон</feature>
                <feature>Паркінг</feature>
                <feature>Ліфт</feature>
                <feature>Кондиціонер</feature>
            </features>
            <images>
                <image id="1" url="https://example.com/images/property1_1.jpg" alt="Гостина" primary="true"/>
                <image id="2" url="https://example.com/images/property1_2.jpg" alt="Кухня"/>
                <image id="3" url="https://example.com/images/property1_3.jpg" alt="Спальня"/>
            </images>
            <contact>
                <agent name="Олександр Петренко" phone="+380441234567" email="agent@estatyq.ua"/>
                <telegram bot="estatyq_kyiv" chat_id="123456789"/>
            </contact>
            <location>
                <address>вул. Хрещатик, 22</address>
                <coordinates lat="50.4501" lng="30.5234"/>
                <metro station="Хрещатик" line="red" distance="200"/>
            </location>
            <status>active</status>
            <created>2025-01-15T14:30:00Z</created>
            <updated>2025-01-20T09:15:00Z</updated>
        </property>
        <!-- Другие объекты -->
    </properties>
</estatyq_catalog>
```

## 🏗 Детальная схема

### Элемент `<estatyq_catalog>`

**Атрибуты:**
- `version` - версия схемы XML
- `last_updated` - дата последнего обновления

### Элемент `<city>`

**Атрибуты:**
- `id` - уникальный идентификатор города
- `name` - название города
- `region` - область

**Дочерние элементы:**
- `<districts>` - список районов
- `<metro>` - информация о метро

### Элемент `<district>`

**Атрибуты:**
- `id` - уникальный идентификатор района
- `name` - название района

**Дочерние элементы:**
- `<microdistricts>` - список микрорайонов

### Элемент `<property>`

**Атрибуты:**
- `id` - уникальный идентификатор объекта
- `type` - тип недвижимости (apartment, house, commercial, office, land, warehouse)
- `transaction` - тип сделки (sale, rent, daily)
- `city` - ID города
- `district` - ID района

**Дочерние элементы:**
- `<title>` - заголовок объекта
- `<description>` - описание
- `<price>` - цена с валютой
- `<area>` - площади (общая, жилая, кухня)
- `<rooms>` - количество комнат
- `<floor>` - этаж (текущий и общий)
- `<year>` - год постройки
- `<features>` - особенности
- `<images>` - фотографии
- `<contact>` - контактная информация
- `<location>` - местоположение
- `<status>` - статус (active, sold, rented, inactive)
- `<created>` - дата создания
- `<updated>` - дата обновления

## 📸 Структура изображений

```xml
<images>
    <image id="1" url="https://example.com/images/property1_1.jpg" 
           alt="Гостина" primary="true" order="1"/>
    <image id="2" url="https://example.com/images/property1_2.jpg" 
           alt="Кухня" order="2"/>
    <image id="3" url="https://example.com/images/property1_3.jpg" 
           alt="Спальня" order="3"/>
</images>
```

**Атрибуты изображения:**
- `id` - уникальный ID изображения
- `url` - URL изображения
- `alt` - альтернативный текст
- `primary` - основное изображение (true/false)
- `order` - порядок отображения

## 🗺 Информация о местоположении

```xml
<location>
    <address>вул. Хрещатик, 22</address>
    <coordinates lat="50.4501" lng="30.5234"/>
    <metro station="Хрещатик" line="red" distance="200"/>
    <district_microdistrict>Печерськ, Вул. Хрещатик</district_microdistrict>
</location>
```

## 📞 Контактная информация

```xml
<contact>
    <agent name="Олександр Петренко" 
           phone="+380441234567" 
           email="agent@estatyq.ua"
           photo="https://example.com/agents/agent1.jpg"/>
    <telegram bot="estatyq_kyiv" chat_id="123456789"/>
    <whatsapp phone="+380441234567"/>
    <viber phone="+380441234567"/>
</contact>
```

## 🏷 Типы недвижимости

### Квартиры (apartment)
```xml
<property type="apartment">
    <area total="85" living="65" kitchen="12" balcony="5"/>
    <rooms>3</rooms>
    <floor current="5" total="9"/>
    <features>
        <feature>Балкон</feature>
        <feature>Лоджія</feature>
        <feature>Паркінг</feature>
        <feature>Ліфт</feature>
    </features>
</property>
```

### Дома (house)
```xml
<property type="house">
    <area total="150" living="120" kitchen="20"/>
    <rooms>4</rooms>
    <floor current="2" total="2"/>
    <plot_area unit="соток">8</plot_area>
    <features>
        <feature>Гараж</feature>
        <feature>Сад</feature>
        <feature>Камін</feature>
        <feature>Тераса</feature>
    </features>
</property>
```

### Комерція (commercial)
```xml
<property type="commercial">
    <area total="120"/>
    <floor current="1" total="3"/>
    <commercial_type>Магазин</commercial_type>
    <features>
        <feature>Вітрина</feature>
        <feature>Склад</feature>
        <feature>Паркінг</feature>
    </features>
</property>
```

## 💰 Ценообразование

```xml
<price currency="USD" original="85000" current="80000">
    <per_sqm>941</per_sqm>
    <negotiable>true</negotiable>
    <discount type="percentage">6</discount>
</price>
```

## 🔄 Статусы объектов

- `active` - активный, доступен для просмотра
- `sold` - продан
- `rented` - сдан в аренду
- `inactive` - неактивный, скрыт
- `reserved` - зарезервирован
- `pending` - ожидает подтверждения

## 📊 Пример полного XML файла

```xml
<?xml version="1.0" encoding="UTF-8"?>
<estatyq_catalog version="1.0" last_updated="2025-01-20T10:30:00Z">
    <cities>
        <city id="kyiv" name="Київ" region="Київська область">
            <districts>
                <district id="pechersk" name="Печерськ">
                    <microdistricts>
                        <microdistrict id="khreshchatyk" name="Вул. Хрещатик"/>
                        <microdistrict id="lipky" name="Вул. Липки"/>
                    </microdistricts>
                </district>
                <district id="obolon" name="Оболонь">
                    <microdistricts>
                        <microdistrict id="pivnichna" name="Північна Оболонь"/>
                        <microdistrict id="pivdenna" name="Південна Оболонь"/>
                    </microdistricts>
                </district>
            </districts>
            <metro>
                <line id="red" name="Червона лінія" color="#FF0000">
                    <station id="akademmistechko" name="Академмістечко"/>
                    <station id="zhytomyrska" name="Житомирська"/>
                    <station id="svyatoshyn" name="Святошин"/>
                    <station id="khreshchatyk" name="Хрещатик"/>
                </line>
                <line id="blue" name="Синя лінія" color="#0000FF">
                    <station id="heroiv_dnipra" name="Героїв Дніпра"/>
                    <station id="minska" name="Мінська"/>
                    <station id="obolon" name="Оболонь"/>
                </line>
            </metro>
        </city>
    </cities>
    
    <properties>
        <property id="1" type="apartment" transaction="sale" city="kyiv" district="pechersk">
            <title>Розкішна квартира в центрі Києва</title>
            <description>Сучасна квартира з панорамними вікнами в історичному центрі міста. Європеський ремонт, всі зручності.</description>
            <price currency="USD">85000</price>
            <area total="85" living="65" kitchen="12" balcony="5"/>
            <rooms>3</rooms>
            <floor current="5" total="9"/>
            <year>2020</year>
            <features>
                <feature>Балкон</feature>
                <feature>Паркінг</feature>
                <feature>Ліфт</feature>
                <feature>Кондиціонер</feature>
                <feature>Інтернет</feature>
            </features>
            <images>
                <image id="1" url="https://example.com/images/property1_1.jpg" alt="Гостина" primary="true" order="1"/>
                <image id="2" url="https://example.com/images/property1_2.jpg" alt="Кухня" order="2"/>
                <image id="3" url="https://example.com/images/property1_3.jpg" alt="Спальня" order="3"/>
                <image id="4" url="https://example.com/images/property1_4.jpg" alt="Балкон" order="4"/>
            </images>
            <contact>
                <agent name="Олександр Петренко" phone="+380441234567" email="agent@estatyq.ua"/>
                <telegram bot="estatyq_kyiv" chat_id="123456789"/>
            </contact>
            <location>
                <address>вул. Хрещатик, 22</address>
                <coordinates lat="50.4501" lng="30.5234"/>
                <metro station="Хрещатик" line="red" distance="200"/>
                <district_microdistrict>Печерськ, Вул. Хрещатик</district_microdistrict>
            </location>
            <status>active</status>
            <created>2025-01-15T14:30:00Z</created>
            <updated>2025-01-20T09:15:00Z</updated>
        </property>
    </properties>
</estatyq_catalog>
```

## 🔧 JavaScript для загрузки XML

```javascript
// Функция для загрузки и парсинга XML
async function loadPropertiesFromXML(xmlUrl) {
    try {
        const response = await fetch(xmlUrl);
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        // Парсим города
        const cities = parseCities(xmlDoc);
        
        // Парсим объекты недвижимости
        const properties = parseProperties(xmlDoc);
        
        return { cities, properties };
    } catch (error) {
        console.error('Ошибка загрузки XML:', error);
        return { cities: {}, properties: [] };
    }
}

// Парсинг городов
function parseCities(xmlDoc) {
    const cities = {};
    const cityElements = xmlDoc.querySelectorAll('city');
    
    cityElements.forEach(cityEl => {
        const cityId = cityEl.getAttribute('id');
        const cityName = cityEl.getAttribute('name');
        const region = cityEl.getAttribute('region');
        
        cities[cityId] = {
            name: cityName,
            region: region,
            districts: {},
            metro: { lines: {} }
        };
        
        // Парсим районы
        const districtElements = cityEl.querySelectorAll('district');
        districtElements.forEach(districtEl => {
            const districtId = districtEl.getAttribute('id');
            const districtName = districtEl.getAttribute('name');
            
            cities[cityId].districts[districtId] = {
                name: districtName,
                microdistricts: []
            };
            
            // Парсим микрорайоны
            const microdistrictElements = districtEl.querySelectorAll('microdistrict');
            microdistrictElements.forEach(microEl => {
                cities[cityId].districts[districtId].microdistricts.push({
                    id: microEl.getAttribute('id'),
                    name: microEl.getAttribute('name')
                });
            });
        });
        
        // Парсим метро
        const metroElement = cityEl.querySelector('metro');
        if (metroElement) {
            const lineElements = metroElement.querySelectorAll('line');
            lineElements.forEach(lineEl => {
                const lineId = lineEl.getAttribute('id');
                const lineName = lineEl.getAttribute('name');
                const lineColor = lineEl.getAttribute('color');
                
                cities[cityId].metro.lines[lineName] = {
                    id: lineId,
                    color: lineColor,
                    stations: []
                };
                
                const stationElements = lineEl.querySelectorAll('station');
                stationElements.forEach(stationEl => {
                    cities[cityId].metro.lines[lineName].stations.push({
                        id: stationEl.getAttribute('id'),
                        name: stationEl.getAttribute('name')
                    });
                });
            });
        }
    });
    
    return cities;
}

// Парсинг объектов недвижимости
function parseProperties(xmlDoc) {
    const properties = [];
    const propertyElements = xmlDoc.querySelectorAll('property');
    
    propertyElements.forEach(propEl => {
        const property = {
            id: parseInt(propEl.getAttribute('id')),
            type: propEl.getAttribute('type'),
            transactionType: propEl.getAttribute('transaction'),
            city: propEl.getAttribute('city'),
            district: propEl.getAttribute('district'),
            title: propEl.querySelector('title')?.textContent || '',
            description: propEl.querySelector('description')?.textContent || '',
            price: parseFloat(propEl.querySelector('price')?.textContent || '0'),
            currency: propEl.querySelector('price')?.getAttribute('currency') || 'USD',
            area: {
                total: parseFloat(propEl.querySelector('area')?.getAttribute('total') || '0'),
                living: parseFloat(propEl.querySelector('area')?.getAttribute('living') || '0'),
                kitchen: parseFloat(propEl.querySelector('area')?.getAttribute('kitchen') || '0'),
                balcony: parseFloat(propEl.querySelector('area')?.getAttribute('balcony') || '0')
            },
            rooms: parseInt(propEl.querySelector('rooms')?.textContent || '0'),
            floor: {
                current: parseInt(propEl.querySelector('floor')?.getAttribute('current') || '0'),
                total: parseInt(propEl.querySelector('floor')?.getAttribute('total') || '0')
            },
            year: parseInt(propEl.querySelector('year')?.textContent || '0'),
            features: [],
            images: [],
            contact: {},
            location: {},
            status: propEl.querySelector('status')?.textContent || 'active',
            created: propEl.querySelector('created')?.textContent || '',
            updated: propEl.querySelector('updated')?.textContent || ''
        };
        
        // Парсим особенности
        const featureElements = propEl.querySelectorAll('feature');
        featureElements.forEach(featureEl => {
            property.features.push(featureEl.textContent);
        });
        
        // Парсим изображения
        const imageElements = propEl.querySelectorAll('image');
        imageElements.forEach(imgEl => {
            property.images.push({
                id: imgEl.getAttribute('id'),
                url: imgEl.getAttribute('url'),
                alt: imgEl.getAttribute('alt'),
                primary: imgEl.getAttribute('primary') === 'true',
                order: parseInt(imgEl.getAttribute('order') || '0')
            });
        });
        
        // Парсим контакты
        const contactEl = propEl.querySelector('contact');
        if (contactEl) {
            const agentEl = contactEl.querySelector('agent');
            if (agentEl) {
                property.contact.agent = {
                    name: agentEl.getAttribute('name'),
                    phone: agentEl.getAttribute('phone'),
                    email: agentEl.getAttribute('email'),
                    photo: agentEl.getAttribute('photo')
                };
            }
            
            const telegramEl = contactEl.querySelector('telegram');
            if (telegramEl) {
                property.contact.telegram = {
                    bot: telegramEl.getAttribute('bot'),
                    chatId: telegramEl.getAttribute('chat_id')
                };
            }
        }
        
        // Парсим местоположение
        const locationEl = propEl.querySelector('location');
        if (locationEl) {
            property.location = {
                address: locationEl.querySelector('address')?.textContent || '',
                coordinates: {
                    lat: parseFloat(locationEl.querySelector('coordinates')?.getAttribute('lat') || '0'),
                    lng: parseFloat(locationEl.querySelector('coordinates')?.getAttribute('lng') || '0')
                },
                metro: {
                    station: locationEl.querySelector('metro')?.getAttribute('station') || '',
                    line: locationEl.querySelector('metro')?.getAttribute('line') || '',
                    distance: parseInt(locationEl.querySelector('metro')?.getAttribute('distance') || '0')
                },
                districtMicrodistrict: locationEl.querySelector('district_microdistrict')?.textContent || ''
            };
        }
        
        properties.push(property);
    });
    
    return properties;
}

// Инициализация с XML данными
async function initializeWithXML() {
    const { cities, properties } = await loadPropertiesFromXML('data/properties.xml');
    
    // Обновляем глобальные данные
    window.citiesData = cities;
    window.allProperties = properties;
    window.filteredProperties = [...properties];
    
    // Перерендериваем интерфейс
    renderProperties();
    updateResultsCount();
    updateDistrictChips();
    updateMetroFilters();
}
```

## 📝 Рекомендации по использованию

1. **Размер файла**: Рекомендуется разбивать большие XML файлы на части по городам
2. **Обновление**: Используйте поле `last_updated` для кэширования
3. **Валидация**: Проверяйте XML на соответствие схеме перед загрузкой
4. **Сжатие**: Используйте gzip сжатие для уменьшения размера
5. **CDN**: Размещайте изображения на CDN для быстрой загрузки

## 🔄 Процесс интеграции

1. Создайте XML файл по предложенной схеме
2. Разместите файл на сервере
3. Обновите JavaScript код для загрузки XML
4. Протестируйте загрузку и отображение данных
5. Настройте автоматическое обновление данных

---

**Готово к интеграции! 🚀**