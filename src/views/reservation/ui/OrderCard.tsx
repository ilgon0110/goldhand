type OrderCardProps = {
  order: string;
  title: string;
  content: string;
  children?: React.ReactNode;
};
export const OrderCard = ({ order, title, content, children }: OrderCardProps) => {
  return (
    <>
      <div className="flex flex-row gap-2 md:gap-4">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#728146] text-sm font-bold text-white md:h-16 md:w-16 md:text-2xl">
          {order}
        </div>
        <div className="w-[90%] space-y-3">
          <div className="font-bold text-[#373737] md:text-4xl">{title}</div>
          <div className="whitespace-pre-wrap break-keep text-sm text-[#373737] md:text-2xl">{content}</div>
          {children}
        </div>
      </div>
    </>
  );
};
