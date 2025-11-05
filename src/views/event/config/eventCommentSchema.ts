import { z } from 'zod';

// 회원만 댓글 달 수 있음
export const eventCommentSchema = z.object({
  comment: z
    .string()
    .min(1, {
      message: '2,000자 이하로 입력해주세요.',
    })
    .max(2000),
});
