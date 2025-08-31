import { http, HttpResponse } from 'msw';

import { mockReviewData } from './review';

const testData = {
  message: 'msw 연결',
};

export const handlers = [
  http.get('/api/msw', async () => {
    return HttpResponse.json(testData);
  }),
  http.get(`/api/review`, async ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || '1';
    const franchisee = url.searchParams.get('franchisee') || '전체';

    if (!page || !franchisee) {
      return HttpResponse.json(
        {
          error: 'Invalid query parameters',
        },
        { status: 400 },
      );
    }

    if (franchisee === '전체') {
      return HttpResponse.json(mockReviewData);
    }

    return HttpResponse.json({
      ...mockReviewData,
      reviewData: mockReviewData.reviewData.filter(review => review.franchisee === franchisee),
    });
  }),
];
