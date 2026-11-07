import { z } from 'zod';

import { ADMIN_NAME_ERROR_MESSAGE, canUseName, refineAdminOnlyName } from '@/src/feature/auth/lib/adminName';

describe('canUseName', () => {
  it.each(['관리자', '고운황금손 관리자', '수원 관리자님', '관 리 자', '관\u200B리자'])('일반 유저는 "%s"를 사용할 수 없다', name => {
    expect(canUseName(name, false)).toBe(false);
  });

  it('관리자는 "관리자"가 포함된 이름을 사용할 수 있다', () => {
    expect(canUseName('고운황금손 관리자', true)).toBe(true);
  });

  it('"관리자"가 없는 이름은 누구나 사용할 수 있다', () => {
    expect(canUseName('홍길동', false)).toBe(true);
  });
});

describe('refineAdminOnlyName', () => {
  const schema = z.object({ name: z.string() });

  it('일반 유저면 name 필드에 에러를 붙인다', () => {
    const result = schema.superRefine(refineAdminOnlyName(false)).safeParse({ name: '수원 관리자' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]).toMatchObject({ path: ['name'], message: ADMIN_NAME_ERROR_MESSAGE });
  });

  it('관리자면 통과한다', () => {
    expect(schema.superRefine(refineAdminOnlyName(true)).safeParse({ name: '관리자' }).success).toBe(true);
  });
});
