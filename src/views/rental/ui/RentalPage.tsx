import Image from 'next/image';

import { SectionTitle } from '@/src/shared/ui/sectionTitle';

export const RentalPage = () => {
  const items = [
    {
      src: '/spectra.png',
      alt: '스펙트라 유축기',
    },
    {
      src: '/home_cam.png',
      alt: '홈 카메라',
    },
    {
      src: '/stan_seat.png',
      alt: '스탠 좌욕기',
    },
  ];
  return (
    <div>
      <SectionTitle buttonTitle="" title="고운황금손 대여물품" onClickButtonTitle={() => {}} />
      <div className="mt-6 flex flex-col items-center justify-between gap-4 md:flex-row">
        {items.map(el => {
          return <Card alt={el.alt} key={el.alt} src={el.src} />;
        })}
      </div>
    </div>
  );
};

const Card = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div className="relative h-[400px] w-full bg-[#F0F4FA]">
      <div className="absolute right-0 top-6">
        <Image alt={alt} height={200} src={src} style={{ objectFit: 'contain' }} width={200} />
      </div>
      <span className="absolute bottom-20 left-4 text-2xl font-bold">{alt}</span>
    </div>
  );
};
