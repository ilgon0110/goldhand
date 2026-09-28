import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '렌탈 서비스',
  description: '고운황금손 산후 렌탈 서비스 안내. 수원 광교 용인 산모신생아 케어 용품 렌탈.',
  alternates: { canonical: 'https://nicegoldhand.com/rental' },
  openGraph: {
    title: '렌탈 서비스 | 고운황금손',
    description: '고운황금손 산후 렌탈 서비스 안내. 수원 광교 용인 산모신생아 케어 용품 렌탈.',
    url: 'https://nicegoldhand.com/rental',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  // 좌우 여백은 이 레이아웃에서 한 번만 정의한다. (manager 레이아웃과 동일한 폭·여백)
  return <section className="mx-auto max-w-6xl px-4 pb-28 md:px-9">{children}</section>;
}
