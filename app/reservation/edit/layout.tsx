import { noIndexMetadata } from '@/src/shared/seo/noIndexMetadata';

export const metadata = noIndexMetadata;

export default function FormLayout({ children }: { children: React.ReactNode }) {
  return <section>{children}</section>;
}
