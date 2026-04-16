/**
 * Dushi Rentals Curaçao — Design Tokens
 * Premium, cinematic, warm island luxury
 */

const theme = {
  colors: {
    // Base — default page (light sand; matches :root in index.css)
    bgPage: '#faf6f1',
    bg: '#faf6f1',
    bgElevated: '#f3ede6',
    bgCard: 'rgba(255, 255, 255, 0.55)',
    bgGlass: 'rgba(255, 255, 255, 0.58)',
    bgGlassHover: 'rgba(255, 255, 255, 0.88)',
    bgGlassStrong: 'rgba(255, 255, 255, 0.72)',
    surface: '#ebe4dc',
    surfaceLight: '#f5efe8',

    // Text
    textPrimary: '#2c241f',
    textSecondary: 'rgba(44, 36, 31, 0.72)',
    textMuted: 'rgba(44, 36, 31, 0.48)',

    // Warm accents
    accent: '#d4845a',
    accentLight: '#e8a87c',
    accentDark: '#b86b3f',
    accentGlow: 'rgba(212, 132, 90, 0.2)',

    // Functional
    white: '#ffffff',
    border: 'rgba(44, 36, 31, 0.08)',
    borderLight: 'rgba(44, 36, 31, 0.12)',
    borderAccent: 'rgba(212, 132, 90, 0.35)',
    overlay: 'rgba(44, 36, 31, 0.45)',

    // Status
    success: '#4ade80',
    star: '#e3a008',
  },

  fonts: {
    heading: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },

  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
    '7xl': '4.5rem',   // 72px
  },

  spacing: {
    1: '0.25rem',  // 4px
    2: '0.5rem',   // 8px
    3: '0.75rem',  // 12px
    4: '1rem',     // 16px
    5: '1.25rem',  // 20px
    6: '1.5rem',   // 24px
    8: '2rem',     // 32px
    10: '2.5rem',  // 40px
    12: '3rem',    // 48px
    16: '4rem',    // 64px
    20: '5rem',    // 80px
    24: '6rem',    // 96px
    32: '8rem',    // 128px
  },

  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },

  shadows: {
    glass: '0 8px 32px rgba(44, 36, 31, 0.07)',
    glow: '0 0 60px rgba(212, 132, 90, 0.18)',
    card: '0 4px 24px rgba(44, 36, 31, 0.07)',
    cardHover: '0 12px 40px rgba(44, 36, 31, 0.1)',
    button: '0 4px 16px rgba(212, 132, 90, 0.35)',
  },

  transitions: {
    fast: '150ms ease',
    base: '250ms ease',
    slow: '400ms ease',
    spring: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },

  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  zIndex: {
    base: 1,
    card: 10,
    header: 100,
    overlay: 200,
    modal: 300,
  },
};

export default theme;
