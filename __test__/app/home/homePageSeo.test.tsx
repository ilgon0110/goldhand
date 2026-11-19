import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { isValidElement } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { renderToHtml } from '@/__test__/utils/renderToHtml';

vi.mock('@/app/api/review/route', () => ({
  GET: vi.fn(async () => Response.json({ message: '성공', reviewData: [], response: 'ok', totalDataLength: 0 })),
}));
vi.mock('@/app/api/price/route', () => ({ GET: vi.fn(async () => Response.json({ prices: {} })) }));
vi.mock('@/src/feature/auth', () => ({
  OAuthSuccessHandler: () => <div>OAUTH_SUCCESS_HANDLER_SENTINEL</div>,
}));
vi.mock('@/src/feature/home', async () => ({
  ...(await vi.importActual('@/src/feature/home/reviewCarousel/api/useReviewCarouselQuery')),
  ...(await vi.importActual('@/src/feature/home/ui/homeContainer')),
  ...(await vi.importActual('@/src/feature/home/ui/HomeSectionSkeletons')),
  FranchiseeSheetList: () => <div>FRANCHISEE_SENTINEL</div>,
  ImageSlideList: () => <div>IMAGE_SLIDE_SENTINEL</div>,
  MainTitle: () => <h1>HOME_TITLE_SENTINEL</h1>,
  PriceList: () => <div>PRICE_SENTINEL</div>,
  ReviewCarousel: () => <div>REVIEW_CAROUSEL_SENTINEL</div>,
  SponsorList: () => <div>SPONSOR_SENTINEL</div>,
}));
vi.mock('@/src/widgets/event/ui/EventModal', () => ({
  EventModal: () => <div>EVENT_MODAL_SENTINEL</div>,
}));

import Home from '@/app/page';

describe('home page SEO rendering boundary', () => {
  it('server-renders the home content without depending on search parameters', async () => {
    const html = await renderToHtml(<QueryClientProvider client={new QueryClient()}>{Home()}</QueryClientProvider>);

    expect(html).toContain('HOME_TITLE_SENTINEL');
    expect(html).toContain('REVIEW_CAROUSEL_SENTINEL');
    expect(html).toContain('OAUTH_SUCCESS_HANDLER_SENTINEL');
    expect(html).toContain('EVENT_MODAL_SENTINEL');
  });

  it('does not wait for the review/price requests before rendering (they are streamed)', async () => {
    const { GET } = await import('@/app/api/review/route');
    vi.mocked(GET).mockImplementationOnce(() => new Promise(() => {}));

    // async로 돌아가면 Promise를 반환해 실패한다. 응답을 기다리지 않고 바로 element를 반환해야 한다.
    expect(isValidElement(Home())).toBe(true);
  });
});
