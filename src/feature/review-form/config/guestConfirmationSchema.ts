import { z } from 'zod';

import { phoneAuthFormSchema } from '@/src/entities/phoneAuth';

export const guestConfirmationSchema = z.object({
  phoneNumber: phoneAuthFormSchema.shape.phoneNumber,
  authCode: phoneAuthFormSchema.shape.authCode,
  agreePersonalInfo: z.literal(true, {
    errorMap: () => ({ message: '개인정보 수집 및 이용에 동의해주세요.' }),
  }),
});
