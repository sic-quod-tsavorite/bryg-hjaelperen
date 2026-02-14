import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemeToggle } from '../../src/components/common/ThemeToggle';
import { useResolvedTheme } from '../../src/components/ThemeProvider';

export default function TabsLayout() {
  const resolvedTheme = useResolvedTheme();
  const isDark = resolvedTheme === 'dark';
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? '#262626' : '#fafafa',
        },
        headerTintColor: isDark ? '#fafafa' : '#171717',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        headerShadowVisible: false,
        headerRight: () => <ThemeToggle />,
        headerRightContainerStyle: {
          paddingRight: 16,
        },
        tabBarActiveTintColor: isDark ? '#4ade80' : '#1a7f45',
        tabBarInactiveTintColor: isDark ? '#737373' : '#a3a3a3',
        tabBarStyle: {
          backgroundColor: isDark ? '#262626' : '#ffffff',
          borderTopColor: isDark ? '#404040' : '#e5e5e5',
          borderTopWidth: 1,
          paddingTop: 6,
          paddingBottom: 6 + insets.bottom,
          height: 80 + insets.bottom,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Opsætning',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flask-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: 'Log',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
