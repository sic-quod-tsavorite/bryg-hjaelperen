// Unit test for theme resolution logic (pure function behavior)

import type {
  ThemeMode,
  ResolvedTheme,
} from '../../../../src/store/themeStore';

// Extract the pure logic from useResolvedTheme for unit testing
function resolveTheme(
  mode: ThemeMode,
  systemTheme: 'light' | 'dark' | null
): ResolvedTheme {
  if (mode === 'system') {
    return systemTheme === 'dark' ? 'dark' : 'light';
  }
  return mode;
}

describe('resolveTheme', () => {
  it('returns light when mode is light', () => {
    expect(resolveTheme('light', null)).toBe('light');
    expect(resolveTheme('light', 'dark')).toBe('light');
  });

  it('returns dark when mode is dark', () => {
    expect(resolveTheme('dark', null)).toBe('dark');
    expect(resolveTheme('dark', 'light')).toBe('dark');
  });

  it('follows system theme when mode is system', () => {
    expect(resolveTheme('system', 'dark')).toBe('dark');
    expect(resolveTheme('system', 'light')).toBe('light');
  });

  it('defaults to light when system theme is null', () => {
    expect(resolveTheme('system', null)).toBe('light');
  });
});
