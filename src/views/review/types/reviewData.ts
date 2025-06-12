import type { Timestamp } from 'firebase/firestore';

export interface IReviewData {
  response: 'ng' | 'ok';
  message: string;
  reviewData:
    | {
        id: string;
        createdAt: Timestamp;
        name: string;
        userId: string;
        title: string;
        updatedAt: Timestamp;
        htmlString: string;
        franchisee: string;
      }[]
    | [];
  totalDataLength: number;
}
