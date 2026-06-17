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
  return <section className="pb-28">{children}</section>;
}
