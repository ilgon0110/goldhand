import type { Timestamp } from 'firebase/firestore';

// event 관련 타입 정의
export interface IEventResponseData {
  response: string;
  message: string;
  data: IEventDetailData;
}

export interface IEventDetailData {
  id: string;
  rowNumber: number;
  thumbnail: string | null;
  htmlString: string;
  createdAt: Pick<Timestamp, 'nanoseconds' | 'seconds'>;
  isPinned: boolean;
  pinnedAt: Pick<Timestamp, 'nanoseconds' | 'seconds'> | null;
  name: string;
  title: string;
  updatedAt: Pick<Timestamp, 'nanoseconds' | 'seconds'>;
  userId: string | null;
  status: 'ENDED' | 'ONGOING' | 'UPCOMING';
}

export interface IEventListResponseData {
  response: 'ng' | 'ok';
  message: string;
  eventData: IEventDetailData[] | [];
  pageableDataLength: number;
  totalDataLength: number;
}
