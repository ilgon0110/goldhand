import { fetcher } from '@/src/shared/utils/fetcher.client';

type TVerifyGuestReviewOwnerResponse = {
  response: 'ng' | 'ok';
  message: string;
};

export const verifyGuestReviewOwner = (docId: string, phoneIdToken: string) =>
  fetcher<TVerifyGuestReviewOwnerResponse>('/api/review/verify-owner', {
    method: 'POST',
    body: JSON.stringify({ docId, phoneIdToken }),
  });
