'use client';

import { useRouter } from 'next/navigation';
import { useQueryStates } from 'nuqs';

import { cn } from '@/lib/utils';
import { useGetReservationListData } from '@/src/entities/reservation';
import { reservationParams } from '@/src/shared/lib/nuqs/searchParams';
import type { IReservationDetailData } from '@/src/shared/types';
import CustomPagination from '@/src/shared/ui/CustomPagination/CustomPagination';
import { formatDateToYMD } from '@/src/shared/utils';

interface IConsultData extends IReservationDetailData {
  id: string;
}

import { ReservationCard } from './ReservationCard';

const LockIcon = () => (
  <svg className="h-[13px] w-[13px]" fill="currentColor" viewBox="0 -960 960 960">
    <path d="M220-80q-24.75 0-42.37-17.63Q160-115.25 160-140v-434q0-24.75 17.63-42.38Q195.25-634 220-634h70v-96q0-78.85 55.61-134.42Q401.21-920 480.11-920q78.89 0 134.39 55.58Q670-808.85 670-730v96h70q24.75 0 42.38 17.62Q800-598.75 800-574v434q0 24.75-17.62 42.37Q764.75-80 740-80H220Z" />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="h-3 w-3"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={3}
    viewBox="0 0 24 24"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const PlusIcon = () => (
  <svg className="h-[13px] w-[13px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const formatDotDate = (dateStr: string) => dateStr.replace(/-/g, ' · ');

export const ReservationListPage = () => {
  const router = useRouter();
  const [consultParam, setConsultParam] = useQueryStates(reservationParams, {
    clearOnDefault: false,
    shallow: false,
  });
  const { data } = useGetReservationListData({ page: consultParam.page, hideSecret: consultParam.hideSecret });

  const isHideSecret = consultParam.hideSecret === 'true';

  return (
    <div>
      {/* 툴바 */}
      <div className={cn('flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 px-1 py-3.5')}>
        <p className="text-[12px] tracking-[0.08em] text-stone-500">
          총{' '}
          <span className="font-serif text-[14px] font-medium tracking-[0.02em] text-stone-900">
            {data.totalDataLength}
          </span>
          건
        </p>
        <div className="flex items-center gap-2">
          {/* 비밀글 안보기 toggle */}
          <button
            aria-pressed={isHideSecret}
            className={cn(
              'inline-flex select-none items-center gap-2.5 rounded-full border px-4 py-2 text-[13px] tracking-[-0.005em] transition-all duration-200',
              isHideSecret
                ? 'border-stone-900 bg-stone-900 text-stone-100'
                : 'border-stone-200 bg-white text-stone-600 hover:border-amber-300 hover:text-stone-900',
            )}
            type="button"
            onClick={() => setConsultParam({ hideSecret: (!isHideSecret).toString() })}
          >
            <span
              className={cn(
                'inline-flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded border transition-all duration-200',
                isHideSecret ? 'border-gold bg-gold' : 'border-stone-200 bg-white',
              )}
            >
              <span
                className={cn('text-white transition-opacity duration-150', isHideSecret ? 'opacity-100' : 'opacity-0')}
              >
                <CheckIcon />
              </span>
            </span>
            <span className={cn('flex-shrink-0 transition-colors', isHideSecret ? 'text-gold/70' : 'text-gold')}>
              <LockIcon />
            </span>
            비밀글 안보기
          </button>

          {/* 새 상담 신청 */}
          <button
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border border-stone-900 bg-stone-900 px-[18px] py-[9px]',
              'text-[13px] tracking-[0.02em] text-stone-100',
              'transition-all duration-200 hover:border-gold hover:bg-gold',
            )}
            type="button"
            onClick={() => router.push('/reservation/form')}
          >
            <PlusIcon />새 상담 신청
          </button>
        </div>
      </div>

      {/* 리스트 */}
      {data.consultData != null && data.consultData.length > 0 ? (
        <ul className="m-0 list-none p-0">
          {(data.consultData as IConsultData[]).map(item => (
            <ReservationCard
              author={item.userId ? '회원' : '비회원'}
              content={item.content}
              createdAt={formatDotDate(formatDateToYMD(item.createdAt))}
              dataUserId={item.userId}
              docId={item.id}
              isSecret={item.secret}
              key={item.id}
              spot={item.franchisee}
              title={item.title}
            />
          ))}
        </ul>
      ) : (
        <div className="border-b border-stone-200 px-6 py-20 text-center">
          <h3 className="mb-1.5 font-serif text-lg font-medium text-stone-900">예약 내역이 없습니다</h3>
          <p className="text-[13px] text-stone-400">새로운 예약 상담을 신청해보세요.</p>
        </div>
      )}

      <CustomPagination
        maxColumnNumber={10}
        targetPage={consultParam.page}
        totalDataLength={data.totalDataLength}
        onChangePage={(page: number) => setConsultParam({ page })}
      />
    </div>
  );
};
