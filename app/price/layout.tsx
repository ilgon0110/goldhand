import { cn } from '@/lib/utils';

export default function PriceLayout({ children }: { children: React.ReactNode }) {
  return <section className={cn('px-6', 'md:px-[10vw]', 'xl:px-[20vw]')}>{children}</section>;
}
