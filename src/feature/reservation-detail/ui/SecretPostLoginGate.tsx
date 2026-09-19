'use client';

import Link from 'next/link';

import { Button } from '@/src/shared/ui/button';
import { LoadingSpinnerIcon } from '@/src/shared/ui/loadingSpinnerIcon';

import { useAuthReturnRefresh } from '../model/useAuthReturnRefresh';
import { SecretPostGateShell } from './SecretPostGateShell';

type TSecretPostLoginGateProps = { docId: string };

export function SecretPostLoginGate({ docId }: TSecretPostLoginGateProps) {
  const isWaitingForRefresh = useAuthReturnRefresh();

  if (isWaitingForRefresh) {
    return (
      <SecretPostGateShell className="text-center">
        <div className="flex flex-col items-center gap-3">
          <LoadingSpinnerIcon />
          <p className="text-sm text-gray-500">게시글을 불러오는 중입니다...</p>
        </div>
      </SecretPostGateShell>
    );
  }

  return (
    <SecretPostGateShell className="text-center">
      <h2 className="text-lg font-semibold">로그인이 필요한 게시글입니다.</h2>
      <p className="mt-2 text-sm text-gray-500">로그인하면 작성한 게시글을 바로 확인할 수 있습니다.</p>
      <Button asChild className="mt-6">
        <Link href={`/login?redirect=${encodeURIComponent(`/reservation/list/${docId}`)}`}>로그인하기</Link>
      </Button>
    </SecretPostGateShell>
  );
}
