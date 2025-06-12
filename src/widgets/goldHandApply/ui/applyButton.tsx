import Image from 'next/image';

type ApplyButtonProps = {
  title: string;
  buttonTitle: string;
  description: string;
  src: string;
};

export const ApplyButton = ({ title, buttonTitle, description, src }: ApplyButtonProps) => {
  return (
    <div className="relative flex w-full flex-col justify-between rounded-lg border-2 border-slate-300 p-7">
      <div className="flex flex-col gap-1">
        <span className="text-base font-bold md:text-lg lg:text-xl">{title}</span>
        <span className="break-keep text-sm md:text-base">{description}</span>
      </div>
      <div className="relative flex h-20 w-full flex-row sm:h-28">
        <button className="absolute bottom-0 left-0 z-10 max-w-[60%] break-keep rounded-md bg-[#728146] px-8 py-4 text-sm text-white hover:opacity-80 sm:text-base">
          {buttonTitle}
        </button>
        <div className="absolute bottom-0 right-0 h-[48px] w-[48px] max-w-[33%] sm:h-[100px] sm:w-[100px]">
          <Image alt="신청 아이콘 이미지" fill sizes="75" src={src} style={{ objectFit: 'contain' }} />
        </div>
      </div>
    </div>
  );
};
