"use client";

import { SectionTitle } from "@/src/shared/ui/sectionTitle";
import Image from "next/image";
import { useEffect, useRef } from "react";
import Router, { useRouter } from "next/router";
import useNaverInit from "@/src/views/login/hooks/useNaverInit";

export const LoginPage = () => {
  useNaverInit();
  const naverRef = useRef<HTMLButtonElement>(null);

  const handleNaverLoginClick = () => {
    if (!naverRef || !naverRef.current || !naverRef.current.children) return;
    (naverRef.current.children[0] as HTMLImageElement).click();
  };

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
