/* eslint-disable react/jsx-handler-names */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { franchiseeList } from '@/src/shared/config';
import { LoadingSpinnerIcon } from '@/src/shared/ui/loadingSpinnerIcon';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/ui/select';
import { Textarea } from '@/src/shared/ui/textarea';
import { toastError, toastSuccess } from '@/src/shared/utils';

import { managerApplySchema } from '../config/managerApplySchema';

export const ManagerApplyPage = () => {
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const form = useForm<z.infer<typeof managerApplySchema>>({
    resolver: zodResolver(managerApplySchema),
    defaultValues: {
      name: '',
      phoneNumber: '',
      email: '',
      content: '',
    },
    mode: 'onChange',
  });
  const formValidation = form.formState.isValid;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values: z.infer<typeof managerApplySchema>) => {
    if (!formValidation) return;
    if (!executeRecaptcha) return;

    try {
      setIsSubmitting(true);
      const recaptchaToken = await executeRecaptcha('join');

      // POST 요청
      const managerApplyResponse = (await (
        await fetch('/api/manager/apply', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...values,
            recaptchaToken,
          }),
        })
      ).json()) as { response: string; message: string };

      if (managerApplyResponse.response === 'ng') {
        toastError(`산후관리사 신청에 실패했습니다.\n${managerApplyResponse.message}`);
        return;
      }

      if (managerApplyResponse.response === 'ok') {
        toastSuccess('산후관리사 신청이 완료되었습니다.\n잠시 후 홈으로 이동합니다.');
        // 3초 후에 페이지 이동
        setTimeout(() => {
          router.replace('/');
        }, 3000);
      }
    } catch (error: any) {
      console.error('Error:', error);
      toastError(`관리사 신청에 실패했습니다.\n${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    form.trigger();
  }, []);

  //const recaptchaRef = useRef<ReCAPTCHA>(null);

  return (
    <div>
      <SectionTitle buttonTitle="" title="고운황금손 산후관리사 지원하기" onClickButtonTitle={() => {}} />
      <Form {...form}>
        <form className="mt-6 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
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
                  <Input placeholder="지원하실 분의 성함을 입력해주세요." {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage>{form.formState.errors.name?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            defaultValue={''}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  휴대폰번호 <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="연락받을 휴대폰번호를 입력해주세요. (예: 01012345678)"
                    {...field}
                    maxLength={12}
                    minLength={6}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            defaultValue={''}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  이메일 <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="연락받을 이메일을 입력해주세요. (예: ----@naver.com)" type="email" {...field} />
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
                      <SelectValue placeholder="지원하실 대리점을 선택해주세요." />
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
                <FormDescription className="text-xs">선택하신 대리점의 점장이 직접 연락을 드립니다.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            defaultValue={''}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  거주지역 <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="OO시 OO동까지 작성해주세요." {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage>{form.formState.errors.location?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  자기소개 <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="h-40 resize-none text-sm"
                    maxLength={700}
                    placeholder="자기소개를 작성해주세요. (700자 이하)"
                    {...field}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full justify-between">
            <Button
              className={cn(
                'transition-all duration-300 ease-in-out',
                formValidation ? '' : 'cursor-not-allowed opacity-20',
              )}
              disabled={!formValidation}
              type="submit"
            >
              {isSubmitting ? <LoadingSpinnerIcon /> : '상담 신청하기'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
