import { noIndexMetadata } from '@/src/shared/seo/noIndexMetadata';

export const metadata = noIndexMetadata;

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  return <section className="px-4 md:px-[10vw]">{children}</section>;
}
