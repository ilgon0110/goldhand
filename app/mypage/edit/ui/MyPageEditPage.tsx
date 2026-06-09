'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { cn } from '@/lib/utils';
import { useGetMyPageData } from '@/src/entities/mypage';
import { useUpdateMyPageMutation } from '@/src/feature/mypage';
import { Button } from '@/src/shared/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/src/shared/ui/form';
import { Input } from '@/src/shared/ui/input';
import { LoadingSpinnerIcon } from '@/src/shared/ui/loadingSpinnerIcon';
import { toastError, toastSuccess } from '@/src/shared/utils';

import { myPageFormSchema } from '../config';

export const MyPageEditPage = () => {
  const { data: myPageData } = useGetMyPageData();
  const isLinked = myPageData.data.isLinked;
  const router = useRouter();
  const { mutate: updateMyPage, isPending } = useUpdateMyPageMutation({
    onSuccess: () => {
      toastSuccess('정보가 수정되었습니다.\n잠시 후 마이페이지로 이동합니다.');
      setTimeout(() => router.push('/mypage'), 1000);
    },
    onError: error => {
      toastError(error.message || '정보 수정에 실패했습니다. 다시 시도해주세요.');
    },
  });
  const form = useForm<z.infer<typeof myPageFormSchema>>({
    resolver: zodResolver(myPageFormSchema),
    defaultValues: {
      name: myPageData?.data.userData?.name || '',
      nickname: myPageData?.data.userData?.nickname || '',
      email: myPageData?.data.userData?.email || '',
    },
    mode: 'onChange',
  });
  const formValidation = form.formState.isValid;

  const onSubmit = (values: z.infer<typeof myPageFormSchema>) => {
    if (!formValidation) return;
    updateMyPage({ ...values, userId: myPageData?.data.userData?.userId || '' });
  };
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          defaultValue={myPageData?.data.userData?.name || ''}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이름</FormLabel>
              <FormControl>
                <Input placeholder="이름을 입력하세요." {...field} required />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage>{form.formState.errors.name?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          defaultValue={myPageData?.data.userData?.nickname || ''}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>닉네임</FormLabel>
              <FormControl>
                <Input placeholder="닉네임을 입력하세요." {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          defaultValue={myPageData?.data.userData?.email || ''}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input disabled={!isLinked} placeholder="이메일을 입력해주세요." {...field} />
              </FormControl>
              {!isLinked && <FormDescription>본인인증이 완료된 사용자만 이메일을 수정할 수 있습니다.</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className={cn(
            'transition-all duration-300 ease-in-out',
            formValidation ? '' : 'cursor-not-allowed opacity-20',
          )}
          disabled={!formValidation}
          type="submit"
        >
          {isPending ? <LoadingSpinnerIcon /> : '정보수정'}
        </Button>
      </form>
    </Form>
  );
};
