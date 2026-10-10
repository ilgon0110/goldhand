import { noIndexMetadata } from '@/src/shared/seo/noIndexMetadata';

export const metadata = noIndexMetadata;

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  // 좌우 여백은 이 레이아웃에서 한 번만 정의한다. (다른 페이지 레이아웃과 동일한 폭·여백)
  return <section className="mx-auto max-w-6xl px-4 pb-28 md:px-9">{children}</section>;
}
