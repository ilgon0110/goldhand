import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/src/shared/ui/button';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';

type TPriceSummaryCardProps = {
  title: string;
  description: string;
  priceList: { type: string; week: string; price: number }[];
  iconSrc: string;
};

export const PriceSummaryCard = ({ title, description, priceList, iconSrc }: TPriceSummaryCardProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex w-full flex-col rounded-lg border border-slate-100 bg-white shadow-md">
      {isPending && <LoadingSpinnerOverlay text="이용요금 페이지 이동중..." />}
      <Image
        alt={title}
        height={200}
        sizes="100vw"
        src={iconSrc}
        style={{ objectFit: 'contain', width: 'auto', height: 200 }}
        width={0}
      />
      <div className="flex h-full flex-col justify-between p-6">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>
        <div className="flex flex-col">
          {priceList.map(item => (
            <div className="mt-6 flex flex-row justify-between gap-6" key={uuidv4()}>
              <span className="text-lg font-semibold">{item.type}</span>
              <div className="flex flex-row items-center gap-2">
                <span className="text-sm text-gray-500">{item.week}</span>
                <span className="text-xl font-bold">{item.price.toLocaleString()}원</span>
              </div>
            </div>
          ))}
        </div>
        <Button
          className="mt-6"
          variant="outline"
          onClick={() => {
            startTransition(() => {
              router.push('/price');
            });
          }}
        >
          자세히 보기
        </Button>
      </div>
    </div>
  );
};
