import { cn } from '@/lib/utils';
function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-accent transition duration-700', className)}
      data-slot="skeleton"
      {...props}
    />
  );
}
export { Skeleton };
