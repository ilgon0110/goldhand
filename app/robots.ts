import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/manager/about', '/manager/work', '/reservation', '/reservation/apply'],
      disallow: ['/api/', '/manager/', '/mypage/', '/reservation/list/', '/reservation/edit/', '/signup/', '/login/'],
    },
    sitemap: 'https://nicegoldhand.com/sitemap.xml',
  };
}
