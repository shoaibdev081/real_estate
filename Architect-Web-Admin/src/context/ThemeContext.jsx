import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export const ThemeContext = createContext(null);

const STORAGE_KEY = 'architecture-admin-theme';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, theme);

    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.dataset.theme = theme;

    if (theme === 'dark') {
      root.style.setProperty('--bg-main', 'var(--brand-dark)');
      root.style.setProperty('--surface-card', 'var(--submenu-bg)');
      root.style.setProperty('--surface-elevated', 'var(--nav-bg)');
      root.style.setProperty('--border-subtle', 'rgba(202, 160, 92, 0.4)');
      root.style.setProperty('--text-primary', 'var(--brand-camel-light)');
      root.style.setProperty('--text-muted', '#A0A0A0');
    } else {
      root.style.setProperty('--bg-main', 'var(--brand-white)');
      root.style.setProperty('--surface-card', '#ffffff');
      root.style.setProperty('--surface-elevated', '#ffffff');
      root.style.setProperty('--border-subtle', 'rgba(148, 163, 184, 0.5)');
      root.style.setProperty('--text-primary', 'var(--text-near-black)');
      root.style.setProperty('--text-muted', '#666666');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      isDark: theme === 'dark',
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}

