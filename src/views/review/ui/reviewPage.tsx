'use client';

import { useRouter } from 'next/navigation';
import { useQueryStates } from 'nuqs';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { franchiseeList } from '@/src/shared/config';
import { reviewParams } from '@/src/shared/searchParams';
import { Button } from '@/src/shared/ui/button';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/ui/select';
import { ReviewCard } from '@/src/widgets/goldHandReview';
import { WidgetPagination } from '@/src/widgets/Pagination';

import { type IReviewData } from '../index';

export const ReviewPage = ({ data, isLogin }: { data: IReviewData; isLogin: boolean }) => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'CARD' | 'TABLE'>('CARD');
  const [reviewParam, setReviewParam] = useQueryStates(reviewParams, {
    shallow: false,
  });
  const generateReviewThumbnailSrc = (htmlString: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const imgElement = doc.querySelector('img');
    return imgElement ? imgElement.getAttribute('src') : null;
  };

  function generateReviewDescription(htmlString: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    const blockTags = new Set(['P', 'DIV', 'BR', 'LI']);

    let result = '';

    function traverse(node: Node) {
      if (node.nodeType === Node.TEXT_NODE) {
        result += (node as Text).textContent;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;

        if (blockTags.has(el.tagName)) {
          result += ' '; // 혹은 "\n"도 가능 (더 깔끔)
        }

        for (const child of Array.from(el.childNodes)) {
          traverse(child);
        }

        if (blockTags.has(el.tagName)) {
          result += ' '; // 마무리 공백
        }
      }
    }

    traverse(doc.body);

    // Normalize whitespace (replace multiple spaces/newlines with single space)
    return result.replace(/\s+/g, ' ').trim();
  }

  const onChangePage = (page: number) => {
    setReviewParam({ page });
  };

  const onSelectValueChange = (value: string) => {
    setReviewParam({ franchisee: value });
  };

  return (
    <div>
      <SectionTitle buttonTitle="" title="이용 후기" onClickButtonTitle={() => {}} />
      <div className="flex w-full flex-col items-baseline justify-between gap-4 sm:flex-row sm:items-center sm:gap-0">
        <div className="flex w-full flex-row justify-between gap-2 sm:justify-normal">
          <Select defaultValue={franchiseeList[0]} onValueChange={onSelectValueChange}>
            <SelectTrigger className="mt-4 w-[180px]">
              <SelectValue placeholder="지점 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>지점 선택</SelectLabel>
                {franchiseeList.map(franchisee => {
                  return (
                    <SelectItem key={franchisee} value={franchisee}>
                      {franchisee}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="flex flex-row items-center gap-2 pt-3">
            <button
              className={cn(
                'fill-slate-200 transition-all duration-300 ease-in-out hover:fill-slate-500',
                viewMode === 'TABLE' && 'fill-slate-500',
              )}
              onClick={() => setViewMode('TABLE')}
            >
              <svg
                fill="current"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M320-80q-33 0-56.5-23.5T240-160v-480q0-33 23.5-56.5T320-720h480q33 0 56.5 23.5T880-640v480q0 33-23.5 56.5T800-80H320Zm0-80h200v-120H320v120Zm280 0h200v-120H600v120ZM80-240v-560q0-33 23.5-56.5T160-880h560v80H160v560H80Zm240-120h200v-120H320v120Zm280 0h200v-120H600v120ZM320-560h480v-80H320v80Z" />
              </svg>
            </button>
            <button
              className={cn(
                'fill-slate-200 transition-all duration-300 ease-in-out hover:fill-slate-500',
                viewMode === 'CARD' && 'fill-slate-500',
              )}
              onClick={() => setViewMode('CARD')}
            >
              <svg
                fill="current"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M80-360v-240q0-33 23.5-56.5T160-680q33 0 56.5 23.5T240-600v240q0 33-23.5 56.5T160-280q-33 0-56.5-23.5T80-360Zm280 160q-33 0-56.5-23.5T280-280v-400q0-33 23.5-56.5T360-760h240q33 0 56.5 23.5T680-680v400q0 33-23.5 56.5T600-200H360Zm360-160v-240q0-33 23.5-56.5T800-680q33 0 56.5 23.5T880-600v240q0 33-23.5 56.5T800-280q-33 0-56.5-23.5T720-360Zm-360 80h240v-400H360v400Zm120-200Z" />
              </svg>
            </button>
          </div>
        </div>
        <Button
          className={cn('', !isLogin && 'opacity-20 hover:cursor-not-allowed')}
          disabled={!isLogin}
          onClick={() => router.push('/review/form')}
        >
          {isLogin ? '후기 남기기' : '로그인 후 작성 가능'}
        </Button>
      </div>
      <section
        className={cn(
          'mt-6 grid gap-3',
          viewMode === 'TABLE' ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        )}
      >
        {data.reviewData.map(review => (
          <ReviewCard
            author={review.name}
            createdAt={review.createdAt}
            description={generateReviewDescription(review.htmlString)}
            franchisee={review.franchisee}
            key={review.id}
            thumbnail={generateReviewThumbnailSrc(review.htmlString)}
            title={review.title}
            viewMode={viewMode}
            onClick={() => router.push(`/review/${review.id}`)}
          />
        ))}
      </section>
      <section className="mt-6">
        {/* <ReviewPagination
          dataLength={data.totalDataLength}
          maxColumnNumber={10}
          reviewParam={reviewParam}
          setReviewParam={setReviewParam}
        /> */}
        <WidgetPagination
          maxColumnNumber={10}
          targetPage={reviewParam.page}
          totalDataLength={data.totalDataLength}
          onChangePage={onChangePage}
        />
      </section>
    </div>
  );
};
