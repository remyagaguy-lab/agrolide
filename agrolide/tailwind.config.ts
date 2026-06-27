import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        vert: {
          profond:    '#1b5e38',
          principal:  '#50a853',
          olive:      '#878e2c',
          clair:      '#f0f7f0',
          pale:       '#e8f5e9',
        },
        orange: {
          accent: '#f99e1d',
          dore:   '#fcb726',
        },
        dark: {
          bg:      '#0f1f17',
          surface: '#1a2e22',
          border:  'rgba(255,255,255,0.1)',
        },
        gris: {
          fond:   '#f8f8f6',
          border: '#e8e8e4',
          light:  '#f0f0ee',
          muted:  '#9a9a96',
          texte:  '#4a4a4a',
          titre:  '#1a1a1a',
        },
      },
      fontFamily: {
        urbanist:    ['var(--font-urbanist)', 'system-ui', 'sans-serif'],
        baskerville: ['var(--font-baskerville)', 'Georgia', 'serif'],
      },
      fontSize: {
        'display': ['clamp(36px, 5vw, 56px)', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '900' }],
        'h1':      ['clamp(28px, 4vw, 44px)', { lineHeight: '1.15', letterSpacing: '-0.025em', fontWeight: '800' }],
        'h2':      ['clamp(22px, 3vw, 34px)', { lineHeight: '1.2',  letterSpacing: '-0.02em',  fontWeight: '800' }],
        'h3':      ['clamp(16px, 2vw, 20px)', { lineHeight: '1.3',  fontWeight: '700' }],
      },
      borderRadius: {
        'card': '12px',
        'btn':  '8px',
        'badge': '5px',
        'icon': '10px',
      },
      spacing: {
        'section-sm': '64px',
        'section':    '80px',
        'section-lg': '96px',
      },
      maxWidth: {
        'container': '1100px',
        'prose':     '660px',
      },
      boxShadow: {
        'card-hover': '0 2px 12px rgba(0,0,0,0.06)',
        'focus-green': '0 0 0 3px rgba(80,168,83,0.12)',
        'focus-red': '0 0 0 3px rgba(211,47,47,0.10)',
      },
      animation: {
        'counter': 'countUp 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },

    },
  },
  plugins: [],
}

export default config
