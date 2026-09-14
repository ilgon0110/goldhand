'use client';

import { cn } from '@/lib/utils';
import { Comment } from '@/src/entities/comment';
import type { TReviewCommentController } from '@/src/feature/review-detail';
import { Button } from '@/src/shared/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/src/shared/ui/form';
import { Label } from '@/src/shared/ui/label';
import { LoadingSpinnerIcon } from '@/src/shared/ui/loadingSpinnerIcon';
import { Textarea } from '@/src/shared/ui/textarea';

type TReviewCommentSectionProps = TReviewCommentController & {
  docId: string;
  userId?: string;
};

export function ReviewCommentSection({ comments, docId, form, handleSubmit, isLoading, userId }: TReviewCommentSectionProps) {
  const isValid = form.formState.isValid;
  const isLoggedIn = userId != null;

  return (
    <>
      <Form {...form}>
        <form className="mt-4 space-y-2" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>댓글 남기기</FormLabel>
                <FormControl><Textarea placeholder="댓글을 입력하세요." {...field} /></FormControl>
                <FormDescription />
                <FormMessage>{form.formState.errors.comment?.message}</FormMessage>
              </FormItem>
            )}
          />
          <div className="flex w-full justify-end">
            <Button
              className={cn('transition-all duration-300', isValid ? '' : 'opacity-20 hover:cursor-not-allowed')}
              disabled={!isValid || isLoading || !isLoggedIn}
              type="submit"
            >
              {isLoading ? <LoadingSpinnerIcon /> : isLoggedIn ? '댓글달기' : '로그인 후 댓글 작성'}
            </Button>
          </div>
        </form>
      </Form>
      <Label className="mt-10 text-lg font-bold">{`댓글 (${comments != null ? comments.length : '댓글이 없습니다'})`}</Label>
      <div className="mt-2 space-y-4">
        {comments?.map(item => (
          <Comment
            commentId={item.id}
            content={item.comment}
            createdAt={item.createdAt}
            docId={docId}
            isAuthorAdmin={item.isAuthorAdmin}
            isCommentOwner={item.userId === userId}
            key={item.id}
            type="review"
            updatedAt={item.updatedAt}
            userId={userId || ''}
          />
        ))}
      </div>
    </>
  );
}
