import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import DefaultImage from '@/src/shared/ui/DefaultImage';
import { formatPhoneNumber } from '@/src/shared/utils';

type TFranchiseeCardProps = {
  index: number;
  total: number;
  title: string;
  badge: string;
  region: string;
  phoneNumber: string;
  description: string;
  address: string;
  naverPlaceUrl: string;
  images?: [string, string, string];
};

export const FranchiseeCard = ({
  index,
  total,
  title,
  badge,
  region,
  phoneNumber,
  description,
  address,
  naverPlaceUrl,
  images,
}: TFranchiseeCardProps) => {
  return (
    <article
      className={cn(
        'grid gap-8 py-14',
        index === 0 ? 'border-y border-slate-200' : 'border-b border-slate-200',
        'grid-cols-1',
        'md:grid-cols-[80px_1fr_1fr]',
      )}
    >
      {/* 인덱스 번호 */}
      <div className="hidden md:block">
        <span className="font-serif text-sm tracking-[0.1em] text-[#A88547]">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>

      {/* 텍스트 정보 */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          {region} · {badge}
        </p>
        <h2 className={cn('mt-3 font-serif text-4xl font-normal tracking-tight text-[#1B1814]', 'md:text-5xl')}>
          {title}
        </h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-slate-500">{description}</p>
        <dl className="mt-7 space-y-3">
          {[
            { label: '주소', value: address },
            { label: '대표 문의', value: formatPhoneNumber(phoneNumber) },
          ].map(({ label, value }) => (
            <div className="flex gap-6 text-sm" key={label}>
              <dt className="min-w-[52px] pt-0.5 text-xs tracking-wide text-slate-400">{label}</dt>
              <dd className="font-serif text-[#1B1814]">{value}</dd>
            </div>
          ))}
        </dl>

        <div className={cn('mt-8 flex flex-col items-start gap-4', 'sm:flex-row sm:items-center sm:gap-6')}>
          <Link
            className="bg-[#1B1814] px-7 py-3 text-sm tracking-wide text-[#F6F1E7] transition-colors hover:bg-[#2d2824]"
            href="/reservation"
          >
            예약 상담하기
          </Link>
          <Link
            className="text-sm text-[#2DB400] underline underline-offset-4 hover:opacity-80"
            href={naverPlaceUrl}
            target="_blank"
          >
            네이버 플레이스 이동하기 →
          </Link>
        </div>
      </div>

      {/* 포토 그리드 (데스크탑 전용) */}
      <div className={cn('hidden h-[360px] grid-cols-[1.6fr_1fr] grid-rows-2 gap-2', 'md:grid')}>
        {images ? (
          <>
            <div className="relative row-span-2 overflow-hidden rounded-sm">
              <Image
                alt={`${title} 메인`}
                className="object-cover"
                fill
                sizes="(max-width: 1024px) 40vw, 25vw"
                src={images[0]}
              />
            </div>
            <div className="relative overflow-hidden rounded-sm">
              <Image
                alt={`${title} 내부 1`}
                className="object-cover"
                fill
                sizes="(max-width: 1024px) 25vw, 15vw"
                src={images[1]}
              />
            </div>
            <div className="relative overflow-hidden rounded-sm">
              <Image
                alt={`${title} 내부 2`}
                className="object-cover"
                fill
                sizes="(max-width: 1024px) 25vw, 15vw"
                src={images[2]}
              />
            </div>
          </>
        ) : (
          <>
            <DefaultImage className="row-span-2 rounded-sm" />
            <DefaultImage className="rounded-sm" />
            <DefaultImage className="rounded-sm" />
          </>
        )}
      </div>
    </article>
  );
};
