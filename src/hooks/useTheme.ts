import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_THEME_MODE, getNextThemeMode } from '../domain/theme';
import type { ThemeMode } from '../domain/theme';

function getPreferredThemeMode(): ThemeMode {
  if (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }

  return DEFAULT_THEME_MODE;
}

export function useTheme() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(getPreferredThemeMode);

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode;
  }, [themeMode]);

  const toggleThemeMode = useCallback(() => {
    setThemeMode((currentThemeMode) => getNextThemeMode(currentThemeMode));
  }, []);

  return {
    setThemeMode,
    themeMode,
    toggleThemeMode,
  };
}
