import { z } from 'zod';

export const detailFormSchema = z.object({
  password: z.string().min(4, {
    message: '4자 이상  입력해주세요.',
  }),
});
