import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { WidgetPagination } from '@/src/widgets/Pagination';

describe('WidgetPagination 컴포넌트 테스트', async () => {
  it('totalDataLength/maxColumnNumber 값과 동일하게 페이지 번호가 생성되는지 확인', async () => {
    render(<WidgetPagination maxColumnNumber={5} targetPage={1} totalDataLength={21} onChangePage={() => {}} />);

    // 페이지 번호가 5개 생성되어야 합니다.
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByRole('link', { name: i.toString() })).toBeInTheDocument();
    }
  });

  it('totalDataLength/maxColumnNumber가 MAXIMUM_NUMBER_OF_PAGES보다 큰 경우 - 페이지번호, 다음, totalPage가 생성되는지 확인', async () => {
    render(<WidgetPagination maxColumnNumber={5} targetPage={1} totalDataLength={103} onChangePage={() => {}} />);

    // 페이지 번호가 10개 생성되어야 합니다.
    for (let i = 1; i <= 10; i++) {
      expect(screen.getByRole('link', { name: i.toString() })).toBeInTheDocument();
    }

    // 다음 버튼이 생성되어야 합니다.
    expect(screen.getByRole('link', { name: 'Go to next page' })).toBeInTheDocument();

    // 마지막 페이지로 바로 가는 링크가 생성되어야 합니다.
    expect(screen.getByRole('link', { name: '21' })).toBeInTheDocument();
  });

  it('현재 페이지 번호가 MAXIMUM_NUMBER_OF_PAGES보다 큰 경우만 이전 버튼이 활성화되는지 확인', async () => {
    render(<WidgetPagination maxColumnNumber={5} targetPage={1} totalDataLength={103} onChangePage={() => {}} />);

    // 페이지 번호가 10개 생성되어야 합니다.
    for (let i = 1; i <= 10; i++) {
      expect(screen.getByRole('link', { name: i.toString() })).toBeInTheDocument();
    }

    userEvent.click(screen.getByRole('link', { name: 'Go to next page' }));

    for (let i = 11; i <= 20; i++) {
      expect(await screen.findByRole('link', { name: i.toString() })).toBeInTheDocument();
    }
  });

  it('totalDataLength//maxColumnNumber가 MAXIMUM_NUMBER_OF_PAGES보다 큰 경우에만 다음 버튼이 활성화되는지 확인', async () => {
    render(<WidgetPagination maxColumnNumber={5} targetPage={1} totalDataLength={21} onChangePage={() => {}} />);

    // 다음 버튼이 비활성화되어야 합니다.
    expect(screen.queryByRole('link', { name: 'Go to next page' })).not.toBeInTheDocument();
  });

  it('페이지 번호를 눌렀을 때 onChangePage가 호출되는지 확인', async () => {
    const handlePage = vi.fn();
    render(<WidgetPagination maxColumnNumber={10} targetPage={1} totalDataLength={103} onChangePage={handlePage} />);

    await userEvent.click(screen.getByRole('link', { name: '3' }));

    expect(handlePage).toHaveBeenCalledTimes(1);
    expect(handlePage).toHaveBeenCalledWith(3);
  });
});
