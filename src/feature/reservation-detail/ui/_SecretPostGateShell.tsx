import { cn } from '@/lib/utils';
import { LoadingSpinnerIcon } from '@/src/shared/ui/loadingSpinnerIcon';

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

export function SecretPostLoading() {
  return (
    <SecretPostGateShell className="text-center">
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinnerIcon />
        <p className="text-sm text-gray-500">게시글을 불러오는 중입니다...</p>
      </div>
    </SecretPostGateShell>
  );
}
