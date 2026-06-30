import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '산후관리사가 하는 일',
  description: '산모 건강 회복과 신생아 돌봄을 중심으로 한 고운황금손 산후관리사의 업무 범위와 에티켓 안내.',
  alternates: { canonical: 'https://nicegoldhand.com/manager/work' },
  openGraph: {
    title: '산후관리사가 하는 일 | 고운황금손',
    description: '산모 건강 회복과 신생아 돌봄을 중심으로 한 고운황금손 산후관리사의 업무 범위와 에티켓 안내.',
    url: 'https://nicegoldhand.com/manager/work',
  },
};

export default function ManagerWorkLayout({ children }: { children: React.ReactNode }) {
  return <section>{children}</section>;
}
