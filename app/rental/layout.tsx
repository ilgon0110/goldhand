import { cn } from '@/lib/utils';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <section className={cn('pb-28')}>{children}</section>;
}
