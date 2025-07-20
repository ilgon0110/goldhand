import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

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
        }, 3000);
      });
    },
    onError: error => {
      toastError('로그아웃 중 오류가 발생했습니다.\n' + error.message);
    },
  });

  return (
    <>
      {isPending && <LoadingSpinnerOverlay text="회원가입 페이지로 이동 중..." />}
      <SectionTitle buttonTitle="" title="고운황금손 마이페이지" onClickButtonTitle={() => {}} />
      <div className="mt-12 flex flex-col items-center justify-center space-y-4">
        <span className="text-xl font-bold">{provider}로 로그인은 완료했으나, 아직 회원가입을 하지 않으셨습니다.</span>
        <span className="text-[#728146]">회원가입을 먼저 진행해주세요.</span>
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
