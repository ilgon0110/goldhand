import { PiRankingFill } from 'react-icons/pi';

import FadeInWhenVisible from '@/src/shared/ui/FadeInWhenVisible';

export function MainTitle() {
  return (
    <div className="flex h-fit flex-col items-center justify-center gap-4 break-keep bg-slate-100 px-6 py-24 text-center md:h-[100vh] md:px-0">
      <FadeInWhenVisible>
        <div className="space-y-4">
          <span className="text-sm text-[#728146]">ABOUT</span>
          <p className="text-4xl font-bold">산모·신생아 전문 케어 서비스, 고운황금손입니다.</p>
          <div className="text-base text-slate-500 md:text-xl">
            <p>전문 교육을 이수한 산후도우미가 집으로 직접 찾아갑니다.</p>
            <p>식사 준비, 산모 마사지, 아기 돌봄까지 책임지고 돕습니다.</p>
            <p>서비스 전 상담부터 종료까지, 체계적인 관리로 운영됩니다.</p>
          </div>
          <p className="mt-4 text-3xl font-bold">
            믿고 맡길 수 있는 산후 도우미를 찾고 계시다면, 고운황금손이 답입니다.
          </p>
        </div>
      </FadeInWhenVisible>
      <FadeInWhenVisible delay={0.5}>
        <div className="mt-12 flex w-full flex-col items-center justify-center gap-4 md:flex-row md:gap-6 md:px-[10vw]">
          <Card contents="산모·신생아 케어 서비스 이용자 수" title="1,000명" />
          <Card contents="전문 교육을 이수한 산후도우미 수" title="1,500명" />
          <Card contents="고운황금손을 통해 산후도우미를 이용한 고객 수" title="10,000명" />
        </div>
      </FadeInWhenVisible>
    </div>
  );
}

const Card = ({ title, contents }: { title: string; contents: string }) => {
  return (
    <div className="group flex w-full flex-row items-center justify-center rounded border border-slate-100 bg-[#FAFAFA] py-3 transition-all duration-300 ease-in-out hover:border-none hover:bg-[#4B552F] hover:text-white md:px-9 md:py-12">
      <div className="relative flex flex-col items-center justify-center gap-2 md:gap-8">
        <PiRankingFill size={48} />
        <span className="text-center text-sm text-slate-500 group-hover:text-slate-200 sm:text-base md:text-lg">
          {contents}
        </span>
        <span className="text-center text-2xl font-bold md:text-[56px]">{title}</span>
      </div>
    </div>
  );
};
