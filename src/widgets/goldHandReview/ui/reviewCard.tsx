import { formatDateToYMD, truncateString } from "@/src/shared/utils";
import { cn } from "@/lib/utils";
import Image from "next/image";
import TruncateText from "@/src/shared/ui/TruncateText";
import { Timestamp } from "firebase/firestore";

type ReviewCardProps = {
  title: string;
  author: string;
  createdAt: Timestamp;
  description: string;
  thumbnail: string | null;
  viewMode?: "CARD" | "TABLE";
  onClick: () => void;
};

export const ReviewCard = ({
  title,
  author,
  createdAt,
  description,
  thumbnail,
  viewMode,
  onClick,
}: ReviewCardProps) => {
  return (
    <>
      {/* 카드버전, width:640px 이상 */}
      <button
        className={cn(
          "relative border-2 border-slate-200 hover:border-slate-500 transition-all duration-300 rounded-md h-[266px]",
          viewMode === undefined
            ? "hidden sm:flex flex-1 flex-col overflow-hidden"
            : viewMode === "CARD"
            ? "flex flex-col overflow-hidden"
            : "hidden"
        )}
        onClick={onClick}
      >
        {!!thumbnail ? (
          <>
            <div className="relative w-full">
              <Image
                src={thumbnail}
                width={0}
                height={0}
                alt="리뷰썸네일이미지"
                sizes="75"
                style={{ objectFit: "cover", width: "100%", height: 200 }}
              />
            </div>
            <span className="font-bold px-4 pt-1 break-keep">
              <TruncateText text={title} maxLines={1} />
            </span>
            <div className="flex gap-2 w-full px-4 mt-[1px] break-keep">
              <span className="text-gray-800 text-sm">
                <TruncateText text={author} maxLines={1} />
              </span>
              <span className="text-gray-500 text-sm">
                <TruncateText text={formatDateToYMD(createdAt)} maxLines={1} />
              </span>
            </div>
          </>
        ) : (
          <div className="p-4">
            <div className="text-start font-bold">
              <TruncateText text={title} maxLines={1} />
            </div>
            <div className="flex gap-2 w-full mt-[1px]">
              <span className="text-gray-800 text-sm">
                <TruncateText text={author} maxLines={1} />
              </span>
              <span className="text-gray-500 text-sm">
                <TruncateText text={formatDateToYMD(createdAt)} maxLines={1} />
              </span>
            </div>
            <div className="text-gray-800 text-start text-sm mt-2">
              <TruncateText text={description} maxLines={6} />
            </div>
          </div>
        )}
      </button>
      {/* 테이블 버전, width:640px 이하, 테이블 구조로 보여주기 */}
      <button
        className={cn(
          "border-b border-gray-200 p-4 gap-3 flex-row h-24",
          viewMode === undefined
            ? "sm:hidden flex flex-1"
            : viewMode === "TABLE"
            ? "flex overflow-hidden"
            : "hidden"
        )}
      >
        {!!thumbnail ? (
          <>
            <div className="relative aspect-square h-full">
              <Image
                src={thumbnail}
                width={0}
                height={0}
                alt="리뷰썸네일이미지"
                sizes="75"
                style={{ objectFit: "cover", width: "auto", height: "100%" }}
              />
            </div>
            <div className="flex flex-col text-start">
              <span className="font-bold">
                <TruncateText text={title} maxLines={1} />
              </span>
              <div className="flex gap-2 w-full mt-[1px]">
                <span className="text-gray-800 text-sm">
                  <TruncateText text={author} maxLines={1} />
                </span>
                <span className="text-gray-500 text-sm">
                  <TruncateText
                    text={formatDateToYMD(createdAt)}
                    maxLines={1}
                  />
                </span>
              </div>
              <div className="text-gray-800 text-start text-sm mt-2">
                <TruncateText text={description} maxLines={1} />
              </div>
            </div>
          </>
        ) : (
          <div>
            <div className="text-base font-bold text-start">
              <TruncateText text={title} maxLines={1} />
            </div>
            <div className="flex gap-2 w-full mt-[1px] text-sm">
              <span className="text-gray-800">
                <TruncateText text={author} maxLines={1} />
              </span>
              <span className="text-gray-500">
                <TruncateText text={formatDateToYMD(createdAt)} maxLines={1} />
              </span>
            </div>
            <div className="text-gray-800 text-start text-sm mt-2">
              <TruncateText text={description} maxLines={1} />
            </div>
          </div>
        )}
      </button>
    </>
  );
};
