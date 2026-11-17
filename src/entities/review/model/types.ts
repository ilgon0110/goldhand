import type { Timestamp } from 'firebase/firestore';
import type { ICommentData } from '@/src/entities/comment/@x/review';

// 이용후기(Review) 관련 타입 정의
export interface IReviewDetailData {
  thumbnail: string | null;
  htmlString: string;
  createdAt: Pick<Timestamp, 'nanoseconds' | 'seconds'>;
  franchisee: string;
  isPinned: boolean;
  pinnedAt: Pick<Timestamp, 'nanoseconds' | 'seconds'> | null;
  name: string;
  title: string;
  updatedAt: Pick<Timestamp, 'nanoseconds' | 'seconds'>;
  userId: string | null;
  // 비회원만 사용. 공개 API 응답에서는 항상 제거되며 관리자 조회 시에만 phoneNumber가 포함된다.
  phoneNumber: string | null;
  // 비회원만 사용. 중복 제출 방지 및 수정/삭제 시 본인 확인용 해시. 클라이언트로는 절대 노출하지 않는다.
  phoneHash: string | null;
  comments: ICommentData[] | null;
}

export interface IReviewListResponseData {
  response: 'ng' | 'ok';
  message: string;
  reviewData: (IReviewDetailData & { id: string; isAuthorAdmin: boolean })[] | [];
  pageableDataLength: number;
  totalDataLength: number;
}

export interface IReviewResponseData {
  response: string;
  message: string;
  data: IReviewDetailData;
}
