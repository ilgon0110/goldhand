import Link from 'next/link';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/accordion';

type TRowProps = {
  title: string;
  address: string;
  phoneNumber: string;
  naverPlaceUrl: string;
};

const Row = ({ title, address, phoneNumber, naverPlaceUrl }: TRowProps) => {
  return (
    <>
      {/* 웹뷰 */}
      <div className="hidden w-full flex-row justify-between px-2 md:flex">
        <div className="text-bold basis-1/4 md:basis-1/5">{title}</div>
        <div className="basis-1/3 text-center text-gray-600 lg:basis-1/4">{address}</div>
        <div className="basis-1/4 text-center text-gray-600 lg:basis-1/5">{phoneNumber}</div>
        <Link
          className="w-fit basis-1/4 text-right text-[#728146] underline decoration-[#728146] underline-offset-2 hover:opacity-80 md:basis-1/5"
          href={naverPlaceUrl}
          target="_blank"
        >
          네이버 플레이스 이동하기
        </Link>
      </div>
      {/* 모바일뷰 */}
      <div className="px-2 md:hidden">
        <Accordion collapsible type="single">
          <AccordionItem value="item-1">
            <AccordionTrigger className="relative flex items-center justify-start text-base">{title}</AccordionTrigger>
            <AccordionContent>
              <div className="mt-2 flex flex-col gap-2">
                <div className="text-gray-600">{address}</div>
                <div className="text-gray-600">{phoneNumber}</div>
                <Link
                  className="w-fit text-[#728146] underline decoration-[#728146] underline-offset-2 hover:opacity-80"
                  href={naverPlaceUrl}
                  target="_blank"
                >
                  네이버 플레이스 이동하기
                </Link>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
};

export default Row;
