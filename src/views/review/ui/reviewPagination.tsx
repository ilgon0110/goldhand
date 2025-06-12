'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/src/shared/ui/pagination';

type ReviewPaginationProps = {
  dataLength: number | undefined;
  maxColumnNumber: number;
  reviewParam: {
    page: number;
  };
  setReviewParam: (params: { page: number }) => void;
};

export const ReviewPagination = ({
  dataLength,
  maxColumnNumber,
  reviewParam,
  setReviewParam,
}: ReviewPaginationProps) => {
  // const [{ page: consultPageParams }] = useQueryStates(
  //   consultParams,
  //   {
  //     shallow: false,
  //   }
  // );
  if (!dataLength) dataLength = 0;
  const totalPages = Math.ceil(dataLength / maxColumnNumber);

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <PaginationItem key={page}>
            <PaginationLink href={`#`} isActive={page === reviewParam.page} onClick={() => setReviewParam({ page })}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
