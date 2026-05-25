import Link from 'next/link';

import { cn } from '@/lib/utils';
import SectionTitleHero from '@/src/shared/ui/SectionTitleHero';

export default function ReservationApplyPage() {
  return (
    <div>
      <SectionTitleHero description="고운황금손 예약상담" label="상담 신청 · APPLY" />
      <p
        className={cn(
          'flex flex-col items-center justify-center space-y-2 break-keep text-center text-sm',
          'md:text-lg',
        )}
      >
        <span>
          <span className="font-bold">회원</span>으로 예약상담 신청 시 카카오톡을 통해{' '}
          <span className="font-bold">답변 등록 알림</span>을 보내드려요.
        </span>
        <span>또한 고운황금손 이용 시 이용후기 남기기 등 다양한 서비스를 이용하실 수 있어요.</span>
        <span>물론 비회원으로도 문의하실 수 있습니다.</span>
      </p>
      <div className="mx-auto mt-6 flex w-full flex-col items-center justify-center space-y-6 px-4 md:px-[10vw]">
        <Link
          className={cn(
            'inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'md:w-1/2',
          )}
          href="/login"
        >
          로그인하기
        </Link>
        <Link
          className={cn(
            'inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors',
            'hover:bg-primary/90',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'md:w-1/2',
          )}
          href="/reservation/form"
        >
          비회원으로 문의하기
        </Link>
      </div>
    </div>
  );
}
