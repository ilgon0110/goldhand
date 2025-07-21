/* eslint-disable react/jsx-handler-names */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { cn } from '@/lib/utils';
import { franchiseeList } from '@/src/shared/config';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/src/shared/ui/alert-dialog';
import { Button } from '@/src/shared/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/src/shared/ui/form';
import { Input } from '@/src/shared/ui/input';
import { LoadingSpinnerIcon } from '@/src/shared/ui/loadingSpinnerIcon';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/ui/select';
import { Editor } from '@/src/widgets/editor/ui/Editor';

import { reviewFormSchema } from '../config/reviewFormSchema';
import { useReviewFormMutation } from '../hooks/useReviewFormMutation';
import { useSuspenseGetReviewDetailData } from '../hooks/useSuspenseGetReviewDetailData';

type TReviewEditPageProps = {
  docId: string;
};

export const ReviewEditPage = ({ docId }: TReviewEditPageProps) => {
  const { data } = useSuspenseGetReviewDetailData(docId);

  const form = useForm<z.infer<typeof reviewFormSchema>>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      title: data.data.title || '',
      name: data.data.name || '',
      franchisee: data.data.franchisee || '',
    },
    mode: 'onChange',
  });
  const formValidation = form.formState.isValid;
  const { onSubmit, handleChangeReviewFormEditor, isSubmitting, imageProgress, resetImageProgress } =
    useReviewFormMutation('update', docId);

  return (
    <>
      <SectionTitle buttonTitle="" title="고운황금손 후기남기기" onClickButtonTitle={() => {}} />
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            defaultValue={''}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  이름 <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="후기에 표시될 이름이나 닉네임을 입력해주세요." {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage>{form.formState.errors.name?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            defaultValue={''}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  제목 <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="제목을 입력해주세요." {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="franchisee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  대리점 <span className="text-red-500">*</span>
                </FormLabel>
                <Select defaultValue={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="이용했던 대리점을 선택해주세요." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {franchiseeList.map(franchisee => {
                      return (
                        <SelectItem key={franchisee} value={franchisee}>
                          {franchisee}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormDescription className="text-xs"></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Editor editable={true} htmlString={data.data.htmlString} onEditorChange={handleChangeReviewFormEditor} />
          <div className="flex w-full justify-between">
            <Button
              className={cn(
                'transition-all duration-300 ease-in-out',
                formValidation ? '' : 'cursor-not-allowed opacity-20',
              )}
              disabled={!formValidation}
              type="submit"
            >
              {isSubmitting ? <LoadingSpinnerIcon /> : '후기 수정하기'}
            </Button>
          </div>
        </form>
      </Form>
      {/* 이미지 업로드 진행 상황 모달 */}
      <AlertDialog open={imageProgress !== undefined} onOpenChange={resetImageProgress}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>업로드 진행 상황</AlertDialogTitle>
            <AlertDialogDescription>
              {imageProgress ? (
                <div className="w-full">
                  <div className="mb-2 text-sm">
                    {imageProgress.key} 업로드 진행률: {imageProgress.progress}%
                  </div>
                  <div className="h-4 w-full rounded-full bg-gray-200">
                    <div
                      className="h-4 rounded-full bg-blue-500 transition-all duration-300 ease-in-out"
                      style={{ width: `${imageProgress.progress}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="text-sm">업로드 진행 상황이 없습니다.</div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>닫기</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
