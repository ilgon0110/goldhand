import type { MetadataRoute } from 'next';

const BASE_URL = 'https://nicegoldhand.com';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/company`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/manager/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/manager/work`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/price`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/voucher`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/franchisee`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/rental`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/event`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/review`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/reservation`, changeFrequency: 'monthly', priority: 0.7 },
  ];
}
