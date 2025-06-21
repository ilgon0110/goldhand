'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createRef, useEffect, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { franchiseeList } from '@/src/shared/config';
import type { IConsultDetailData, IUserData } from '@/src/shared/types';
import { Calendar } from '@/src/shared/ui/calendar';
import { Checkbox } from '@/src/shared/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/src/shared/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/src/shared/ui/popover';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/ui/select';
import { Textarea } from '@/src/shared/ui/textarea';
import { toastError, toastSuccess } from '@/src/shared/utils';
import { formSchema } from '@/src/views/reservation/form';

export const ReservationFormPage = ({
  userData,
  consultDetailData,
}: {
  userData: IUserData;
  consultDetailData: IConsultDetailData;
}) => {
  const searchParams = useSearchParams();
  const docId = searchParams.get('docId');
  const password = searchParams.get('password');
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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
  const [expiredDialogOpen, setExpiredDialogOpen] = useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!formValidation) return;

    try {
      setIsSubmitting(true);

      const recaptchaToken = await recaptchaRef.current?.executeAsync();

      // POST 요청
      const apiUrl = consultDetailData.response === 'ok' ? '/api/consultDetail/update' : '/api/consultDetail/create';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          userId: userData.userData?.uid || null,
          recaptchaToken,
          docId,
        }),
      });

      const data = await response.json();
      if (data.response === 'expired') {
        // 추후 회원인데 비회원 상담 신청 시 로직 구현... 지금은 PASS
        //setExpiredDialogOpen(true);
        toastError('로그인 세션이 만료되었습니다.\n다시 로그인 해주세요.');
        return;
      }

      if (data.response === 'ok') {
        toastSuccess('상담 신청이 완료되었습니다.\n잠시 후 작성글 페이지로 이동합니다.');
        // 3초 후에 페이지 이동
        setTimeout(() => {
          router.replace(`/reservation/list/${data.docId || docId}?password=${values.password}`);
        }, 3000);
      } else {
        toastError(`상담 신청에 실패했습니다.\n${data.message}`);
      }
    } catch (error: any) {
      console.error('Error:', error);
      toastError(`상담 신청에 실패했습니다.\n${error.message}`);
    } finally {
      setIsSubmitting(false);
      recaptchaRef.current?.reset();
    }
  };

  const isMember = userData.userData != null || userData.response === 'unAuthorized';

  useEffect(() => {
    form.trigger();
  }, []);

  const recaptchaRef = createRef<ReCAPTCHA>();

  return (
    <div>
      <Dialog open={expiredDialogOpen} onOpenChange={setExpiredDialogOpen}>
        <SectionTitle buttonTitle="" title="고운황금손 상담신청" onClickButtonTitle={() => {}} />
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
            {!isMember && (
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
                    <FormDescription></FormDescription>
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
                  <Select
                    defaultValue={consultDetailData.data.franchisee || field.value}
                    onValueChange={field.onChange}
                  >
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
              <ReCAPTCHA ref={recaptchaRef} sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!} size="invisible" />
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
                  '상담 신청하기'
                )}
              </Button>
            </div>
          </form>
        </Form>

        <DialogContent className="sm:max-w-[425px] sm:px-8">
          <DialogTitle>비밀번호를 입력하세요.</DialogTitle>
          <DialogHeader>
            <DialogDescription></DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
