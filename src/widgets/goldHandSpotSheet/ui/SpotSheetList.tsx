"use client";

import { useState } from "react";
import Row from "./row";

export function SpotSheetList() {
  const [location, setLocation] = useState<string>("경기도");

  const onClickLocation = (location: string) => {
    setLocation(location);
  };

  const items = [
    {
      title: "화성",
      address: "경기도 화성시 향남읍 상신하길로",
      phoneNumber: "010-8381-0431",
    },
    {
      title: "동탄",
      address: "경기도 동탄시 어쩌고",
      phoneNumber: "02-1234-5678",
    },
    {
      title: "수원",
      address: "경기도 수원시 어쩌고",
      phoneNumber: "031-1234-5678",
    },
  ];

  return (
    <div>
      <div className="text-base md:text-lg lg:text-2xl">
        <span className="text-[#728146] font-bold">고운황금손</span> 지점 소개
      </div>
      <button
        className="bg-[#728146] rounded-t-md px-7 py-2 text-base text-white hover:opacity-80 mt-9"
        onClick={() => onClickLocation("경기")}
      >
        경기도
      </button>
      <div className="h-[1px] w-full bg-gray-300" />
      <div className="space-y-3 my-3">
        {items.map((item, index) => (
          <div key={item.title}>
            <Row {...item} />
            {index + 1 !== items.length && (
              <div className="border-b border-slate-300 px-0 w-full mt-2" />
            )}
          </div>
        ))}
      </div>
      <div className="h-[1px] w-full bg-gray-300" />
    </div>
  );
}
