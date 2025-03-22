"use client";

import { cn } from "@/lib/utils";
import {
  basicCheckList,
  basicPriceList,
  premiumCheckList,
  premiumHouseFiveDayPriceList,
  premiumHouseSixDayPriceList,
  premiumHouseSixDayCheckList,
  premiumPriceList,
  costEffectivenessPriceList,
  costEffectivenessCheckList,
  PriceCard,
} from "../index";
import { useState } from "react";
import { SectionTitle } from "@/src/shared/ui/sectionTitle";

export const PriceList = () => {
  const [type, setType] = useState<"출퇴근형" | "입주형" | "실속형">(
    "출퇴근형"
  );
  const onChangeType = (type: string) => {
    setType(type as "출퇴근형" | "입주형" | "실속형");
  };

  return (
    <div>
      <SectionTitle
        title="고운황금손 이용요금"
        contents="고운황금손의 이용요금을 확인해보세요."
        buttonTitle="이용요금 보러가기"
      />
      <div className="flex flex-row gap-7 justify-center items-center h-fit mt-10">
        <TypeButton
          type="출퇴근형"
          selectedType={type}
          onChangeType={onChangeType}
        />
        <div className="w-[1px] h-8 bg-[#D9D9D9]" />
        <TypeButton
          type="입주형"
          selectedType={type}
          onChangeType={onChangeType}
        />
        <div className="w-[1px] h-8 bg-[#D9D9D9]" />
        <TypeButton
          type="실속형"
          selectedType={type}
          onChangeType={onChangeType}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-12 mt-16 justify-center items-center">
        {type === "출퇴근형" && (
          <>
            <PriceCard
              title="주5일 출퇴근(베이직)"
              description="베이직이 뭔지 설명 간단하게"
              priceList={basicPriceList}
              checkList={basicCheckList}
            />
            <PriceCard
              title="주5일 출퇴근(프리미엄)"
              description="왜 베이직 안쓰고 프리미엄 써야되는지 소개"
              priceList={premiumPriceList}
              checkList={premiumCheckList}
            />
          </>
        )}
        {type === "입주형" && (
          <>
            <PriceCard
              title="주5일 입주형(프리미엄)"
              description="주5일 입주형(프리미엄) 설명 간단하게"
              priceList={premiumHouseFiveDayPriceList}
              checkList={premiumHouseSixDayCheckList}
            />
            <PriceCard
              title="주6일 입주형(프리미엄)"
              description="주6일 입주형(프리미엄) 설명 간단하게"
              priceList={premiumHouseSixDayPriceList}
              checkList={premiumHouseSixDayCheckList}
            />
          </>
        )}
        {type === "실속형" && (
          <PriceCard
            title="실속형"
            description="평일 09:00 ~ 14:00/평일 10:00 ~ 15:00"
            priceList={costEffectivenessPriceList}
            checkList={costEffectivenessCheckList}
          />
        )}
      </div>
    </div>
  );
};

const TypeButton = ({
  type,
  selectedType,
  onChangeType,
}: {
  type: string;
  selectedType: string;
  onChangeType: (type: string) => void;
}) => {
  const onClick = () => {
    onChangeType(type);
  };
  return (
    <button
      className={cn(
        "font-bold text-base md:text-3xl",
        type === selectedType ? "text-[#0F2E16]" : "text-[#878787]"
      )}
      onClick={onClick}
    >
      {type}
    </button>
  );
};
