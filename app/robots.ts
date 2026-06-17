import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/manager/', '/mypage/', '/reservation/', '/signup/', '/login/'],
    },
    sitemap: 'https://nicegoldhand.com/sitemap.xml',
  };
}
