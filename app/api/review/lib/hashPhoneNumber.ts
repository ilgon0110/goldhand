import { createHmac } from 'crypto';

export function hashPhoneNumber(phoneNumber: string): string {
  const secret = process.env.PHONE_HASH_SECRET;
  if (!secret) {
    throw new Error('PHONE_HASH_SECRET 환경변수가 설정되어 있지 않습니다.');
  }

  const normalized = phoneNumber.replace(/\D/g, '');
  return createHmac('sha256', secret).update(normalized).digest('hex');
}
