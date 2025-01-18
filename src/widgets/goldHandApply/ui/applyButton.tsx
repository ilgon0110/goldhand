import Image from "next/image";

type ApplyButtonProps = {
  title: string;
  description: string;
  src: string;
};

export const ApplyButton = ({ title, description, src }: ApplyButtonProps) => {
  return (
    <div className="w-full border-2 border-slate-300 p-7 rounded-lg flex flex-col relative justify-between">
      <div className="flex flex-col gap-1">
        <span className="text-base md:text-lg lg:text-xl font-bold">
          {title}
        </span>
        <span className="text-sm md:text-base break-keep">{description}</span>
      </div>
      <div className="flex flex-row relative w-full h-20 sm:h-28">
        <button className="absolute left-0 bottom-0 bg-[#728146] rounded-md px-8 py-4 text-sm sm:text-base text-white hover:opacity-80">{`${title.substring(
          0,
          3
        )} 신청하기`}</button>
        <div className="max-w-[33%] w-[48px] h-[48px] sm:w-[100px] sm:h-[100px] absolute right-0 bottom-0">
          <Image
            src={src}
            fill
            alt="신청 아이콘 이미지"
            sizes="75"
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
    </div>
  );
};
