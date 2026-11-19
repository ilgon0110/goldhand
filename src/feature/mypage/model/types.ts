import type { ICommentData } from '@/src/entities/comment';
import type { IApplyDetailData } from '@/src/entities/manager';
import type { IReservationDetailData } from '@/src/entities/reservation';
import type { IReviewDetailData } from '@/src/entities/review';
import type { IUserDetailData } from '@/src/entities/user';

// 마이페이지(MyPage) 관련 타입 정의
export interface IMyPageData {
  isLinked: boolean;
  userData: IUserDetailData | null;
  managersData: (IApplyDetailData & { id: string })[] | null;
  applies: (IApplyDetailData & { id: string })[] | null;
  consults: (IReservationDetailData & { id: string })[] | null;
  reviews: (IReviewDetailData & { id: string })[] | null;
  comments: (ICommentData & { id: string })[] | null;
}

export interface IMyPageResponseData {
  response: 'ng' | 'ok';
  message: string;
  data: IMyPageData;
}
