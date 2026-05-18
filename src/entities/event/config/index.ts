import { z } from 'zod';

export const eventFormSchema = z.object({
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
  status: z.string({ required_error: '이벤트 상태를 선택해주세요.' }),
});

// 회원만 댓글 달 수 있음
export const eventCommentSchema = z.object({
  comment: z
    .string()
    .min(1, {
      message: '2,000자 이하로 입력해주세요.',
    })
    .max(2000),
});
