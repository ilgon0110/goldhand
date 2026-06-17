import type { Metadata } from 'next';

import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: '이용 후기',
  description: '실제 산모들의 생생한 후기. 수원·광교·용인 고운황금손 산후도우미 서비스 이용 후기.',
  alternates: { canonical: 'https://nicegoldhand.com/review' },
  openGraph: {
    title: '이용 후기 | 고운황금손',
    description: '실제 산모들의 생생한 후기. 수원·광교·용인 고운황금손 산후도우미 서비스 이용 후기.',
    url: 'https://nicegoldhand.com/review',
  },
};

export default function ReviewLayout({ children }: { children: React.ReactNode }) {
  return <section className={cn('px-4', 'md:px-[10vw]')}>{children}</section>;
}
