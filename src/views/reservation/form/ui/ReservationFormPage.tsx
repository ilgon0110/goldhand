'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
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
import type { IUserResponseData } from '@/src/shared/types';
import { Calendar } from '@/src/shared/ui/calendar';
import { Checkbox } from '@/src/shared/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/src/shared/ui/dialog';
import { LoadingSpinnerIcon } from '@/src/shared/ui/loadingSpinnerIcon';
import { Popover, PopoverContent, PopoverTrigger } from '@/src/shared/ui/popover';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/ui/select';
import { Textarea } from '@/src/shared/ui/textarea';
import { toastError, toastSuccess } from '@/src/shared/utils';
import { formSchema } from '@/src/views/reservation/form';

export const ReservationFormPage = ({ userData }: { userData: IUserResponseData }) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      name: userData?.userData?.name || '',
      password: '',
      secret: true,
      franchisee: '',
      phoneNumber: userData?.userData?.phoneNumber || '',
      bornDate: undefined,
      location: '',
      content: '',
    },
    mode: 'onChange',
  });
  const formValidation = form.formState.isValid;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expiredDialogOpen, setExpiredDialogOpen] = useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!formValidation) return;
    if (!executeRecaptcha) return;
    try {
      setIsSubmitting(true);

      const recaptchaToken = await executeRecaptcha('join');

      // POST 요청
      const response = await fetch('/api/consultDetail/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          userId: userData.userData?.userId || null,
          recaptchaToken,
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
          router.replace(`/reservation/list/${data.docId}`);
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

  useEffect(() => {
    form.trigger();
  }, []);

  return (
    <div>
      <Dialog open={expiredDialogOpen} onOpenChange={setExpiredDialogOpen}>
        <SectionTitle buttonTitle="" title="고운황금손 상담신청" onClickButtonTitle={() => {}} />
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              defaultValue={userData.userData?.name || ''}
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
              defaultValue={userData.userData?.phoneNumber || ''}
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
            {userData.userData?.userId == null && (
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
                  <Select defaultValue={field.value} onValueChange={field.onChange}>
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
                  <FormMessage>{form.formState.errors.title?.message}</FormMessage>
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
                      <Checkbox checked={field.value} defaultChecked={true} onCheckedChange={field.onChange} />
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
                {isSubmitting ? <LoadingSpinnerIcon /> : '상담 신청하기'}
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
