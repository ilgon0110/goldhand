import { describe, expect, it } from 'vitest';

import { guestConfirmationSchema } from '@/src/feature/review-form/config/guestConfirmationSchema';

const validPayload = {
  phoneNumber: '01012345678',
  authCode: '123456',
  agreePersonalInfo: true as const,
};

describe('guestConfirmationSchema', () => {
  it('후기 필드 없이 유효한 휴대폰 인증 필드만 검증한다', () => {
    expect(guestConfirmationSchema.safeParse(validPayload).success).toBe(true);
  });

  it('개인정보 수집 동의가 없으면 실패한다', () => {
    const { agreePersonalInfo: _omit, ...rest } = validPayload;
    expect(guestConfirmationSchema.safeParse(rest).success).toBe(false);
  });

  it('개인정보 수집 동의가 true가 아니면 실패한다', () => {
    expect(guestConfirmationSchema.safeParse({ ...validPayload, agreePersonalInfo: false }).success).toBe(false);
  });

  it('휴대폰번호 형식이 올바르지 않으면 실패한다', () => {
    expect(guestConfirmationSchema.safeParse({ ...validPayload, phoneNumber: '1234567890' }).success).toBe(false);
  });

  it('인증코드가 6자리가 아니면 실패한다', () => {
    expect(guestConfirmationSchema.safeParse({ ...validPayload, authCode: '12345' }).success).toBe(false);
  });
});
