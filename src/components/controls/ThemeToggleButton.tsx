import { Moon, Sun } from 'lucide-react';
import type { ThemeMode } from '../../domain/theme';

type ThemeToggleButtonProps = {
  themeMode: ThemeMode;
  onToggle: () => void;
};

export function ThemeToggleButton({ themeMode, onToggle }: ThemeToggleButtonProps) {
  const isDarkTheme = themeMode === 'dark';
  const Icon = isDarkTheme ? Sun : Moon;
  const label = isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme';

  return (
    <button
      className="theme-toggle-button"
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={isDarkTheme}
      onClick={onToggle}
    >
      <Icon aria-hidden="true" />
    </button>
  );
}
