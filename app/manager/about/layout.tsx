import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '산후관리사란',
  description: '전문 교육과 배상보험을 갖춘 고운황금손 산후관리사 소개. 자격조건, 약속, 준수사항을 확인하세요.',
  alternates: { canonical: 'https://nicegoldhand.com/manager/about' },
  openGraph: {
    title: '산후관리사란 | 고운황금손',
    description: '전문 교육과 배상보험을 갖춘 고운황금손 산후관리사 소개. 자격조건, 약속, 준수사항을 확인하세요.',
    url: 'https://nicegoldhand.com/manager/about',
  },
};

export default function ManagerAboutLayout({ children }: { children: React.ReactNode }) {
  return <section>{children}</section>;
}
