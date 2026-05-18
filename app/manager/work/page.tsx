'use client';

import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import SectionTitleHero from '@/src/shared/ui/SectionTitleHero';

import { BabyCardInfo, FamilyCardInfo, MotherCardInfo, StudentCardInfo } from './config';
import { EtiquetteCard } from './ui/_EtiquetteCard';
import { ManagerWorkCard } from './ui/_ManagerWorkCard';

const ManagerWorkPage = () => {
  return (
    <div className="flex flex-col items-center">
      {/* 1. Hero */}
      <SectionTitleHero
        description="산모님의 회복과 신생아의 안정을 최우선으로, 체계적인 산후 케어를 제공합니다."
        label="산후관리사가 하는 일"
      />

      {/* 2. Lede */}
      <div className={cn('mx-auto max-w-xl px-6 text-center')}>
        <p className={cn('break-keep text-sm leading-loose text-stone-700', 'md:text-base')}>
          산후관리사는 산모와 신생아, 그리고 직계 가족(남편·아이들)에 관련된 일을 주로 수행합니다. 체계적인 산모·신생아
          관리를 통해 산모의 건강 회복과 가정의 안정을 돕는 것이 핵심 역할입니다.
        </p>
      </div>

      {/* 3. Gold Rule */}
      <div className="my-6 flex justify-center">
        <div className="h-14 w-px bg-gold" />
      </div>

      {/* 4. Pull Quote */}
      <div className={cn('mx-auto max-w-2xl px-6 text-center')}>
        <div className="mb-4 text-5xl leading-none text-gold/50">&ldquo;</div>
        <p className={cn('break-keep text-xl leading-relaxed tracking-tight text-stone-900', 'md:text-2xl')}>
          산모와 신생아 보호를 최우선으로 하며,
          <br />그 외 가사 업무 지원은 별도의 규정에 따릅니다.
        </p>
      </div>

      {/* 5. Care Areas */}
      <section className={cn('mx-auto mt-20 w-full max-w-5xl px-6', 'md:px-8')}>
        <div className="mb-12 text-center">
          <p className="mb-4 text-xs tracking-[0.4em] text-gold">CARE AREAS</p>
          <p className={cn('mt-4 text-sm text-stone-400', 'md:text-base')}>
            산모와 신생아의 회복을 중심으로, 가족 모두의 일상이 평온하도록 도와드립니다.
          </p>
        </div>
        <motion.div
          className={cn('grid grid-cols-1 border-t border-[#E8E1D2]', 'md:grid-cols-2')}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {[MotherCardInfo, BabyCardInfo, StudentCardInfo, FamilyCardInfo].map((info, idx) => (
            <div className={cn(idx % 2 === 0 ? 'md:border-r md:border-[#E8E1D2]' : '')} key={info.title}>
              <ManagerWorkCard contentList={info.contentList} index={idx + 1} note={info.note} title={info.title} />
            </div>
          ))}
        </motion.div>
      </section>

      {/* 6. Etiquette */}
      <section className={cn('mx-auto mt-20 w-full max-w-3xl px-6', 'md:px-8')}>
        <div className="mb-12 text-center">
          <p className="mb-4 text-xs tracking-[0.4em] text-gold">ETIQUETTE</p>
          <h2 className={cn('text-3xl font-semibold tracking-tight text-stone-900', 'md:text-4xl')}>
            산후관리사에 대한
            <br />
            기본 에티켓
          </h2>
          <p className={cn('mt-4 text-sm text-stone-400', 'md:text-base')}>
            관리사가 산모님과 아기에게 온전히 집중할 수 있도록, 네 가지를 부탁드립니다.
          </p>
        </div>
        <div className="border-b border-[#E8E1D2]">
          <EtiquetteCard number="01" title="산모와 신생아 돌봄이 주 업무입니다">
            산후관리사는 <strong className="text-stone-900">산모와 신생아를 돌보는 것이 주 업무</strong>로, 발코니나
            대청소, 커튼·이불 빨래, 김치담그기, 손님상 차리기 등 산후관리와 직접 관련이 없는 일은 하지 않습니다.{' '}
            <span className="font-semibold text-greenDeep">산모의 산후관리와 신생아 돌보기</span>에 전념할 수 있도록
            협조해 주시기 바랍니다.
          </EtiquetteCard>
          <EtiquetteCard number="02" title="의료인이 아닌 회복 도우미입니다">
            <strong className="text-stone-900">산후관리사는 의료인이 아닙니다.</strong> 의료인으로 생각하셔서 과잉
            기대를 하시는 경우가 간혹 있습니다. 산후관리사는 산모와 아기의 회복과 안정을 돕는 사람이며, 질병의 진단과
            치료는 의료 행위이므로 관리사가 수행하지 않습니다.
          </EtiquetteCard>
          <EtiquetteCard number="03" title="전문 교육을 이수한 '관리사님'입니다">
            산후관리사는 일반 가사도우미와 달리{' '}
            <strong className="text-stone-900">산모님과 신생아에 대한 전문적인 교육</strong>을 이수한 분들로, 호칭은{' '}
            <strong className="text-stone-900">&apos;관리사님&apos;</strong>으로 불러주시고 인격적으로 대해 주시기
            바랍니다.{' '}
            <span className="font-semibold text-greenDeep">신생아는 산후관리사에게 믿고 맡겨 주셔도 좋습니다.</span>{' '}
            관리사의 점심 식사는 산모님 가정에서 드시게 됩니다.
          </EtiquetteCard>
          <EtiquetteCard number="04" title="입주·출퇴근 시 부탁드리는 점">
            입주형의 경우, 매끼 식사는 산모님 가정에서 드시며, 관리사가 거주할 방을 마련해 주시고 저녁 8시 이후에는
            아기를 보살피며 휴식할 수 있도록 해 주세요. 출산 전 산후관리에 필요한 기본 음식 재료를 준비해 주시면 보다
            케어에 집중할 수 있습니다. 출퇴근 이용 시 장보기를 원하시는 경우, 근무시간 내에서 이루어질 수 있도록 협조
            부탁드립니다.
          </EtiquetteCard>
        </div>
      </section>

      {/* 7. Closing */}
      <div className={cn('mx-auto mt-24 max-w-xl px-6 pb-32 text-center')}>
        <p className={cn('break-keep text-lg leading-loose text-stone-700', 'md:text-xl')}>
          산모님의 가장 고운 시기에,
          <br />
          가장 다정한 손길이 함께합니다.
        </p>
        <p className="mt-7 text-xs tracking-[0.4em] text-gold">─── 고운황금손 ───</p>
      </div>
    </div>
  );
};

export default ManagerWorkPage;
