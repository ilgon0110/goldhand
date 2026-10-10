import { useQueryClient } from '@tanstack/react-query';
import { getAuth, signOut } from 'firebase/auth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { PiEnvelopeSimple, PiPhone, PiShieldCheck } from 'react-icons/pi';

import { cn } from '@/lib/utils';
import { firebaseApp } from '@/src/shared/config/firebase';
import { authKeys, userKeys } from '@/src/shared/config/queryKeys';
import type { IMyPageResponseData } from '@/src/shared/types';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';
import { formatPhoneNumber, toastError, toastSuccess } from '@/src/shared/utils';

import { useLogoutMutation } from '../api/useLogoutMutation';

interface IMyPageInfoCardProps {
  myPageData: IMyPageResponseData;
  handleWithdrawModalOpen: () => void;
}

export const MyPageInfoCard = ({ myPageData, handleWithdrawModalOpen }: IMyPageInfoCardProps) => {
  const router = useRouter();
  const auth = getAuth(firebaseApp);
  const queryClient = useQueryClient();
  const { mutate: logout } = useLogoutMutation({
    onSuccess: data => {
      signOut(auth).then(() => {
        queryClient.removeQueries({ queryKey: authKeys.all });
        queryClient.removeQueries({ queryKey: userKeys.all });
        toastSuccess(data.message || '로그아웃 되었습니다.');
        router.replace('/');
      });
    },
    onError: error => {
      toastError('로그아웃 중 오류가 발생했습니다.\n' + error.message);
    },
  });

  const isAdmin = myPageData.data.userData?.grade === 'admin';
  const isNaver = myPageData.data.userData?.provider === 'naver';
  const isLinked = myPageData.data.isLinked;
  const [isPending, startTransition] = useTransition();

  const userData = myPageData.data.userData;
  const ACTION_BUTTON = cn(
    'inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors duration-200',
    'hover:border-gold/60 hover:text-goldDeep',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-goldDeep',
  );
  const BADGE = 'inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-semibold';

  return (
    <>
      {isPending && <LoadingSpinnerOverlay text="로딩 중..." />}
      <section aria-label="회원 정보" className={cn('rounded-2xl bg-muted/50 p-5', 'md:p-8')}>
        <div className={cn('flex flex-col gap-6', 'md:flex-row md:items-start md:justify-between')}>
          {/* 이름·닉네임 + 배지 */}
          <div className="min-w-0">
            <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className={cn('text-xl font-bold text-foreground', 'md:text-2xl')}>{userData?.name || '이름'}</span>
              <span className="font-semibold text-goldDeep">{userData?.nickname || '닉네임'}</span>
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {/* 등급 */}
              <span className={cn(BADGE, isAdmin ? 'bg-goldDeep text-white' : 'bg-background text-muted-foreground')}>
                {isAdmin ? 'ADMIN' : 'BASIC'}
              </span>
              {/* 가입 경로 (브랜드 색 유지) */}
              <span className={cn(BADGE, isNaver ? 'bg-naver text-white' : 'bg-kakao text-black')}>
                <Image
                  alt={`${userData?.provider} icon`}
                  height={12}
                  src={isNaver ? '/icon/naver.png' : '/icon/kakaotalk.png'}
                  width={12}
                />
                {userData?.provider}
              </span>
              {/* 전화번호 인증 */}
              <span
                className={cn(BADGE, isLinked ? 'bg-gold/15 text-goldDeep' : 'bg-background text-muted-foreground')}
              >
                {isLinked && <PiShieldCheck aria-hidden="true" className="h-3.5 w-3.5" />}
                {isLinked ? '인증완료' : '미인증'}
              </span>
            </div>
          </div>

          {/* 연락처 */}
          <dl className={cn('space-y-2 text-sm', 'md:min-w-[260px]')}>
            <div className="flex items-center gap-3">
              <dt className="flex w-16 shrink-0 items-center gap-1.5 text-muted-foreground">
                <PiPhone aria-hidden="true" className="h-4 w-4" />
                전화
              </dt>
              <dd className="tabular-nums text-foreground">{formatPhoneNumber(userData?.phoneNumber) || '미등록'}</dd>
            </div>
            <div className="flex items-center gap-3">
              <dt className="flex w-16 shrink-0 items-center gap-1.5 text-muted-foreground">
                <PiEnvelopeSimple aria-hidden="true" className="h-4 w-4" />
                이메일
              </dt>
              <dd className="min-w-0 break-all text-foreground">{userData?.email}</dd>
            </div>
          </dl>
        </div>

        {/* 액션: 주요 동작은 pill, 탈퇴는 조용한 텍스트 버튼으로 분리 */}
        <div className={cn('mt-6 flex flex-wrap items-center gap-2 border-t border-border pt-5', 'md:mt-8')}>
          <button
            className={ACTION_BUTTON}
            type="button"
            onClick={() => startTransition(() => router.push('/mypage/edit'))}
          >
            정보 수정
          </button>
          <button
            className={ACTION_BUTTON}
            type="button"
            onClick={() => startTransition(() => router.push('/signup/phone'))}
          >
            전화번호 인증
          </button>
          <button className={ACTION_BUTTON} type="button" onClick={() => startTransition(() => logout())}>
            로그아웃
          </button>
          <button
            className={cn(
              'ml-auto px-2 text-sm text-muted-foreground underline-offset-4 transition-colors duration-200',
              'hover:text-destructive hover:underline',
            )}
            type="button"
            onClick={handleWithdrawModalOpen}
          >
            탈퇴
          </button>
        </div>
      </section>
    </>
  );
};
