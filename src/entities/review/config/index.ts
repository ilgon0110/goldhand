import { z } from 'zod';

import { phoneAuthFormSchema } from '@/src/entities/phoneAuth';

const commonFields = {
  title: z
    .string()
    .min(2, {
      message: '2자 이상 100자 이하로 입력해주세요.',
    })
    .max(100),
  name: z
    .string()
    .min(2, {
      message: '2자 이상 20자 이하로 입력해주세요.',
    })
    .max(20),
  franchisee: z.string({
    required_error: '대리점을 선택해주세요.',
  }),
};

export const reviewFormSchema = z.discriminatedUnion('isGuestPost', [
  z.object({
    ...commonFields,
    isGuestPost: z.literal(false), // 회원이 작성한 글 → 토큰 인증
    phoneNumber: z.undefined(),
    authCode: z.undefined(),
    agreePersonalInfo: z.undefined(),
  }),
  z.object({
    ...commonFields,
    isGuestPost: z.literal(true), // 비회원이 작성한 글 → SMS 인증 필요
    phoneNumber: phoneAuthFormSchema.shape.phoneNumber,
    authCode: phoneAuthFormSchema.shape.authCode,
    agreePersonalInfo: z.literal(true, {
      errorMap: () => ({ message: '개인정보 수집 및 이용에 동의해주세요.' }),
    }),
  }),
]);
