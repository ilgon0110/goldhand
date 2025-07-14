'use client';

import type { CheckedState } from '@radix-ui/react-checkbox';
import { useQueryStates } from 'nuqs';

import { useAuthState } from '@/src/shared/hooks/useAuthState';
import { consultParams } from '@/src/shared/searchParams';
import type { IConsultDetailData } from '@/src/shared/types';
import { Checkbox } from '@/src/shared/ui/checkbox';
import { formatDateToYMD } from '@/src/shared/utils';
import { ReservationCard } from '@/src/views/reservation';
import { WidgetPagination } from '@/src/widgets/Pagination';

interface IConsultData extends IConsultDetailData {
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
  const [consultParam, setConsultParam] = useQueryStates(consultParams, {
    shallow: false,
  });
  const { userData } = useAuthState();

  const toggleHideSecret = (check: CheckedState) => {
    setConsultParam({
      hideSecret: check.toString(),
    });
  };

  const onChangePage = (page: number) => {
    setConsultParam({ page });
  };

  return (
    <div>
      <div className="flex items-center space-x-2">
        <Checkbox
          className="h-4 w-4 md:h-6 md:w-6"
          defaultChecked={consultParam.hideSecret === 'true'}
          id="secret"
          onCheckedChange={check => toggleHideSecret(check)}
        />
        <label
          className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="secret"
        >
          비밀글 안보기
        </label>
      </div>
      <div className="space-y-4 pt-4">
        {data.consultData?.map(item => {
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
              userData={userData}
            />
          );
        })}
      </div>
      <WidgetPagination
        maxColumnNumber={10}
        targetPage={consultParam.page}
        totalDataLength={data.totalDataLength}
        onChangePage={onChangePage}
      />
    </div>
  );
};
