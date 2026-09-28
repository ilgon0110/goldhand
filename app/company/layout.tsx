import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '대표 인사말',
  description: '고운황금손 대표 차복규의 인사말. 산모와 신생아를 전문가의 손길로 보살피는 수원 광교 용인 산후도우미.',
  alternates: { canonical: 'https://nicegoldhand.com/company' },
  openGraph: {
    title: '대표 인사말 | 고운황금손',
    description: '고운황금손 대표 차복규의 인사말. 산모와 신생아를 전문가의 손길로 보살피는 수원 광교 용인 산후도우미.',
    url: 'https://nicegoldhand.com/company',
  },
};

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  // 좌우 여백은 이 레이아웃에서 한 번만 정의한다. (다른 안내 페이지 레이아웃과 동일한 폭·여백)
  return <section className="mx-auto max-w-6xl px-4 pb-28 md:px-9">{children}</section>;
}
