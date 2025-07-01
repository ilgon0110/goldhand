'use client';

import { getAuth } from 'firebase/auth';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';
import { firebaseApp } from '@/src/shared/config/firebase';
import type { IUserDetailData } from '@/src/shared/types';
import { AnimateModal } from '@/src/shared/ui/AnimateModal';
import GridLoadingSpinner from '@/src/shared/ui/gridSpinner';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';
import { formatDateToYMD, toastError, toastSuccess } from '@/src/shared/utils';
import useNaverInit from '@/src/views/login/hooks/useNaverInit';

import { naverLoginAction } from '../hooks/naverLoginAction';

export const LoginPage = () => {
  useNaverInit();
  const auth = getAuth(firebaseApp);
  const router = useRouter();
  const params = useParams();
  const naverRef = useRef<HTMLButtonElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isRejoinDialogOpen, setIsRejoinDialogOpen] = useState(false);
  const [rejoinUserData, setRejoinUserData] = useState<IUserDetailData>();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const access_token = window.location.hash.split('=')[1]?.split('&')[0];

    if (access_token === undefined) return;
    setIsLoading(true);

    const fetchPost = async () => {
      try {
        if (isRejoinDialogOpen) return;
        // 쿠키 저장을 위해 server action 사용
        const postData = await naverLoginAction(access_token);

        // 재가입 가능한 탈퇴 유저가 로그인 했을 시
        if (postData.response === 'rejoin') {
          setRejoinUserData(postData.userData || undefined);
          setIsRejoinDialogOpen(true);

          return;
        }

        if (postData.response !== 'ok') {
          toastError(postData.message || '로그인에 실패했습니다.');
        }

        if (postData.redirectTo) {
          startTransition(() => {
            router.replace(postData.redirectTo!);
          });
        }
      } catch (error) {
        console.error(error);
        toastError('로그인에 실패했습니다. 다시 시도해주세요.\n' + (error instanceof Error ? error.message : ''));
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [params]);

  const handleNaverLoginClick = () => {
    if (!naverRef || !naverRef.current || !naverRef.current.children) return;
    (naverRef.current.children[0] as HTMLImageElement).click();
  };

  const handleRejoin = async () => {
    setIsRejoinDialogOpen(false);
    if (!rejoinUserData) return;
    try {
      const res = await (
        await fetch('/api/user/rejoin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: rejoinUserData.userId }),
        })
      ).json();
      if (res.response === 'ok') {
        toastSuccess('재가입이 완료되었습니다.');
      } else {
        toastError(res.message || '재가입에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('재가입 중 오류 발생:', error);
      toastError('재가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsRejoinDialogOpen(false);
      setRejoinUserData(undefined);
      router.replace('/');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <SectionTitle buttonTitle="" title="고운황금손 로그인" onClickButtonTitle={() => {}} />
      {isLoading && <GridLoadingSpinner text="로그인중..." />}
      {isPending && <GridLoadingSpinner text="회원가입 유무 확인중..." />}
      {!isLoading && !isPending && (
        <div className="mt-14 flex w-full max-w-[480px] flex-col gap-4">
          <AuthLoginButton
            className="cursor-not-allowed opacity-40"
            color="yellow"
            disabled
            iconSrc="/icon/kakaotalk.png"
            title="카카오로 로그인하기(준비중)"
            onClick={() => {}}
          />
          <button className="hidden" id="naverIdLogin" ref={naverRef} />
          <AuthLoginButton
            color="green"
            iconSrc="/icon/naver.png"
            title="네이버로 로그인하기"
            onClick={handleNaverLoginClick}
          />
        </div>
      )}

      {/* 재가입 다이얼로그 */}
      <AnimateModal isOpen={isRejoinDialogOpen} setIsOpen={setIsRejoinDialogOpen}>
        <p className="mb-2">고운황금손에 재가입하시겠습니까?</p>
        <p className="mb-2 text-sm lg:text-base">기존 계정 정보</p>
        <p className="mb-2 text-sm lg:text-base">가입일시 : {formatDateToYMD(rejoinUserData?.createdAt)}</p>
        <p className="mb-2 text-sm lg:text-base">탈퇴일시 : {formatDateToYMD(rejoinUserData?.deletedAt)}</p>
        <p className="mb-2 text-sm lg:text-base">이메일 : {rejoinUserData?.email || '이메일 없음'}</p>
        <p className="mb-2 text-sm lg:text-base">전화번호 : {rejoinUserData?.phoneNumber || '전화번호 없음'}</p>
        <p className="mb-2 text-sm lg:text-base">이름 : {rejoinUserData?.name || '이름 없음'}</p>
        <p className="text-sm text-gray-500">
          확인을 누르시면 고운황금손에 재가입됩니다. 재가입 후에는 기존의 탈퇴 기록이 복구되며, 이전에 사용하던 계정
          정보(이메일, 전화번호 등)로 다시 로그인할 수 있습니다.
        </p>
        <div className="absolute bottom-4 right-4 mt-4 flex w-full justify-end gap-2">
          <Button onClick={handleRejoin}>재가입</Button>
          <Button variant="outline" onClick={() => setIsRejoinDialogOpen(false)}>
            닫기
          </Button>
        </div>
      </AnimateModal>
    </div>
  );
};

type TAutoLoginButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  title: string;
  iconSrc: string;
  color: 'green' | 'yellow';
  onClick: () => void;
};

const AuthLoginButton = ({ title, iconSrc, color, onClick, ...props }: TAutoLoginButtonProps) => {
  const colorVariants = {
    green: 'bg-[#2DB400] hover:bg-green-600 text-white',
    yellow: 'bg-[#FFEB3B] hover:bg-yellow-300 text-black',
  };
  return (
    <button
      {...props}
      className={cn(
        `${colorVariants[color]} flex h-14 w-full flex-row items-center justify-center gap-2 rounded-full`,
        props.className,
      )}
      onClick={onClick}
    >
      <Image alt="icon" height={24} src={iconSrc} width={24} />
      {title}
    </button>
  );
};
