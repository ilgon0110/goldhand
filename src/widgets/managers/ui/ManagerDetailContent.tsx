import type { IApplyDetailData } from '@/src/shared/types';
import { PostDetailHeader } from '@/src/feature/post/ui/PostDetailHeader';

type TManagerDetailContentProps = {
  managerApplyDetailData: IApplyDetailData | null;
};

export const ManagerDetailContent = ({ managerApplyDetailData }: TManagerDetailContentProps) => {
  return (
    <>
      <PostDetailHeader
        author={managerApplyDetailData?.name}
        createdAt={managerApplyDetailData?.createdAt}
        title={`${managerApplyDetailData?.name}의 지원서`}
        updatedAt={managerApplyDetailData?.updatedAt}
      />
      <div className="my-4 h-[1px] w-full bg-slate-300" />
      <div className="relative w-full">
        <div className="mb-4 flex flex-col gap-1">
          <span className="text-xl font-bold">자기소개서</span>
          <p className="whitespace-pre-wrap break-words">{managerApplyDetailData?.content}</p>
        </div>
      </div>
      <div className="mb-4 mt-4 h-[1px] w-full bg-slate-300" />
    </>
  );
};
