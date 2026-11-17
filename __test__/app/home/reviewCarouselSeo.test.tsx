import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const reviewFixture = {
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

vi.mock('@/app/api/review/route', () => ({
  GET: vi.fn(async () =>
    Response.json({
      message: '성공',
      response: 'ok',
      reviewData: [reviewFixture],
      totalDataLength: 1,
    }),
  ),
}));
vi.mock('@/app/api/price/route', () => ({ GET: vi.fn(async () => Response.json({}, { status: 500 })) }));
vi.mock('@/src/feature/auth', () => ({ OAuthSuccessHandler: () => null }));
vi.mock('@/src/feature/home', async () => ({
  ...(await vi.importActual('@/src/feature/home/reviewCarousel/api/useReviewCarouselQuery')),
  ...(await vi.importActual('@/src/feature/home/reviewCarousel/ui/ReviewCarousel')),
  ...(await vi.importActual('@/src/feature/home/ui/homeContainer')),
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
    const html = renderToStaticMarkup(<QueryClientProvider client={new QueryClient()}>{element}</QueryClientProvider>);

    expect(html).toContain('너무 만족스러운 산후관리였어요');
    expect(html).toContain('김OO');
    expect(html).toContain('산모와 아기 모두 편안하게 잘 돌봐주셔서 감사했습니다.');
  });
});
