import { noIndexMetadata } from '@/src/shared/seo/noIndexMetadata';

export const metadata = noIndexMetadata;

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return <section>{children}</section>;
}
