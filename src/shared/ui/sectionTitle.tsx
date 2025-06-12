import { gowunDodumFont } from '@/src/shared/fonts';

export const SectionTitle = ({
  title,
  contents,
  buttonTitle,
  onClickButtonTitle,
}: {
  title: string;
  contents?: string;
  buttonTitle: string;
  onClickButtonTitle: () => void;
}) => (
  <div className="flex flex-col items-center justify-center">
    <div className={`text-center ${gowunDodumFont.className} flex flex-col gap-4`}>
      <span className="text-2xl lg:text-5xl">{title}</span>
      <span className="text-base md:text-2xl">{contents}</span>
    </div>
    {!!buttonTitle && (
      <button
        className="w-fit rounded-full border border-[#0F2E16] px-8 py-3 text-sm transition-all duration-300 ease-in-out hover:bg-[#0F2E16] hover:text-white md:mt-4 md:px-12 md:py-4 md:text-xl"
        onClick={onClickButtonTitle}
      >
        {buttonTitle}
      </button>
    )}
  </div>
);
