import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import type * as ReviewEntities from '@/src/entities/review';

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
vi.mock('@/src/feature/auth', () => ({ OAuthSuccessHandler: () => null }));
vi.mock('@/src/feature/home', () => ({
  FaqSection: () => null,
  FranchiseeSheetList: () => null,
  ImageSlideList: () => null,
  MainTitle: () => null,
  PriceList: () => null,
  SponsorList: () => null,
}));
vi.mock('@/src/widgets/event/ui/EventModal', () => ({ EventModal: () => null }));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

import Home from '@/app/page';

describe('home page review carousel SEO rendering', () => {
  it('server-renders real review title, author, and content text (not a loading skeleton)', async () => {
    const element = await Home();
    const html = renderToStaticMarkup(
      <QueryClientProvider client={new QueryClient()}>{element}</QueryClientProvider>,
    );

    expect(html).toContain('너무 만족스러운 산후관리였어요');
    expect(html).toContain('김OO');
    expect(html).toContain('산모와 아기 모두 편안하게 잘 돌봐주셔서 감사했습니다.');
  });
});
