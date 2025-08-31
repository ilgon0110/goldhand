/* eslint-disable react/jsx-handler-names */
'use client';

import { useState } from 'react';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/src/shared/ui/pagination';

type TWidgetPaginationProps = {
  totalDataLength: number | undefined;
  maxColumnNumber: number;
  targetPage: number;
  onChangePage: (page: number) => void;
};

export const WidgetPagination = ({
  totalDataLength,
  maxColumnNumber,
  targetPage,
  onChangePage,
}: TWidgetPaginationProps) => {
  const MAXIMUM_NUMBER_OF_PAGES = 10;
  const totalPages = Math.ceil((totalDataLength || 0) / maxColumnNumber);
  const [paginationArr, setPaginationArr] = useState(
    Array.from(
      {
        length: totalPages > MAXIMUM_NUMBER_OF_PAGES ? MAXIMUM_NUMBER_OF_PAGES : totalPages,
      },
      (_, i) => i + 1,
    ),
  );
  const nowStartPageNumber = paginationArr[0];
  const nowEndPageNumber = paginationArr[paginationArr.length - 1];

  const onClickPrevious = () => {
    if (nowStartPageNumber > MAXIMUM_NUMBER_OF_PAGES) {
      const newArr = Array.from(
        {
          length: nowStartPageNumber - 1 > MAXIMUM_NUMBER_OF_PAGES ? MAXIMUM_NUMBER_OF_PAGES : nowStartPageNumber - 1,
        },
        (_, i) => nowStartPageNumber - i - 1,
      ).reverse();
      setPaginationArr(newArr);
      onChangePage(nowStartPageNumber - 1);
    }
  };

  const onClickNext = () => {
    const nowEndPageNumber = paginationArr[paginationArr.length - 1];
    if (nowEndPageNumber < totalPages) {
      const newArr = Array.from(
        {
          length:
            totalPages - nowEndPageNumber > MAXIMUM_NUMBER_OF_PAGES
              ? MAXIMUM_NUMBER_OF_PAGES
              : totalPages - nowEndPageNumber,
        },
        (_, i) => nowEndPageNumber + i + 1,
      );
      setPaginationArr(newArr);
      onChangePage(nowEndPageNumber + 1);
    }
  };

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        {nowStartPageNumber > MAXIMUM_NUMBER_OF_PAGES && (
          <PaginationItem>
            <PaginationPrevious href="#" onClick={onClickPrevious} />
          </PaginationItem>
        )}
        {paginationArr.map(page => (
          <PaginationItem key={page}>
            <PaginationLink href={`#`} isActive={page === targetPage} onClick={() => onChangePage(page)}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {nowEndPageNumber < totalPages && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href={`#`} isActive={targetPage === totalPages} onClick={() => onChangePage(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" onClick={onClickNext} />
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </Pagination>
  );
};
