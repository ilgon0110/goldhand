import { z } from 'zod';

export const signupPhoneFormSchema = z.object({
  phoneNumber: z.string().refine(
    value => {
      const phoneRegex = /^(010|011|016|017|018|019)\d{3,4}\d{4}$/;
      return phoneRegex.test(value);
    },
    {
      message: '올바른 휴대폰 번호를 입력해주세요. (예: 01012345678)',
    },
  ),
  authCode: z
    .string()
    .min(6, {
      message: '인증코드는 6자리입니다.',
    })
    .max(6, {
      message: '인증코드는 6자리입니다.',
    }),
});
