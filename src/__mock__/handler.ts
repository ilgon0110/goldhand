import { Timestamp } from '@firebase/firestore';
import { http, HttpResponse } from 'msw';

import { apiUrl } from '../shared/config';
import type { ICommentData, IReviewDetailData } from '../shared/types';
import { mockEventListData } from './event';
import { mockMypageData } from './mypage';
import { mockReservationListData } from './reservation';
import { mockReviewData, mockReviewDetailData } from './review';
import { mockUserData } from './user';

const testData = {
  message: 'msw 연결',
};

export const handlers = [
  http.get('/api/msw', async () => {
    return HttpResponse.json(testData);
  }),
  http.get('/api/user', async () => {
    return HttpResponse.json(mockUserData);
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
  http.get('/api/reservation', async ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || '1';
    const hideSecret = url.searchParams.get('hideSecret') || 'false';

    if (!page || !hideSecret) {
      return HttpResponse.json(
        {
          error: 'Invalid query parameters',
        },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      ...mockReservationListData,
      consultData: mockReservationListData.consultData?.filter(consult =>
        hideSecret === 'true' ? !consult.secret : true,
      ),
    });
  }),
  // server action이라 apiUrl 붙여줌
  http.post(`${apiUrl}/api/reservation/detail/password`, async ({ request }) => {
    const { docId, password } = (await request.json()) as {
      docId: string;
      password: string;
    };

    if (!docId || !password) {
      return HttpResponse.json(
        {
          response: 'ng',
          message: '필수로 입력해야하는 필드를 입력해주세요.',
        },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      response: 'ok',
      message: '비밀번호가 일치합니다.',
    });
  }),

  http.get('/api/review/detail', async ({ request }) => {
    const defaultData: IReviewDetailData = {
      thumbnail: null,
      htmlString: '',
      createdAt: Timestamp.now(),
      franchisee: '',
      name: '',
      title: '',
      updatedAt: Timestamp.now(),
      userId: null,
      comments: [] as ICommentData[],
    };

    const url = new URL(request.url);
    const docId = url.searchParams.get('docId');

    if (!docId) {
      return HttpResponse.json(
        {
          response: 'ng',
          message: 'docId is required',
          data: defaultData,
        },
        { status: 400 },
      );
    }

    return HttpResponse.json(mockReviewDetailData);
  }),
  http.post(`${apiUrl}/api/auth/kakao`, async () => {
    return HttpResponse.json(
      {
        response: 'ok',
        message: '로그인 성공',
        redirectTo: '/',
        user: null,
        accessToken: null,
        email: 'mockEmail@domain.com',
        userData: mockUserData.userData,
      },
      { status: 200 },
    );
  }),
  http.post(`${apiUrl}/api/auth/naver`, async () => {
    return HttpResponse.json(
      {
        response: 'ok',
        message: '로그인 성공',
        redirectTo: '/',
        user: null,
        accessToken: null,
        email: 'mockEmail@domain.com',
        userData: mockUserData.userData,
      },
      { status: 200 },
    );
  }),
  http.post('/api/user/rejoin', async ({ request }) => {
    const { userId } = (await request.json()) as { userId: string };

    if (!userId) {
      return HttpResponse.json(
        {
          response: 'ng',
          message: 'userId is required',
        },
        { status: 400 },
      );
    }

    return HttpResponse.json(
      {
        response: 'ok',
        message: '재가입 성공',
      },
      {
        status: 200,
      },
    );
  }),
  http.get('/api/mypage', async () => {
    return HttpResponse.json(mockMypageData);
  }),

  http.get('/api/event', async () => {
    return HttpResponse.json(mockEventListData);
  }),
];
