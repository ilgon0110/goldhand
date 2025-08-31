import { SectionTitle } from '@/src/shared/ui/sectionTitle';

import { RentalCard } from './RentalCard';

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
    <>
      <SectionTitle title="고운황금손 대여물품" />
      <div className="mt-6 flex flex-col items-center justify-between gap-4 md:flex-row">
        {items.map(el => {
          return <RentalCard alt={el.alt} key={el.alt} src={el.src} />;
        })}
      </div>
    </>
  );
};
