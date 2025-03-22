"use client";

import { cn } from "@/lib/utils";
import { ReviewPagination, type IReviewData } from "../index";
import { SectionTitle } from "@/src/shared/ui/sectionTitle";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/ui/select";
import { ReviewCard } from "@/src/widgets/goldHandReview";
import { useState } from "react";

export const ReviewPage = ({ data }: { data: IReviewData["data"] }) => {
  const [viewMode, setViewMode] = useState<"CARD" | "TABLE">("CARD");

  return (
    <div>
      <SectionTitle title="이용 후기" buttonTitle="" />
      <div className="w-full flex flex-row justify-between">
        <Select defaultValue="화성점">
          <SelectTrigger className="w-[180px] mt-4">
            <SelectValue placeholder="지점 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>지점 선택</SelectLabel>
              <SelectItem value="화성점">화성점</SelectItem>
              <SelectItem value="동탄점">동탄점</SelectItem>
              <SelectItem value="수원점">수원점</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex flex-row gap-2">
          <button
            className={cn(
              "fill-slate-200 hover:fill-slate-500 transition-all duration-300 ease-in-out",
              viewMode === "TABLE" && "fill-slate-500"
            )}
            onClick={() => setViewMode("TABLE")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="current"
            >
              <path d="M320-80q-33 0-56.5-23.5T240-160v-480q0-33 23.5-56.5T320-720h480q33 0 56.5 23.5T880-640v480q0 33-23.5 56.5T800-80H320Zm0-80h200v-120H320v120Zm280 0h200v-120H600v120ZM80-240v-560q0-33 23.5-56.5T160-880h560v80H160v560H80Zm240-120h200v-120H320v120Zm280 0h200v-120H600v120ZM320-560h480v-80H320v80Z" />
            </svg>
          </button>
          <button
            className={cn(
              "fill-slate-200 hover:fill-slate-500 transition-all duration-300 ease-in-out",
              viewMode === "CARD" && "fill-slate-500"
            )}
            onClick={() => setViewMode("CARD")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="current"
            >
              <path d="M80-360v-240q0-33 23.5-56.5T160-680q33 0 56.5 23.5T240-600v240q0 33-23.5 56.5T160-280q-33 0-56.5-23.5T80-360Zm280 160q-33 0-56.5-23.5T280-280v-400q0-33 23.5-56.5T360-760h240q33 0 56.5 23.5T680-680v400q0 33-23.5 56.5T600-200H360Zm360-160v-240q0-33 23.5-56.5T800-680q33 0 56.5 23.5T880-600v240q0 33-23.5 56.5T800-280q-33 0-56.5-23.5T720-360Zm-360 80h240v-400H360v400Zm120-200Z" />
            </svg>
          </button>
        </div>
      </div>
      <section
        className={cn(
          "mt-6 grid gap-3",
          viewMode === "TABLE"
            ? "grid-cols-1"
            : "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        )}
      >
        {data.map((review) => (
          <ReviewCard
            key={review.id}
            title={review.title}
            author={review.author}
            created_at={review.created_at}
            description={review.content}
            thumbnail={review.thumbnail}
            viewMode={viewMode}
          />
        ))}
      </section>
      <section className="mt-6">
        <ReviewPagination dataLength={10} maxColumnNumber={3} />
      </section>
    </div>
  );
};
