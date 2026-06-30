import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '상담 신청',
  description: '고운황금손 산후도우미 서비스 상담을 신청하세요. 간단한 정보 입력 후 빠르게 연락드립니다.',
  alternates: { canonical: 'https://nicegoldhand.com/reservation' },
  openGraph: {
    title: '상담 신청 | 고운황금손',
    description: '고운황금손 산후도우미 서비스 상담을 신청하세요. 간단한 정보 입력 후 빠르게 연락드립니다.',
    url: 'https://nicegoldhand.com/reservation',
  },
};

export default function ReviewLayout({ children }: { children: React.ReactNode }) {
  return <section className="px-4 md:px-[10vw]">{children}</section>;
}
