import type { IApplyDetailData } from '@/src/shared/types';

interface IMockApplyDetailData extends IApplyDetailData {
  id: string;
}

interface IMockManagerApplyListData {
  response: 'ng' | 'ok' | 'unAuthorized';
  message: string;
  data: IMockApplyDetailData[];
  totalDataLength: number;
}

export const mockManagerData: IMockManagerApplyListData = {
  response: 'ok',
  message: '성공',
  data: [
    {
      id: 'apply_001',
      content: '잘하겠다',
      createdAt: {
        seconds: 1753970558,
        nanoseconds: 95000000,
      },
      email: 'test@example.com',
      franchisee: '가맹점1',
      location: '서울',
      name: '홍길동',
      phoneNumber: '010-1234-5678',
      updatedAt: {
        seconds: 1753970558,
        nanoseconds: 95000000,
      },
      userId: 'user123',
      docId: 'doc123',
    },
  ],

  totalDataLength: 1,
};
