import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '지점 안내',
  description:
    '수원 광교 용인 등 고운황금손 지점 안내. 보건복지부·정부바우처 등록 기관에서 운영하는 산후도우미 서비스.',
  alternates: { canonical: 'https://nicegoldhand.com/franchisee' },
  openGraph: {
    title: '지점 안내 | 고운황금손',
    description:
      '수원 광교 용인 등 고운황금손 지점 안내. 보건복지부·정부바우처 등록 기관에서 운영하는 산후도우미 서비스.',
    url: 'https://nicegoldhand.com/franchisee',
  },
};

export default function FranchiseeLayout({ children }: { children: React.ReactNode }) {
  // 좌우 여백은 이 레이아웃에서 한 번만 정의한다. (다른 안내 페이지 레이아웃과 동일한 폭·여백)
  return <section className="mx-auto max-w-6xl px-4 pb-28 md:px-9">{children}</section>;
}
