import { useEffect, useState } from 'react';
import { storage } from '../services/storage';

function getInitialTheme() {
    const saved = storage.getTheme();
    if (saved) return saved;

    if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
}

export default function ThemeToggle() {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        const isDark = theme === 'dark';
        document.body.classList.toggle('theme-dark', isDark);
        storage.setTheme(theme);
    }, [theme]);

    return (
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
    );
}
