// ==================== ДОПОЛНИТЕЛЬНЫЕ УТИЛИТЫ ====================

// Управление избранным
class FavoritesManager {
    constructor() {
        this.favorites = JSON.parse(localStorage.getItem('estatyq_favorites') || '[]');
        this.init();
    }

    init() {
        this.updateFavoritesUI();
    }

    toggle(propertyId) {
        const index = this.favorites.indexOf(propertyId);
        if (index > -1) {
            this.favorites.splice(index, 1);
        } else {
            this.favorites.push(propertyId);
        }
        this.save();
        this.updateFavoritesUI();
    }

    isFavorite(propertyId) {
        return this.favorites.includes(propertyId);
    }

    getAll() {
        return this.favorites;
    }

    save() {
        localStorage.setItem('estatyq_favorites', JSON.stringify(this.favorites));
    }

    updateFavoritesUI() {
        document.querySelectorAll('.property-favorite').forEach(btn => {
            const propertyId = parseInt(btn.closest('.property-card').dataset.id);
            const icon = btn.querySelector('i');
            
            if (this.isFavorite(propertyId)) {
                btn.classList.add('active');
                icon.className = 'fas fa-heart';
            } else {
                btn.classList.remove('active');
                icon.className = 'far fa-heart';
            }
        });
    }
}

// Управление историей поиска
class SearchHistory {
    constructor() {
        this.history = JSON.parse(localStorage.getItem('estatyq_search_history') || '[]');
        this.maxItems = 10;
    }

    add(query) {
        if (!query || query.trim() === '') return;
        
        // Удаляем дубликаты
        this.history = this.history.filter(item => item !== query);
        
        // Добавляем в начало
        this.history.unshift(query);
        
        // Ограничиваем количество
        this.history = this.history.slice(0, this.maxItems);
        
        this.save();
    }

    get() {
        return this.history;
    }

    clear() {
        this.history = [];
        this.save();
    }

    save() {
        localStorage.setItem('estatyq_search_history', JSON.stringify(this.history));
    }
}

// Управление фильтрами
class FiltersManager {
    constructor() {
        this.savedFilters = JSON.parse(localStorage.getItem('estatyq_saved_filters') || '{}');
    }

    save(filters) {
        this.savedFilters = { ...filters };
        localStorage.setItem('estatyq_saved_filters', JSON.stringify(this.savedFilters));
    }

    load() {
        return { ...this.savedFilters };
    }

    clear() {
        this.savedFilters = {};
        localStorage.removeItem('estatyq_saved_filters');
    }
}

// Управление просмотрами
class ViewManager {
    constructor() {
        this.currentView = localStorage.getItem('estatyq_view') || 'grid';
        this.init();
    }

    init() {
        this.updateViewButtons();
        this.applyView();
    }

    setView(view) {
        this.currentView = view;
        localStorage.setItem('estatyq_view', view);
        this.updateViewButtons();
        this.applyView();
    }

    updateViewButtons() {
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.view === this.currentView) {
                btn.classList.add('active');
            }
        });
    }

    applyView() {
        const container = document.getElementById('properties-container');
        if (!container) return;

        if (this.currentView === 'list') {
            container.classList.add('list-view');
        } else {
            container.classList.remove('list-view');
        }
    }
}

// Уведомления
class NotificationManager {
    constructor() {
        this.container = this.createContainer();
    }

    createContainer() {
        const container = document.createElement('div');
        container.id = 'notifications-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 3000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(container);
        return container;
    }

    show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: var(--bg-card);
            border: 1px solid var(--border-primary);
            border-radius: var(--radius-md);
            padding: 15px 20px;
            color: var(--text-primary);
            box-shadow: var(--shadow-lg);
            animation: slideInRight 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;

        const icon = this.getIcon(type);
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="${icon}" style="color: var(--primary-gold);"></i>
                <span>${message}</span>
            </div>
        `;

        this.container.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }

    getIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || icons.info;
    }
}

// Аналитика
class Analytics {
    constructor() {
        this.events = [];
    }

    track(event, data = {}) {
        const eventData = {
            event,
            data,
            timestamp: new Date().toISOString(),
            url: window.location.href
        };
        
        this.events.push(eventData);
        
        // В реальном приложении здесь бы отправлялись данные на сервер
        console.log('Analytics:', eventData);
    }

    trackSearch(query) {
        this.track('search', { query });
    }

    trackFilter(filter, value) {
        this.track('filter', { filter, value });
    }

    trackView(propertyId) {
        this.track('property_view', { propertyId });
    }

    trackContact(propertyId) {
        this.track('property_contact', { propertyId });
    }
}

// Инициализация утилит
const favoritesManager = new FavoritesManager();
const searchHistory = new SearchHistory();
const filtersManager = new FiltersManager();
const viewManager = new ViewManager();
const notificationManager = new NotificationManager();
const analytics = new Analytics();

// Обновляем функцию toggleFavorite
window.toggleFavorite = function(propertyId) {
    favoritesManager.toggle(propertyId);
    notificationManager.show(
        favoritesManager.isFavorite(propertyId) ? 'Додано до обраного' : 'Видалено з обраного',
        'success'
    );
};

// Обновляем функцию contactProperty
window.contactProperty = function(propertyId) {
    analytics.trackContact(propertyId);
    const property = allProperties.find(p => p.id === propertyId);
    if (!property) return;
    
    const city = citiesData[property.city];
    if (city?.bot) {
        window.open(city.bot, '_blank');
        notificationManager.show('Відкриваємо Telegram...', 'info');
    } else {
        notificationManager.show('Контактна інформація недоступна', 'error');
    }
};

// Обновляем функцию openPropertyModal
window.openPropertyModal = function(propertyId) {
    analytics.trackView(propertyId);
    // Оригинальная функция остается той же
    const property = allProperties.find(p => p.id === propertyId);
    if (!property) return;
    
    const modal = document.getElementById('property-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    const contactBtn = document.getElementById('contact-btn');
    
    if (!modal || !title || !body || !contactBtn) return;
    
    title.textContent = property.title;
    
    body.innerHTML = `
        <div class="property-modal-content">
            <div class="property-modal-image">
                <img src="${property.image}" alt="${property.title}">
            </div>
            
            <div class="property-modal-info">
                <div class="property-modal-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${property.district}, ${property.cityName}</span>
                </div>
                
                <div class="property-modal-description">
                    <p>${property.description}</p>
                </div>
                
                <div class="property-modal-details">
                    <div class="detail-grid">
                        <div class="detail-item">
                            <span class="detail-label">Тип:</span>
                            <span class="detail-value">${property.typeName}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Угода:</span>
                            <span class="detail-value">${transactionTypes[property.transactionType]}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Ціна:</span>
                            <span class="detail-value">$${property.price.toLocaleString()} ${property.transactionType === 'rent' ? '/міс' : ''}</span>
                        </div>
                        ${property.rooms > 0 ? `
                            <div class="detail-item">
                                <span class="detail-label">Кімнат:</span>
                                <span class="detail-value">${property.rooms}</span>
                            </div>
                        ` : ''}
                        <div class="detail-item">
                            <span class="detail-label">Площа:</span>
                            <span class="detail-value">${property.area} м²</span>
                        </div>
                        ${property.floor > 0 ? `
                            <div class="detail-item">
                                <span class="detail-label">Поверх:</span>
                                <span class="detail-value">${property.floor}</span>
                            </div>
                        ` : ''}
                        <div class="detail-item">
                            <span class="detail-label">Рік:</span>
                            <span class="detail-value">${property.year}</span>
                        </div>
                    </div>
                    
                    <div class="property-modal-features">
                        <h4>Особливості:</h4>
                        <div class="features-list">
                            ${property.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    contactBtn.onclick = () => contactProperty(propertyId);
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
};

// Добавляем CSS для анимаций уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    .list-view .properties-grid {
        grid-template-columns: 1fr;
    }
    
    .list-view .property-card {
        display: flex;
        flex-direction: row;
        height: auto;
    }
    
    .list-view .property-image {
        width: 300px;
        height: 200px;
        flex-shrink: 0;
    }
    
    .list-view .property-content {
        flex: 1;
        padding: var(--spacing-lg);
    }
    
    .list-view .property-details {
        grid-template-columns: repeat(4, 1fr);
    }
    
    @media (max-width: 768px) {
        .list-view .property-card {
            flex-direction: column;
        }
        
        .list-view .property-image {
            width: 100%;
            height: 250px;
        }
        
        .list-view .property-details {
            grid-template-columns: repeat(2, 1fr);
        }
    }
`;
document.head.appendChild(style);

// Экспортируем утилиты для глобального доступа
window.favoritesManager = favoritesManager;
window.searchHistory = searchHistory;
window.filtersManager = filtersManager;
window.viewManager = viewManager;
window.notificationManager = notificationManager;
window.analytics = analytics;