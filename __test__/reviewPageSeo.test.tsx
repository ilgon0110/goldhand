import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/src/entities/review', () => ({
  getReviewListData: vi.fn(async () => ({ message: '성공', response: 'ok', reviewData: [], totalDataLength: 0 })),
}));
vi.mock('@/src/shared/api/getUserData', () => ({
  getUserData: vi.fn(async () => ({ accessToken: null, isLinked: false, message: '성공', response: 'ng', userData: null })),
}));
vi.mock('@/src/shared/lib/nuqs/searchParams', () => ({
  loadReviewParams: vi.fn(async () => ({ franchisee: '전체', page: 1 })),
}));
vi.mock('@/app/review/ui/ReviewPage', () => ({ ReviewPage: () => null }));

import ReviewPageRoute from '@/app/review/page';

describe('review page SEO rendering', () => {
  it('renders the review page primary heading outside its client data boundary', async () => {
    const element = await ReviewPageRoute({ searchParams: Promise.resolve({}) });
    const html = renderToStaticMarkup(<QueryClientProvider client={new QueryClient()}>{element}</QueryClientProvider>);

    expect(html).toContain('<h1');
    expect(html).toContain('이용 후기');
  });
});
