type PriceCardProps = {
  title: string;
  description: string;
  priceList: string[];
  checkList: string[];
};

export const PriceCard = ({ title, description, priceList, checkList }: PriceCardProps) => {
  function formatPricePerShare(input: string): string {
    const [price, unit] = input.split('/');
    if (!price || !unit) return input; // 형식이 올바르지 않은 경우 원본 반환

    const trimmedPrice = price.trim();
    const trimmedUnit = unit.trim();

    return `${trimmedPrice}원 / ${trimmedUnit}`;
  }

  return (
    <div className="relative flex h-fit w-full flex-col rounded border border-slate-200 p-6 pb-8 shadow-xl md:max-w-[50vw] md:p-8">
      <span className="text-xl font-bold text-[#0F2E16] lg:text-3xl">{title}</span>
      {description.length > 0 && <span className="mt-4 text-base lg:text-lg">{description}</span>}
      {priceList.length > 0 && (
        <div className="mt-8 flex flex-col gap-6 text-2xl font-bold text-[#0F2E16]">
          {priceList.map(price => (
            <span key={price}>{formatPricePerShare(price)}</span>
          ))}
        </div>
      )}
      <div className="mt-10 flex flex-col gap-6">
        {checkList.map(price => (
          <span className="flex flex-row gap-4" key={price}>
            <svg fill="#0F2E16" height="24px" viewBox="0 -960 960 960" width="24px" xmlns="http://www.w3.org/2000/svg">
              <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
            </svg>
            {price}
          </span>
        ))}
      </div>
    </div>
  );
};
