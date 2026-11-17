import { z } from 'zod';

export const commentEditSchema = z.object({
  editComment: z
    .string()
    .min(1, {
      message: '2,000자 이하로 입력해주세요.',
    })
    .max(2000),
});
