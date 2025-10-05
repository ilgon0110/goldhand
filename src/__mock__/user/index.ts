import type { IUserResponseData } from '@/src/shared/types';

export const mockUserData: {
  response: 'ng' | 'ok' | 'unAuthorized';
  message: string;
  userData: IUserResponseData['userData'] | null;
  isLinked: boolean;
} = {
  response: 'ok',
  message: '사용자 정보 조회 성공',
  userData: {
    userId: 'test-user-id',
    email: 'test-user@example.com',
    name: '테스트 사용자',
    phoneNumber: '01012345678',
    grade: 'basic',
    createdAt: {
      nanoseconds: 0,
      seconds: 1672531200, // 2023-01-01T00:00:00Z
    },
    nickname: 'testnick',
    updatedAt: {
      nanoseconds: 0,
      seconds: 1672531200, // 2023-01-01T00:00:00Z
    },
    isDeleted: false,
    deletedAt: null,
    provider: 'kakao',
    kakaoId: 'kakao-test-id',
    kakaoEmail: 'kakao-test@example.com',
  },
  isLinked: true,
};
