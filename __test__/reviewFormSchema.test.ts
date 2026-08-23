import { describe, expect, it } from 'vitest';

import { reviewFormSchema } from '@/src/entities/review/config';

const validGuestPayload = {
  isGuestPost: true as const,
  title: '후기 제목입니다.',
  name: '홍길동',
  franchisee: '전체',
  phoneNumber: '01012345678',
  authCode: '123456',
  agreePersonalInfo: true as const,
};

const validMemberPayload = {
  isGuestPost: false as const,
  title: '후기 제목입니다.',
  name: '홍길동',
  franchisee: '전체',
};

describe('reviewFormSchema', () => {
  it('회원(isGuestPost: false)은 phoneNumber/authCode/agreePersonalInfo 없이 유효하다', () => {
    const result = reviewFormSchema.safeParse(validMemberPayload);
    expect(result.success).toBe(true);
  });

  it('비회원은 필수값이 모두 있으면 유효하다', () => {
    const result = reviewFormSchema.safeParse(validGuestPayload);
    expect(result.success).toBe(true);
  });

  it('비회원인데 agreePersonalInfo가 없으면 실패한다', () => {
    const { agreePersonalInfo: _omit, ...rest } = validGuestPayload;
    const result = reviewFormSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it('비회원인데 agreePersonalInfo가 false이면 실패한다', () => {
    const result = reviewFormSchema.safeParse({ ...validGuestPayload, agreePersonalInfo: false });
    expect(result.success).toBe(false);
  });

  it('비회원의 휴대폰번호 형식이 올바르지 않으면 실패한다', () => {
    const result = reviewFormSchema.safeParse({ ...validGuestPayload, phoneNumber: '1234567890' });
    expect(result.success).toBe(false);
  });

  it('비회원의 인증코드가 6자리가 아니면 실패한다', () => {
    const result = reviewFormSchema.safeParse({ ...validGuestPayload, authCode: '12345' });
    expect(result.success).toBe(false);
  });
});
