# Task 2: Single Source of Truth - Flow Diagram

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                   ESTABLECYQ SITE ARCHITECTURE                  │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│              localStorage: estatyq_favorites = []                │
│                  (JSON array of propertyIds)                     │
└──────────────────────────────────────────────────────────────────┘
                              ▲
                              │
                              │ (sync)
                              │
┌──────────────────────────────────────────────────────────────────┐
│           GLOBAL: let favorites = JSON.parse(...)                │
│              (loaded at page init from localStorage)             │
└──────────────────────────────────────────────────────────────────┘
                              ▲
                              │
             ┌────────────────┴────────────────┐
             │                                 │
             │ (check)                         │ (toggle)
             │                                 │
    ┌────────────────┐          ┌──────────────────────┐
    │   isFavorite   │          │   toggleFavorite     │
    │  (propertyId)  │          │   (propertyId)       │
    │                │          │                      │
    │ returns boolean│          │ - Add/Remove from [] │
    │ (for display)  │          │ - Save to localStorage
    │                │          │ - Call applyFilters()
    └────────────────┘          └──────────────────────┘
             ▲                           ▲
             │                           │
             └───────────────┬───────────┘
                             │
                             │ (called by)
                             │
                    ┌────────────────────┐
                    │   toggleLike()     │
                    │  (propertyId)      │
                    │                    │
                    │ - Call toggleFav() │
                    │ - Call renderProp()│
                    └────────────────────┘
                             ▲
                             │
            ┌────────────────┴────────────────┐
            │                                 │
            │ Grid View                       │ List View
            │ onclick="toggleLike(${id})"     │ onclick="toggleLike(${id})"
            │ (button on card)                │ (button on list-item)
            │                                 │
            │ Modal View                      │
            │ onclick="toggleLike(${id});     │
            │          closeModal()"          │
            │                                 │
            └────────────────┬────────────────┘
                             │
                             │ (calls)
                             ▼
                    ┌──────────────────────┐
                    │ renderProperties()   │
                    │                      │
                    │ - Checks currentView │
                    │ - Uses isFavorite()  │
                    │ - Renders grid OR    │
                    │   list accordingly   │
                    │ - Shows/hides "More" │
                    │   button             │
                    └──────────────────────┘
                             │
                             │ (refreshes UI)
                             ▼
                    ┌──────────────────────┐
                    │  User sees updated:  │
                    │  - Heart state (♡/♥)│
                    │  - Both views sync   │
                    │  - Modal consistency │
                    └──────────────────────┘
```

## Data Flow for Like Action

### Scenario: User clicks heart in Grid View

```
┌────────────────────────────────────────────────────────────────┐
│ 1. User clicks ♡ button on property card (Grid)                │
│    onclick="toggleLike(${prop.id})"                             │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│ 2. toggleLike(propertyId) is called with propertyId            │
│    function toggleLike(propertyId) {                            │
│      toggleFavorite(propertyId);   // Add/remove from favorites │
│      renderProperties();            // Re-render all views      │
│    }                                                             │
└────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
        ┌──────────────────┐  ┌──────────────────┐
        │ toggleFavorite() │  │renderProperties()│
        │                  │  │                  │
        │ 1. Find index    │  │ 1. Get display  │
        │ 2. Add/Remove    │  │    count        │
        │ 3. Save to LS    │  │ 2. For each     │
        │ 4. Call filters  │  │    property:    │
        │                  │  │  - isFavorite() │
        └──────────────────┘  │  - Render card  │
                              │ 3. Show/hide    │
                              │    "More" btn   │
                              └──────────────────┘
                                      │
                                      ▼
                         ┌──────────────────────┐
                         │ User sees ♥ filled   │
                         │ Heart icon updated   │
                         │ Button state saved   │
                         └──────────────────────┘
```

### Scenario: User opens modal with liked property

```
┌────────────────────────────────────────────────────────────────┐
│ 1. User clicks "Детально" on liked property card               │
│    onclick="openModal(${prop.id})"                              │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│ 2. openModal(propId) builds modal with:                         │
│    ${isFavorite(prop.id) ? '♥ Видалити' : '♡ Додати'}          │
│                                                                 │
│    Result: Shows "♥ Видалити з улюблених" (filled heart)       │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│ 3. Modal button: onclick="toggleLike(${prop.id}); closeModal();"│
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│ 4. User clicks "♥ Видалити з улюблених"                        │
│    - toggleLike(propertyId) removes from favorites              │
│    - renderProperties() refreshes grid/list                     │
│    - closeModal() closes the modal                              │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│ 5. User is back at grid/list view                               │
│    - Heart on the property is now ♡ (empty)                     │
│    - Data persisted in localStorage                              │
│    - If user opens modal again, button shows ♡ Додати           │
└────────────────────────────────────────────────────────────────┘
```

## Single Source of Truth Achievement

### ✅ BEFORE (Broken)
```javascript
// Two renderProperties functions - CONFLICT!
function renderProperties() { /* grid only */ }  // Line 1193
function renderProperties() { /* grid+list */ }  // Line 1332

// Two toggleLike functions - CONFLICT!
function toggleLike(propertyId) { /* correct */ }  // Line 1272
function toggleLike(event) { /* wrong */ }         // Line 1581
```

**Problems:**
- Which function gets called? Unpredictable!
- Same button onclick="toggleLike()" calls wrong function
- Modal and grid might use different functions
- Impossible to maintain - bugs everywhere

### ✅ AFTER (Fixed)
```javascript
// ONE renderProperties function
function renderProperties() {
  // ... handles grid/list based on currentView
  if (currentView === 'list') {
    // render list
  } else {
    // render grid
  }
}

// ONE toggleLike function
function toggleLike(propertyId) {
  toggleFavorite(propertyId);
  renderProperties();
}
```

**Benefits:**
- Always uses same function
- No ambiguity
- Easy to maintain
- Consistent behavior everywhere
- Reliable localStorage sync

## Acceptance Criteria Status

| Criterion | Status | Details |
|-----------|--------|---------|
| **One renderProperties** | ✅ PASS | Single function at line 1261 |
| **Grid/List support** | ✅ PASS | if (currentView === 'list') branch |
| **Pagination support** | ✅ PASS | "Показати ще" button logic intact |
| **One toggleLike** | ✅ PASS | Single function at line 1510 |
| **propertyId parameter** | ✅ PASS | function toggleLike(propertyId) |
| **localStorage sync** | ✅ PASS | Calls toggleFavorite → save to LS |
| **View switching stable** | ✅ PASS | setView() + currentView variable |
| **Like sync grid↔modal** | ✅ PASS | isFavorite() called in both |
| **No mocking/event-based** | ✅ PASS | Not using event.target anymore |

## Code References

- **Single renderProperties**: `js/script.js` line 1261
- **Single toggleLike**: `js/script.js` line 1510
- **toggleFavorite (helper)**: `js/script.js` line 1779
- **isFavorite (helper)**: `js/script.js` line 1795
- **View switcher**: `js/script.js` line 1240
- **Global favorites**: `js/script.js` line 548
