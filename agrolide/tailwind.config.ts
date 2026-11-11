import type { Config } from 'tailwindcss'

/** Couleurs, formes, ombres et typographies : voir les jetons (src/styles/tokens/theme.css). */
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        urbanist: ['var(--font-urbanist)', 'system-ui', 'sans-serif'],
        baskerville: ['var(--font-baskerville)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
