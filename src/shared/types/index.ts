import type { Timestamp } from 'firebase/firestore';

// 이용상담(Consult, Reservation) 관련 타입 정의
export interface ConsultDetailData {
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
  comments: CommentData[] | null;
}

export interface IConsultDetailData {
  response: string;
  message: string;
  data: ConsultDetailData;
}

// 이용후기(Review) 관련 타입 정의
export interface ReviewDetailData {
  htmlString: string;
  createdAt: Timestamp;
  franchisee: string;
  name: string;
  title: string;
  updatedAt: Timestamp;
  userId: string | null;
  comments: CommentData[] | null;
}

export interface IReviewDetailData {
  response: string;
  message: string;
  data: ReviewDetailData;
}

// 댓글(Comment) 관련 타입 정의
export interface CommentData {
  id: string;
  comment: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId: string;
  docId: string; // 댓글이 달린 문서의 ID (Consult 또는 Review)
  docType: 'consult' | 'review'; // 댓글이 달린 문서의 타입
}

// 사용자(User) 관련 타입 정의
export interface UserDetailData {
  phoneNumber: string;
  email: string;
  grade: string;
  createdAt: Timestamp;
  nickname: string;
  name: string;
  updatedAt: Timestamp;
  uid: string;
}

export interface IUserData {
  response: 'ng' | 'ok' | 'unAuthorized';
  message: string;
  accessToken: string | null;
  userData: UserDetailData | null;
  isLinked: boolean;
}

export interface MyPageData {
  isLinked: boolean;
  userData: UserDetailData | null;
  consults: (ConsultDetailData & { id: string })[] | null;
  reviews: (ReviewDetailData & { id: string })[] | null;
  comments: (CommentData & { id: string })[] | null;
}

export interface IMyPageData {
  response: 'ng' | 'ok' | 'unAuthorized';
  message: string;
  data: MyPageData;
}
