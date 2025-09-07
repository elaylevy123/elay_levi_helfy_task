const THEME_KEY = 'tm_theme';
const FILTERS_KEY = 'tm_filters';

export const storage = {
    getTheme() {
        return localStorage.getItem(THEME_KEY) || 'light';
    },
    setTheme(theme) {
        localStorage.setItem(THEME_KEY, theme);
    },
    getFilters() {
        try {
            const raw = localStorage.getItem(FILTERS_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    },
    setFilters(filters) {
        localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
    },
};
