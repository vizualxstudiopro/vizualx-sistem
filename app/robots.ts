import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/dashboard', '/clients', '/invoices', '/domains', '/projects', '/social', '/assets', '/analytics', '/settings', '/web-settings', '/portfolio-manager', '/te-dhenat', '/board', '/login', '/reset-password'],
      },
    ],
    sitemap: 'https://www.vizualx.online/sitemap.xml',
  }
}
