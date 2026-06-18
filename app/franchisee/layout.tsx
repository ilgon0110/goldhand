import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '지점 안내',
  description: '수원 광교 용인 등 고운황금손 지점 안내. 보건복지부·정부바우처 등록 기관에서 운영하는 산후도우미 서비스.',
  alternates: { canonical: 'https://nicegoldhand.com/franchisee' },
  openGraph: {
    title: '지점 안내 | 고운황금손',
    description: '수원 광교 용인 등 고운황금손 지점 안내. 보건복지부·정부바우처 등록 기관에서 운영하는 산후도우미 서비스.',
    url: 'https://nicegoldhand.com/franchisee',
  },
};

export default function FranchiseeLayout({ children }: { children: React.ReactNode }) {
  return <section className="px-4 md:px-[10vw]">{children}</section>;
}
