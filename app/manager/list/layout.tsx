import { noIndexMetadata } from '@/src/shared/seo/noIndexMetadata';

export const metadata = noIndexMetadata;

export default function ManagerListLayout({ children }: { children: React.ReactNode }) {
  return <section className="mt-6 px-4 md:px-[10vw]">{children}</section>;
}
