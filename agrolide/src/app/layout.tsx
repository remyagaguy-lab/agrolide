import type { Metadata } from "next";
import localFont from "next/font/local";
import { AuthProvider } from "@/lib/auth/client";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

// Polices embarquées (fichiers dans src/app/fonts) : plus de dépendance à Google Fonts.
const urbanist = localFont({
  src: './fonts/Urbanist-latin.woff2',
  weight: '100 900',
  style: 'normal',
  variable: '--font-urbanist',
  display: 'swap',
  preload: true,
})

const baskerville = localFont({
  src: [
    { path: './fonts/LibreBaskerville-latin.woff2', weight: '400 700', style: 'normal' },
    { path: './fonts/LibreBaskerville-latin-italic.woff2', weight: '400 700', style: 'italic' },
  ],
  variable: '--font-baskerville',
  display: 'swap',
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL('https://agrolide.org'),
  title: { 
    default: 'agrolide | Le Premier Réseau Agricole d\'Afrique', 
    template: '%s | Réseau Agricole agrolide' 
  },
  description: 'Fédérer la chaîne agricole africaine pour conquérir la souveraineté alimentaire. Annuaire, bibliothèque, formations et accompagnement pour agronomes, chercheurs et agripreneurs africains.',
  openGraph: { type: 'website', locale: 'fr_FR', siteName: 'agrolide', images: [{ url: '/og-image.jpg', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "agrolide",
    "alternateName": ["Réseau Agricole agrolide", "Réseau Agricole"],
    "url": "https://agrolide.org",
    "logo": "https://agrolide.org/logo.png",
    "description": "agrolide est le premier réseau agricole connectant professionnels, ingénieurs agronomes, chercheurs et agripreneurs en Afrique pour bâtir la souveraineté alimentaire.",
    "sameAs": [
      "https://www.linkedin.com/company/agrolide"
    ]
  }

  return (
    <AuthProvider>
      <html
        lang="fr"
        className={`${urbanist.variable} ${baskerville.variable} h-full antialiased`}
        data-theme="light"
        suppressHydrationWarning
      >
        <head>
          <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </head>
        <body className="min-h-full flex flex-col">
          {children}
          <CookieBanner />
        </body>
      </html>
    </AuthProvider>
  );
}
