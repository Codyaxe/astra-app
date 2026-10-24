// Theme tokens: Colors and Fonts for ASTRA Mobile-First Web App
export const theme = {
  colors: {
    primary: '#6366f1',
    primaryHover: '#4f46e5',
    background: '#090d16',
    surface: '#131b2e',
    surfaceBorder: '#23304c',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    statusPaid: '#10b981',
    statusUnpaid: '#ef4444',
    accentGold: '#f59e0b',
  },
  fonts: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
    heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  radii: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
} as const;
