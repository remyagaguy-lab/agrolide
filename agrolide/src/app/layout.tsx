import type { Metadata } from "next";
import { Urbanist, Libre_Baskerville } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { CookieBanner } from "@/components/layout/CookieBanner";
import "./globals.css";

const urbanist = Urbanist({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-urbanist',
  display: 'swap',
  preload: true,
})

const baskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-baskerville',
  display: 'swap',
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL('https://agrolide.org'),
  title: { default: 'Accueil | Réseau agrolide', template: '%s | Réseau agrolide' },
  description: 'Fédérer la chaîne agricole africaine pour conquérir la souveraineté alimentaire. Annuaire, bibliothèque, formations et accompagnement pour agronomes, chercheurs et agripreneurs africains.',
  openGraph: { type: 'website', locale: 'fr_FR', siteName: 'agrolide', images: [{ url: '/og-image.jpg', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="fr"
        className={`${urbanist.variable} ${baskerville.variable} h-full antialiased`}
      >
        <head>
          {/* Scripts analytiques gérés par CookieBanner */}
        </head>
        <body className="min-h-full flex flex-col">
          {children}
          <CookieBanner />
        </body>
      </html>
    </ClerkProvider>
  );
}
