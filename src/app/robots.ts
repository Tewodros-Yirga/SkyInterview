// src/app/robots.ts
import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Don't waste Google's time trying to crawl private user dashboards
      disallow: ['/notebook/', '/api/'], 
    },
    sitemap: 'https://skyinterview.vercel.app/sitemap.xml',
  }
}
