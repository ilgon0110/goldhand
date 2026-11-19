import { describe, expect, it } from 'vitest';

import { reviewContentSchema } from '@/src/entities/review/config';

describe('reviewContentSchema', () => {
  it('휴대폰 인증 필드 없이 후기 작성 필드만 검증한다', () => {
    const result = reviewContentSchema.safeParse({
      name: '홍길동',
      title: '후기 제목입니다.',
      franchisee: '전체',
    });

    expect(result.success).toBe(true);
  });
});
