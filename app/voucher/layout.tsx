import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '정부바우처 안내',
  description: '보건복지부 산모신생아 건강관리 바우처 서비스 안내. 수원 광교 용인 지역 정부지원 산후도우미.',
  alternates: { canonical: 'https://nicegoldhand.com/voucher' },
  openGraph: {
    title: '정부바우처 안내 | 고운황금손',
    description: '보건복지부 산모신생아 건강관리 바우처 서비스 안내. 수원 광교 용인 지역 정부지원 산후도우미.',
    url: 'https://nicegoldhand.com/voucher',
  },
};

export default function VoucherLayout({ children }: { children: React.ReactNode }) {
  // 좌우 여백은 이 레이아웃에서 한 번만 정의한다. (manager·rental·price 레이아웃과 동일한 폭·여백)
  return <section className="mx-auto max-w-6xl px-4 pb-28 md:px-9">{children}</section>;
}
