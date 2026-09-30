import { render, screen, within } from '@testing-library/react';

vi.mock('@/src/shared/ui/FadeInWhenVisible', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import PricePage from '@/app/price/page';

describe('가격 정책', () => {
  it('추가 요금 영역을 부가서비스로 안내한다', () => {
    render(<PricePage />);

    expect(screen.getByRole('heading', { level: 2, name: '부가서비스' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '부가서비스' })).toHaveAttribute('href', '#extra');
    expect(screen.queryByText('그 외 요금 안내')).not.toBeInTheDocument();
  });

  it('변경된 큰아이 일당을 방학 구분 없이 안내한다', () => {
    render(<PricePage />);

    const table = screen.getByRole('table', { name: '큰아이 추가비용: 출퇴근형 및 입주형 비교' });
    const scoped = within(table);

    expect(scoped.getByRole('columnheader', { name: '출퇴근형 (일당)' })).toBeInTheDocument();
    expect(scoped.getByRole('columnheader', { name: '입주형 (일당)' })).toBeInTheDocument();
    expect(scoped.getByRole('row', { name: '미취학 20개월 미만 12,000원 20,000원' })).toBeInTheDocument();
    expect(scoped.getByRole('row', { name: '유치원 ~ 초등학생 이상 5,000원 10,000원' })).toBeInTheDocument();
    expect(scoped.queryByText('미취학 20개월 이상')).not.toBeInTheDocument();
    expect(scoped.queryByText(/방학/)).not.toBeInTheDocument();
    expect(scoped.queryByText(/어린이집/)).not.toBeInTheDocument();
  });

  it('변경된 기타 일당을 안내하고 관리사 지정 항목을 제거한다', () => {
    render(<PricePage />);

    const table = screen.getByRole('table', { name: '기타 추가비용: 출퇴근형 및 입주형 비교' });
    const scoped = within(table);

    expect(scoped.getByRole('row', { name: '명절 휴일 추가 70,000원 100,000원' })).toBeInTheDocument();
    expect(scoped.getByRole('row', { name: '쌍둥이 추가(경력자) 5,000원 10,000원' })).toBeInTheDocument();
    expect(scoped.queryByText('관리사 지정 추가')).not.toBeInTheDocument();
  });
});
