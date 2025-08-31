import type { Timestamp } from 'firebase/firestore';

export interface IReviewData {
  response: 'ng' | 'ok';
  message: string;
  reviewData:
    | {
        id: string;
        createdAt: Pick<Timestamp, 'nanoseconds' | 'seconds'>;
        name: string;
        userId: string;
        title: string;
        updatedAt: Pick<Timestamp, 'nanoseconds' | 'seconds'>;
        htmlString: string;
        franchisee: string;
      }[]
    | [];
  totalDataLength: number;
}
