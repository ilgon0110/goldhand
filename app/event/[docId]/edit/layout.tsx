import { noIndexMetadata } from '@/src/shared/seo/noIndexMetadata';

export const metadata = noIndexMetadata;

export default function EventDetailEditLayout({ children }: { children: React.ReactNode }) {
  return <section>{children}</section>;
}
