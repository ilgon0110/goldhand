import type { IMyPageData } from '@/src/shared/types';

import { mockReservationListData } from '../reservation';
import { mockReviewDetailData } from '../review';
import { mockUserData } from '../user';

interface IMockMypageData {
  response: 'expired' | 'ng' | 'ok' | 'unAuthorized';
  message: string;
  data: IMyPageData;
}

export const mockMypageData: IMockMypageData = {
  response: 'ok',
  message: '마이페이지 데이터 조회 성공',
  data: {
    isLinked: false,
    userData: mockUserData.userData,
    consults: mockReservationListData.consultData,
    reviews: [{ ...mockReviewDetailData.data, id: '123' }],
    comments: [
      {
        id: '124312',
        docId: '123',
        docType: 'review',
        comment: '이것은 내가 작성한 댓글입니다.',
        createdAt: {
          nanoseconds: 0,
          seconds: 1696238400, // 2023-10-02T12:00:00Z
        },
        updatedAt: {
          nanoseconds: 0,
          seconds: 1696238400, // 2023-10-02T12:00:00Z
        },
        userId: 'user_001',
      },
    ],
  },
};
