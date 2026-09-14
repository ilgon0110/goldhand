import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import type * as EventEntities from '@/src/entities/event';
import type * as EventSearchParams from '@/src/shared/lib/nuqs/searchParams';

const eventFixture = {
  comments: null,
  createdAt: { nanoseconds: 0, seconds: 0 },
  htmlString: '<p>9월 한정 산후관리 상담 예약 시 사은품을 드립니다.</p>',
  id: 'event-1',
  isPinned: false,
  name: '관리자',
  pinnedAt: null,
  rowNumber: 1,
  status: 'ONGOING' as const,
  thumbnail: null,
  title: '9월 신규 회원 이벤트',
  updatedAt: { nanoseconds: 0, seconds: 0 },
  userId: null,
};

vi.mock('@/src/entities/event', async importOriginal => {
  const actual = await importOriginal<typeof EventEntities>();

  return {
    ...actual,
    getEventListData: vi.fn(async () => ({
      eventData: [eventFixture],
      message: '성공',
      response: 'ok',
      totalDataLength: 1,
    })),
  };
});
vi.mock('@/src/shared/api/getUserData', () => ({
  getUserData: vi.fn(async () => ({ isLinked: false, message: '성공', response: 'ng', userData: null })),
}));
vi.mock('@/src/shared/lib/nuqs/searchParams', async importOriginal => {
  const actual = await importOriginal<typeof EventSearchParams>();

  return {
    ...actual,
    loadEventParams: vi.fn(async () => ({ page: 1, status: 'ALL' })),
  };
});
vi.mock('@/src/shared/hooks/useMediaQuery', () => ({ useMediaQuery: () => true }));
vi.mock('@/src/shared/utils/verifyViewId', () => ({ sendViewLog: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn(), replace: vi.fn() }) }));
vi.mock('nuqs', async () => {
  const actual = await vi.importActual('nuqs');
  return { ...actual, useQueryStates: () => [{ page: 1, status: 'ALL' }, vi.fn()] };
});

import EventPageRoute from '@/app/event/page';

describe('event list card SEO rendering', () => {
  it('server-renders real event title/content instead of a loading skeleton', async () => {
    const element = await EventPageRoute({ searchParams: Promise.resolve({}) });
    const html = renderToStaticMarkup(
      <QueryClientProvider client={new QueryClient()}>{element}</QueryClientProvider>,
    );

    expect(html).toContain('9월 신규 회원 이벤트');
    expect(html).toContain('9월 한정 산후관리 상담 예약 시 사은품을 드립니다.');
    expect(html).not.toContain('data-slot="skeleton"');
  });
});
