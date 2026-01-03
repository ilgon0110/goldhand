import { CalendarIcon, EditIcon, TextIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { cn } from '@/lib/utils';
import type { IMyPageResponseData } from '@/src/shared/types';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';
import { WithEmptyState } from '@/src/shared/ui/WithEmptyState';
import { formatDateToYMD } from '@/src/shared/utils';

interface IMyPagePostListProps {
  myPageData: IMyPageResponseData;
}

export const MyPagePostList = ({ myPageData }: IMyPagePostListProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isAdmin = myPageData.data.userData?.grade === 'admin';

  return (
    <>
      {isPending && <LoadingSpinnerOverlay text="페이지 이동 중..." />}
      {/* admin전용 : 산후관리사 지원목록 조회 */}
      {isAdmin && (
        <div>
          <div className="relative mt-6 flex flex-row items-center gap-3">
            <CalendarIcon className="mr-2 h-6 w-6" />
            <span className="text-base font-bold md:text-2xl">산후관리사 지원목록</span>
            <button
              className="absolute right-1 text-slate-500 underline transition-all ease-in-out hover:cursor-pointer hover:text-black"
              onClick={() => {
                startTransition(() => {
                  router.push('/manager/list');
                });
              }}
            >
              전체 보기
            </button>
          </div>
          <div className="mt-2 h-[1px] w-full bg-black" />
          <WithEmptyState
            data={myPageData.data.managersData}
            emptyDescription=""
            emptyTitle="산후관리사 지원목록이 없습니다."
          >
            {myPageData.data?.managersData?.map(manager => (
              <div className="mt-3 flex flex-row justify-between" data-testid={manager.id} key={manager.id}>
                <span
                  className={cn(
                    'text-base font-medium text-slate-700 transition-all ease-in-out',
                    'md:text-xl',
                    'hover:cursor-pointer hover:text-black hover:underline',
                  )}
                  onClick={() => {
                    startTransition(() => {
                      router.push(`/manager/${manager.id}`);
                    });
                  }}
                >
                  {manager.content}
                </span>
                <span className="text-slate-500">{formatDateToYMD(manager.updatedAt)}</span>
              </div>
            ))}
          </WithEmptyState>
        </div>
      )}
      {/* 산후관리사 지원문의 */}
      <div>
        <div className="relative mt-6 flex flex-row items-center gap-3">
          <CalendarIcon className="mr-2 h-6 w-6" />
          <span className="text-base font-bold md:text-2xl">산후관리사 지원문의</span>
          <button className="absolute right-1 text-slate-500 underline transition-all ease-in-out hover:cursor-pointer hover:text-black">
            전체 보기
          </button>
        </div>
        <div className="mt-2 h-[1px] w-full bg-black" />
        <WithEmptyState data={myPageData.data.applies} emptyDescription="" emptyTitle="산후관리사 지원내역이 없습니다.">
          {myPageData.data?.applies?.map(apply => (
            <div className="mt-3 flex flex-row justify-between" data-testid={apply.id} key={apply.id}>
              <span
                className={cn(
                  'text-base font-medium text-slate-700 transition-all ease-in-out',
                  'md:text-xl',
                  'hover:cursor-pointer hover:text-black hover:underline',
                )}
                onClick={() => {
                  startTransition(() => {
                    router.push(`/manager/${apply.id}`);
                  });
                }}
              >
                {apply.content}
              </span>
              <span className="text-slate-500">{formatDateToYMD(apply.updatedAt)}</span>
            </div>
          ))}
        </WithEmptyState>
      </div>
      {/* 예약 상담 */}
      <div>
        <div className="relative mt-6 flex flex-row items-center gap-3">
          <CalendarIcon className="mr-2 h-6 w-6" />
          <span className="text-base font-bold md:text-2xl">예약 내역</span>
          <div className="absolute right-1 text-slate-500 underline transition-all ease-in-out hover:cursor-pointer hover:text-black">
            전체 보기
          </div>
        </div>
        <div className="mt-2 h-[1px] w-full bg-black" />
        <WithEmptyState
          data={myPageData.data.consults}
          emptyDescription="새로운 예약을 추가해보세요."
          emptyTitle="예약 내역이 없습니다."
        >
          {myPageData.data?.consults?.map(consult => (
            <div className="mt-3 flex flex-row justify-between" data-testid={consult.id} key={consult.id}>
              <span
                className={cn(
                  'text-base font-medium text-slate-700 transition-all ease-in-out',
                  'md:text-xl',
                  'hover:cursor-pointer hover:text-black hover:underline',
                )}
                onClick={() => {
                  startTransition(() => {
                    router.push(`/reservation/list/${consult.id}`);
                  });
                }}
              >
                {consult.title}
              </span>
              <span className="text-slate-500">{formatDateToYMD(consult.updatedAt)}</span>
            </div>
          ))}
        </WithEmptyState>
      </div>
      {/* 이용 후기 */}
      <div className="mt-10">
        <div className="relative mt-6 flex flex-row items-center gap-3">
          <EditIcon className="mr-2 h-6 w-6" />
          <span className="text-base font-bold md:text-2xl">이용 후기</span>
          <div className="absolute right-1 text-slate-500 underline transition-all ease-in-out hover:cursor-pointer hover:text-black">
            전체 보기
          </div>
        </div>
        <div className="mt-2 h-[1px] w-full bg-black" />
        <WithEmptyState
          data={myPageData.data.reviews}
          emptyDescription="새로운 후기를 추가해보세요."
          emptyTitle="후기 내역이 없습니다."
        >
          {myPageData.data?.reviews?.map(review => (
            <div className="mt-3 flex flex-row justify-between" data-testid={review.id} key={review.id}>
              <span
                className={cn(
                  'text-base font-medium text-slate-700 transition-all ease-in-out',
                  'md:text-xl',
                  'hover:cursor-pointer hover:text-black hover:underline',
                )}
                onClick={() => {
                  startTransition(() => {
                    router.push(`/review/${review.id}`);
                  });
                }}
              >
                {review.title}
              </span>
              <span className="text-slate-500">{formatDateToYMD(review.updatedAt)}</span>
            </div>
          ))}
        </WithEmptyState>
      </div>

      {/* 작성 댓글 */}
      <div className="mt-10">
        <div className="relative mt-6 flex flex-row items-center gap-3">
          <TextIcon className="mr-2 h-6 w-6" />
          <span className="text-base font-bold md:text-2xl">작성 댓글</span>
          <div className="absolute right-1 text-slate-500 underline transition-all ease-in-out hover:cursor-pointer hover:text-black">
            전체 보기
          </div>
        </div>
        <div className="mt-2 h-[1px] w-full bg-black" />
        <WithEmptyState
          data={myPageData.data.comments}
          emptyDescription="새로운 댓글을 추가해보세요."
          emptyTitle="댓글 내역이 없습니다."
        >
          {myPageData.data?.comments?.map(item => (
            <div className="mt-3 flex flex-row justify-between" data-testid={item.id} key={item.id}>
              <span
                className={cn(
                  'text-base font-medium text-slate-700 transition-all ease-in-out',
                  'md:text-xl',
                  'hover:cursor-pointer hover:text-black hover:underline',
                )}
                onClick={() => {
                  startTransition(() => {
                    if (item.docType === 'review') {
                      router.push(`/review/${item.docId}`);
                    }

                    if (item.docType === 'consult') {
                      router.push(`/reservation/list/${item.docId}`);
                    }

                    if (item.docType === 'manager') {
                      router.push(`/manager/${item.docId}`);
                    }
                  });
                }}
              >
                {item.comment}
              </span>
              <span className="text-slate-500">{formatDateToYMD(item.updatedAt)}</span>
            </div>
          ))}
        </WithEmptyState>
      </div>
    </>
  );
};
