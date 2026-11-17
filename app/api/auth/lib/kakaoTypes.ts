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
