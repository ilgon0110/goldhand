import { z } from 'zod';

export const signUpFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: '2자리 이상 입력해주세요',
    })
    .max(20, {
      message: '20자리 이하로 입력해주세요',
    }),
  nickname: z
    .string()
    .min(2, {
      message: '2자리 이상 입력해주세요',
    })
    .max(20, {
      message: '20자리 이하로 입력해주세요',
    }),
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
  email: z.string().email({ message: '올바른 이메일을 입력해주세요' }),
});
