type PriceCardProps = {
  title: string;
  description: string;
  priceList: string[];
  checkList: string[];
};

export const PriceCard = ({
  title,
  description,
  priceList,
  checkList,
}: PriceCardProps) => {
  return (
    <div className="w-full md:max-w-[50vw] h-[1019px] border border-slate-200 relative shadow-xl rounded-xl md:rounded-[32px] p-6 md:p-8 flex flex-col">
      <span className="text-3xl text-[#0F2E16] font-bold">{title}</span>
      <span className="text-xl mt-4">{description}</span>
      <div className="flex flex-col gap-6 text-[#0F2E16] font-bold text-2xl md:text-5xl mt-8">
        {priceList.map((price) => (
          <span key={price}>{price}</span>
        ))}
      </div>
      <div className="flex flex-col gap-6 mt-10">
        {checkList.map((price) => (
          <span key={price} className="flex flex-row gap-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#0F2E16"
            >
              <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
            </svg>
            {price}
          </span>
        ))}
      </div>
      <button className="w-[96%] h-16 rounded bg-[#0F2E16] text-white absolute bottom-11 left-1/2 -translate-x-1/2">
        자세히 알아보기
      </button>
    </div>
  );
};
