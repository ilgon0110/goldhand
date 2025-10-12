import type { IApplyDetailData } from '@/src/shared/types';
import { formatDateToYMD } from '@/src/shared/utils';

type TManagerDetailContentProps = {
  managerApplyDetailData: IApplyDetailData | null;
};

export const ManagerDetailContent = ({ managerApplyDetailData }: TManagerDetailContentProps) => {
  return (
    <>
      <div className="relative flex flex-col gap-2">
        <h3 className="text-xl font-bold md:text-3xl">{`${managerApplyDetailData?.name}의 지원서`}</h3>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="space-x-2">
            <span>{managerApplyDetailData?.name}</span>
            <span>{formatDateToYMD(managerApplyDetailData?.createdAt)}</span>
          </div>
        </div>
      </div>
      <div className="my-4 h-[1px] w-full bg-slate-300" />
      <div className="relative w-full">
        <div className="mb-4 flex flex-col gap-1">
          <span className="text-xl font-bold">자기소개서</span>
          <p>{managerApplyDetailData?.content}</p>
        </div>
      </div>
      <div className="mb-4 mt-4 h-[1px] w-full bg-slate-300" />
    </>
  );
};
