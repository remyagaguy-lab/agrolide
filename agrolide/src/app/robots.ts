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
          '/callback',
          '/_next/',
        ],
      }
    ],
    sitemap: 'https://agrolide.org/sitemap.xml',
  }
}
