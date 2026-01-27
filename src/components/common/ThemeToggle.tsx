import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

import { useThemeStore } from '../../store/themeStore';
import { useResolvedTheme } from '../ThemeProvider';

export function ThemeToggle() {
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const resolvedTheme = useResolvedTheme();

  const isDark = resolvedTheme === 'dark';

  return (
    <Pressable
      onPress={toggleTheme}
      className="h-10 w-10 items-center justify-center rounded-full bg-primary-subtle dark:bg-surface-dark"
      accessibilityLabel={
        isDark ? 'Skift til lyst tema' : 'Skift til mørkt tema'
      }
      accessibilityRole="button"
    >
      <Ionicons
        name={isDark ? 'sunny-outline' : 'moon-outline'}
        size={22}
        color={isDark ? '#4ade80' : '#1a7f45'}
      />
    </Pressable>
  );
}
