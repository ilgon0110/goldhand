import { z } from 'zod';

export const myPageFormSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: '2자 이상 100자 이하로 입력해주세요.',
    })
    .max(100),
  nickname: z
    .string()
    .min(2, {
      message: '2자 이상 20자 이하로 입력해주세요.',
    })
    .max(20),
  email: z.string().email({ message: '올바른 이메일을 입력해주세요' }),
});
