import { gowunDodumFont } from "@/src/shared/fonts";

export const SectionTitle = ({
  title,
  contents,
  buttonTitle,
}: {
  title: string;
  contents?: string;
  buttonTitle: string;
}) => (
  <div className="flex flex-col justify-center items-center">
    <div
      className={`text-center ${gowunDodumFont.className} flex flex-col gap-4`}
    >
      <span className="text-2xl lg:text-5xl">{title}</span>
      <span className="text-base md:text-2xl">{contents}</span>
    </div>
    {!!buttonTitle && (
      <button className="px-4 py-2 md:px-12 md:py-4 text-sm md:text-xl w-fit rounded-full border border-[#0F2E16] hover:bg-[#0F2E16] hover:text-white transition-all duration-300 ease-in-out mt-8">
        {buttonTitle}
      </button>
    )}
  </div>
);
