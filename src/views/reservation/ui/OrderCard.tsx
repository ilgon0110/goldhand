type OrderCardProps = {
  order: string;
  title: string;
  content: string;
  children?: React.ReactNode;
};
export const OrderCard = ({
  order,
  title,
  content,
  children,
}: OrderCardProps) => {
  return (
    <>
      <div className="flex flex-row gap-2 md:gap-4">
        <div className="w-6 h-6 md:w-16 md:h-16 rounded-full flex justify-center items-center font-bold text-sm md:text-2xl bg-[#728146] text-white">
          {order}
        </div>
        <div className="space-y-3 w-[90%]">
          <div className="font-bold md:text-4xl text-[#373737]">{title}</div>
          <div className="text-sm md:text-2xl text-[#373737] break-keep whitespace-pre-wrap">
            {content}
          </div>
          {children}
        </div>
      </div>
    </>
  );
};
