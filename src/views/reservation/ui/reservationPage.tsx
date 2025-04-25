"use client";

import { SectionTitle } from "@/src/shared/ui/sectionTitle";
import Image from "next/image";
import { useEffect, useState } from "react";
import { orderCardList, FAQItemList, OrderCard, FAQItem } from "../index";
import Link from "next/link";

export const ReservationPage = () => {
  const waitingNumber = 35;
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === "undefined") return;
      setHeight(Math.min(window.scrollY * 0.1, 90));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <div className="relative">
        <SectionTitle title="고운황금손 예약상담" buttonTitle="" />
        <div
          className={`w-[1px] border border-dashed border-slate-400 absolute left-3 md:left-8 top-32 -z-10`}
          style={{ height: `${height}%` }}
        />
        <div className="mt-14 space-y-[9vw]">
          {orderCardList.map((orderCard, index) => (
            <OrderCard
              key={orderCard.title}
              order={(index + 1).toString()}
              title={orderCard.title}
              content={orderCard.content}
            >
              {index === 0 ? (
                <div className="flex flex-row gap-6 md:gap-10">
                  <div className="flex flex-row gap-2 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 -960 960 960"
                      fill="#728146"
                      className="w-6 h-6 md:w-12 md:h-12"
                    >
                      <path d="M776-487q-5-121-89-205t-205-89v-60q72 2 135.5 30.5T729-734q48 48 76.5 111.5T836-487h-60Zm-169 0q-5-50-40-84.5T482-611v-60q75 5 127.5 57T667-487h-60Zm188 367q-116 0-236.5-56T335-335Q232-438 176-558.5T120-795q0-19.29 12.86-32.14Q145.71-840 165-840h140q14 0 24 10t14 25l26.93 125.64Q372-665 369.5-653.5t-10.73 19.73L259-533q26 44 55 82t64 72q37 38 78 69.5t86 55.5l95-98q10-11 23.15-15 13.15-4 25.85-2l119 26q15 4 25 16.04 10 12.05 10 26.96v135q0 19.29-12.86 32.14Q814.29-120 795-120ZM229-588l81-82-23-110H180q2 42 13.5 88.5T229-588Zm369 363q41 19 89 31t93 14v-107l-103-21-79 83ZM229-588Zm369 363Z" />
                    </svg>
                    <div className="md:text-2xl">010-1234-5678</div>
                  </div>
                  <div className="flex flex-row gap-2 items-center">
                    <div className="w-6 h-6 md:w-12 md:h-12 relative">
                      <Image
                        src="/icon/kakaotalk.png"
                        alt="Kakao"
                        fill
                        sizes="100vw"
                      />
                    </div>
                    <div className="md:text-2xl">
                      <span className="font-bold">{"고운황금손"}</span> 검색
                    </div>
                  </div>
                </div>
              ) : null}
            </OrderCard>
          ))}
        </div>
      </div>
      <div className="mt-20 px-[10vw]">
        <SectionTitle title="예약상담 FAQ" buttonTitle="" />
        <div className="space-y-6 mt-6">
          {FAQItemList.map((faqItem) => (
            <>
              <FAQItem
                key={faqItem.title}
                title={faqItem.title}
                content={faqItem.content}
              />
              <div className="w-full h-[1px] bg-gray-500" />
            </>
          ))}
        </div>
        <div className="mt-10 flex justify-center items-center flex-col space-y-2 md:space-y-4">
          <div className="text-base md:text-2xl mx-auto">
            현재{" "}
            <span className="font-bold text-[#0F2E16]">{waitingNumber}</span>
            명의 산모님들이 상담중입니다
          </div>
          <Link
            href="reservation/apply"
            className="w-full mx-auto py-4 md:py-[2vw] flex justify-center items-center bg-[#728146] hover:bg-[#062E16] transition-all duration-300 ease-in-out rounded-full text-white text-base md:text-3xl"
          >
            예약상담 신청하기
          </Link>
        </div>
      </div>
    </div>
  );
};
