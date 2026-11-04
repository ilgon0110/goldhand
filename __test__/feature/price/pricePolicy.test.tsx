import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';

import PricePage from '@/app/price/page';

import { PRICES } from '../../fixtures/prices';

const getPriceData = vi.hoisted(() => vi.fn());

vi.mock('@/src/shared/lib/server', () => ({ checkAdminAuth: async () => ({ ok: false }) }));
vi.mock('@/src/entities/price/api/getPriceData', () => ({ getPriceData }));
vi.mock('@/src/shared/ui/FadeInWhenVisible', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const renderPricePage = async () =>
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { staleTime: Infinity, retry: false } } })}
    >
      {await PricePage()}
    </QueryClientProvider>,
  );

const otherExtras = () => screen.getByRole('table', { name: '기타 추가비용: 출퇴근형 및 입주형 비교' });

beforeEach(() => {
  getPriceData.mockResolvedValue({ prices: PRICES, revision: 0 });
});

it('요금 조회 API가 실패하면 페이지를 렌더링하지 않고 에러를 던진다', async () => {
  getPriceData.mockRejectedValue(new Error('요금을 불러오지 못했습니다.'));

  await expect(PricePage()).rejects.toThrow('요금을 불러오지 못했습니다.');
});

describe('가격 정책', () => {
  it('기타 추가비용에서 출퇴근형·입주형 금액이 같은 시간연장 행은 한 칸으로 병합한다', async () => {
    await renderPricePage();

    const row = within(otherExtras()).getByRole('row', { name: /시간연장/ });
    expect(within(row).getByRole('cell')).toHaveAttribute('colspan', '2');
  });

  it('시간연장 항목명을 바꿔도 동일 금액 셀은 병합된다', async () => {
    const prices = structuredClone(PRICES);
    prices.otherExtraFeeList[1] = { id: 'overtime', label: '추가 돌봄', values: [30000, 30000] };
    getPriceData.mockResolvedValue({ prices, revision: 0 });

    await renderPricePage();

    const row = within(otherExtras()).getByRole('row', { name: /추가 돌봄/ });
    expect(within(row).getByRole('cell')).toHaveAttribute('colspan', '2');
  });

  it('추가 요금 영역을 부가서비스로 안내한다', async () => {
    await renderPricePage();

    expect(screen.getByRole('heading', { level: 2, name: '부가서비스' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '부가서비스' })).toHaveAttribute('href', '#extra');
    expect(screen.queryByText('그 외 요금 안내')).not.toBeInTheDocument();
  });
});
