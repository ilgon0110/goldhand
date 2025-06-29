import type { Timestamp } from 'firebase/firestore';

// 이용상담(Consult, Reservation) 관련 타입 정의
export interface IConsultDetailData {
  bornDate: Date | null;
  content: string;
  createdAt: Timestamp;
  franchisee: string;
  location: string;
  name: string;
  password: string | null;
  phoneNumber: string;
  secret: boolean;
  title: string;
  updatedAt: Timestamp;
  userId: string | null;
  comments: ICommentData[] | null;
}

export interface IConsultResponseData {
  response: string;
  message: string;
  data: IConsultDetailData;
}

// 이용후기(Review) 관련 타입 정의
export interface IReviewDetailData {
  htmlString: string;
  createdAt: Timestamp;
  franchisee: string;
  name: string;
  title: string;
  updatedAt: Timestamp;
  userId: string | null;
  comments: ICommentData[] | null;
}

export interface IReviewResponseData {
  response: string;
  message: string;
  data: IReviewDetailData;
}

// 댓글(Comment) 관련 타입 정의
export interface ICommentData {
  id: string;
  comment: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId: string;
  docId: string; // 댓글이 달린 문서의 ID (Consult 또는 Review)
  docType: 'consult' | 'review'; // 댓글이 달린 문서의 타입
}

// 사용자(User) 관련 타입 정의
export interface IUserDetailData {
  phoneNumber: string;
  email: string;
  grade: string;
  createdAt: Timestamp;
  nickname: string;
  name: string;
  updatedAt: Timestamp;
  uid: string;
  isDeleted: boolean;
  deletedAt: Timestamp | null;
  provider: 'kakao' | 'naver';
}

export interface IUserResponseData {
  response: 'ng' | 'ok' | 'unAuthorized';
  message: string;
  accessToken: string | null;
  userData: IUserDetailData | null;
  isLinked: boolean;
}

export interface IMyPageData {
  isLinked: boolean;
  userData: IUserDetailData | null;
  consults: (IConsultDetailData & { id: string })[] | null;
  reviews: (IReviewDetailData & { id: string })[] | null;
  comments: (ICommentData & { id: string })[] | null;
}

export interface IMyPageResponseData {
  response: 'ng' | 'ok' | 'unAuthorized';
  message: string;
  data: IMyPageData;
}
