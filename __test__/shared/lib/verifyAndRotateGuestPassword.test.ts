import bcrypt from 'bcryptjs';
import { describe, expect, it } from 'vitest';

import { verifyAndRotateGuestPassword } from '@/src/shared/lib/verifyAndRotateGuestPassword';

describe('verifyAndRotateGuestPassword', () => {
  it('기존 비밀번호가 일치하면 새 비밀번호의 해시를 반환한다', async () => {
    const storedHash = await bcrypt.hash('oldpass1234', 10);

    const result = await verifyAndRotateGuestPassword('oldpass1234', 'newpass5678', storedHash);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.newHashedPassword).not.toBe(storedHash);
      await expect(bcrypt.compare('newpass5678', result.newHashedPassword)).resolves.toBe(true);
    }
  });

  it('기존 비밀번호가 일치하지 않으면 mismatch를 반환한다', async () => {
    const storedHash = await bcrypt.hash('oldpass1234', 10);

    const result = await verifyAndRotateGuestPassword('wrongpass', 'newpass5678', storedHash);

    expect(result).toEqual({ ok: false, reason: 'mismatch' });
  });

  it('storedHash가 null이어도 항상 mismatch로 처리한다(비교 시 예외를 던지지 않음)', async () => {
    const result = await verifyAndRotateGuestPassword('anypass', 'newpass5678', null);

    expect(result).toEqual({ ok: false, reason: 'mismatch' });
  });
});
