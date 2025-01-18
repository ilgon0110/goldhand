import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";

type RowProps = {
  title: string;
  address: string;
  phoneNumber: string;
};

const Row = ({ title, address, phoneNumber }: RowProps) => {
  return (
    <>
      {/* 웹뷰 */}
      <div className="hidden md:flex w-full flex-row justify-between px-2">
        <div className="text-bold basis-1/4 md:basis-1/5">{title}</div>
        <div className="text-gray-600 basis-1/3 lg:basis-1/4 text-center">
          {address}
        </div>
        <div className="text-gray-600 basis-1/4 lg:basis-1/5 text-center">
          {phoneNumber}
        </div>
        <button className="w-fit text-[#728146] text-right basis-1/4 md:basis-1/5 underline decoration-[#728146] underline-offset-2 hover:opacity-80">
          자세히 보기
        </button>
      </div>
      {/* 모바일뷰 */}
      <div className="md:hidden px-2">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="flex  justify-start items-center relative text-base">
              {title}
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2 mt-2">
                <div className="text-gray-600">{address}</div>
                <div className="text-gray-600">{phoneNumber}</div>
                <button className="text-[#728146] underline decoration-[#728146] underline-offset-2 hover:opacity-80 w-fit">
                  자세히 보기
                </button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
};

export default Row;
