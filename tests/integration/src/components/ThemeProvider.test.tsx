// Integration test for ThemeProvider with actual Zustand store

import { render, act } from '@testing-library/react';

import { ThemeProvider } from '../../../../src/components/ThemeProvider';
import { useThemeStore } from '../../../../src/store/themeStore';

// Mock nativewind
const mockSetColorScheme = jest.fn();
jest.mock('nativewind', () => ({
  useColorScheme: () => ({ setColorScheme: mockSetColorScheme }),
}));

// Mock react-native useColorScheme
jest.mock('react-native', () => ({
  useColorScheme: () => 'light',
}));

describe('ThemeProvider integration with themeStore', () => {
  beforeEach(() => {
    mockSetColorScheme.mockClear();
    // Reset store to default state
    useThemeStore.setState({ mode: 'system' });
  });

  it('syncs color scheme when store mode changes', () => {
    render(
      <ThemeProvider>
        <div data-testid="content">Content</div>
      </ThemeProvider>
    );

    // Initial call with system -> light (mocked system is 'light')
    expect(mockSetColorScheme).toHaveBeenCalledWith('light');
    mockSetColorScheme.mockClear();

    // Change store to dark mode
    act(() => {
      useThemeStore.getState().setMode('dark');
    });

    expect(mockSetColorScheme).toHaveBeenCalledWith('dark');
  });

  it('toggles between light and dark', () => {
    useThemeStore.setState({ mode: 'light' });

    render(
      <ThemeProvider>
        <div>Content</div>
      </ThemeProvider>
    );

    expect(mockSetColorScheme).toHaveBeenLastCalledWith('light');

    act(() => {
      useThemeStore.getState().toggleTheme();
    });

    expect(mockSetColorScheme).toHaveBeenLastCalledWith('dark');
  });
});
