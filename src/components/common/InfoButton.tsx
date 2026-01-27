import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

import { useResolvedTheme } from '../ThemeProvider';

interface InfoButtonProps {
  onPress: () => void;
}

export function InfoButton({ onPress }: InfoButtonProps) {
  const resolvedTheme = useResolvedTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <Pressable
      onPress={onPress}
      className="ml-2 h-8 w-8 items-center justify-center rounded-full bg-primary-subtle active:bg-primary-light dark:bg-surface-dark dark:active:bg-border-dark"
    >
      <Ionicons
        name="information-circle-outline"
        size={20}
        color={isDark ? '#4ade80' : '#1a7f45'}
      />
    </Pressable>
  );
}
