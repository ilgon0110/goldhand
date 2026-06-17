import type { Metadata } from 'next';

import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: '정부바우처 안내',
  description:
    '보건복지부 산모신생아 건강관리 바우처 서비스 안내. 수원 광교 용인 지역 정부지원 산후도우미.',
  alternates: { canonical: 'https://nicegoldhand.com/voucher' },
  openGraph: {
    title: '정부바우처 안내 | 고운황금손',
    description:
      '보건복지부 산모신생아 건강관리 바우처 서비스 안내. 수원 광교 용인 지역 정부지원 산후도우미.',
    url: 'https://nicegoldhand.com/voucher',
  },
};

export default function VoucherLayout({ children }: { children: React.ReactNode }) {
  return <section className={cn('px-4', 'md:px-[10vw]')}>{children}</section>;
}
