import { startupImages } from '@/lib/pwa-splash'
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { AuthProvider } from "@/lib/auth/client";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { EnregistrementSW } from "@/components/pwa/EnregistrementSW";
import { InvitationInstallation } from "@/components/pwa/InvitationInstallation";
import { ToastProvider } from "@/components/ui/Toast";
import { darkColors, lightColors } from "@/styles/tokens";
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
  // Application installable : manifeste, et titre sous l'icône d'écran d'accueil sur iOS (l'icône vient de apple-icon.png).
  manifest: '/manifest.json',
  appleWebApp: { capable: true, title: 'agrolide', statusBarStyle: 'default', startupImage: startupImages },
  formatDetection: { telephone: false },
};

// Couleur de la barre du navigateur / de l'application installée : surface claire ou sombre des jetons de marque.
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: lightColors.surface },
    { media: '(prefers-color-scheme: dark)', color: darkColors.surface },
  ],
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
          <ToastProvider>
            {children}
          </ToastProvider>
          <CookieBanner />
          <EnregistrementSW />
          <InvitationInstallation />
          {/* Vitesse réelle des visiteurs (Core Web Vitals), sans cookie ni donnée personnelle. Résultats : Vercel > Speed Insights. */}
          <SpeedInsights />
        </body>
      </html>
    </AuthProvider>
  );
}
