import { useQueryClient } from '@tanstack/react-query';
import { getAuth, signOut } from 'firebase/auth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

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
        setTimeout(() => {
          router.replace('/');
        }, 1000);
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

  return (
    <>
      {isPending && <LoadingSpinnerOverlay text="로딩 중..." />}
      <section
        aria-label="회원 정보"
        className={cn(
          'flex flex-wrap items-center gap-x-5 gap-y-2 border border-stone-200 bg-white px-6 py-[18px]',
          'text-[13.5px] text-stone-700',
        )}
      >
        {/* 이름 + 닉네임 */}
        <span className="inline-flex items-baseline gap-2 whitespace-nowrap">
          <span className={cn('text-[15px] font-semibold tracking-[-0.005em] text-stone-900')}>
            {myPageData.data.userData?.name || '이름'}
          </span>
          <span className="text-[13px] text-greenDeep">{myPageData.data.userData?.nickname || '닉네임'}</span>
        </span>

        {/* 등급 pill */}
        <span
          className={cn(
            'inline-flex items-center whitespace-nowrap rounded-full px-[9px] py-[3px] text-[10.5px] font-medium tracking-[0.06em]',
            isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-700',
          )}
        >
          {isAdmin ? 'ADMIN' : 'BASIC'}
        </span>

        {/* 소셜 provider pill */}
        <span
          className={cn(
            'inline-flex items-center gap-[5px] rounded-full px-[9px] py-[3px]',
            'whitespace-nowrap text-[10.5px] font-medium tracking-[0.06em]',
            isNaver ? 'bg-naver text-white' : 'bg-kakao text-black',
          )}
        >
          <Image
            alt={`${myPageData.data.userData?.provider} icon`}
            height={12}
            src={isNaver ? '/icon/naver.png' : '/icon/kakaotalk.png'}
            width={12}
          />
          {myPageData.data.userData?.provider}
        </span>

        {/* 전화번호 인증 pill */}
        <span
          className={cn(
            'inline-flex items-center gap-[5px] rounded-full px-[9px] py-[3px]',
            'whitespace-nowrap text-[10.5px] font-medium tracking-[0.06em]',
            isLinked ? 'bg-greenDeep/10 text-greenDeep' : 'bg-stone-100 text-stone-500',
          )}
        >
          {isLinked && <span className="h-[5px] w-[5px] rounded-full bg-current" />}
          {isLinked ? '인증완료' : '미인증'}
        </span>

        {/* 구분선 (태블릿 이상) */}
        <span className={cn('hidden h-[18px] w-px bg-stone-200', 'md:block')} />

        {/* 전화번호 */}
        <span className="inline-flex items-center gap-2 whitespace-nowrap">
          <span className="text-[11px] tracking-[0.1em] text-stone-400">전화</span>
          <span className="text-stone-700">{formatPhoneNumber(myPageData.data.userData?.phoneNumber) || '미등록'}</span>
        </span>

        {/* 이메일 */}
        <span className="inline-flex items-center gap-2 whitespace-nowrap">
          <span className="text-[11px] tracking-[0.1em] text-stone-400">이메일</span>
          <span className="text-stone-700">{myPageData.data.userData?.email}</span>
        </span>

        {/* 액션 링크 */}
        <span
          className={cn(
            'inline-flex flex-wrap items-center gap-3.5 border-t border-stone-100 pt-2.5 text-xs',
            'w-full',
            'md:ml-auto md:w-auto md:flex-nowrap md:gap-[18px] md:border-t-0 md:pt-0 md:text-[12.5px]',
          )}
        >
          <button
            className="whitespace-nowrap bg-transparent p-0 tracking-[-0.005em] text-stone-500 transition-colors hover:text-stone-900"
            type="button"
            onClick={() => startTransition(() => router.push('/mypage/edit'))}
          >
            정보 수정
          </button>
          <button
            className="whitespace-nowrap bg-transparent p-0 tracking-[-0.005em] text-stone-500 transition-colors hover:text-stone-900"
            type="button"
            onClick={() => startTransition(() => router.push('/signup/phone'))}
          >
            전화번호 인증
          </button>
          <button
            className="whitespace-nowrap bg-transparent p-0 tracking-[-0.005em] text-stone-500 transition-colors hover:text-stone-900"
            type="button"
            onClick={() => startTransition(() => logout())}
          >
            로그아웃
          </button>
          <button
            className="whitespace-nowrap bg-transparent p-0 tracking-[-0.005em] text-stone-400 transition-colors hover:text-destructive"
            type="button"
            onClick={handleWithdrawModalOpen}
          >
            탈퇴
          </button>
        </span>
      </section>
    </>
  );
};
