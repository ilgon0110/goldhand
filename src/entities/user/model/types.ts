import type { Timestamp } from 'firebase/firestore';

// 사용자(User) 관련 타입 정의
export interface IKakaoAlarmSettings {
  alarmComment: boolean;
  alarmNews: boolean;
  alarmNewPost: boolean;
  alarmEditPost: boolean;
  alarmNewComment: boolean;
  alarmEditComment: boolean;
}

export interface IUserDetailData {
  phoneNumber: string;
  email: string;
  grade: 'admin' | 'basic';
  createdAt: Pick<Timestamp, 'nanoseconds' | 'seconds'>;
  nickname: string;
  name: string;
  updatedAt: Pick<Timestamp, 'nanoseconds' | 'seconds'>;
  userId: string;
  isDeleted: boolean;
  deletedAt: Pick<Timestamp, 'nanoseconds' | 'seconds'> | null;
  provider: 'kakao' | 'naver';
  kakaoId: string | null;
  kakaoEmail: string | null;
  fcmTokens?: string[] | null;
  kakaoAlarmSettings: IKakaoAlarmSettings;
}

export interface IUserResponseData {
  response: 'ng' | 'ok';
  message: string;
  userData: IUserDetailData | null;
  isLinked: boolean;
}

// 관리자 사용자 목록 조회 응답에 포함되는 항목만 담는다 (userId, kakaoId, fcmTokens 등 민감/불필요 필드는 서버에서 제외).
export interface IUserListItem {
  name: string;
  nickname: string;
  email: string;
  phoneNumber: string;
  grade: 'admin' | 'basic';
  provider: 'kakao' | 'naver';
  kakaoEmail: string | null;
  isDeleted: boolean;
  deletedAt: Pick<Timestamp, 'nanoseconds' | 'seconds'> | null;
  createdAt: Pick<Timestamp, 'nanoseconds' | 'seconds'>;
  updatedAt: Pick<Timestamp, 'nanoseconds' | 'seconds'>;
}

export interface IUserListResponseData {
  response: 'ng' | 'ok';
  message: string;
  data: IUserListItem[] | null;
  totalDataLength: number;
}
