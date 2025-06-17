'use client';

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';

import { firebaseApp } from '@/src/shared/config/firebase';
import GridLoadingSpinner from '@/src/shared/ui/gridSpinner';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';
//import { toastError, toastSuccess } from '@/src/shared/utils';
import useNaverInit from '@/src/views/login/hooks/useNaverInit';

import { naverLoginAction } from '../hooks/naverLoginAction';

//import { useNaverLoginMutation } from '../hooks/useNaverLoginMutation';

export const LoginPage = () => {
  useNaverInit();
  const auth = getAuth(firebaseApp);
  const router = useRouter();
  const params = useParams();
  const naverRef = useRef<HTMLButtonElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const access_token = window.location.hash.split('=')[1]?.split('&')[0];

    if (access_token === undefined) return;
    setIsLoading(true);

    const fetchPost = async () => {
      try {
        // 쿠키 저장을 위해 server action 사용
        const postData = await naverLoginAction(access_token);

        // Client side에서 이메일 로그인
        if (postData.email) {
          await signInWithEmailAndPassword(auth, postData.email, process.env.NEXT_PUBLIC_DEFAULT_PASSWORD!);
        }

        if (postData.redirectTo) {
          startTransition(() => {
            router.replace(postData.redirectTo!);
          });
        }
      } catch (error) {
        console.error(error);
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

  const onClickButtonTitle = () => {};

  return (
    <div className="flex flex-col items-center">
      <SectionTitle buttonTitle="" title="고운황금손 로그인" onClickButtonTitle={onClickButtonTitle} />
      {isLoading && <GridLoadingSpinner text="로그인중..." />}
      {isPending && <GridLoadingSpinner text="회원가입 유무 확인중..." />}
      <div className="mt-14 flex w-full max-w-[480px] flex-col gap-4">
        <Button
          className="opacity-20"
          color="yellow"
          disabled
          iconSrc="/icon/kakaotalk.png"
          title="카카오로 로그인하기"
          onClick={() => {}}
        />
        <button className="hidden" id="naverIdLogin" ref={naverRef} />
        <Button color="green" iconSrc="/icon/naver.png" title="네이버로 로그인하기" onClick={handleNaverLoginClick} />
      </div>
    </div>
  );
};

type TButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  title: string;
  iconSrc: string;
  color: 'green' | 'yellow';
  onClick: () => void;
};

const Button = ({ title, iconSrc, color, onClick, ...props }: TButtonProps) => {
  const colorVariants = {
    green: 'bg-[#2DB400] hover:bg-green-600 text-white',
    yellow: 'bg-[#FFEB3B] hover:bg-yellow-300 text-black',
  };
  return (
    <button
      className={`${colorVariants[color]} flex h-14 w-full flex-row items-center justify-center gap-2 rounded-full`}
      onClick={onClick}
      {...props}
    >
      <Image alt="icon" height={24} src={iconSrc} width={24} />
      {title}
    </button>
  );
};
