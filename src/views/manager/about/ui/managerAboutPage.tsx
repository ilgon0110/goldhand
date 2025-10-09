'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { cn } from '@/lib/utils';
import { gowunDodumFont } from '@/shared/fonts';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';

import { policyList, ruleList } from '../config/const';
import { ValueCard } from './_ValueCard';

export const ManagerAboutPage = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <main className="mt-12">
      {isPending && <LoadingSpinnerOverlay text="상담 페이지로 이동 중..." />}
      {/* HERO */}
      <section className="mx-auto max-w-6xl rounded-2xl bg-gradient-to-b from-[rgba(242,244,238,0.6)] to-white p-6 shadow-sm">
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
          <div>
            <h1
              className={cn(
                `text-xl font-extrabold leading-tight text-[#2f4320] ${gowunDodumFont.className}`,
                'sm:text-2xl',
                'md:text-3xl',
              )}
            >
              산후관리사란?
            </h1>
            <p className={cn('mt-4 max-w-xl text-sm text-slate-700', 'sm:text-base')}>
              출산 후, 몸의 회복이 중요한 시기인 산욕기(분만종료 후 6~8주간)에 산모님이 가정에서 편안하게 산후관리를
              하실 수 있도록 도와드리기 위해 산모 영양/건강관리, 신생아 돌보기 등 전문교육을 수료하고 배상보험에
              가입되어 가정방문 산후관리 서비스를 제공하는 전문인입니다.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                className={cn(
                  'inline-flex items-center rounded-lg bg-[#728146] px-4 py-2 text-sm font-semibold text-white shadow transition',
                  'hover:cursor-pointer hover:shadow-md',
                )}
                onClick={() => {
                  if (typeof window === 'undefined') return;
                  const el = document.getElementById('qualifications');
                  if (el) {
                    const y = el.getBoundingClientRect().top + window.pageYOffset - 56; // 56px 여유
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}
              >
                더 알아보기
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate-600">
              <span className="rounded-full bg-[rgba(114,129,70,0.08)] px-2 py-1">전문교육 이수</span>
              <span className="rounded-full bg-[rgba(114,129,70,0.08)] px-2 py-1">배상보험 가입</span>
              <span className="rounded-full bg-[rgba(114,129,70,0.08)] px-2 py-1">맞춤형 가정 케어</span>
            </div>
          </div>

          <div className="relative h-64 w-full overflow-hidden rounded-xl md:h-80">
            <Image
              alt="산후관리사가 아기와 엄마를 돌보는 모습"
              fill
              priority
              sizes="(max-width: 640px) 100vw, 50vw"
              src="/handwithbaby.jpg"
              style={{ objectFit: 'cover' }}
            />
            {/* subtle overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.08)] to-transparent" />
          </div>
        </div>
      </section>

      {/* KEY VALUES */}
      <section className="mx-auto mt-10 max-w-6xl">
        <div className="grid gap-6 rounded-2xl bg-white p-6 shadow-sm md:grid-cols-3">
          <ValueCard
            desc="전문 교육을 수료한 관리사가 신생아 돌보기와 산모 건강 관리를 책임집니다."
            icon="🏥"
            title="전문성"
          />
          <ValueCard
            desc="배상보험 가입 및 정밀 건강검진을 받은 관리사가 안전한 서비스를 제공합니다."
            icon="🛡️"
            title="안전성"
          />
          <ValueCard
            desc="각 가정의 라이프스타일과 필요에 맞춘 세심한 케어 계획을 제안합니다."
            icon="🤝"
            title="맞춤 케어"
          />
        </div>
      </section>

      {/* QUALIFICATIONS / RULES */}
      <section className="mx-auto mt-12 max-w-6xl" id="qualifications">
        <div className={cn('grid items-start gap-8', 'md:grid-cols-2')}>
          <div>
            <h2 className={cn(`text-xl font-bold text-[#2f4320] ${gowunDodumFont.className}`, 'md:text-2xl')}>
              산후관리사 자격조건
            </h2>
            <p className="mt-2 text-sm text-slate-700">산후관리사로 활동하기 위한 주요 자격 및 교육 요건입니다.</p>

            <ul className="mt-6 space-y-4">
              {ruleList.map(({ number, contents }) => (
                <li key={number}>
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#728146] text-sm font-semibold text-white">
                      {number}
                    </div>
                    <div className="text-sm text-slate-700">{contents}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-slate-100 bg-[rgba(242,244,238,0.6)] p-4">
              <h3 className="text-lg font-semibold text-[#728146]">교육 & 보장</h3>
              <p className="mt-2 text-sm text-slate-700">
                모든 관리사는 정기 교육을 받고 배상보험에 가입되어 있습니다.
              </p>
              <p className="mt-1 text-sm text-slate-700">
                안전한 가정방문 서비스를 제공하기 위해 정기적인 교육을 진행합니다.
              </p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>• 위생 및 응급처치 교육</li>
                <li>• 신생아 관리 실습</li>
                <li>• 고객 응대 및 윤리 교육</li>
              </ul>
            </div>

            <div className="rounded-xl p-4 shadow-sm">
              <Image
                alt="산후관리 서비스 예시"
                className="rounded-md"
                height={340}
                src="/food_review_1.png"
                width={600}
              />
            </div>
          </div>
        </div>
      </section>

      {/* POLICIES / RULES */}
      <section className="mx-auto mt-12 max-w-6xl">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className={cn(`text-xl font-bold text-[#2f4320] ${gowunDodumFont.className}`, 'md:text-2xl')}>
            산후관리사 준수사항
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            관리사 활동 중 회사 절차를 따르지 않고 임의로 수행한 행위에 대해서는 회사가 책임을 지지 않습니다.
          </p>
          <p className="text-sm leading-relaxed text-slate-700">적발 시 내부 규정에 따라 조치됩니다.</p>
          <div className={cn('mt-6 grid gap-4', 'md:grid-cols-2')}>
            {policyList.map(({ number, contents }) => (
              <div className="flex items-center gap-4 rounded-lg border p-4" key={number}>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#728146] font-bold text-white">
                  {number}
                </div>
                <div className="text-sm text-slate-700">{contents}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / 상담 */}
      <section className="sticky bottom-4 mx-auto mt-12 max-w-6xl">
        <div
          className={cn(
            'flex flex-row items-center justify-between gap-6 rounded-2xl bg-[linear-gradient(90deg,#f7fbf6,#f7fbf6)] px-4 py-6 shadow',
            'sm:px-8',
          )}
        >
          <div>
            <h3 className={cn(`text-lg font-semibold text-[#2f4320] ${gowunDodumFont.className}`)}>
              상담이 필요하신가요?
            </h3>
            <p className="mt-2 text-sm text-slate-700">간단한 정보만 입력하면 빠른 상담 연락을 드립니다.</p>
          </div>
          <div className="flex gap-3">
            <button
              className="rounded-md bg-[#728146] px-4 py-2 text-sm font-semibold text-white shadow transition hover:shadow-md"
              onClick={() => {
                startTransition(() => {
                  router.push('/reservation');
                });
              }}
            >
              상담 요청
            </button>
          </div>
        </div>
      </section>

      {/* small footer spacing */}
      <div className="mt-12" />
    </main>
  );
};
