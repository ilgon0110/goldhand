import { Skeleton } from '@/src/shared/ui/skeleton';

export default function Loading() {
  return (
    <div aria-busy="true" className="min-h-[60vh]" role="status">
      <span className="sr-only">상담글을 불러오는 중이에요...</span>

      <div aria-hidden="true">
        <div className="relative flex flex-col gap-2">
          <Skeleton className="h-7 w-2/3 md:h-9 md:w-1/2" />
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-6 w-28" />
            </div>
            <Skeleton className="h-6 w-12 sm:ml-auto" />
          </div>
        </div>

        <div className="my-4 h-px w-full bg-slate-300" />

        <div className="relative w-full">
          <div className="relative mb-4 flex flex-col gap-1">
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="mb-4 flex flex-col gap-1">
            <Skeleton className="h-7 w-20" />
            <div className="h-40 space-y-3 pt-1 md:h-56">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>

        <div className="mb-4 mt-4 h-px w-full bg-slate-300" />

        <div className="flex w-full justify-end space-x-4">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>

        <div className="mt-4 space-y-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-20 w-full" />
          <div className="flex w-full justify-end">
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
