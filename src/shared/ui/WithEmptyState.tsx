import { EmptyState } from './empty-state';

type TWithEmptyStateProps = {
  data: unknown[] | null | undefined; // The data to be checked for emptiness
  children: React.ReactNode;
  emptyTitle?: string; // Optional title for the empty state
  emptyDescription?: string; // Optional description for the empty state
};

export const WithEmptyState = ({ data, emptyTitle, emptyDescription, children }: TWithEmptyStateProps) => {
  if (data == null || data.length === 0) {
    return (
      <EmptyState
        className="mt-4"
        description={emptyDescription || '데이터가 없습니다.'}
        title={emptyTitle || '빈 상태입니다.'}
      />
    );
  }

  return <>{children}</>;
};
