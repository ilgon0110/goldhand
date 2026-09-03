import { noIndexMetadata } from '@/src/shared/seo/noIndexMetadata';

export const metadata = noIndexMetadata;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <section className="py-12">{children}</section>;
}
