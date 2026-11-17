import type { IApplyDetailData } from '@/src/entities/manager/@x/mypage';
import type { ICommentData } from '@/src/entities/comment/@x/mypage';
import type { IReservationDetailData } from '@/src/entities/reservation/@x/mypage';
import type { IReviewDetailData } from '@/src/entities/review/@x/mypage';
import type { IUserDetailData } from '@/src/entities/user/@x/mypage';

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
