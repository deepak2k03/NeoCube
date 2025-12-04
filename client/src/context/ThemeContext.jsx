import React, { createContext, useContext, useState, useEffect } from 'react';

// Theme options
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// Create context
const ThemeContext = createContext();

// Provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get saved theme or default to system
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || THEMES.SYSTEM;
  });

  // Apply theme to DOM
  useEffect(() => {
    const applyTheme = (themeToApply) => {
      const root = document.documentElement;

      if (themeToApply === THEMES.DARK) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    const resolveTheme = () => {
      if (theme === THEMES.SYSTEM) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? THEMES.DARK : THEMES.LIGHT;
      }
      return theme;
    };

    const resolvedTheme = resolveTheme();
    applyTheme(resolvedTheme);

    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme === THEMES.SYSTEM) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = () => {
        const prefersDark = mediaQuery.matches;
        const root = document.documentElement;

        if (prefersDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      };

      // Add listener
      mediaQuery.addEventListener('change', handleChange);

      // Cleanup
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Toggle theme function
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      switch (prevTheme) {
        case THEMES.LIGHT:
          return THEMES.DARK;
        case THEMES.DARK:
          return THEMES.SYSTEM;
        case THEMES.SYSTEM:
          return THEMES.LIGHT;
        default:
          return THEMES.LIGHT;
      }
    });
  };

  // Set specific theme
  const setSpecificTheme = (newTheme) => {
    if (Object.values(THEMES).includes(newTheme)) {
      setTheme(newTheme);
    }
  };

  // Get current resolved theme (what's actually applied)
  const getCurrentTheme = () => {
    if (theme === THEMES.SYSTEM) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? THEMES.DARK : THEMES.LIGHT;
    }
    return theme;
  };

  // Check if dark mode is currently active
  const isDarkMode = () => {
    return getCurrentTheme() === THEMES.DARK;
  };

  // Context value
  const value = {
    theme,
    currentTheme: getCurrentTheme(),
    isDarkMode: isDarkMode(),
    toggleTheme,
    setTheme: setSpecificTheme,
    themes: THEMES,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};