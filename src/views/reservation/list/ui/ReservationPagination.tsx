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

type TReviewPaginationProps = {
  dataLength: number | undefined;
  maxColumnNumber: number;
  consultParam: {
    page: number;
    hideSecret?: string;
  };
  setConsultParam: (params: { page: number; hideSecret?: string; [key: string]: number | string | undefined }) => void;
};

export const ReservationPagination = ({
  dataLength,
  maxColumnNumber,
  consultParam,
  setConsultParam,
}: TReviewPaginationProps) => {
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
            <PaginationLink href={`#`} isActive={page === consultParam.page} onClick={() => setConsultParam({ page })}>
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
