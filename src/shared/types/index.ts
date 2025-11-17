import type { Timestamp } from 'firebase/firestore';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TAliasAny = any;

// 산후관리사 지원(Manager Apply) 관련 타입 정의
export interface IApplyDetailData {
  content: string;
  createdAt: Pick<Timestamp, 'nanoseconds' | 'seconds'>;
  email: string;
  franchisee: string;
  location: string;
  name: string;
  phoneNumber: string;
  updatedAt: Pick<Timestamp, 'nanoseconds' | 'seconds'>;
  userId: string | null;
  docId: string;
}

export interface IManagerApplyListData {
  response: 'ng' | 'ok' | 'unAuthorized';
  message: string;
  data: IApplyDetailData[] | null;
  totalDataLength: number;
}

export interface IManagerApplyDetailResponseData {
  response: 'ng' | 'ok' | 'unAuthorized';
  message: string;
  data: IApplyDetailData | null;
}

// 이용상담(Consult, Reservation) 관련 타입 정의
export interface IReservationDetailData {
  bornDate: string | null;
  content: string;
  createdAt: Pick<Timestamp, 'nanoseconds' | 'seconds'>;
  franchisee: string;
  location: string;
  name: string;
  password: string | null;
  phoneNumber: string;
  secret: boolean;
  title: string;
  updatedAt: Pick<Timestamp, 'nanoseconds' | 'seconds'>;
  userId: string | null;
  comments?: ICommentData[] | null;
}

export interface IReservationResponseData {
  response: string;
  message: string;
  data: IReservationDetailData;
}

// 이용후기(Review) 관련 타입 정의
export interface IReviewDetailData {
  thumbnail: string | null;
  htmlString: string;
  createdAt: Pick<Timestamp, 'nanoseconds' | 'seconds'>;
  franchisee: string;
  name: string;
  title: string;
  updatedAt: Pick<Timestamp, 'nanoseconds' | 'seconds'>;
  userId: string | null;
  comments: ICommentData[] | null;
}

export interface IReviewListResponseData {
  response: 'ng' | 'ok';
  message: string;
  reviewData: (IReviewDetailData & { id: string })[] | [];
  totalDataLength: number;
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
  createdAt: Pick<Timestamp, 'nanoseconds' | 'seconds'>;
  updatedAt: Pick<Timestamp, 'nanoseconds' | 'seconds'>;
  userId: string;
  docId: string; // 댓글이 달린 문서의 ID (Consult 또는 Review)
  docType: 'consult' | 'manager' | 'review'; // 댓글이 달린 문서의 타입
}

// 사용자(User) 관련 타입 정의
export interface IUserDetailData {
  phoneNumber: string;
  email: string;
  grade: string;
  createdAt: Pick<Timestamp, 'nanoseconds' | 'seconds'>;
  nickname: string;
  name: string;
  updatedAt: Pick<Timestamp, 'nanoseconds' | 'seconds'>;
  userId: string;
  isDeleted: boolean;
  deletedAt: Pick<Timestamp, 'nanoseconds' | 'seconds'> | null;
  provider: 'kakao' | 'naver';
  kakaoId: string | null;
  kakaoEmail: string | null;
}

export interface IUserResponseData {
  response: 'ng' | 'ok' | 'unAuthorized';
  message: string;
  accessToken: string | null;
  userData: IUserDetailData | null;
  isLinked: boolean;
}

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
  response: 'ng' | 'ok' | 'unAuthorized';
  message: string;
  data: IMyPageData;
}

// 카카오 로그인 관련 타입 정의
export interface IKakaoTokenResponseBody {
  token_type: 'bearer';
  access_token: string;
  id_token?: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope?: string;
}

export interface IKakaoUserInfoResponseBody {
  id: number;
  connected_at: string;
  kakao_account: {
    // 프로필 또는 닉네임 동의항목 필요
    profile_nickname_needs_agreement?: boolean;
    // 프로필 또는 프로필 사진 동의항목 필요
    profile_image_needs_agreement?: boolean;
    profile: {
      // 프로필 또는 닉네임 동의항목 필요
      nickname?: string;
      // 프로필 또는 프로필 사진 동의항목 필요
      thumbnail_image_url?: string;
      profile_image_url?: string;
      is_default_image?: boolean;
      is_default_nickname?: boolean;
    };
    // 이름 동의항목 필요
    name_needs_agreement?: boolean;
    name?: string;
    // 카카오계정(이메일) 동의항목 필요
    email_needs_agreement?: boolean;
    is_email_valid?: boolean;
    is_email_verified?: boolean;
    email?: string;
    // 연령대 동의항목 필요
    age_range_needs_agreement?: boolean;
    age_range?: string;
    // 출생 연도 동의항목 필요
    birthyear_needs_agreement?: boolean;
    birthyear?: number;
    // 생일 동의항목 필요
    birthday_needs_agreement?: boolean;
    birthday?: number;
    birthday_type?: string;
    is_leap_month?: boolean;
    // 성별 동의항목 필요
    gender_needs_agreement?: boolean;
    gender?: string;
    // 카카오계정(전화번호) 동의항목 필요
    phone_number_needs_agreement?: boolean;
    phone_number?: string;
    // CI(연계정보) 동의항목 필요
    ci_needs_agreement?: boolean;
    ci?: string;
    ci_authenticated_at?: string;
  };
  properties: {
    [key: string]: unknown;
  };
  for_partner: {
    uuid: string;
  };
}

// viewCount 관련 타입 정의
export interface IViewCountData {
  totalViewCount: number;
}

export interface IViewCountResponseData {
  response: 'ng' | 'ok';
  message: string;
  data: IViewCountData | null;
}

// event 관련 타입 정의
export interface IEventResponseData {
  response: string;
  message: string;
  data: IEventDetailData;
}

export interface IEventDetailData {
  id: string;
  rowNumber: number;
  htmlString: string;
  createdAt: Pick<Timestamp, 'nanoseconds' | 'seconds'>;
  name: string;
  title: string;
  updatedAt: Pick<Timestamp, 'nanoseconds' | 'seconds'>;
  userId: string | null;
  status: 'ENDED' | 'ONGOING' | 'UPCOMING';
  comments: ICommentData[] | null;
}

export interface IEventListResponseData {
  response: 'ng' | 'ok';
  message: string;
  eventData: IEventDetailData[] | [];
  totalDataLength: number;
}
