'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { cn } from '@/lib/utils';
import { Button } from '@/src/shared/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/src/shared/ui/form';
import { LoadingSpinnerIcon } from '@/src/shared/ui/loadingSpinnerIcon';
import { Textarea } from '@/src/shared/ui/textarea';
import { toastError, toastSuccess } from '@/src/shared/utils';
import { useComments } from '@/src/widgets/Comment';

import { managerCommentSchema } from '../config/managerCommentSchema';

interface IResponsePost {
  response: 'expired' | 'ng' | 'ok' | 'unAuthorized';
  message: string;
}

type TManagerCommentFormProps = {
  docId: string;
};

export const ManagerCommentForm = ({ docId }: TManagerCommentFormProps) => {
  const { loading: isCommentSubmitting } = useComments({
    docId,
    collectionName: 'managers',
  });
  const form = useForm<z.infer<typeof managerCommentSchema>>({
    resolver: zodResolver(managerCommentSchema),
    defaultValues: {
      comment: '',
    },
    mode: 'onChange',
  });

  const formValidation = form.formState.isValid;

  const onSubmit = async (values: z.infer<typeof managerCommentSchema>) => {
    if (!formValidation) return;
    const { comment } = values;

    try {
      const response = await fetch('/api/manager/detail/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          docId,
          comment,
        }),
      });
      const data: IResponsePost = await response.json();
      if (data.response === 'ok') {
        toastSuccess('댓글이 작성되었습니다.');
        form.reset();
      } else if (data.response === 'unAuthorized' || data.response === 'expired') {
        toastError('로그인 후 이용해주세요.');
        form.reset();
      } else {
        toastError('댓글 작성 중 알 수 없는 오류가 발생하였습니다.');
      }
    } catch {
      toastError('댓글 작성 중 알 수 없는 오류가 발생하였습니다.');
    }
  };

  return (
    <Form {...form}>
      <form className="mt-4 space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          defaultValue={''}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>댓글 남기기</FormLabel>
              <FormControl>
                <Textarea placeholder="댓글을 입력하세요." {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage>{form.formState.errors.comment?.message}</FormMessage>
            </FormItem>
          )}
        />
        <div className="flex w-full justify-end">
          <Button
            className={cn('transition-all duration-300', formValidation ? '' : 'opacity-20 hover:cursor-not-allowed')}
            disabled={!formValidation}
            type="submit"
          >
            {isCommentSubmitting ? <LoadingSpinnerIcon /> : '댓글달기'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
