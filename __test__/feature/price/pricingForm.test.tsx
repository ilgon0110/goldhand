import { QueryClient } from '@tanstack/react-query';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';

import { server } from '@/src/__mock__/node';
import type { TPriceData } from '@/src/entities/price/model/prices';
import { PricingForm } from '@/src/feature/price/ui/PricingForm';
import { priceKeys } from '@/src/shared/config/queryKeys';
import { renderWithQueryClient } from '@/src/shared/utils/test/render';

import { PRICES } from '../../fixtures/prices';

// authFetcher는 next/headers의 cookie를 읽으므로 일반 fetcher로 바꾸고, 요청은 MSW가 받는다.
vi.mock('@/src/shared/utils/fetcher.server', async () => {
  const { fetcher } = await import('@/src/shared/utils/fetcher.client');
  return { authFetcher: fetcher };
});

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn() }));

vi.mock('@/src/shared/utils', async importOriginal => ({
  ...(await importOriginal<object>()),
  toastSuccess: toast.success,
  toastError: toast.error,
}));

const BASIC_1W = '출퇴근형 베이직 1주 (원)';

// 서버 prefetch를 대신해 캐시에 요금을 넣는다. staleTime: Infinity라 GET 재조회가 일어나지 않는다.
const renderPricingForm = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
  queryClient.setQueryData<TPriceData>(priceKeys.all, { prices: PRICES, revision: 2 });
  renderWithQueryClient(<PricingForm />, { queryClient });
  return userEvent.setup();
};

// PUT /api/price 요청 본문을 모두 기록하고, 서버처럼 revision을 1 올려 응답한다.
const mockSave = () => {
  const bodies: TPriceData[] = [];
  server.use(
    http.put('/api/price', async ({ request }) => {
      const body = (await request.json()) as TPriceData;
      bodies.push(body);
      return HttpResponse.json({ prices: body.prices, revision: body.revision + 1 });
    }),
  );
  return bodies;
};

it('저장에 실패하면 에러 토스트를 띄우고 입력한 값을 유지한다', async () => {
  server.use(http.put('/api/price', () => HttpResponse.json({ message: '저장하지 못했습니다' }, { status: 500 })));
  const user = renderPricingForm();
  const input = screen.getByLabelText(BASIC_1W);

  await user.clear(input);
  await user.type(input, '900000');
  await user.click(screen.getByRole('button', { name: '전체 저장' }));

  await waitFor(() => expect(toast.error).toHaveBeenCalledWith('저장하지 못했습니다'));
  expect(input).toHaveValue('900,000');
});

it('불러온 revision으로 저장하고, 이후 저장된 revision을 사용한다', async () => {
  const bodies = mockSave();
  const user = renderPricingForm();

  await user.click(screen.getByRole('button', { name: '전체 저장' }));
  await waitFor(() => expect(toast.success).toHaveBeenCalledWith('저장했습니다.'));
  await user.click(screen.getByRole('button', { name: '전체 저장' }));

  await waitFor(() => expect(bodies).toHaveLength(2));
  expect(bodies.map(body => body.revision)).toEqual([2, 3]);
});

it('음수 금액은 필드 에러를 보여주고 저장하지 않는다', async () => {
  const bodies = mockSave();
  const user = renderPricingForm();
  const input = screen.getByLabelText(BASIC_1W);

  await user.clear(input);
  await user.type(input, '-1');
  await user.click(screen.getByRole('button', { name: '전체 저장' }));

  expect(await screen.findByText('0 이상의 정수 금액을 입력해 주세요.')).toBeInTheDocument();
  expect(bodies).toHaveLength(0);
});

it('입력하는 동안 쉼표를 붙이고, 숫자로 전송한다', async () => {
  const bodies = mockSave();
  const user = renderPricingForm();
  const input = screen.getByLabelText(BASIC_1W);
  expect(input).toHaveValue('820,000');

  await user.clear(input);
  await user.type(input, '1650000');
  expect(input).toHaveValue('1,650,000');

  await user.click(screen.getByRole('button', { name: '전체 저장' }));

  await waitFor(() => expect(bodies).toHaveLength(1));
  expect(bodies[0].prices.basicPriceList[0]).toBe(1650000);
});

it('숫자 중간을 고쳐도 쉼표가 붙은 뒤 커서가 고친 자리 뒤에 남는다', async () => {
  const user = renderPricingForm();
  const input = screen.getByLabelText<HTMLInputElement>(BASIC_1W);

  // '820,000'에서 '8' 뒤에 커서를 두고 '1', '5'를 차례로 입력
  await user.click(input);
  input.setSelectionRange(1, 1);
  await user.keyboard('1');
  // 실제 입력처럼 키 사이에 한 프레임이 지나야 커서 복원(requestAnimationFrame)이 실행된다.
  await new Promise(requestAnimationFrame);
  await user.keyboard('5');

  expect(input).toHaveValue('81,520,000');
});

it('쉼표가 포함된 금액을 붙여넣어도 숫자로 전송한다', async () => {
  const bodies = mockSave();
  const user = renderPricingForm();
  const input = screen.getByLabelText(BASIC_1W);

  await user.clear(input);
  await user.paste('2,000,000');
  expect(input).toHaveValue('2,000,000');

  await user.click(screen.getByRole('button', { name: '전체 저장' }));

  await waitFor(() => expect(bodies).toHaveLength(1));
  expect(bodies[0].prices.basicPriceList[0]).toBe(2000000);
});

it('입력을 비우면 필수 에러를 보여주고, 0은 허용한다', async () => {
  const user = renderPricingForm();
  const input = screen.getByLabelText(BASIC_1W);

  await user.clear(input);
  await user.click(screen.getByRole('button', { name: '전체 저장' }));
  expect(await screen.findByText('요금을 입력해 주세요.')).toBeInTheDocument();

  await user.type(input, '0');

  expect(input).toHaveValue('0');
  await waitFor(() => expect(screen.queryByText('요금을 입력해 주세요.')).not.toBeInTheDocument());
});

it('항목명을 자유롭게 수정해 저장하고 고정 ID는 유지한다', async () => {
  const bodies = mockSave();
  const user = renderPricingForm();
  const input = screen.getByLabelText('시간연장 (시간당) 항목명');

  await user.clear(input);
  await user.type(input, '추가 돌봄, 시간당');
  await user.click(screen.getByRole('button', { name: '전체 저장' }));

  await waitFor(() => expect(bodies).toHaveLength(1));
  expect(bodies[0].prices.otherExtraFeeList[1]).toEqual({
    id: 'overtime',
    label: '추가 돌봄, 시간당',
    values: [20000, 20000],
  });
});
