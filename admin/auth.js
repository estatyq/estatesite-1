// Initialize Firebase
let auth;
try {
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase initialization error:', error);
    showError('Помилка підключення до Firebase. Перевірте конфігурацію.');
}

// Check if user is already logged in
auth.onAuthStateChanged((user) => {
    const currentPage = window.location.pathname;
    
    if (user) {
        // User is signed in
        if (currentPage.includes('login.html')) {
            window.location.href = 'dashboard.html';
        }
    } else {
        // User is signed out
        if (currentPage.includes('dashboard.html')) {
            window.location.href = 'login.html';
        }
    }
});

// Google Sign-In handler
const googleLoginBtn = document.getElementById('google-login-btn');
if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        googleLoginBtn.disabled = true;
        googleLoginBtn.querySelector('span').textContent = 'Вхід через Google...';
        
        // Set a timeout to re-enable button after 30 seconds if no response
        const timeout = setTimeout(() => {
            googleLoginBtn.disabled = false;
            googleLoginBtn.querySelector('span').textContent = 'Увійти через Google';
            showError('Timeout: Помилка входу через Google. Спробуйте ще раз.');
        }, 30000);
        
        try {
            const result = await auth.signInWithPopup(provider);
            clearTimeout(timeout);
            console.log('✅ Google login successful:', result.user.email);
            // Success - redirect will happen automatically via onAuthStateChanged
        } catch (error) {
            clearTimeout(timeout);
            console.error('Google login error:', error);
            let errorMessage = 'Помилка входу через Google';
            
            switch (error.code) {
                case 'auth/popup-closed-by-user':
                    errorMessage = 'Вікно входу закрито. Спробуйте ще раз.';
                    break;
                case 'auth/cancelled-popup-request':
                    errorMessage = 'Запит скасовано';
                    break;
                case 'auth/popup-blocked':
                    errorMessage = 'Popup заблоковано браузером. Дозвольте popup для цього сайту.';
                    break;
                case 'auth/account-exists-with-different-credential':
                    errorMessage = 'Акаунт існує з іншим методом входу';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Помилка мережі. Перевірте підключення до інтернету.';
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = 'Google Sign-In не налаштований. Перевірте Firebase консоль.';
                    break;
                default:
                    errorMessage = `Помилка: ${error.message}`;
            }
            
            showError(errorMessage);
            googleLoginBtn.disabled = false;
            googleLoginBtn.querySelector('span').textContent = 'Увійти через Google';
        }
    });
}

// Email/Password login form handler
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const loginBtn = document.getElementById('login-btn');
        const btnText = loginBtn.querySelector('.btn-text');
        
        // Disable button and show loading
        loginBtn.disabled = true;
        btnText.textContent = 'Вхід...';
        
        try {
            await auth.signInWithEmailAndPassword(email, password);
            // Success - redirect will happen automatically via onAuthStateChanged
        } catch (error) {
            console.error('Login error:', error);
            let errorMessage = 'Помилка входу. Перевірте email та пароль.';
            
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'Користувача не знайдено';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Невірний пароль';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Невірний формат email';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'Акаунт заблоковано';
                    break;
                case 'auth/invalid-credential':
                    errorMessage = 'Невірні дані для входу';
                    break;
            }
            
            showError(errorMessage);
            loginBtn.disabled = false;
            btnText.textContent = 'Увійти';
        }
    });
}

// Logout handler
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await auth.signOut();
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Logout error:', error);
            showError('Помилка виходу');
        }
    });
}

// Display user email in dashboard
if (window.location.pathname.includes('dashboard.html')) {
    auth.onAuthStateChanged((user) => {
        if (user) {
            const userEmailElement = document.getElementById('user-email');
            if (userEmailElement) {
                userEmailElement.textContent = user.email;
            }
        }
    });
}

// Helper function to show errors
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.add('show');
        
        setTimeout(() => {
            errorDiv.classList.remove('show');
        }, 5000);
    }
}

// Helper function to show success messages
function showSuccess(message) {
    const successDiv = document.getElementById('success-message');
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.classList.add('show');
        
        setTimeout(() => {
            successDiv.classList.remove('show');
        }, 5000);
    }
}

