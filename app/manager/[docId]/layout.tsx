import { noIndexMetadata } from '@/src/shared/seo/noIndexMetadata';

export const metadata = noIndexMetadata;

export default function ManagerAboutLayout({ children }: { children: React.ReactNode }) {
  return <section className="mt-12">{children}</section>;
}
