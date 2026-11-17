import type { Timestamp } from 'firebase/firestore';

// 산후관리사 지원(Manager Apply) 관련 타입 정의
export interface IApplyDetailData {
  content: string;
  createdAt: Pick<Timestamp, 'nanoseconds' | 'seconds'>;
  email: string;
  franchisee: string;
  location: string;
  name: string;
  phoneNumber: string;
  updatedAt: Pick<Timestamp, 'nanoseconds' | 'seconds'>;
  userId: string | null;
  docId: string;
}

export interface IManagerApplyListData {
  response: 'ng' | 'ok';
  message: string;
  data: IApplyDetailData[] | null;
  totalDataLength: number;
}

export interface IManagerApplyDetailResponseData {
  response: 'ng' | 'ok';
  message: string;
  data: IApplyDetailData | null;
}
