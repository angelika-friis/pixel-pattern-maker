import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useTheme } from './useTheme';

function mockSystemThemePreference(prefersDarkTheme: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      addEventListener: vi.fn(),
      addListener: vi.fn(),
      dispatchEvent: vi.fn(),
      matches: query === '(prefers-color-scheme: dark)' && prefersDarkTheme,
      media: query,
      onchange: null,
      removeEventListener: vi.fn(),
      removeListener: vi.fn(),
    })),
  });
}

describe('useTheme', () => {
  beforeEach(() => {
    delete document.documentElement.dataset.theme;
    mockSystemThemePreference(false);
  });

  it('starts with the system light theme preference', () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.themeMode).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('starts with the system dark theme preference', () => {
    mockSystemThemePreference(true);

    const { result } = renderHook(() => useTheme());

    expect(result.current.themeMode).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('toggles the current theme without storage', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleThemeMode();
    });

    expect(result.current.themeMode).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});
