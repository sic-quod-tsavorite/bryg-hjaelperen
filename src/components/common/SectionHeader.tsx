import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

import { useResolvedTheme } from '../ThemeProvider';

interface SectionHeaderProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export function SectionHeader({ title, icon }: SectionHeaderProps) {
  const resolvedTheme = useResolvedTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <View className="mb-4 mt-8 flex-row items-center">
      <View className="mr-3 h-8 w-8 items-center justify-center rounded-lg bg-primary-subtle dark:bg-surface-dark">
        <Ionicons
          name={icon}
          size={18}
          color={isDark ? '#4ade80' : '#1a7f45'}
        />
      </View>
      <Text className="text-h3 font-semibold text-text-primary dark:text-text-primary-dark">
        {title}
      </Text>
    </View>
  );
}
