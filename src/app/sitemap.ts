// src/app/sitemap.ts
import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://skyinterview.vercel.app'

  return [
    // 1. Landing Page (Most Important)
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    // 2. Aviation Knowledge Module (High SEO Value)
    {
      url: `${baseUrl}/aviation`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // 3. Airline Knowledge (Specific to Ethiopian Airlines)
    {
      url: `${baseUrl}/airline`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // 4. Interview Simulator (Landing page for the feature)
    {
      url: `${baseUrl}/interview`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    // 5. Group Discussion (Landing page for the feature)
    {
      url: `${baseUrl}/discussion`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    // 6. Login/Signup (Lower priority for SEO)
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]
}