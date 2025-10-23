// Dashboard - Realtime Database Version
console.log('📋 Dashboard loading...');

// Don't redeclare - use global firebase auth
var rtdb, storage;

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOMContentLoaded fired');
    
    // Get Firebase services (auth is already global from auth.js)
    try {
        rtdb = firebase.database();
        storage = firebase.storage();
        // auth is already defined globally in auth.js
        console.log('✅ Firebase Realtime Database ready');
    } catch(e) {
        console.error('Firebase error:', e);
        alert('Firebase помилка');
        return;
    }
    
    setupTabs();
    setupForms();
    checkAuth();
});

function setupTabs() {
    console.log('Setting up tabs...');
    const buttons = document.querySelectorAll('.tab-button');
    console.log('Found', buttons.length, 'tab buttons');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const tab = this.getAttribute('data-tab');
            console.log('Tab clicked:', tab);
            
            document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            const content = document.getElementById(tab + '-tab');
            if (content) {
                content.classList.add('active');
                console.log('Tab activated:', tab);
            }
            
            if (tab === 'portfolio') {
                loadPortfolioList();
            }
            
            if (tab === 'profile') {
                loadProfile();
            }
        });
    });
}

function setupForms() {
    const contactForm = document.getElementById('contacts-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveContacts();
        });
    }
    
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProfile();
        });
    }
    
    const portfolioForm = document.getElementById('portfolio-form');
    if (portfolioForm) {
        portfolioForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addProject(e);
        });
    }
    
    // ... file preview handlers...
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            auth.signOut().then(() => {
                window.location.href = 'login.html';
            });
        });
    }
}

function checkAuth() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            const emailEl = document.getElementById('user-email');
            if (emailEl) {
                emailEl.textContent = user.email;
            }
            loadContacts();
            checkFirebaseStatus();
        } else {
            window.location.href = 'login.html';
        }
    });
}

async function loadContacts() {
    const savedDiv = document.getElementById('current-saved-contacts');
    if (savedDiv) {
        savedDiv.innerHTML = '<p style="color: #888;">⏳ Завантаження...</p>';
    }
    
    try {
        const ref = firebase.database().ref('settings/contacts');
        const snapshot = await ref.get();
        
        if (snapshot.exists()) {
            const data = snapshot.val();
            console.log('✅ Contacts loaded from Realtime DB:', data);
            
            if (document.getElementById('telegram')) document.getElementById('telegram').value = data.telegram || '';
            if (document.getElementById('telegram-channel')) document.getElementById('telegram-channel').value = data.telegramChannel || '';
            if (document.getElementById('email')) document.getElementById('email').value = data.email || '';
            if (document.getElementById('instagram')) document.getElementById('instagram').value = data.instagram || '';
            if (document.getElementById('phone')) document.getElementById('phone').value = data.phone || '';
            if (document.getElementById('upwork')) document.getElementById('upwork').value = data.upwork || '';
            
            if (savedDiv) {
                savedDiv.innerHTML = '<pre style="color: #888; font-size: 0.85em;">' + JSON.stringify(data, null, 2) + '</pre>';
            }
        } else {
            console.log('ℹ️ No contacts in Realtime DB');
            if (savedDiv) {
                savedDiv.innerHTML = '<p style="color: #fbbf24;">📭 Немає даних - заповніть форму та натисніть Зберегти</p>';
            }
        }
    } catch (error) {
        console.error('❌ Database error:', error.message);
        if (savedDiv) {
            savedDiv.innerHTML = '<p style="color: #f87171;">❌ Помилка: ' + error.message + '</p>';
        }
    }
}

async function saveContacts() {
    const btn = document.querySelector('#contacts-form button[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = '⏳ Збереження...';
    
    let hasError = false;
    
    try {
        const contacts = {
            telegram: (document.getElementById('telegram') || {value:''}).value.trim(),
            telegramChannel: (document.getElementById('telegram-channel') || {value:''}).value.trim(),
            email: (document.getElementById('email') || {value:''}).value.trim(),
            instagram: (document.getElementById('instagram') || {value:''}).value.trim(),
            phone: (document.getElementById('phone') || {value:''}).value.trim(),
            upwork: (document.getElementById('upwork') || {value:''}).value.trim(),
            updatedAt: new Date().toISOString()
        };
        
        console.log('Saving contacts:', contacts);
        
        const ref = firebase.database().ref('settings/contacts');
        await ref.set(contacts);
        
        console.log('✅ Contacts saved to Realtime DB');
        showMessage('✅ Контакти збережено!', 'success');
        setTimeout(() => loadContacts(), 500);
        
    } catch (error) {
        hasError = true;
        console.error('❌ Save error:', error.message);
        showMessage('❌ ' + error.message, 'error');
    } finally {
        setTimeout(() => {
            btn.disabled = false;
            btn.textContent = originalText;
            console.log('✅ Button re-enabled');
        }, 100);
    }
}

async function loadPortfolioList() {
    const container = document.getElementById('portfolio-list');
    if (!container) return;
    
    container.innerHTML = '<p>⏳ Завантаження...</p>';
    
    try {
        const ref = firebase.database().ref('portfolio');
        const snapshot = await ref.get();
        
        if (!snapshot.exists()) {
            container.innerHTML = '<p>📭 Немає проектів</p>';
            return;
        }
        
        const projects = [];
        snapshot.forEach(child => {
            projects.push({
                id: child.key,
                ...child.val()
            });
        });
        
        // Sort by createdAt descending
        projects.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        
        container.innerHTML = '';
        projects.forEach(project => {
            let thumbnail = '📦';
            if (project.imageUrl) {
                thumbnail = `<img src="${project.imageUrl}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; cursor: pointer;" onclick="window.open('${project.imageUrl}', '_blank')">`;
            } else if (project.icon) {
                thumbnail = `<div style="font-size: 2em;">${project.icon}</div>`;
            }
            
            const html = `<div style="background: #1a1a1a; border: 1px solid #333; padding: 15px; margin-bottom: 15px; border-radius: 8px; display: flex; gap: 15px; align-items: flex-start;">
                <div style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; width: 60px; height: 60px;">${thumbnail}</div>
                <div style="flex: 1;">
                    <h4 style="margin: 0 0 5px 0;">${project.title}</h4>
                    <p style="margin: 0 0 10px 0; color: #888; font-size: 0.9em;">${project.description.substring(0, 80)}...</p>
                    ${project.tags ? `<small style="color: #666;">🏷️ ${project.tags}</small><br>` : ''}
                    ${project.photos && project.photos.length > 0 ? `<small style="color: #666;">📸 Фото: ${project.photos.length} шт.</small><br>` : ''}
                    ${project.videoUrl ? `<small style="color: #666;">🎥 <a href="${project.videoUrl}" target="_blank" style="color: #A855F7;">Переглянути відео</a></small><br>` : ''}
                    ${project.archiveUrl ? `<small style="color: #666;">📦 <a href="${project.archiveUrl}" target="_blank" style="color: #A855F7;">Завантажити архів</a></small><br>` : ''}
                    ${project.imageUrl ? `<small style="color: #666;">🔗 <a href="${project.imageUrl}" target="_blank" style="color: #A855F7;">Відкрити зображення</a></small>` : ''}
                </div>
                <button onclick="window.editProject('${project.id}')" style="background: #f59e0b; color: white; border: none; padding: 8px 15px; border-radius: 6px; cursor: pointer; white-space: nowrap;">Редагувати</button>
                <button onclick="window.deleteProject('${project.id}')" style="background: #dc2626; color: white; border: none; padding: 8px 15px; border-radius: 6px; cursor: pointer; white-space: nowrap;">Видалити</button>
            </div>`;
            container.innerHTML += html;
        });
        
    } catch (error) {
        console.error('❌ Portfolio load error:', error.message);
        container.innerHTML = '<p style="color: #f87171;">❌ Помилка: ' + error.message + '</p>';
    }
}

function addProjectPhotoField() {
    const container = document.getElementById('project-photos-container');
    const index = container.children.length;
    const html = `<div class="form-group" style="position: relative;">
        <label for="project-photo-${index}">📸 Фото ${index + 1}</label>
        <input type="url" id="project-photo-${index}" placeholder="https://example.com/photo${index + 1}.jpg">
        <button type="button" onclick="this.parentElement.remove()" style="position: absolute; right: 0; top: 30px; background: #dc2626; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer;">✕</button>
    </div>`;
    container.innerHTML += html;
}

async function addProject(e) {
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = '⏳ Збереження...';
    
    try {
        const title = (document.getElementById('project-title') || {value:''}).value.trim();
        const description = (document.getElementById('project-description') || {value:''}).value.trim();
        const imageUrl = (document.getElementById('project-url') || {value:''}).value.trim();
        const icon = (document.getElementById('project-icon') || {value:''}).value.trim() || '🖼️';
        const tags = (document.getElementById('project-tags') || {value:''}).value.trim();
        const videoUrl = (document.getElementById('project-video') || {value:''}).value.trim();
        const archiveUrl = (document.getElementById('project-archive') || {value:''}).value.trim();
        const detailedDesc = (document.getElementById('project-detailed-desc') || {value:''}).value.trim();
        
        if (!title || !description) {
            throw new Error('Заповніть назву та опис');
        }
        
        // Collect photos
        const photos = [];
        document.querySelectorAll('[id^="project-photo-"]').forEach(input => {
            if (input.value.trim()) {
                photos.push(input.value.trim());
            }
        });
        
        const projectId = firebase.database().ref('portfolio').push().key;
        const project = {
            id: projectId,
            title: title,
            description: description,
            imageUrl: imageUrl,
            icon: icon,
            tags: tags,
            photos: photos,
            videoUrl: videoUrl,
            archiveUrl: archiveUrl,
            detailedDescription: detailedDesc,
            createdAt: Date.now()
        };
        
        await firebase.database().ref('portfolio/' + projectId).set(project);
        
        showMessage('✅ Проект додано!', 'success');
        
        setTimeout(() => {
            e.target.reset();
            document.getElementById('project-photos-container').innerHTML = '';
            loadPortfolioList();
        }, 500);
        
    } catch (error) {
        console.error('❌ Add project error:', error.message);
        showMessage('❌ ' + error.message, 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
}

window.deleteProject = async function(projectId) {
    if (!confirm('Видалити проект?')) return;
    
    try {
        showMessage('⏳ Видалення...', 'success');
        
        const ref = firebase.database().ref('portfolio/' + projectId);
        const snapshot = await ref.get();
        
        if (snapshot.exists()) {
            const project = snapshot.val();
            
            // Delete files from Storage if they exist
            if (project.imageUrl) {
                try {
                    const imageRef = firebase.storage().refFromURL(project.imageUrl);
                    await imageRef.delete();
                } catch (err) {
                    console.log('Image delete skipped:', err.message);
                }
            }
            
            if (project.videoUrl) {
                try {
                    const videoRef = firebase.storage().refFromURL(project.videoUrl);
                    await videoRef.delete();
                } catch (err) {
                    console.log('Video delete skipped:', err.message);
                }
            }
        }
        
        await ref.remove();
        showMessage('✅ Проект видалено', 'success');
        loadPortfolioList();
    } catch (error) {
        console.error('❌ Delete error:', error.message);
        showMessage('❌ Помилка: ' + error.message, 'error');
    }
};

async function loadProfile() {
    const savedDiv = document.getElementById('current-saved-profile');
    if (savedDiv) {
        savedDiv.innerHTML = '<p style="color: #888;">⏳ Завантаження...</p>';
    }
    
    try {
        const ref = firebase.database().ref('profile');
        const snapshot = await ref.get();
        
        if (snapshot.exists()) {
            const data = snapshot.val();
            console.log('✅ Profile loaded from Realtime DB:', data);
            
            if (document.getElementById('profile-name')) document.getElementById('profile-name').value = data.name || '';
            if (document.getElementById('profile-about')) document.getElementById('profile-about').value = data.about || '';
            if (document.getElementById('profile-avatar')) document.getElementById('profile-avatar').value = data.avatar || '';
            if (document.getElementById('profile-video')) document.getElementById('profile-video').value = data.videoUrl || '';
            if (document.getElementById('profile-archive')) document.getElementById('profile-archive').value = data.archiveUrl || '';
            if (document.getElementById('profile-description')) document.getElementById('profile-description').value = data.description || '';
            
            // Load photos
            const photosContainer = document.getElementById('photos-container');
            photosContainer.innerHTML = '';
            if (data.photos && Array.isArray(data.photos)) {
                data.photos.forEach((photo, index) => {
                    addPhotoField();
                    document.getElementById('profile-photo-' + index).value = photo;
                });
            }
            
            if (savedDiv) {
                savedDiv.innerHTML = '<pre style="color: #888; font-size: 0.9em;">' + JSON.stringify(data, null, 2) + '</pre>';
            }
        } else {
            console.log('ℹ️ No profile data in Realtime DB');
            if (savedDiv) {
                savedDiv.innerHTML = '<p style="color: #fbbf24;">📭 Немає даних - заповніть форму та натисніть Зберегти</p>';
            }
        }
    } catch (error) {
        console.error('❌ Database error:', error.message);
        if (savedDiv) {
            savedDiv.innerHTML = '<p style="color: #f87171;">❌ Помилка: ' + error.message + '</p>';
        }
    }
}

async function saveProfile() {
    const btn = document.querySelector('#profile-form button[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = '⏳ Збереження...';
    
    try {
        const photos = [];
        document.querySelectorAll('[id^="profile-photo-"]').forEach(input => {
            if (input.value.trim()) {
                photos.push(input.value.trim());
            }
        });
        
        const profile = {
            name: (document.getElementById('profile-name') || {value:''}).value.trim(),
            about: (document.getElementById('profile-about') || {value:''}).value.trim(),
            avatar: (document.getElementById('profile-avatar') || {value:''}).value.trim(),
            videoUrl: (document.getElementById('profile-video') || {value:''}).value.trim(),
            archiveUrl: (document.getElementById('profile-archive') || {value:''}).value.trim(),
            description: (document.getElementById('profile-description') || {value:''}).value.trim(),
            photos: photos,
            updatedAt: new Date().toISOString()
        };
        
        console.log('Saving profile:', profile);
        
        const ref = firebase.database().ref('profile');
        await ref.set(profile);
        
        console.log('✅ Profile saved to Realtime DB');
        showMessage('✅ Профіль збережено!', 'success');
        setTimeout(() => loadProfile(), 500);
        
    } catch (error) {
        console.error('❌ Save error:', error.message);
        showMessage('❌ ' + error.message, 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
}

function addPhotoField() {
    const container = document.getElementById('photos-container');
    const index = container.children.length;
    const html = `<div class="form-group" style="position: relative;">
        <label for="profile-photo-${index}">📸 Фото ${index + 1}</label>
        <input type="url" id="profile-photo-${index}" placeholder="https://example.com/photo${index + 1}.jpg">
        <button type="button" onclick="this.parentElement.remove()" style="position: absolute; right: 0; top: 30px; background: #dc2626; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer;">✕</button>
    </div>`;
    container.innerHTML += html;
}

function showMessage(text, type) {
    const id = type === 'success' ? 'success-message' : 'error-message';
    const el = document.getElementById(id);
    if (el) {
        el.textContent = text;
        el.style.display = 'block';
        setTimeout(() => { el.style.display = 'none'; }, 3000);
    }
}

function checkFirebaseStatus() {
    const el = document.getElementById('firebase-status');
    if (el) {
        el.innerHTML = '<div style="color: #4ade80;">✅ З\'єднання активне</div>';
    }
}

// ==================== EDIT PROJECT FUNCTIONS ====================

let currentEditingProjectId = null;

window.editProject = async function(projectId) {
    console.log('✏️ Editing project:', projectId);
    currentEditingProjectId = projectId;
    
    try {
        const ref = firebase.database().ref('portfolio/' + projectId);
        const snapshot = await ref.get();
        
        if (!snapshot.exists()) {
            showMessage('❌ Проект не знайдено', 'error');
            return;
        }
        
        const project = snapshot.val();
        
        // Fill form fields
        document.getElementById('edit-project-title').value = project.title || '';
        document.getElementById('edit-project-description').value = project.description || '';
        document.getElementById('edit-project-icon').value = project.icon || '';
        document.getElementById('edit-project-url').value = project.imageUrl || '';
        document.getElementById('edit-project-tags').value = project.tags || '';
        document.getElementById('edit-project-video').value = project.videoUrl || '';
        document.getElementById('edit-project-archive').value = project.archiveUrl || '';
        document.getElementById('edit-project-detailed-desc').value = project.detailedDescription || '';
        
        // Load photos
        const photosContainer = document.getElementById('edit-project-photos-container');
        photosContainer.innerHTML = '';
        if (project.photos && Array.isArray(project.photos)) {
            project.photos.forEach((photo, index) => {
                addEditProjectPhotoField();
                document.getElementById('edit-project-photo-' + index).value = photo;
            });
        }
        
        // Show modal
        const modal = document.getElementById('edit-project-modal');
        modal.style.display = 'flex';
        document.getElementById('edit-project-form').style.display = 'block';
        document.body.style.overflow = 'hidden';
        
    } catch (error) {
        console.error('❌ Edit error:', error.message);
        showMessage('❌ ' + error.message, 'error');
    }
};

function closeEditProjectModal() {
    const modal = document.getElementById('edit-project-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentEditingProjectId = null;
}

function addEditProjectPhotoField() {
    const container = document.getElementById('edit-project-photos-container');
    const index = container.children.length;
    const html = `<div class="form-group" style="position: relative;">
        <label for="edit-project-photo-${index}">📸 Фото ${index + 1}</label>
        <input type="url" id="edit-project-photo-${index}" placeholder="https://example.com/photo${index + 1}.jpg">
        <button type="button" onclick="this.parentElement.remove()" style="position: absolute; right: 0; top: 30px; background: #dc2626; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer;">✕</button>
    </div>`;
    container.innerHTML += html;
}

document.addEventListener('DOMContentLoaded', function() {
    // Setup edit form submission
    const editForm = document.getElementById('edit-project-form');
    if (editForm) {
        editForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.disabled = true;
            btn.textContent = '⏳ Збереження...';
            
            try {
                const photos = [];
                document.querySelectorAll('[id^="edit-project-photo-"]').forEach(input => {
                    if (input.value.trim()) {
                        photos.push(input.value.trim());
                    }
                });
                
                const updatedProject = {
                    id: currentEditingProjectId,
                    title: (document.getElementById('edit-project-title') || {value:''}).value.trim(),
                    description: (document.getElementById('edit-project-description') || {value:''}).value.trim(),
                    icon: (document.getElementById('edit-project-icon') || {value:''}).value.trim() || '🖼️',
                    imageUrl: (document.getElementById('edit-project-url') || {value:''}).value.trim(),
                    tags: (document.getElementById('edit-project-tags') || {value:''}).value.trim(),
                    photos: photos,
                    videoUrl: (document.getElementById('edit-project-video') || {value:''}).value.trim(),
                    archiveUrl: (document.getElementById('edit-project-archive') || {value:''}).value.trim(),
                    detailedDescription: (document.getElementById('edit-project-detailed-desc') || {value:''}).value.trim(),
                    updatedAt: new Date().toISOString()
                };
                
                if (!updatedProject.title || !updatedProject.description) {
                    throw new Error('Заповніть назву та опис');
                }
                
                console.log('Saving updated project:', updatedProject);
                
                await firebase.database().ref('portfolio/' + currentEditingProjectId).set(updatedProject);
                
                showMessage('✅ Проект оновлено!', 'success');
                closeEditProjectModal();
                loadPortfolioList();
                
            } catch (error) {
                console.error('❌ Save error:', error.message);
                showMessage('❌ ' + error.message, 'error');
            } finally {
                btn.disabled = false;
                btn.textContent = originalText;
            }
        });
    }
    
    // Close modal on backdrop click
    const modal = document.getElementById('edit-project-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeEditProjectModal();
            }
        });
    }
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && currentEditingProjectId) {
            closeEditProjectModal();
        }
    });
});

console.log('✅ Dashboard ready');
