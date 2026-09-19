import { cn } from '@/lib/utils';

type TSecretPostGateShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function SecretPostGateShell({ children, className }: TSecretPostGateShellProps) {
  return (
    <section className={cn('mx-auto mt-10 w-full max-w-md rounded-md border p-6', 'md:p-8', className)}>
      {children}
    </section>
  );
}
