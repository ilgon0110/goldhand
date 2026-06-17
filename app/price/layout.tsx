import type { Metadata } from 'next';

import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: '이용요금',
  description: '수원 광교 용인 산후도우미 이용요금 안내. 정부바우처 적용 시 비용 및 서비스 기간.',
  alternates: { canonical: 'https://nicegoldhand.com/price' },
  openGraph: {
    title: '이용요금 | 고운황금손',
    description: '수원 광교 용인 산후도우미 이용요금 안내. 정부바우처 적용 시 비용 및 서비스 기간.',
    url: 'https://nicegoldhand.com/price',
  },
};

export default function PriceLayout({ children }: { children: React.ReactNode }) {
  return <section className={cn('px-6', 'md:px-[10vw]', 'xl:px-[20vw]')}>{children}</section>;
}
