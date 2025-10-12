/* eslint-disable react/jsx-handler-names */
'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { cn } from '@/lib/utils';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';
import TruncateText from '@/src/shared/ui/TruncateText';
import { sendViewLog } from '@/src/shared/utils/verifyViewId';

type TManagerCardProps = {
  docId: string;
  title: string;
  author: string;
  createdAt: string;
  dataUserId: string | null; // 추가된 부분: 데이터의 userId
};

export const ManagerCard = ({ docId, title, author, createdAt }: TManagerCardProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <>
      {isPending && <LoadingSpinnerOverlay text="해당 지원내역으로 이동중.." />}
      <button
        className={cn(
          'relative flex w-full flex-row overflow-hidden border-b border-gray-200 p-4 transition-all duration-300 ease-in-out',
          'hover:bg-slate-100',
        )}
        data-testid={docId}
        onClick={e => {
          startTransition(() => {
            e.stopPropagation();

            // 조회수 기록
            const viewRes = sendViewLog(docId);
            if (!viewRes) {
              console.error('Failed to send view log');
            }

            router.push(`/manager/${docId}`);
          });
        }}
      >
        <div>
          <div className="text-start text-lg font-bold">
            <TruncateText maxLines={1} text={title} />
          </div>
          <div className="mt-[1px] flex w-full gap-2 text-sm">
            <span className="text-gray-800">
              <TruncateText maxLines={1} text={author} />
            </span>
            <span className="text-gray-500">
              <TruncateText maxLines={1} text={createdAt} />
            </span>
          </div>
        </div>
      </button>
    </>
  );
};
