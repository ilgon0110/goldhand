'use client';

import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';

import { BabyCardInfo, FamilyCardInfo, MotherCardInfo, StudentCardInfo } from '../config/const';
import { EtiquetteCard } from './_EtiquetteCard';
import { ManagerWorkCard } from './_ManagerWorkCard';

export const NewManagerWorkPage = () => {
  return (
    <div className="mt-12 flex flex-col items-center justify-center leading-7 text-gray-800">
      <SectionTitle title="산후관리사가 하는 일" />
      <p className={cn('whitespace-pre-wrap break-keep text-center leading-8 text-slate-700', 'md:text-lg')}>
        산후관리사는 산모와 신생아 그리고 직계 가족(남편, 아이들)에 관련된 일을 주로 수행합니다.
      </p>
      <p className={cn('whitespace-pre-wrap break-keep text-center leading-8 text-slate-700', 'md:text-lg')}>
        <span className="font-bold text-[#728146]">산모와 신생아 보호를 최우선으로 하며</span>, 기타 가족이 포함된 가사
        업무 지원은 별도의 규정에 따릅니다.
      </p>
      <p className={cn('whitespace-pre-wrap break-keep text-center leading-8 text-slate-700', 'md:text-lg')}>
        체계적인 산모·신생아 관리 서비스를 통해 산모의 건강 회복과 가정의 안정을 돕는 것이 산후관리사의 핵심 역할입니다.
      </p>

      <section
        className={cn(
          'mt-6 flex w-full max-w-7xl flex-col items-center justify-between bg-gradient-to-b from-[rgba(242,244,238,0.6)] to-white p-4 shadow-sm',
          'lg:flex-row lg:gap-16 lg:p-6',
        )}
      >
        <motion.div
          className={cn('grid w-full grid-cols-1 gap-8', 'md:grid-cols-2')}
          initial={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.6 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          {[MotherCardInfo, BabyCardInfo, StudentCardInfo, FamilyCardInfo].map((info, idx) => (
            <ManagerWorkCard contentList={info.contentList} iconSrc={info.iconSrc} key={idx} title={info.title} />
          ))}
        </motion.div>
      </section>

      {/* 하단 섹션 - 기본 에티켓 */}
      <section className="mx-auto mt-10 max-w-6xl">
        <SectionTitle title="산후관리사에 대한 기본 에티켓" />
        <div className={cn('mt-4 grid grid-cols-1 gap-4', 'md:grid-cols-2')}>
          <EtiquetteCard>
            산후관리사는 <span className="font-bold">산모와 신생아를 돌보는 것이 주 업무</span>로 발코니 또는 대청소,
            커튼/이불/빨래, 김치담그기, 손님상 차리기 등 산후관리와 직접적인 연관이 없는 일은 하지 않습니다.{' '}
            <span className="font-bold">산모의 산후관리와 신생아 돌보기</span>에 전념할 수 있도록 협조해 주시기
            바랍니다.
          </EtiquetteCard>
          <EtiquetteCard>
            <span className="font-bold">산후관리사는 의료인이 아닙니다.</span> 의료인으로 생각하셔서 과잉기대를 하시는
            산모님이 간혹 계십니다. 산후관리사는 산모와 아기의 회복과 안정을 도와주는 사람입니다. 산모와 아기의 질병
            진단과 치료는 의료 행위임으로 관리사가 하지 않습니다.
          </EtiquetteCard>
          <EtiquetteCard>
            산후관리사는 일반 가사도우미와는 달리{' '}
            <span className="font-bold">산모님과 신생아에 대한 전문적인 교육</span>을 이수하신 분들로 호칭은{' '}
            <span className="font-bold">‘관리사님&apos;</span>으로 불러주시고 인격적으로 대해 주시기 바랍니다.{' '}
            <span className="font-bold">신생아는 산후관리사에게 믿고 맡겨 주셔도 좋습니다.</span> 산후관리사의 점심
            식사는 산모님 가정에서 드시게 합니다.
          </EtiquetteCard>
          <EtiquetteCard>
            입주형의 경우 매끼 식사는 산모님 가정에서 드시게 되며, 관리사가 거주할 수 있는 방을 마련하여 저녁 8시 이후는
            아기를 보살펴주며 휴식할 수 있게 합니다. 출산 전 산후관리에 필요한 기본 음식 재료를 준비해 주시면 산후관리에
            보다 집중할 수 있습니다. 출퇴근 이용시 장보기를 원하실 경우, 근무시간 내에서 이루어 질 수 있도록 해 주시기
            바랍니다.
          </EtiquetteCard>
        </div>
      </section>
    </div>
  );
};
