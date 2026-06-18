import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이벤트',
  description: '고운황금손에서 진행중인 이벤트 및 혜택 안내. 수원 광교 용인 산후도우미 서비스.',
  alternates: { canonical: 'https://nicegoldhand.com/event' },
  openGraph: {
    title: '이벤트 | 고운황금손',
    description: '고운황금손에서 진행중인 이벤트 및 혜택 안내. 수원 광교 용인 산후도우미 서비스.',
    url: 'https://nicegoldhand.com/event',
  },
};

export default function EventLayout({ children }: { children: React.ReactNode }) {
  return <section className="px-4 md:px-[10vw]">{children}</section>;
}
