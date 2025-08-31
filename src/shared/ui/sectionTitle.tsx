/* eslint-disable react/jsx-handler-names */

export const SectionTitle = ({ title, contents }: { title: string; contents?: string; buttonTitle?: string }) => (
  <div className="flex flex-col items-center justify-center">
    <div className={`flex flex-col gap-4 text-center`}>
      <span className="text-xl lg:text-3xl">{title}</span>
      <span className="text-base md:text-lg">{contents}</span>
    </div>
  </div>
);
