import type { MetadataRoute } from 'next';

const BASE_URL = 'https://nicegoldhand.com';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, lastModified: '2026-06-16', changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/company`, lastModified: '2026-06-16', changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/review`, lastModified: '2026-06-16', changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/price`, lastModified: '2026-06-16', changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/voucher`, lastModified: '2026-06-16', changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/event`, lastModified: '2026-06-16', changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/franchisee`, lastModified: '2026-06-16', changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/rental`, lastModified: '2026-06-16', changeFrequency: 'monthly', priority: 0.5 },
  ];
}
