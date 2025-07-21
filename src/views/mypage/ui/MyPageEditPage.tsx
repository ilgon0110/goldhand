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
import { LoadingSpinnerIcon } from '@/src/shared/ui/loadingSpinnerIcon';
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
            userId: userData.userData?.userId || '',
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
          {isSubmitting ? <LoadingSpinnerIcon /> : '정보수정'}
        </Button>
      </form>
    </Form>
  );
};
