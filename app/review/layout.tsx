import { cn } from '@/lib/utils';

export default function ReviewLayout({ children }: { children: React.ReactNode }) {
  return <section className={cn('mt-6 px-8', 'md:px-20', 'xl:px-56')}>{children}</section>;
}
