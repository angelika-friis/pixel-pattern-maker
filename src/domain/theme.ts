export const DEFAULT_THEME_MODE: ThemeMode = 'light';

export type ThemeMode = 'light' | 'dark';

export function getNextThemeMode(themeMode: ThemeMode): ThemeMode {
  return themeMode === 'dark' ? 'light' : 'dark';
}
