
function loadFromStorage(key, fallbackValue) {
    try {
        const rawData = localStorage.getItem(key);
        return rawData ? JSON.parse(rawData) : fallbackValue;
    } catch (error) {
        console.error(`Failed to parse localStorage key "${key}":`, error);
        return fallbackValue;
    }
}

function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Failed to save localStorage key "${key}":`, error);
    }
}

const themeToggleButton = document.getElementById('theme-toggle');
const THEME_STORAGE_KEY = 'kitchenTheme';

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggleButton) {
        themeToggleButton.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
    }
}

// Apply saved theme immediately on page load
const initialTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'light';
applyTheme(initialTheme);

if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    });
}


/* ==========================================================================
   DAY 2: Recent Recipe Searches (Last 5 Searches + Dropdown)
   ========================================================================== */
const searchInput = document.getElementById('search-input');
const historyDropdown = document.getElementById('history-dropdown');
const activeSearchDisplay = document.getElementById('active-search-display');
const SEARCH_HISTORY_KEY = 'recentRecipeSearches';
const MAX_RECENT_SEARCHES = 5;

function executeRecipeSearch(query) {
    const cleanQuery = query.trim();
    if (!cleanQuery) return;

    // Update UI to simulate running the search
    if (activeSearchDisplay) {
        activeSearchDisplay.textContent = `Showing recipe results for: "${cleanQuery}"`;
    }

    // Update and persist the last 5 unique searches
    let searchHistory = loadFromStorage(SEARCH_HISTORY_KEY, []);
    searchHistory = searchHistory.filter(item => item.toLowerCase() !== cleanQuery.toLowerCase());
    searchHistory.unshift(cleanQuery);

    if (searchHistory.length > MAX_RECENT_SEARCHES) {
        searchHistory.pop();
    }

    saveToStorage(SEARCH_HISTORY_KEY, searchHistory);
}

function renderSearchHistory() {
    if (!historyDropdown) return;
    const searchHistory = loadFromStorage(SEARCH_HISTORY_KEY, []);
    historyDropdown.innerHTML = '';

    if (searchHistory.length === 0) {
        historyDropdown.style.display = 'none';
        return;
    }

    searchHistory.forEach(term => {
        const listItem = document.createElement('li');
        listItem.textContent = `🕒 ${term}`;

        // Click a history item to search again
        listItem.addEventListener('click', () => {
            searchInput.value = term;
            historyDropdown.style.display = 'none';
            executeRecipeSearch(term);
        });

        historyDropdown.appendChild(listItem);
    });

    historyDropdown.style.display = 'block';
}

if (searchInput) {
    searchInput.addEventListener('focus', renderSearchHistory);
    searchInput.addEventListener('input', renderSearchHistory);

    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            executeRecipeSearch(searchInput.value);
            historyDropdown.style.display = 'none';
        }
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.search-container')) {
            historyDropdown.style.display = 'none';
        }
    });
}


/* ==========================================================================
   DAY 3: Recipe Notes Auto-Save (Every 5 Seconds + Recovery + Clear on Submit)
   ========================================================================== */
const recipeForm = document.getElementById('auto-save-form');
const autosaveStatus = document.getElementById('autosave-status');
const RECIPE_DRAFT_KEY = 'recipeDraftData';

if (recipeForm) {
    const formFields = recipeForm.querySelectorAll('input, textarea, select');

    // Recover draft data when the page loads/refreshes
    window.addEventListener('DOMContentLoaded', () => {
        const savedDraft = loadFromStorage(RECIPE_DRAFT_KEY, null);
        if (savedDraft) {
            formFields.forEach(field => {
                if (field.name && savedDraft[field.name] !== undefined) {
                    field.value = savedDraft[field.name];
                }
            });
            if (autosaveStatus) {
                autosaveStatus.textContent = 'Recovered unsaved recipe draft from previous session.';
            }
        }
    });

    function collectFormData() {
        const formData = {};
        formFields.forEach(field => {
            if (field.name) {
                formData[field.name] = field.value;
            }
        });
        return formData;
    }

    // Auto-save all fields every 5 seconds
    setInterval(() => {
        const currentData = collectFormData();
        const hasContent = Object.values(currentData).some(val => val.trim() !== '');

        if (hasContent) {
            saveToStorage(RECIPE_DRAFT_KEY, currentData);
            if (autosaveStatus) {
                const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                autosaveStatus.textContent = `Draft auto-saved at ${timeNow}`;
            }
        }
    }, 5000);

    // Clear saved draft on form submission
    recipeForm.addEventListener('submit', (event) => {
        event.preventDefault();
        localStorage.removeItem(RECIPE_DRAFT_KEY);
        recipeForm.reset();

        if (autosaveStatus) {
            autosaveStatus.textContent = 'Recipe saved! Auto-save draft cleared.';
        }
    });
}