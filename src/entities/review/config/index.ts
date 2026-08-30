import { z } from 'zod';

import { phoneAuthFormSchema } from '@/src/entities/phoneAuth';

const reviewContentFields = {
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

export const reviewContentSchema = z.object(reviewContentFields);

export const guestConfirmationSchema = z.object({
  phoneNumber: phoneAuthFormSchema.shape.phoneNumber,
  authCode: phoneAuthFormSchema.shape.authCode,
  agreePersonalInfo: z.literal(true, {
    errorMap: () => ({ message: '개인정보 수집 및 이용에 동의해주세요.' }),
  }),
});

export const reviewFormSchema = z.discriminatedUnion('isGuestPost', [
  z.object({
    ...reviewContentFields,
    isGuestPost: z.literal(false), // 회원이 작성한 글 → 토큰 인증
    phoneNumber: z.undefined(),
    authCode: z.undefined(),
    agreePersonalInfo: z.undefined(),
  }),
  z.object({
    ...reviewContentFields,
    isGuestPost: z.literal(true), // 비회원이 작성한 글 → SMS 인증 필요
    phoneNumber: phoneAuthFormSchema.shape.phoneNumber,
    authCode: phoneAuthFormSchema.shape.authCode,
    agreePersonalInfo: z.literal(true, {
      errorMap: () => ({ message: '개인정보 수집 및 이용에 동의해주세요.' }),
    }),
  }),
]);

// 수정 폼 전용: 개인정보 동의는 최초 작성 시 1회만 받으므로 재요구하지 않는다.
// isGuestPost는 "이 수정 요청에 SMS 재인증이 필요한지"를 의미한다(관리자가 비회원 글을 수정할 땐 불필요).
export const reviewEditFormSchema = z.discriminatedUnion('isGuestPost', [
  z.object({
    ...reviewContentFields,
    isGuestPost: z.literal(false),
    phoneNumber: z.undefined(),
    authCode: z.undefined(),
  }),
  z.object({
    ...reviewContentFields,
    isGuestPost: z.literal(true),
    phoneNumber: phoneAuthFormSchema.shape.phoneNumber,
    authCode: phoneAuthFormSchema.shape.authCode,
  }),
]);
