import bcrypt from 'bcryptjs';

export type TVerifyAndRotateGuestPasswordResult =
  { ok: false; reason: 'mismatch' } | { ok: true; newHashedPassword: string };

export async function verifyAndRotateGuestPassword(
  oldPassword: string,
  newPassword: string,
  storedHash: string | null,
): Promise<TVerifyAndRotateGuestPasswordResult> {
  const isMatch = await bcrypt.compare(oldPassword, storedHash || '');
  if (!isMatch) {
    return { ok: false, reason: 'mismatch' };
  }

  const newHashedPassword = await bcrypt.hash(newPassword, 10);
  return { ok: true, newHashedPassword };
}
