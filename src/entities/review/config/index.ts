import { z } from 'zod';

export const reviewFormSchema = z.object({
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
});
