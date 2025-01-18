"use client";

import { searchParams } from "@/src/shared/searchParams";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/src/shared/ui/pagination";
//import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useQueryState, parseAsInteger, useQueryStates } from "nuqs";
import { useCallback } from "react";

type ReviewPaginationProps = {
  dataLength: number;
  maxColumnNumber: number;
};

export const ReviewPagination = ({
  dataLength,
  maxColumnNumber,
}: ReviewPaginationProps) => {
  const [{ page: pageParams }, setPageParams] = useQueryStates(searchParams, {
    shallow: false,
  });

  //   const router = useRouter();
  //   const pathname = usePathname();
  //   const searchParams = useSearchParams();
  //   const pageParams = searchParams.get("page");

  //   // Get a new searchParams string by merging the current
  //   // searchParams with a provided key/value pair
  //   const createQueryString = useCallback(
  //     (name: string, value: string) => {
  //       const params = new URLSearchParams(searchParams.toString());
  //       params.set(name, value);

  //       return params.toString();
  //     },
  //     [searchParams]
  //   );

  const totalPages = Math.ceil(dataLength / maxColumnNumber);

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href={`#`}
              isActive={page === pageParams}
              onClick={() => setPageParams({ page })}
            >
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
