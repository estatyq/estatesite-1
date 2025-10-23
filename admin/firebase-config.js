// Firebase конфігурація для EstatyQ
// ⚠️ ЗАМІНІТЬ ЦІ ДАНІ НА СВОЇ З FIREBASE CONSOLE

const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.YOUR_REGION.firebasedatabase.app"
};

// ==================== ІНСТРУКЦІЯ ====================
// 
// 1. Перейдіть на https://console.firebase.google.com/
// 2. Створіть новий проект або виберіть існуючий
// 3. У налаштуваннях проекту знайдіть "Your apps" → "Web app"
// 4. Скопіюйте конфігурацію та замініть дані вище
// 5. Увімкніть такі сервіси:
//    - Authentication → Email/Password
//    - Realtime Database → Create Database
//    - Storage → Get Started
//
// ⚠️ ВАЖЛИВО: Додайте цей файл в .gitignore!
// ⚠️ НЕ публікуйте API ключі в публічних репозиторіях!
//
// ====================================================
