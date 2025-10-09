import { SectionTitle } from '@/src/shared/ui/sectionTitle';

import { RentalCard } from './_RentalCard';

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
      <div className="mx-auto mt-3 flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        <RentalCard alt="스펙트라 유축기" src="/spectra_origin.jpg" />
        <RentalCard alt="홈 카메라" src="/webcam.jpg" />
        <RentalCard alt="스탠 좌욕기" src="/stanseat.png" />
      </div>
      <div className="mt-6 flex flex-col items-center">
        <div className="w-full max-w-xl whitespace-pre-wrap break-keep text-left leading-6 text-slate-700 lg:text-lg">
          <div>※ 서비스 기간 동안 이용 가능하며 택배로 배송해 드립니다.</div>
          <div>※ 물품대여 희망 시 서비스 해당 지사로 문의 바랍니다.</div>
          <div>※ 대여 물품은 별도 구매는 불가능합니다.</div>
          <div>※ 대여 이용 금액은 전액 무료입니다.</div>
          <div className="mt-3 font-bold">단, 왕복 택배비는 별도이며 유축기 소모품은 개별 구매해 주셔야 합니다.</div>
          <div>※ 왕복 택배비 : 10,000원</div>
        </div>
      </div>
    </>
  );
};
