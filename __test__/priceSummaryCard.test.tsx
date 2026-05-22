import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

import { PriceSummaryCard } from '@/src/feature/home/priceList/ui/_PriceSummaryCard';

const mockProps = {
  title: '출퇴근형',
  description: '산후관리사가 산모 집으로 직접 찾아와요',
  priceList: [
    { type: '베이직', week: '1주', price: 850000 },
    { type: '프리미엄', week: '1주', price: 900000 },
  ],
  iconType: 'commute' as const,
};

describe('PriceSummaryCard', () => {
  it('제목과 설명을 렌더링한다', () => {
    render(<PriceSummaryCard {...mockProps} />);
    expect(screen.getByText('출퇴근형')).toBeInTheDocument();
    expect(screen.getByText('산후관리사가 산모 집으로 직접 찾아와요')).toBeInTheDocument();
  });

  it('가격 목록을 렌더링한다', () => {
    render(<PriceSummaryCard {...mockProps} />);
    expect(screen.getByText('850,000원')).toBeInTheDocument();
    expect(screen.getByText('900,000원')).toBeInTheDocument();
  });

  it('카드 클릭 시 /price로 이동한다', async () => {
    render(<PriceSummaryCard {...mockProps} />);
    await userEvent.click(screen.getByRole('button'));
    expect(pushMock).toHaveBeenCalledWith('/price');
  });

  it('"자세히 보기" 버튼이 없다', () => {
    render(<PriceSummaryCard {...mockProps} />);
    expect(screen.queryByText('자세히 보기')).not.toBeInTheDocument();
  });
});
