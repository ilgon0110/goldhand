import { GET, PUT } from '@/app/api/price/route';
import type { TPrices } from '@/src/entities/price/model/prices';

import { PRICES } from '../../../fixtures/prices';

// 외부 I/O(인증, Firestore, Next 캐시)만 막는다. 검증(validPriceData)은 실제 코드를 쓰고, 저장된 문서는 PRICES로 둔다.
const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  transaction: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
  revalidateTag: vi.fn(),
  revalidatePath: vi.fn(),
  read: vi.fn(),
}));

vi.mock('@/src/shared/lib/server', () => ({ checkAdminAuth: mocks.auth }));
vi.mock('@/src/shared/config/firebase-admin', () => ({ firebaseAdminApp: {} }));
vi.mock('firebase-admin/firestore', () => ({ getFirestore: () => ({ runTransaction: mocks.transaction }) }));
vi.mock('next/cache', () => ({ revalidateTag: mocks.revalidateTag, revalidatePath: mocks.revalidatePath }));
vi.mock('@/src/entities/price/api/pricing.server', () => ({ pricingRef: () => 'pricing', getPricing: mocks.read }));

const request = (body: unknown) =>
  new Request('http://localhost/api/price', { method: 'PUT', body: JSON.stringify(body) });

// 저장된 요금을 복사해 일부만 바꾼 요청 본문
const pricesWith = (edit: (prices: TPrices) => void) => {
  const prices = structuredClone(PRICES);
  edit(prices);
  return prices;
};

beforeEach(() => {
  vi.resetAllMocks();
  mocks.auth.mockResolvedValue({ ok: true, isAdmin: true, uid: 'admin' });
  mocks.get.mockResolvedValue({ data: () => ({ prices: PRICES, revision: 0 }) });
  mocks.transaction.mockImplementation(fn => fn({ get: mocks.get, set: mocks.set }));
});

it('비로그인 사용자와 일반 사용자의 수정 요청을 거부한다', async () => {
  mocks.auth.mockResolvedValue({ ok: false });
  expect((await PUT(request({ prices: PRICES, revision: 0 }))).status).toBe(401);

  mocks.auth.mockResolvedValue({ ok: true, isAdmin: false });
  expect((await PUT(request({ prices: PRICES, revision: 0 }))).status).toBe(403);

  expect(mocks.transaction).not.toHaveBeenCalled();
});

it.each([
  ['본문 없음', null],
  ['빈 객체', {}],
  ['revision 누락', { prices: PRICES }],
  ['음수 revision', { prices: PRICES, revision: -1 }],
])('형식이 잘못된 요청 본문은 DB 조회 전에 거부한다: %s', async (_, body) => {
  expect((await PUT(request(body))).status).toBe(400);
  expect(mocks.transaction).not.toHaveBeenCalled();
});

it.each([
  ['음수 금액', { prices: pricesWith(p => (p.basicPriceList[0] = -1)), revision: 0 }],
  ['소수 금액', { prices: pricesWith(p => (p.basicPriceList[0] = 1.5)), revision: 0 }],
  ['문자열 금액', { prices: pricesWith(p => ((p.basicPriceList as unknown[])[0] = '820000')), revision: 0 }],
  ['주 단위 요금 개수 변경', { prices: pricesWith(p => p.basicPriceList.pop()), revision: 0 }],
  [
    '부가 요금 행 추가',
    { prices: pricesWith(p => p.otherExtraFeeList.push({ ...p.otherExtraFeeList[0] })), revision: 0 },
  ],
  ['고정 ID 변경', { prices: pricesWith(p => (p.otherExtraFeeList[1].id = 'hacked')), revision: 0 }],
  ['빈 항목명', { prices: pricesWith(p => (p.childExtraFeeList[0].label = '  ')), revision: 0 }],
  ['알 수 없는 키 추가', { prices: { ...PRICES, extra: [1] }, revision: 0 }],
  ['요금 키 누락', { prices: pricesWith(p => delete (p as Partial<TPrices>).oneDayPriceList), revision: 0 }],
])('저장된 요금과 구조가 다르거나 값이 잘못되면 쓰지 않고 거부한다: %s', async (_, body) => {
  expect((await PUT(request(body))).status).toBe(400);
  expect(mocks.set).not.toHaveBeenCalled();
});

it('수정한 요금을 저장하고 공개 페이지 캐시를 무효화한다', async () => {
  const prices = pricesWith(p => {
    p.basicPriceList[0] = 900000;
    p.otherExtraFeeList[1].label = '추가 돌봄, 시간당';
  });
  mocks.get.mockResolvedValue({ data: () => ({ prices: PRICES, revision: 4 }) });

  const response = await PUT(request({ prices, revision: 4 }));

  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ prices, revision: 5 });
  expect(mocks.set).toHaveBeenCalledWith(
    'pricing',
    expect.objectContaining({ schemaVersion: 2, prices, revision: 5, updatedBy: 'admin' }),
  );
  expect(mocks.revalidateTag).toHaveBeenCalledWith('pricing');
  expect(mocks.revalidatePath).toHaveBeenCalledWith('/');
  expect(mocks.revalidatePath).toHaveBeenCalledWith('/price');
});

it('요금 문서가 없으면 새로 만들지 않고 404로 거부한다', async () => {
  mocks.get.mockResolvedValue({ data: () => undefined });

  expect((await PUT(request({ prices: PRICES, revision: 0 }))).status).toBe(404);
  expect(mocks.set).not.toHaveBeenCalled();
});

it('동시 수정(revision 불일치)은 쓰지 않고 409로 거부한다', async () => {
  mocks.get.mockResolvedValue({ data: () => ({ prices: PRICES, revision: 2 }) });

  expect((await PUT(request({ prices: PRICES, revision: 1 }))).status).toBe(409);
  expect(mocks.set).not.toHaveBeenCalled();
  expect(mocks.revalidateTag).not.toHaveBeenCalled();
});

it('저장 중 DB 오류 시 500을 반환하고 캐시를 무효화하지 않는다', async () => {
  mocks.transaction.mockRejectedValue(new Error('offline'));

  expect((await PUT(request({ prices: PRICES, revision: 0 }))).status).toBe(500);
  expect(mocks.revalidateTag).not.toHaveBeenCalled();
});

it('조회 시 저장된 요금을 그대로 반환한다', async () => {
  mocks.read.mockResolvedValue({ prices: PRICES, revision: 3 });

  const response = await GET();

  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ prices: PRICES, revision: 3 });
});

it('조회 중 DB 오류 시 500을 반환한다', async () => {
  mocks.read.mockRejectedValue(new Error('offline'));

  expect((await GET()).status).toBe(500);
});
