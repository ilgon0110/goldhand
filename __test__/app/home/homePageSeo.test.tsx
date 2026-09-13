import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/src/entities/review', () => ({
  getReviewListData: vi.fn(async () => ({ message: '성공', reviewData: [], response: 'ok', totalDataLength: 0 })),
}));
vi.mock('@/src/feature/auth', () => ({
  OAuthSuccessHandler: () => <div>OAUTH_SUCCESS_HANDLER_SENTINEL</div>,
}));
vi.mock('@/src/feature/home', () => ({
  FaqSection: () => <div>FAQ_SENTINEL</div>,
  FranchiseeSheetList: () => <div>FRANCHISEE_SENTINEL</div>,
  ImageSlideList: () => <div>IMAGE_SLIDE_SENTINEL</div>,
  MainTitle: () => <h1>HOME_TITLE_SENTINEL</h1>,
  PriceList: () => <div>PRICE_SENTINEL</div>,
  SponsorList: () => <div>SPONSOR_SENTINEL</div>,
}));
vi.mock('@/src/feature/home/reviewCarousel/ui/ReviewCarousel', () => ({
  ReviewCarousel: () => <div>REVIEW_CAROUSEL_SENTINEL</div>,
}));
vi.mock('@/src/widgets/event/ui/EventModal', () => ({
  EventModal: () => <div>EVENT_MODAL_SENTINEL</div>,
}));

import Home from '@/app/page';

describe('home page SEO rendering boundary', () => {
  it('server-renders the home content without depending on search parameters', async () => {
    const element = await Home();
    const html = renderToStaticMarkup(
      <QueryClientProvider client={new QueryClient()}>{element}</QueryClientProvider>,
    );

    expect(html).toContain('HOME_TITLE_SENTINEL');
    expect(html).toContain('FAQ_SENTINEL');
    expect(html).toContain('REVIEW_CAROUSEL_SENTINEL');
    expect(html).toContain('OAUTH_SUCCESS_HANDLER_SENTINEL');
    expect(html).toContain('EVENT_MODAL_SENTINEL');
  });
});
