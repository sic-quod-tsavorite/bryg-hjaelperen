/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary colors (Forest Green)
        primary: {
          DEFAULT: '#1a7f45',
          dark: '#166534',
          light: '#4ade80',
          subtle: '#dcfce7',
        },
        // Accent colors for CTAs
        accent: {
          DEFAULT: '#166534',
          hover: '#14532d',
        },
        // Neutral colors - Light mode
        background: {
          DEFAULT: '#f5f5f5',
          dark: '#171717',
        },
        surface: {
          DEFAULT: '#fafafa',
          elevated: '#ffffff',
          dark: '#262626',
          'elevated-dark': '#303030',
        },
        border: {
          DEFAULT: '#e5e5e5',
          subtle: '#f0f0f0',
          dark: '#404040',
          'subtle-dark': '#333333',
        },
        // Text colors
        text: {
          primary: '#171717',
          secondary: '#525252',
          tertiary: '#a3a3a3',
          inverse: '#fafafa',
          'primary-dark': '#fafafa',
          'secondary-dark': '#a3a3a3',
          'tertiary-dark': '#737373',
        },
        // Status colors
        error: {
          DEFAULT: '#dc2626',
          bg: '#fef2f2',
          'bg-dark': '#450a0a',
        },
        warning: {
          DEFAULT: '#d97706',
          bg: '#fffbeb',
        },
        success: {
          DEFAULT: '#1a7f45',
          bg: '#dcfce7',
        },
        info: {
          DEFAULT: '#2563eb',
          bg: '#eff6ff',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        h1: ['28px', { lineHeight: '1.2', fontWeight: '600' }],
        h2: ['22px', { lineHeight: '1.3', fontWeight: '600' }],
        h3: ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        body: ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        caption: ['12px', { lineHeight: '1.4', fontWeight: '400' }],
        button: ['16px', { lineHeight: '1', fontWeight: '600' }],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
