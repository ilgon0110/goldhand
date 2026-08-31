/* eslint-disable jsx-a11y/no-autofocus, react/jsx-handler-names */
'use client';

import type { LexicalEditor } from 'lexical';
import dynamic from 'next/dynamic';
import type { UseFormReturn } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { franchiseeList } from '@/src/shared/config';
import { Button } from '@/src/shared/ui/button';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/src/shared/ui/form';
import { Input } from '@/src/shared/ui/input';
import { LoadingSpinnerIcon } from '@/src/shared/ui/loadingSpinnerIcon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/ui/select';

import type { TReviewContentValues } from '../model';

const Editor = dynamic(() => import('@/src/widgets/editor/ui/Editor').then(mod => mod.Editor), {
  ssr: false,
  loading: () => <LoadingSpinnerIcon />,
});

type TReviewFieldsProps = {
  form: UseFormReturn<TReviewContentValues>;
  autoFocusName?: boolean;
  isSubmitting: boolean;
  isOptimizing: boolean;
  onEditorChange: (editor: LexicalEditor) => void;
};

export const ReviewFields = ({
  form,
  autoFocusName = false,
  isSubmitting,
  isOptimizing,
  onEditorChange,
}: TReviewFieldsProps) => {
  const canSubmit = form.formState.isValid;

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              이름 <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input autoFocus={autoFocusName} placeholder="후기에 표시될 이름이나 닉네임을 입력해주세요." {...field} />
            </FormControl>
            <FormDescription />
            <FormMessage>{form.formState.errors.name?.message}</FormMessage>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              제목 <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder="제목을 입력해주세요." {...field} />
            </FormControl>
            <FormDescription />
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
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger aria-label="대리점 선택" data-testid="franchisee-select-trigger">
                  <SelectValue placeholder="이용했던 대리점을 선택해주세요." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {franchiseeList.map(franchisee => (
                  <SelectItem key={franchisee} value={franchisee}>
                    {franchisee}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription className="text-xs" />
            <FormMessage />
          </FormItem>
        )}
      />
      <Editor editable={true} onEditorChange={onEditorChange} />
      <div className="flex w-full justify-between">
        <Button
          className={cn('transition-all duration-300 ease-in-out', !canSubmit && 'cursor-not-allowed opacity-20')}
          disabled={!canSubmit}
          type="submit"
        >
          {isSubmitting || isOptimizing ? <LoadingSpinnerIcon /> : '후기 남기기'}
        </Button>
      </div>
    </>
  );
};
