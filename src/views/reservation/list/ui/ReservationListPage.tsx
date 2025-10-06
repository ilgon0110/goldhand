'use client';

import { useQueryStates } from 'nuqs';

import { reservationParams } from '@/src/shared/lib/nuqs/searchParams';
import type { IReservationDetailData } from '@/src/shared/types';
import { Checkbox } from '@/src/shared/ui/checkbox';
import { EmptyState } from '@/src/shared/ui/empty-state';
import { formatDateToYMD } from '@/src/shared/utils';
import { ReservationCard } from '@/src/views/reservation';
import { WidgetPagination } from '@/src/widgets/Pagination';

interface IConsultData extends IReservationDetailData {
  id: string;
}

type TReservationListPageProps = {
  data: {
    message: string;
    consultData: IConsultData[] | null;
    totalDataLength: number;
  };
};

export const ReservationListPage = ({ data }: TReservationListPageProps) => {
  const [consultParam, setConsultParam] = useQueryStates(reservationParams, {
    shallow: false,
  });

  return (
    <div>
      <div className="flex items-center space-x-2">
        <Checkbox
          className="h-4 w-4 md:h-6 md:w-6"
          defaultChecked={consultParam.hideSecret === 'true'}
          id="secret"
          role="checkbox"
          onCheckedChange={check => {
            setConsultParam({ hideSecret: check.toString() });
          }}
        />
        <label
          className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="secret"
        >
          비밀글 안보기
        </label>
      </div>
      <div className="space-y-4 pt-4">
        {data.consultData != null ? (
          data.consultData.map(item => {
            return (
              <ReservationCard
                author={item.userId ? '회원' : '비회원'}
                content={item.content}
                createdAt={formatDateToYMD(item.createdAt)}
                dataUserId={item.userId}
                docId={item.id}
                isSecret={item.secret}
                key={item.id}
                spot={item.franchisee}
                title={item.title}
              />
            );
          })
        ) : (
          <EmptyState className="my-auto" description="새로운 예약 상담을 신청해보세요." title="예약 내역이 없습니다" />
        )}
      </div>
      <WidgetPagination
        maxColumnNumber={10}
        targetPage={consultParam.page}
        totalDataLength={data.totalDataLength}
        onChangePage={(page: number) => setConsultParam({ page })}
      />
    </div>
  );
};
