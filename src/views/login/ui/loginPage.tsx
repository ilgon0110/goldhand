"use client";

import { SectionTitle } from "@/src/shared/ui/sectionTitle";
import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter, useParams } from "next/navigation";
import useNaverInit from "@/src/views/login/hooks/useNaverInit";
import { useAuthStore } from "@/src/shared/store";
import GridLoadingSpinner from "@/src/shared/ui/gridSpinner";

interface ResponseGetBody {
  message: string;
  accessToken: string | null;
}

export const LoginPage = ({ data }: { data: ResponseGetBody }) => {
  useNaverInit();
  const router = useRouter();
  const params = useParams();
  const naverRef = useRef<HTMLButtonElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { setAccessToken } = useAuthStore();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const access_token = window.location.hash.split("=")[1]?.split("&")[0];

    if (access_token === undefined) return;
    setIsLoading(true);
    const fetchPost = async () => {
      try {
        const res = await fetch("/api/auth/naver", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ access_token }),
        });

        const postData = await res.json();

        if (postData?.accessToken) {
          setAccessToken(postData.accessToken);
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

  if (isLoading)
    return (
      <div className="flex flex-col items-center">
        <SectionTitle title="고운황금손 로그인" buttonTitle="" />
        <div>
          <GridLoadingSpinner text="로그인중..." />
        </div>
      </div>
    );

  if (isPending) {
    return (
      <div className="flex flex-col items-center">
        <SectionTitle title="고운황금손 로그인" buttonTitle="" />
        <div>
          <GridLoadingSpinner text="회원가입 유무 확인중..." />
        </div>
      </div>
    );
  }

  if (data?.message === "unAuthorized") {
    return (
      <div className="flex flex-col items-center">
        <SectionTitle title="고운황금손 로그인" buttonTitle="" />
        <div>회원가입 인증 실패!</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <SectionTitle title="고운황금손 로그인" buttonTitle="" />
      <div className="w-full flex flex-col gap-4 max-w-[480px] mt-14">
        <Button
          title="카카오로 로그인하기"
          iconSrc="/icon/kakaotalk.png"
          color="yellow"
          onClick={() => {}}
        />
        <button ref={naverRef} id="naverIdLogin" className="hidden" />
        <Button
          title="네이버로 로그인하기"
          iconSrc="/icon/naver.png"
          color="green"
          onClick={handleNaverLoginClick}
        />
      </div>
    </div>
  );
};

type ButtonProps = {
  title: string;
  iconSrc: string;
  color: "green" | "yellow";
  onClick: () => void;
};

const Button = ({ title, iconSrc, color, onClick }: ButtonProps) => {
  const colorVariants = {
    green: "bg-[#2DB400] hover:bg-green-600 text-white",
    yellow: "bg-[#FFEB3B] hover:bg-yellow-300 text-black",
  };
  return (
    <button
      className={`${colorVariants[color]} rounded-full w-full h-14 flex flex-row items-center justify-center gap-2`}
      onClick={onClick}
    >
      <Image src={iconSrc} alt="icon" width={24} height={24} />
      {title}
    </button>
  );
};
