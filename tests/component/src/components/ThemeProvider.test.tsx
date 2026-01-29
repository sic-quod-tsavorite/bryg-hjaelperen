// Component test for ThemeProvider - isolated component behavior

import { render, screen } from '@testing-library/react';

import { ThemeProvider } from '../../../../src/components/ThemeProvider';

// Mock nativewind
const mockSetColorScheme = jest.fn();
jest.mock('nativewind', () => ({
  useColorScheme: () => ({ setColorScheme: mockSetColorScheme }),
}));

// Mock react-native useColorScheme
jest.mock('react-native', () => ({
  useColorScheme: () => 'light',
}));

// Mock the theme store
jest.mock('../../../../src/store/themeStore', () => ({
  useThemeStore: (selector: (state: { mode: string }) => string) =>
    selector({ mode: 'light' }),
}));

describe('ThemeProvider', () => {
  beforeEach(() => {
    mockSetColorScheme.mockClear();
  });

  it('renders children', () => {
    render(
      <ThemeProvider>
        <div data-testid="child">Child content</div>
      </ThemeProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('calls setColorScheme on mount', () => {
    render(
      <ThemeProvider>
        <div>Content</div>
      </ThemeProvider>
    );

    expect(mockSetColorScheme).toHaveBeenCalledWith('light');
  });
});
