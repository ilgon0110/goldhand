import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/app/api/event/route', () => ({
  GET: vi.fn(async () => Response.json({ eventData: [], message: '성공', response: 'ok', totalDataLength: 0 })),
}));
vi.mock('@/app/api/user/route', () => ({
  GET: vi.fn(async () => Response.json({ isLinked: false, message: '성공', response: 'ng', userData: null })),
}));
vi.mock('@/src/shared/lib/nuqs/searchParams', () => ({
  loadEventParams: vi.fn(async () => ({ page: 1, status: 'ALL' })),
}));
vi.mock('@/app/event/ui/EventPage', () => ({ EventPage: () => null }));

import EventPageRoute from '@/app/event/page';

describe('event page SEO rendering', () => {
  it('renders the event page primary heading outside its client data boundary', async () => {
    const element = await EventPageRoute({ searchParams: Promise.resolve({}) });
    const html = renderToStaticMarkup(<QueryClientProvider client={new QueryClient()}>{element}</QueryClientProvider>);

    expect(html).toContain('<h1');
    expect(html).toContain('고운황금손 소식');
  });
});
