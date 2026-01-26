import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import {
  ThemeProvider,
  useResolvedTheme,
} from '../src/components/ThemeProvider';

function RootLayoutContent() {
  const resolvedTheme = useResolvedTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: isDark ? '#262626' : '#fafafa',
          },
          headerTintColor: isDark ? '#4ade80' : '#1a7f45',
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: isDark ? '#171717' : '#f5f5f5',
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="modal/ingredient-info"
          options={{
            title: 'Ingrediensinfo',
            presentation: 'modal',
            headerStyle: {
              backgroundColor: isDark ? '#303030' : '#ffffff',
            },
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}
