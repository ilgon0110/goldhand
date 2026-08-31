import { z } from 'zod';

const commonFields = {
  title: z.string().min(2, { message: '2자 이상 100자 이하로 입력해주세요.' }).max(100),
  name: z.string().min(2, { message: '2자 이상 20자 이하로 입력해주세요.' }).max(20),
  secret: z.boolean().default(false).optional(),
  franchisee: z.string({ required_error: '대리점을 선택해주세요.' }),
  phoneNumber: z.string().refine(value => /^(010|011|016|017|018|019)\d{3,4}\d{4}$/.test(value), {
    message: '올바른 휴대폰번호를 입력해주세요. (예: 01012345678)',
  }),
  bornDate: z.date().optional(),
  location: z.string().min(1, { message: '서비스 이용 지역을 입력해주세요.' }),
  content: z.string().min(1, { message: '상담 내용을 입력해주세요.' }),
};

export const reservationFormSchema = z.discriminatedUnion('isGuestPost', [
  z.object({
    ...commonFields,
    isGuestPost: z.literal(false), // 회원이 작성한 글 → 토큰 인증, password 없음
    password: z.undefined(),
  }),
  z.object({
    ...commonFields,
    isGuestPost: z.literal(true), // 비회원이 작성한 글 → 비밀번호 인증
    password: z.string().min(4, { message: '4자 이상 입력해주세요.' }),
  }),
]);

// 수정 폼 전용: 비회원은 기존 비밀번호를 재검증한 뒤 새 비밀번호로 교체한다.
export const reservationEditFormSchema = z.discriminatedUnion('isGuestPost', [
  z.object({
    ...commonFields,
    isGuestPost: z.literal(false), // 회원이 작성한 글 → 토큰 인증, password 없음
    password: z.undefined(),
    oldPassword: z.undefined(),
  }),
  z.object({
    ...commonFields,
    isGuestPost: z.literal(true), // 비회원이 작성한 글 → 기존 비밀번호 검증 후 새 비밀번호로 교체
    oldPassword: z.string().min(4, { message: '기존 비밀번호를 입력해주세요.' }),
    password: z.string().min(4, { message: '4자 이상 입력해주세요.' }),
  }),
]);
