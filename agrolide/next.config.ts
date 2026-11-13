import type { NextConfig } from "next";
import withBundleAnalyzer from '@next/bundle-analyzer';

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

// PWA : le service worker est écrit à la main (public/sw.js) et enregistré par src/components/pwa/EnregistrementSW.tsx.
// L'ancien plugin @ducanh2912/next-pwa ne fonctionne qu'avec webpack : avec Turbopack (build par défaut de Next 16)
// il ne produisait aucun service worker en production.

// CSP en mode « report-only » : elle signale (console du navigateur) sans rien bloquer.
// Après une période d'observation sans alerte, renommer l'en-tête en Content-Security-Policy.
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).host
  : '*.supabase.co'
const cspReportOnly = [
  "default-src 'self'",
  // Next injecte des scripts/styles inline (pas de nonce) ; Google Analytics (consentement cookies)
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.googletagmanager.com https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://img.youtube.com https://images.unsplash.com https://*.r2.dev https://*.r2.cloudflarestorage.com https://*.supabase.co https://*.google-analytics.com https://*.googletagmanager.com",
  "font-src 'self' data:",
  `connect-src 'self' https://${supabaseHost} wss://${supabaseHost} https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.ingest.sentry.io https://*.ingest.de.sentry.io https://challenges.cloudflare.com https://*.r2.cloudflarestorage.com`,
  "frame-src https://challenges.cloudflare.com https://www.youtube.com https://www.youtube-nocookie.com",
  "worker-src 'self' blob:",
  "media-src 'self' https://*.r2.dev https://*.r2.cloudflarestorage.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join('; ')

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // 75 par défaut ; 90 pour la photo de l'en-tête d'accueil (grande, au premier plan, où la compression se voit).
    qualities: [75, 80, 90],
    // Les images optimisées restent un jour en cache (60 s par défaut) : moins de recalculs côté serveur,
    // et le navigateur n'a plus à tout revérifier à chaque visite. Une image remplacée sous le même nom
    // met donc jusqu'à un jour à changer : pour l'imposer, la renommer.
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // Configuration R2 (A adapter avec l'URL exacte)
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/**',
      },
    ],
  },
  // Les anciennes couvertures PNG (chemins stockés en base) sont servies en WebP.
  async rewrites() {
    return [
      { source: '/images/formations/:name.png', destination: '/images/formations/:name.webp' },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()' },
          { key: 'Content-Security-Policy-Report-Only', value: cspReportOnly },
        ],
      },
      // Le service worker et le manifeste ne doivent jamais rester en cache : une mise à jour doit être vue tout de suite.
      { source: '/sw.js', headers: [{ key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' }, { key: 'Service-Worker-Allowed', value: '/' }] },
      { source: '/manifest.json', headers: [{ key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }] },
      // Images du dossier public (logo, couvertures, photos d'équipe…) : Vercel les sert par défaut avec
      // « max-age=0 », donc le navigateur les redemande à chaque visite. Ici : un jour, puis une semaine
      // de rafraîchissement en arrière-plan. Ces fichiers gardent leur nom : pas de durée « à vie ».
      // Les fichiers versionnés de /_next/ (JS, CSS, polices) ont déjà leur propre cache d'un an.
      {
        source: '/((?!_next/).*\\.(?:svg|jpg|jpeg|png|webp|avif|ico))',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }],
      },
    ]
  },
  turbopack: {},
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
};

export default withAnalyzer(nextConfig);
