import { useSuspenseQuery } from '@tanstack/react-query';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { renderWithQueryClient } from '@/__test__/utils/render';
import { AsyncBoundary } from '@/src/shared/ui/AsyncBoundary';

const Section = ({ queryFn }: { queryFn: () => Promise<string> }) => {
  const { data } = useSuspenseQuery({ queryKey: ['section'], queryFn, retry: false });
  return <p>{data}</p>;
};

describe('AsyncBoundary', () => {
  it('섹션의 쿼리가 실패하면 그 섹션만 에러 UI로 바뀌고 바깥 내용은 그대로 남는다', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {}); // React가 잡힌 에러를 콘솔에 남긴다
    const queryFn = vi.fn().mockRejectedValueOnce(new Error('boom')).mockResolvedValueOnce('복구된 내용');

    renderWithQueryClient(
      <>
        <h1>페이지 제목</h1>
        <AsyncBoundary pendingFallback={<p>불러오는 중</p>}>
          <Section queryFn={queryFn} />
        </AsyncBoundary>
      </>,
    );

    expect(await screen.findByText('정보를 불러오지 못했습니다.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '페이지 제목' })).toBeInTheDocument();

    // 다시 시도하면 QueryErrorResetBoundary가 쿼리를 reset해 다시 가져온다.
    await userEvent.click(screen.getByRole('button', { name: '다시 시도' }));
    expect(await screen.findByText('복구된 내용')).toBeInTheDocument();
  });
});
