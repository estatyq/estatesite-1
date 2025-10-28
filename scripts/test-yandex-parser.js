/**
 * Test Yandex XML Parser
 * Проверить корректность работы парсера на примерах XML структур
 * 
 * Run: node scripts/test-yandex-parser.js
 */

const { XMLParser } = require('fast-xml-parser');

// Копируем вспомогательные функции из parse-yandex-feed.js
function toNumber(val) {
  if (val == null) return null;
  if (typeof val === 'number') return val;
  const n = parseFloat(String(val).replace(/[^0-9.\-]/g, ''));
  return Number.isFinite(n) ? n : null;
}

function typeMap(rawCategory, rawPropType) {
  const s = [rawCategory, rawPropType].filter(Boolean).map(x => String(x).toLowerCase()).join(' ');
  if (/квартир|apartment/.test(s)) return 'apartment';
  if (/дом|house|коттедж/.test(s)) return 'house';
  if (/офис|office/.test(s)) return 'office';
  if (/коммер|free purpose|магазин|торгов/.test(s)) return 'commercial';
  if (/земл|участок|land/.test(s)) return 'land';
  if (/склад|warehouse|производ/.test(s)) return 'warehouse';
  return null;
}

function dealMap(rawType, maybeTextBlob) {
  const s = [rawType, maybeTextBlob].filter(Boolean).map(x => String(x).toLowerCase()).join(' ');
  if (/продажа|sale/.test(s)) return 'sale';
  if (/аренда|rent/.test(s)) return 'rent';
  if (/подобов|посуточ|daily/.test(s)) return 'daily';
  return null;
}

function getArray(x) { return Array.isArray(x) ? x : (x ? [x] : []); }

function parseOffers(xmlText) {
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
  const parsed = parser.parse(xmlText);
  let offers = parsed?.['realty-feed']?.offer || parsed?.offer;
  if (!offers) {
    const queue = [parsed];
    while (queue.length) {
      const cur = queue.shift();
      if (Array.isArray(cur) && cur.length && typeof cur[0] === 'object') { offers = cur; break; }
      if (cur && typeof cur === 'object') for (const k of Object.keys(cur)) queue.push(cur[k]);
    }
  }
  return Array.isArray(offers) ? offers : [offers];
}

function normalizeOffer(off) {
  const internalId = off?.['internal-id'] != null ? String(off['internal-id']) : null;
  const url = off?.url || null;
  const category = off?.category || null;
  const propType = off?.['property-type'] || null;
  const rawType = off?.type || null;
  const textBlob = [category, propType, rawType, off?.name].filter(Boolean).join(' ');
  const t = typeMap(category, propType);
  const deal = dealMap(rawType, textBlob);

  return {
    id: internalId,
    url: url,
    category: category,
    propertyType: propType,
    type: t,
    rawType: rawType,
    transactionType: deal,
    parsed: { category, propType, rawType, typeResult: t, dealResult: deal }
  };
}

// === TEST CASES ===

const testCases = [
  {
    name: 'Тест 1: Аренда квартиры (мінімальні дані)',
    xml: `<?xml version="1.0"?>
<realty-feed>
  <offer internal-id="111861165">
    <type>аренда</type>
    <property-type>жилая</property-type>
    <category>квартира</category>
  </offer>
</realty-feed>`
  },
  {
    name: 'Тест 2: Продажа квартиры (з URL и датами)',
    xml: `<?xml version="1.0"?>
<realty-feed>
  <offer internal-id="213054095">
    <type>продажа</type>
    <property-type>жилая</property-type>
    <category>квартира</category>
    <url>http://estatyq.ligapro.ua/kvartiry_prodaga/ann-3054095-0.html</url>
    <creation-date>2025-01-14T00:00:00+02:00</creation-date>
    <last-update-date>2025-01-14T10:18:36+02:00</last-update-date>
  </offer>
</realty-feed>`
  },
  {
    name: 'Тест 3: Подобово оренда будинку',
    xml: `<?xml version="1.0"?>
<realty-feed>
  <offer internal-id="312054096">
    <type>подобово</type>
    <property-type>жилая</property-type>
    <category>дом</category>
    <url>http://estatyq.ligapro.ua/domy_podobobovo/ann-2054096-0.html</url>
  </offer>
</realty-feed>`
  },
  {
    name: 'Тест 4: Коммерційна нерухомість',
    xml: `<?xml version="1.0"?>
<realty-feed>
  <offer internal-id="412054097">
    <type>продажа</type>
    <property-type>коммерческая</property-type>
    <category>офис</category>
    <url>http://estatyq.ligapro.ua/komm/ann-2054097-0.html</url>
  </offer>
</realty-feed>`
  }
];

// === MAIN TEST ===

console.log('🧪 ТЕСТУВАННЯ ЯНДЕКС ПАРСЕРА\n');
console.log('='.repeat(80));

let passed = 0;
let failed = 0;

for (const testCase of testCases) {
  console.log(`\n✅ ${testCase.name}`);
  console.log('-'.repeat(80));

  try {
    const offers = parseOffers(testCase.xml);
    console.log(`📦 Знайдено пропозицій: ${offers.length}`);

    for (const offer of offers) {
      const normalized = normalizeOffer(offer);
      
      console.log(`\n  ID: ${normalized.id}`);
      console.log(`  URL: ${normalized.url || '(не вказано)'}`);
      console.log(`  Категорія: ${normalized.category}`);
      console.log(`  Тип нерухомості: ${normalized.propertyType}`);
      console.log(`  Raw type: ${normalized.rawType}`);
      
      console.log(`\n  🔍 РЕЗУЛЬТАТИ ПАРСИНГУ:`);
      console.log(`     typeMap("${normalized.category}", "${normalized.propertyType}") → "${normalized.type}"`);
      console.log(`     dealMap("${normalized.rawType}", ...) → "${normalized.transactionType}"`);

      // Перевірка коректності
      let testPassed = true;
      
      if (normalized.type === null && normalized.category !== null) {
        console.log(`     ⚠️  ПОМИЛКА: type=null, можливо невідома категорія`);
        testPassed = false;
      }
      
      if (normalized.transactionType === null && normalized.rawType !== null) {
        console.log(`     ⚠️  ПОМИЛКА: transactionType=null, невідомий тип угоди`);
        testPassed = false;
      }

      if (testPassed) {
        console.log(`     ✅ УСПІШНО: Парсинг пройшов без помилок`);
        passed++;
      } else {
        failed++;
      }
    }
  } catch (err) {
    console.log(`❌ ПОМИЛКА при парсингу: ${err.message}`);
    failed++;
  }
}

console.log(`\n${'='.repeat(80)}`);
console.log(`\n📊 РЕЗУЛЬТАТИ ТЕСТУВАННЯ:`);
console.log(`   ✅ Успішних: ${passed}`);
console.log(`   ❌ Невдалих: ${failed}`);
console.log(`   📈 Всього: ${passed + failed}`);

if (failed === 0) {
  console.log(`\n🎉 ВСІ ТЕСТИ ПРОЙДЕНІ!`);
  process.exit(0);
} else {
  console.log(`\n⚠️  ДЕЯКІ ТЕСТИ ПРОВАЛИЛИСЯ`);
  process.exit(1);
}
