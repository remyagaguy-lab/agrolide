import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";
import withBundleAnalyzer from '@next/bundle-analyzer';

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

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
    ]
  },
  turbopack: {},
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
};

export default withAnalyzer(withPWA(nextConfig));
