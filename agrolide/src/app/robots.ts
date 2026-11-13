import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/membres/',
          '/auth/',
          '/_next/',
          '/hors-ligne',
        ],
      }
    ],
    sitemap: 'https://agrolide.org/sitemap.xml',
  }
}
