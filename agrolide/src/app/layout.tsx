import type { Metadata } from "next";
import { Urbanist, Libre_Baskerville } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const urbanist = Urbanist({
  weight: ["600", "700"],
  subsets: ["latin"],
  variable: "--font-urbanist",
});

const baskerville = Libre_Baskerville({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-baskerville",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://agrolide.org'),
  title: { default: 'agrolide — Réseau agricole africain', template: '%s | agrolide' },
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
    <html
      lang="fr"
      className={`${urbanist.variable} ${baskerville.variable} h-full antialiased`}
    >
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-KM57804JDG`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KM57804JDG', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
