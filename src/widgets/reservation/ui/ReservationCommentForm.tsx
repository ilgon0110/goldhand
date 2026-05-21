'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { cn } from '@/lib/utils';
import { useCommentCreateMutation, useComments } from '@/src/entities/comment';
import { Button } from '@/src/shared/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/src/shared/ui/form';
import { LoadingSpinnerIcon } from '@/src/shared/ui/loadingSpinnerIcon';
import { Textarea } from '@/src/shared/ui/textarea';
import { toastError, toastSuccess } from '@/src/shared/utils';

import { consultCommentSchema } from '../config/consultCommentSchema';

type TReservationCommentFormProps = {
  docId: string;
};

export const ReservationCommentForm = ({ docId }: TReservationCommentFormProps) => {
  useComments({ docId, collectionName: 'consults' });

  const form = useForm<z.infer<typeof consultCommentSchema>>({
    resolver: zodResolver(consultCommentSchema),
    defaultValues: {
      comment: '',
    },
    mode: 'onChange',
  });

  const formValidation = form.formState.isValid;

  const { mutate: submitComment, isPending: isCommentSubmitting } = useCommentCreateMutation('reservation', docId, {
    onSuccess: () => {
      toastSuccess('댓글이 작성되었습니다.');
      form.reset();
    },
    onError: error => {
      toastError(error.message || '댓글 작성 중 오류가 발생하였습니다.');
    },
  });

  const onSubmit = (values: z.infer<typeof consultCommentSchema>) => {
    submitComment(values.comment);
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
