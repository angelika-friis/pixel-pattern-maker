import { Moon, Sun } from 'lucide-react';
import type { ThemeMode } from '../../domain/theme';
import buttonStyles from '../../styles/shared/button.module.css';
import styles from './ThemeToggleButton.module.css';

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
      className={`${buttonStyles.button} ${styles['theme-toggle-button']}`}
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
