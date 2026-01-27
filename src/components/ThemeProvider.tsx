import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import { useThemeStore, type ResolvedTheme } from '../store/themeStore';

export function useResolvedTheme(): ResolvedTheme {
  const mode = useThemeStore((state) => state.mode);
  const systemColorScheme = useSystemColorScheme();

  if (mode === 'system') {
    return systemColorScheme === 'dark' ? 'dark' : 'light';
  }

  return mode;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const resolvedTheme = useResolvedTheme();
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(resolvedTheme);
  }, [resolvedTheme, setColorScheme]);

  return <>{children}</>;
}
