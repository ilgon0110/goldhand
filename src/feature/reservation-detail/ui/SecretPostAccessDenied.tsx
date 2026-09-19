import Link from 'next/link';

import { Button } from '@/src/shared/ui/button';

import { SecretPostGateShell } from './SecretPostGateShell';

export function SecretPostAccessDenied() {
  return (
    <SecretPostGateShell className="text-center">
      <h2 className="text-lg font-semibold">접근 권한이 없습니다.</h2>
      <p className="mt-2 text-sm text-gray-500">작성자와 운영자만 조회가 가능합니다.</p>
      <Button asChild className="mt-6" variant="outline">
        <Link href="/">홈으로 돌아가기</Link>
      </Button>
    </SecretPostGateShell>
  );
}
