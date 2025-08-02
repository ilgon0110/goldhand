/* eslint-disable react/jsx-handler-names */

import { Button } from './button';

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
    {/* <div className={`text-center ${gowunDodumFont.className} flex flex-col gap-4`}> */}
    <div className={`flex flex-col gap-4 text-center`}>
      <span className="text-xl lg:text-3xl">{title}</span>
      <span className="text-base md:text-lg">{contents}</span>
    </div>
    {!!buttonTitle && (
      // <button
      //   className="w-fit border border-[#0F2E16] px-8 py-3 text-sm transition-all duration-300 ease-in-out hover:bg-[#0F2E16] hover:text-white md:mt-4 md:px-12 md:py-4 md:text-xl"
      //   onClick={onClickButtonTitle}
      // >
      //   {buttonTitle}
      // </button>
      <Button variant="outline" onClick={onClickButtonTitle}>
        {buttonTitle}
      </Button>
    )}
  </div>
);
