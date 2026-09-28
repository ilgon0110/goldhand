import type { Metadata } from 'next';

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
  // 좌우 여백은 이 레이아웃에서 한 번만 정의한다. (manager·rental 레이아웃과 동일한 폭·여백)
  return <section className="mx-auto max-w-6xl px-4 pb-28 md:px-9">{children}</section>;
}
