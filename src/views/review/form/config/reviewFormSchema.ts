import { z } from 'zod';

export const reviewFormSchema = z.object({
  title: z
    .string()
    .min(1, {
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
  // images: z.object({ fileArray: z.array(z.instanceof(File)) }).optional(),
  // content: z.string().min(1, {
  //   message: "상담 내용을 입력해주세요.",
  // }),
});
