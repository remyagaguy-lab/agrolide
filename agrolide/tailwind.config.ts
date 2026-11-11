import type { Config } from 'tailwindcss'

/**
 * Les couleurs, formes, ombres et typographies viennent des jetons (src/styles/tokens/theme.css).
 *
 * Reste ci-dessous UNIQUEMENT la palette héritée encore employée par les trois fichiers en attente de
 * migration (src/app/(public)/page.tsx, src/app/(public)/formations/page.tsx,
 * src/components/modules/evenements/EventCard.tsx). À supprimer avec eux : voir Design-System.md §10.
 * Le garde-fou `npm run ds:check` interdit de l'utiliser ailleurs.
 */
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // HÉRITÉ — à supprimer
        vert: {
          profond: '#1b5e38',
          principal: '#50a853',
          clair: '#f0f7f0',
          pale: '#e8f5e9',
        },
        primary: {
          50: '#f0fdf4',
          500: '#50a853',
          600: '#16a34a',
          700: '#15803d',
        },
        orange: {
          accent: '#f99e1d',
        },
        gris: {
          fond: '#f8f8f6',
          border: '#e8e8e4',
          light: '#f0f0ee',
          muted: '#757571',
          texte: '#4a4a4a',
          titre: '#1a1a1a',
        },
      },
      fontFamily: {
        urbanist: ['var(--font-urbanist)', 'system-ui', 'sans-serif'],
        baskerville: ['var(--font-baskerville)', 'Georgia', 'serif'],
      },
      spacing: {
        'section-lg': '96px', // HÉRITÉ (page d'accueil)
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
