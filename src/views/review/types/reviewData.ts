import { Timestamp } from "firebase/firestore";

export interface IReviewData {
  response: "ok" | "ng";
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
