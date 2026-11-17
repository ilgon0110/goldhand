import type { Timestamp } from 'firebase/firestore';

// 이용상담(Consult, Reservation) 관련 타입 정의
export interface IReservationDetailData {
  bornDate: string | null;
  content: string;
  createdAt: Pick<Timestamp, 'nanoseconds' | 'seconds'>;
  franchisee: string;
  isPinned: boolean;
  pinnedAt: Pick<Timestamp, 'nanoseconds' | 'seconds'> | null;
  location: string;
  name: string;
  password: string | null;
  phoneNumber: string;
  secret: boolean;
  title: string;
  updatedAt: Pick<Timestamp, 'nanoseconds' | 'seconds'>;
  userId: string | null;
}

export type TReservationDetailResponseCode =
  | 'ACCESS_DENIED'
  | 'INVALID_REQUEST'
  | 'NEEDS_LOGIN'
  | 'NEEDS_PASSWORD'
  | 'NOT_FOUND'
  | 'OK'
  | 'SERVER_ERROR'
  | 'TOKEN_EXPIRED';

export interface IReservationResponseData {
  response: 'ng' | 'ok';
  code: TReservationDetailResponseCode;
  message: string;
  data: IReservationDetailData;
}
