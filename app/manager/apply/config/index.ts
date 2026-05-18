import { z } from 'zod';

export const managerApplySchema = z.object({
  name: z
    .string()
    .min(1, {
      message: '2자 이상 100자 이하로 입력해주세요.',
    })
    .max(100),
  phoneNumber: z.string().refine(
    value => {
      const phoneRegex = /^(010|011|016|017|018|019)\d{3,4}\d{4}$/;
      return phoneRegex.test(value);
    },
    {
      message: '올바른 휴대폰 번호를 입력해주세요. (예: 01012345678)',
    },
  ),
  franchisee: z.string({
    required_error: '대리점을 선택해주세요.',
  }),
  location: z.string().min(1, {
    message: '거주하고 계신 지역을 입력해주세요.',
  }),
  email: z.string().email({ message: '올바른 이메일을 입력해주세요' }),
  content: z
    .string()
    .min(1, {
      message: '내용을 입력해주세요.',
    })
    .max(700, {
      message: '700자 이하로 입력해주세요.',
    }),
});
