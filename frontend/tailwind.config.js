import plugin from 'tailwindcss/plugin.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ascend: {
          page: 'var(--as-bg)',
          ink: 'var(--as-text)',
          muted: 'var(--as-muted)',
          tint: 'var(--as-tint)',
          input: 'var(--as-input)',
          panel: 'var(--as-panel)',
          form: 'var(--as-form-bg)',
          line: 'var(--as-border)',
          field: 'var(--as-input-border)',
          selected: 'var(--as-selected)',
          blue: 'var(--as-blue)',
          accent: 'var(--as-accent)',
          error: 'var(--as-error)',
        },
        brand: {
          primary: '#6366f1',
          primaryHover: '#4f46e5',
          background: '#0f172a',
          surface: '#1e293b',
          border: '#334155',
        },
      },
      fontFamily: { astrascend: ['ASTRAscend Urbanist', 'sans-serif'] },
      screens: { 'as-wide': '1200px' },
    },
  },
  plugins: [plugin(({ addVariant }) => {
    addVariant('as-dark', '.astrascend[data-theme="dark"] &');
    addVariant('as-tiny', '@media (max-width: 359px)');
    addVariant('as-label', '@media (min-width: 480px) and (max-width: 1023px)');
    // Keep compact overrides above standard responsive utilities without changing global screens.
    addVariant('as-compact', '@media (min-width: 1024px) and (max-width: 1599px), (min-width: 1024px) and (max-height: 800px) { && }');
  })],
};
