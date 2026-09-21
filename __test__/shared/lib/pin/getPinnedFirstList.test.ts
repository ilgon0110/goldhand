import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getPinnedFirstListAdmin } from '@/src/shared/lib/pin/getPinnedFirstList';

const { collectionMock, nonPinnedCountGetMock, pageGetMock, pinnedGetMock } = vi.hoisted(() => ({
  collectionMock: vi.fn(),
  nonPinnedCountGetMock: vi.fn(),
  pageGetMock: vi.fn(),
  pinnedGetMock: vi.fn(),
}));

vi.mock('firebase-admin/firestore', () => ({
  getFirestore: vi.fn(() => ({ collection: collectionMock })),
}));

vi.mock('@/src/shared/config/firebase-admin', () => ({
  firebaseAdminApp: {},
}));

describe('getPinnedFirstListAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const pinnedQuery = { get: pinnedGetMock };
    const pageQuery = { get: pageGetMock };
    const limitedQuery = { limit: vi.fn(() => pageQuery) };
    const nonPinnedQuery = {
      count: vi.fn(() => ({ get: nonPinnedCountGetMock })),
      offset: vi.fn(() => limitedQuery),
    };
    const baseCollection = {
      where: vi.fn((_field: string, _operator: string, isPinned: boolean) => ({
        orderBy: vi.fn(() => (isPinned ? pinnedQuery : nonPinnedQuery)),
      })),
    };

    collectionMock.mockReturnValue(baseCollection);
    pinnedGetMock.mockResolvedValue({
      docs: [{ data: () => ({ isPinned: true }), id: 'pinned-1' }],
      size: 1,
    });
    nonPinnedCountGetMock.mockResolvedValue({ data: () => ({ count: 2 }) });
    pageGetMock.mockResolvedValue({
      docs: [
        { data: () => ({ isPinned: false }), id: 'review-2' },
        { data: () => ({ isPinned: false }), id: 'review-1' },
      ],
    });
  });

  it('전체 건수에는 고정글을 포함하고 페이지 대상 건수에서는 제외한다', async () => {
    const result = await getPinnedFirstListAdmin('reviews', [], 1, 10);

    expect(result.totalDataLength).toBe(3);
    expect(result.pageableDataLength).toBe(2);
    expect(result.pinnedItems).toHaveLength(1);
    expect(result.pageItems).toHaveLength(2);
  });
});
