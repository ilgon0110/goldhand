import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ReviewSummaryCard } from '@/src/feature/home/reviewCarousel/ui/_ReviewSummaryCard';

const mockProps = {
  title: '정말 좋았어요',
  author: '김산모',
  updatedAt: { seconds: 1700000000, nanoseconds: 0 },
  content: '산후도우미가 너무 친절했고 아이를 잘 돌봐주었습니다.',
  thumbnailSrc: null,
  handleClick: vi.fn(),
};

describe('ReviewSummaryCard', () => {
  it('제목을 렌더링한다', () => {
    render(<ReviewSummaryCard {...mockProps} />);
    expect(screen.getByText('정말 좋았어요')).toBeInTheDocument();
  });

  it('작성자를 렌더링한다', () => {
    render(<ReviewSummaryCard {...mockProps} />);
    expect(screen.getByText('김산모')).toBeInTheDocument();
  });

  it('카드 클릭 시 handleClick이 호출된다', async () => {
    const handleClick = vi.fn();
    render(<ReviewSummaryCard {...mockProps} handleClick={handleClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('"자세히 보기" 버튼이 없다', () => {
    render(<ReviewSummaryCard {...mockProps} />);
    expect(screen.queryByText('자세히 보기')).not.toBeInTheDocument();
  });
});
