import { z } from 'zod';

export const detailPasswordFormSchema = z.object({
  password: z.string().min(1, { message: '비밀번호를 입력해주세요.' }),
});
