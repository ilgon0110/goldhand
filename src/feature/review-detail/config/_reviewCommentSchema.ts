import { z } from 'zod';

export const reviewCommentSchema = z.object({
  comment: z.string().min(1, { message: '2,000자 이하로 입력해주세요.' }).max(2000),
});
