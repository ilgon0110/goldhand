import { useQueryClient } from '@tanstack/react-query';
import { getAuth, signOut } from 'firebase/auth';
import { BadgeCheckIcon, BookCheck, BookX, ShieldCheckIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { cn } from '@/lib/utils';
import { firebaseApp } from '@/src/shared/config/firebase';
import type { IMyPageResponseData } from '@/src/shared/types';
import { Badge } from '@/src/shared/ui/badge';
import { Button } from '@/src/shared/ui/button';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';
import { formatPhoneNumber, toastError, toastSuccess } from '@/src/shared/utils';
import { useLogoutMutation } from '@/src/widgets/MyPageWidget';

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
        queryClient.invalidateQueries({ queryKey: ['auth'] });
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
  const [isPending, startTransition] = useTransition();
  return (
    <>
      {isPending && <LoadingSpinnerOverlay text="로딩 중..." />}
      <div className="relative mt-6 w-full rounded border border-slate-300 p-3 md:p-11">
        <div className="flex flex-col md:flex-row md:justify-between">
          <div className="flex flex-col gap-2 text-base font-bold md:flex-row md:items-center md:text-3xl">
            <div className="space-x-2">
              <span>{myPageData.data.userData?.name || '이름'}</span>
              <span className="font-medium text-[#728146]">{myPageData.data.userData?.nickname || '닉네임'}</span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <Badge
                className={cn(
                  isAdmin ? 'space-x-1 bg-purple-800 text-white' : 'space-x-1 bg-blue-500 text-white dark:bg-blue-600',
                )}
                variant="outline"
              >
                {isAdmin ? (
                  <ShieldCheckIcon data-testid="admin-grade-badge" />
                ) : (
                  <BadgeCheckIcon data-testid="basic-grade-badge" />
                )}
                <span>{myPageData.data.userData?.grade}</span>
              </Badge>
              <Badge
                className={cn(
                  myPageData.data.userData?.provider === 'naver' ? 'bg-naver text-white' : 'bg-kakao text-black',
                  'space-x-1',
                )}
                variant="outline"
              >
                <Image
                  alt="icon"
                  height={24}
                  src={myPageData.data.userData?.provider === 'naver' ? '/icon/naver.png' : '/icon/kakaotalk.png'}
                  width={24}
                />
                <span>{myPageData.data.userData?.provider}</span>
              </Badge>
              <Badge className={cn('space-x-1')} variant={myPageData.data.isLinked ? 'default' : 'outline'}>
                <span>{myPageData.data.isLinked ? <BookCheck /> : <BookX color="gray" />}</span>
                <span>{myPageData.data.isLinked ? '전화번호 인증완료' : '전화번호 미인증'}</span>
              </Badge>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-4 text-sm md:mt-8 md:flex-row md:gap-9 md:text-xl">
          <div className="space-x-2">
            <span className="text-slate-500">전화번호</span>
            <span>{formatPhoneNumber(myPageData.data.userData?.phoneNumber) || '미등록'}</span>
          </div>
          <div className="space-x-2">
            <span className="text-slate-500">이메일</span>
            <span>{myPageData.data.userData?.email}</span>
          </div>
        </div>
      </div>
      <div className="relative mt-4 flex flex-row justify-end gap-3">
        <Button
          className="absolute left-0"
          variant="outline"
          onClick={() => {
            startTransition(() => {
              logout();
            });
          }}
        >
          로그아웃
        </Button>
        <Button
          onClick={() => {
            startTransition(() => {
              router.push('/signup/phone');
            });
          }}
        >
          전화번호 인증
        </Button>
        <Button
          onClick={() => {
            startTransition(() => {
              router.push('/mypage/edit');
            });
          }}
        >
          정보수정
        </Button>
        <Button variant="destructive" onClick={handleWithdrawModalOpen}>
          회원탈퇴
        </Button>
      </div>
    </>
  );
};
