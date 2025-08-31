import { getAuth, signOut } from 'firebase/auth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { cn } from '@/lib/utils';
import { Badge } from '@/src/shared/ui/badge';
import { Button } from '@/src/shared/ui/button';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';
import { toastError, toastSuccess } from '@/src/shared/utils';

import { useLogoutMutation } from '../hooks/useLogoutMutation';

type TMyPageNotYetSignInProps = {
  provider: string;
};

export const MyPageNotYetSignIn = ({ provider }: TMyPageNotYetSignInProps) => {
  const auth = getAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { mutate: logout } = useLogoutMutation({
    onSuccess: () => {
      signOut(auth).then(() => {
        toastSuccess('로그아웃 되었습니다.');

        setTimeout(() => {
          router.replace('/');
        }, 2000);
      });
    },
    onError: error => {
      toastError('로그아웃 중 오류가 발생했습니다.\n' + error.message);
    },
  });

  const providerKo = provider === 'kakao' ? '카카오' : '네이버';

  return (
    <>
      {isPending && <LoadingSpinnerOverlay text="회원가입 페이지로 이동 중..." />}
      <SectionTitle title="고운황금손 마이페이지" />
      <div className="mt-12 flex flex-col items-center justify-center space-y-4">
        <div className="flex items-center text-center text-xl font-bold">
          <Badge className={cn(provider === 'naver' ? 'bg-naver text-white' : 'bg-kakao text-black', 'space-x-1')}>
            <Image
              alt="icon"
              height={24}
              src={provider === 'naver' ? '/icon/naver.png' : '/icon/kakaotalk.png'}
              width={24}
            />
            <span>{providerKo}</span>
          </Badge>
          로 로그인은 완료했으나, 아직 회원가입을 하지 않으셨습니다.
        </div>
        <span className="text-lg text-[#728146]">회원가입을 먼저 진행해주세요.</span>
        <span className="mt-2">혹시 다른 계정으로 로그인을 원하시면 로그아웃 후 다시 로그인해주세요.</span>
        <div className="space-x-3">
          <Button
            onClick={() => {
              startTransition(() => {
                router.push('/signup');
              });
            }}
          >
            회원가입
          </Button>
          <Button variant="outline" onClick={() => logout()}>
            로그아웃
          </Button>
        </div>
      </div>
    </>
  );
};
