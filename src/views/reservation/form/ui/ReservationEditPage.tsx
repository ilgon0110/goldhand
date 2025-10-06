/* eslint-disable react/jsx-handler-names */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { cn } from '@/lib/utils';
import { franchiseeList } from '@/src/shared/config';
import type { IReservationResponseData, IUserResponseData } from '@/src/shared/types';
import { Button } from '@/src/shared/ui/button';
import { Calendar } from '@/src/shared/ui/calendar';
import { Checkbox } from '@/src/shared/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/src/shared/ui/form';
import { Input } from '@/src/shared/ui/input';
import { LoadingSpinnerIcon } from '@/src/shared/ui/loadingSpinnerIcon';
import { Popover, PopoverContent, PopoverTrigger } from '@/src/shared/ui/popover';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/ui/select';
import { Textarea } from '@/src/shared/ui/textarea';
import { toastError, toastSuccess } from '@/src/shared/utils';

import { reservationFormSchema } from '../config/reservationFormSchema';

export const ReservationEditPage = ({
  userData,
  consultDetailData,
}: {
  userData: IUserResponseData;
  consultDetailData: IReservationResponseData;
}) => {
  const searchParams = useSearchParams();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const docId = searchParams.get('docId');
  const password = searchParams.get('password');
  const router = useRouter();

  const form = useForm<z.infer<typeof reservationFormSchema>>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      title: consultDetailData.data.title || '',
      name: userData?.userData?.name || consultDetailData.data.name || '',
      password: password || '',
      secret: consultDetailData.data.secret || false,
      franchisee: consultDetailData.data.franchisee || '',
      phoneNumber: userData?.userData?.phoneNumber || consultDetailData.data.phoneNumber || '',
      bornDate: consultDetailData.data.bornDate ? new Date(consultDetailData.data.bornDate) : undefined,
      location: consultDetailData.data.location || '',
      content: consultDetailData.data.content || '',
    },
    mode: 'onChange',
  });
  const formValidation = form.formState.isValid;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values: z.infer<typeof reservationFormSchema>) => {
    if (!formValidation) return;
    if (!executeRecaptcha) return;
    try {
      setIsSubmitting(true);

      const recaptchaToken = await executeRecaptcha('join');

      // POST 요청
      const response = await fetch('/api/reservation/detail/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          userId: userData.userData?.userId || null,
          recaptchaToken,
          docId,
        }),
      });

      const data = await response.json();
      if (data.response === 'expired') {
        toastError('로그인 세션이 만료되었습니다.\n다시 로그인 해주세요.');
        return;
      }

      if (data.response === 'ok') {
        toastSuccess('상담 신청이 완료되었습니다.\n잠시 후 작성글 페이지로 이동합니다.');
        // 3초 후에 페이지 이동
        setTimeout(() => {
          router.replace(`/reservation/list/${data.docId || docId}`);
        }, 3000);
      } else {
        toastError(`상담 신청에 실패했습니다.\n${data.message}`);
      }
    } catch (error: any) {
      console.error('Error:', error);
      toastError(`상담 신청에 실패했습니다.\n${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isMemberAndCreateMode = userData.userData?.userId != null && consultDetailData.data == null;
  const isNonMemberAndSecret =
    consultDetailData.data && consultDetailData.data.secret && consultDetailData.data?.userId == null;

  useEffect(() => {
    form.trigger();
  }, []);

  return (
    <>
      <SectionTitle title="고운황금손 상담신청" />
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            defaultValue={userData.userData?.name || consultDetailData.data.name || ''}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  이름 <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="상담받으실 분의 성함을 입력해주세요." {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage>{form.formState.errors.name?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            defaultValue={userData.userData?.phoneNumber || consultDetailData.data.phoneNumber || ''}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  휴대폰번호 <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="휴대폰번호를 입력해주세요. (예: 01012345678)"
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
          {(isNonMemberAndSecret || isMemberAndCreateMode) && (
            <FormField
              control={form.control}
              defaultValue={undefined}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    비밀번호 <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="게시글 수정, 삭제를 위한 비밀번호를 입력해주세요." {...field} />
                  </FormControl>
                  <FormDescription>비회원으로 예약하실 경우에만 사용됩니다.</FormDescription>
                  <FormMessage>{form.formState.errors.password?.message}</FormMessage>
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="bornDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>출산 예정일</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                        variant={'outline'}
                      >
                        {field.value ? (
                          format(field.value, 'PPP', { locale: ko })
                        ) : (
                          <span>출산 예정일을 선택해주세요.</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                      disabled={date => date < new Date('1900-01-01')}
                      initialFocus
                      locale={ko}
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription className="hidden"></FormDescription>
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
                <Select defaultValue={consultDetailData.data.franchisee || field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="상담받으실 대리점을 선택해주세요." />
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
                <FormDescription className="text-xs">선택하신 대리점의 점장이 직접 상담해드려요.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="h-[1px] w-full bg-slate-200" />
          <FormField
            control={form.control}
            defaultValue={consultDetailData.data.title || ''}
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
                <FormMessage>{form.formState.errors.title?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            defaultValue={consultDetailData.data.location || ''}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  서비스 이용 지역 <span className="text-red-500">*</span>
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
                  상담 내용 <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="h-40 resize-none text-sm"
                    placeholder="상담하고 싶은 내용을 입력해주세요."
                    {...field}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full justify-between">
            <FormField
              control={form.control}
              name="secret"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      defaultChecked={consultDetailData.data.secret || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>비밀글</FormLabel>
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
              {isSubmitting ? <LoadingSpinnerIcon /> : '수정완료'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
