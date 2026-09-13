import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import type * as ReviewEntities from '@/src/entities/review';
import type * as ReviewSearchParams from '@/src/shared/lib/nuqs/searchParams';

const reviewFixture = {
  comments: null,
  createdAt: { nanoseconds: 0, seconds: 0 },
  franchisee: '수원점',
  htmlString: '<p>산모와 아기 모두 편안하게 잘 돌봐주셔서 감사했습니다.</p>',
  id: 'review-1',
  isAuthorAdmin: false,
  isPinned: false,
  name: '김OO',
  phoneHash: null,
  phoneNumber: null,
  pinnedAt: null,
  title: '너무 만족스러운 산후관리였어요',
  updatedAt: { nanoseconds: 0, seconds: 0 },
  userId: null,
};

vi.mock('@/src/entities/review', async importOriginal => {
  const actual = await importOriginal<typeof ReviewEntities>();

  return {
    ...actual,
    getReviewListData: vi.fn(async () => ({
      message: '성공',
      response: 'ok',
      reviewData: [reviewFixture],
      totalDataLength: 1,
    })),
  };
});
vi.mock('@/src/shared/api/getUserData', () => ({
  getUserData: vi.fn(async () => ({ isLinked: false, message: '성공', response: 'ng', userData: null })),
}));
vi.mock('@/src/shared/lib/nuqs/searchParams', async importOriginal => {
  const actual = await importOriginal<typeof ReviewSearchParams>();

  return {
    ...actual,
    loadReviewParams: vi.fn(async () => ({ franchisee: '전체', page: 1 })),
  };
});
vi.mock('@/src/shared/hooks/useMediaQuery', () => ({ useMediaQuery: () => true }));
vi.mock('@/src/shared/utils/verifyViewId', () => ({ sendViewLog: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn(), replace: vi.fn() }) }));
vi.mock('nuqs', async () => {
  const actual = await vi.importActual('nuqs');
  return { ...actual, useQueryStates: () => [{ franchisee: '전체', page: 1 }, vi.fn()] };
});

import ReviewPageRoute from '@/app/review/page';

describe('review list card SEO rendering', () => {
  it('server-renders real review title/author/content instead of a loading skeleton', async () => {
    const element = await ReviewPageRoute({ searchParams: Promise.resolve({}) });
    const html = renderToStaticMarkup(
      <QueryClientProvider client={new QueryClient()}>{element}</QueryClientProvider>,
    );

    expect(html).toContain('너무 만족스러운 산후관리였어요');
    expect(html).toContain('김OO');
    expect(html).toContain('산모와 아기 모두 편안하게 잘 돌봐주셔서 감사했습니다.');
    expect(html).not.toContain('data-slot="skeleton"');
  });
});
