import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pigeons.studio';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/*/admin',
          '/*/login',
          '/*/profile',
          '/*/bios',
          '/*/events/leave',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
