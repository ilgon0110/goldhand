'use client';

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';

import { firebaseApp } from '@/src/shared/config/firebase';
import GridLoadingSpinner from '@/src/shared/ui/gridSpinner';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';
import useNaverInit from '@/src/views/login/hooks/useNaverInit';

interface ResponseGetBody {
  message: string;
  accessToken: string | null;
}

export const LoginPage = ({ data }: { data: ResponseGetBody }) => {
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
        const postData = await (
          await fetch('/api/auth/naver', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ access_token }),
          })
        ).json();

        // 반환받은 JWT를 사용하여 Client-side에서 Firebase 인증
        // if (postData?.customToken) {
        //   console.log("postData.customToken:", postData.customToken);
        //   await signInWithCustomToken(auth, postData.customToken);
        // }

        if (postData.email) {
          await signInWithEmailAndPassword(auth, postData.email, process.env.NEXT_PUBLIC_DEFAULT_PASSWORD!);
        }

        if (postData?.redirectTo) {
          startTransition(() => {
            router.replace(postData.redirectTo);
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
    return () => {};
  }, [params]);

  const handleNaverLoginClick = () => {
    if (!naverRef || !naverRef.current || !naverRef.current.children) return;
    (naverRef.current.children[0] as HTMLImageElement).click();
  };

  const onClickButtonTitle = () => {};

  if (isLoading)
    return (
      <div className="flex flex-col items-center">
        <SectionTitle buttonTitle="" title="고운황금손 로그인" onClickButtonTitle={onClickButtonTitle} />
        <div>
          <GridLoadingSpinner text="로그인중..." />
        </div>
      </div>
    );

  if (isPending) {
    return (
      <div className="flex flex-col items-center">
        <SectionTitle buttonTitle="" title="고운황금손 로그인" onClickButtonTitle={onClickButtonTitle} />
        <div>
          <GridLoadingSpinner text="회원가입 유무 확인중..." />
        </div>
      </div>
    );
  }

  if (data?.message === 'unAuthorized') {
    return (
      <div className="flex flex-col items-center">
        <SectionTitle buttonTitle="" title="고운황금손 로그인" onClickButtonTitle={onClickButtonTitle} />
        <div>회원가입 인증 실패!</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <SectionTitle buttonTitle="" title="고운황금손 로그인" onClickButtonTitle={onClickButtonTitle} />
      <div className="mt-14 flex w-full max-w-[480px] flex-col gap-4">
        <Button color="yellow" iconSrc="/icon/kakaotalk.png" title="카카오로 로그인하기" onClick={() => {}} />
        <button className="hidden" id="naverIdLogin" ref={naverRef} />
        <Button color="green" iconSrc="/icon/naver.png" title="네이버로 로그인하기" onClick={handleNaverLoginClick} />
      </div>
    </div>
  );
};

type ButtonProps = {
  title: string;
  iconSrc: string;
  color: 'green' | 'yellow';
  onClick: () => void;
};

const Button = ({ title, iconSrc, color, onClick }: ButtonProps) => {
  const colorVariants = {
    green: 'bg-[#2DB400] hover:bg-green-600 text-white',
    yellow: 'bg-[#FFEB3B] hover:bg-yellow-300 text-black',
  };
  return (
    <button
      className={`${colorVariants[color]} flex h-14 w-full flex-row items-center justify-center gap-2 rounded-full`}
      onClick={onClick}
    >
      <Image alt="icon" height={24} src={iconSrc} width={24} />
      {title}
    </button>
  );
};
