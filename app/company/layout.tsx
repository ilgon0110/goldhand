import type { Metadata } from 'next';

import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: '대표 인사말',
  description:
    '고운황금손 대표 차복규의 인사말. 산모와 신생아를 전문가의 손길로 보살피는 수원 광교 용인 산후도우미.',
  alternates: { canonical: 'https://nicegoldhand.com/company' },
  openGraph: {
    title: '대표 인사말 | 고운황금손',
    description:
      '고운황금손 대표 차복규의 인사말. 산모와 신생아를 전문가의 손길로 보살피는 수원 광교 용인 산후도우미.',
    url: 'https://nicegoldhand.com/company',
  },
};

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  return <section className={cn('mt-14 px-4', 'md:px-[10vw]')}>{children}</section>;
}
