'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { cn } from '@/lib/utils';
import type { IUserResponseData } from '@/src/shared/types';
import { Button } from '@/src/shared/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/src/shared/ui/form';
import { Input } from '@/src/shared/ui/input';
import { toastError, toastSuccess } from '@/src/shared/utils';

import { myPageFormSchema } from '../config/mypageFormSchema';

type TMyPageEditPageProps = {
  userData: IUserResponseData;
};

export const MyPageEditPage = ({ userData }: TMyPageEditPageProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof myPageFormSchema>>({
    resolver: zodResolver(myPageFormSchema),
    defaultValues: {
      name: userData.userData?.name || '',
      nickname: userData.userData?.nickname || '',
      phoneNumber: userData.userData?.phoneNumber || '',
      email: userData.userData?.email || '',
    },
    mode: 'onChange',
  });
  const formValidation = form.formState.isValid;

  const onSubmit = async (values: z.infer<typeof myPageFormSchema>) => {
    if (!formValidation) return;
    try {
      setIsSubmitting(true);
      const response = await (
        await fetch('/api/mypage/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...values,
            userId: userData.userData?.uid,
          }),
        })
      ).json();
      if (response.response === 'ok') {
        toastSuccess('정보가 수정되었습니다.\n잠시 후 마이페이지로 이동합니다.');
        setIsSubmitting(false);
        setTimeout(() => {
          router.push('/mypage');
        }, 1000);
      } else {
        toastError(response.message || '정보 수정에 실패했습니다. 다시 시도해주세요.');
        setIsSubmitting(false);
      }
    } catch (error) {
      toastError('정보 수정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          defaultValue={userData.userData?.name || ''}
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
          defaultValue={userData.userData?.nickname || ''}
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
          defaultValue={userData?.userData?.phoneNumber || ''}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>휴대폰번호</FormLabel>
              <FormControl>
                <div className="flex flex-row gap-6">
                  <Input
                    placeholder="휴대폰번호를 입력해주세요. (예:01012345678)"
                    {...field}
                    maxLength={12}
                    minLength={6}
                    required
                  />
                </div>
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          defaultValue={userData?.userData?.email || ''}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input placeholder="이메일을 입력해주세요." {...field} />
              </FormControl>
              <FormDescription></FormDescription>
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
          {isSubmitting ? (
            <div role="status">
              <svg
                aria-hidden="true"
                className="h-6 w-6 animate-spin fill-green-500 text-gray-200 dark:text-gray-600"
                fill="none"
                viewBox="0 0 100 101"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            '정보수정'
          )}
        </Button>
      </form>
    </Form>
  );
};
