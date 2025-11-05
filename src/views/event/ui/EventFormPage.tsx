/* eslint-disable react/jsx-handler-names */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
//import { Editor } from '@/src/widgets/editor/ui/Editor';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { cn } from '@/lib/utils';
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

import { useEventFormMutation } from '../api/useEventFormMutation';
import { eventFormSchema } from '../config/eventFormSchema';

const Editor = dynamic(() => import('@/src/widgets/editor/ui/Editor').then(mod => mod.Editor), {
  ssr: false,
  loading: () => <LoadingSpinnerIcon />,
});

export const EventFormPage = () => {
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      name: '',
    },
    mode: 'onChange',
  });
  const formValidation = form.formState.isValid;

  const { onSubmit, handleChangeEventFormEditor, isSubmitting, imageProgress, resetImageProgress } =
    useEventFormMutation('create');

  return (
    <>
      <SectionTitle title="고운황금손 이벤트 만들기" />
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
                  <Input placeholder="관리자 이름을 입력해주세요." {...field} />
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
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  이벤트 상태 <span className="text-red-500">*</span>
                </FormLabel>
                <Select defaultValue={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger data-testid="event-status-select-trigger">
                      <SelectValue placeholder="이벤트 상태를 선택해주세요." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="UPCOMING">예정됨</SelectItem>
                    <SelectItem value="ONGOING">진행중</SelectItem>
                    <SelectItem value="ENDED">종료됨</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription className="text-xs"></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Editor editable={true} onEditorChange={handleChangeEventFormEditor} />
          <div className="flex w-full justify-between">
            <Button
              className={cn(
                'transition-all duration-300 ease-in-out',
                formValidation ? '' : 'cursor-not-allowed opacity-20',
              )}
              disabled={!formValidation}
              type="submit"
            >
              {isSubmitting ? <LoadingSpinnerIcon /> : '이벤트 만들기'}
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
