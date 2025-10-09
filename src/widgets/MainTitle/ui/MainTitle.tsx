import { GrUserFemale } from 'react-icons/gr';
import { MdPlace } from 'react-icons/md';
import { PiUsersFourFill } from 'react-icons/pi';

import { cn } from '@/lib/utils';
import FadeInWhenVisible from '@/src/shared/ui/FadeInWhenVisible';

import { TitleCard } from './_TitleCard';

export function MainTitle() {
  return (
    <div
      className={cn(
        'flex h-fit flex-col items-center justify-center gap-4 break-keep bg-slate-100 px-6 py-24 text-center',
        'md:h-[100vh] md:px-0',
      )}
    >
      <FadeInWhenVisible>
        <div className="space-y-4">
          <p className="text-4xl font-bold">산모·신생아 전문 케어 서비스, 고운황금손입니다.</p>
          <div className={cn('text-base text-slate-500', 'md:text-xl')}>
            <p>전문 교육을 이수한 산후도우미가 집으로 직접 찾아갑니다.</p>
            <p>식사 준비, 아기 돌봄까지 책임지고 돕습니다.</p>
            <p>서비스 전 상담부터 종료까지, 체계적인 관리로 운영됩니다.</p>
          </div>
          <p className="mt-4 text-3xl font-bold">
            믿고 맡길 수 있는 산후 도우미를 찾고 계시다면, 고운황금손이 답입니다.
          </p>
        </div>
      </FadeInWhenVisible>
      <FadeInWhenVisible delay={0.5}>
        <div
          className={cn(
            'mt-12 flex w-full flex-col items-center justify-center gap-4',
            'md:flex-row md:gap-6 md:px-[10vw]',
          )}
        >
          <TitleCard contents="산모 신생아 케어 서비스 이용자 수" icon={<PiUsersFourFill size={48} />} title="2,000+" />
          <TitleCard contents="전문 교육을 이수한 산후도우미 수" icon={<GrUserFemale size={48} />} title="100+" />
          <TitleCard contents="고운황금손 만족후기" icon={<MdPlace size={48} />} title="1,000+" />
        </div>
      </FadeInWhenVisible>
    </div>
  );
}
