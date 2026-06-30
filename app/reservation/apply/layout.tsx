import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '상담 신청',
  description: '고운황금손 산후도우미 서비스 상담을 신청하세요. 회원·비회원 모두 문의하실 수 있습니다.',
  alternates: { canonical: 'https://nicegoldhand.com/reservation/apply' },
  openGraph: {
    title: '상담 신청 | 고운황금손',
    description: '고운황금손 산후도우미 서비스 상담을 신청하세요. 회원·비회원 모두 문의하실 수 있습니다.',
    url: 'https://nicegoldhand.com/reservation/apply',
  },
};

export default function ReviewApplyLayout({ children }: { children: React.ReactNode }) {
  return <section>{children}</section>;
}
