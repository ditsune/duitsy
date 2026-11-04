/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        hand: ['var(--font-caveat)', 'cursive'],
        sans: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      colors: {
        paper: 'var(--paper)',
        'paper-2': 'var(--paper-2)',
        'paper-3': 'var(--paper-3)',
        line: 'var(--line)',
        'line-strong': 'var(--line-strong)',
        'line-soft': 'var(--line-soft)',
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        'ink-3': 'var(--ink-3)',
        accent: 'var(--accent)',
        'accent-ink': 'var(--accent-ink)',
        'accent-soft': 'var(--accent-soft)',
        pos: 'var(--pos)',
        'pos-soft': 'var(--pos-soft)',
        neg: 'var(--neg)',
        'neg-soft': 'var(--neg-soft)',
        focus: 'var(--focus)',
      },
      borderRadius: {
        chip: '6px',
        field: '10px',
        card: '14px',
        sheet: '20px',
      },
      maxWidth: {
        app: '480px',
      },
    },
  },
  plugins: [],
};
