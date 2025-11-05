'use client';

import { useQueryStates } from 'nuqs';

import { managerListParams } from '@/src/shared/lib/nuqs/searchParams';
import type { IApplyDetailData } from '@/src/shared/types';
import { EmptyState } from '@/src/shared/ui/empty-state';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';
import { formatDateToYMD } from '@/src/shared/utils';
import { ManagerCard } from '@/src/widgets/managers';
import { WidgetPagination } from '@/src/widgets/Pagination';

interface IManagerListPageProps {
  managerListData: IApplyDetailData[] | null;
  totalDataLength: number;
}

export const ManagerListPage = ({ managerListData, totalDataLength }: IManagerListPageProps) => {
  const [managerListParam, setManagerListParam] = useQueryStates(managerListParams, {
    clearOnDefault: false,
    shallow: false,
  });

  return (
    <>
      <SectionTitle title="산후관리사 지원내역" />
      <div>
        {managerListData != null ? (
          managerListData.map(item => {
            return (
              <ManagerCard
                author={item.name}
                createdAt={formatDateToYMD(item.createdAt)}
                dataUserId={item.userId}
                docId={item.docId}
                key={item.docId}
                title={item.content}
              />
            );
          })
        ) : (
          <EmptyState className="my-auto" description=" " title="산후관리사 지원내역이 없습니다" />
        )}
      </div>
      <WidgetPagination
        maxColumnNumber={10}
        targetPage={managerListParam.page}
        totalDataLength={totalDataLength}
        onChangePage={(page: number) => setManagerListParam({ page })}
      />
    </>
  );
};
