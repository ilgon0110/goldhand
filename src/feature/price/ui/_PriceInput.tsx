'use client';

import type { ChangeEvent } from 'react';
import { type FieldPath, useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';
import type { TPrices } from '@/src/entities/price';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/shared/ui/form';

const PRICE_RULES = {
  required: '요금을 입력해 주세요.',
  // 숫자만 입력되면 number로 저장된다(onPriceChange). 문자열이 남아 있다면 잘못된 입력이다.
  validate: (value: unknown) =>
    (typeof value === 'number' && Number.isSafeInteger(value)) || '0 이상의 정수 금액을 입력해 주세요.',
};
const LABEL_RULES = {
  required: '항목명을 입력해 주세요.',
  validate: (value: unknown) =>
    (String(value).trim().length > 0 && String(value).length <= 200) || '항목명은 1~200자로 입력해 주세요.',
};

// 쉼표를 뺀 값을 폼에 넘기고(숫자면 number), 다시 쉼표가 붙은 뒤에도 커서가 같은 자릿수 뒤에 머물게 한다.
function onPriceChange(event: ChangeEvent<HTMLInputElement>, onChange: (value: number | string) => void) {
  const input = event.currentTarget;
  const cursor = input.selectionStart ?? input.value.length;
  const digitsBeforeCursor = input.value.slice(0, cursor).replace(/,/g, '').length;
  const raw = input.value.replace(/,/g, '');
  onChange(/^\d+$/.test(raw) ? Number(raw) : raw);
  requestAnimationFrame(() => {
    if (document.activeElement !== input) return;
    let position = 0;
    let digits = 0;
    while (position < input.value.length && digits < digitsBeforeCursor) {
      if (input.value[position] !== ',') digits++;
      position++;
    }
    input.setSelectionRange(position, position);
  });
}

type TPriceInputProps = {
  name: FieldPath<TPrices>;
  /** 스크린리더용 전체 이름. 표의 행·열 제목이 시각적 라벨 역할을 한다. */
  label: string;
  kind?: 'label' | 'price';
  className?: string;
};

export function PriceInput({ name, label, kind = 'price', className }: TPriceInputProps) {
  const { control } = useFormContext<TPrices>();
  const isPrice = kind === 'price';

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="space-y-1.5">
          <FormLabel className="sr-only">{isPrice ? `${label} (원)` : label}</FormLabel>
          <div
            className={cn(
              'flex h-10 items-center gap-1 rounded-[10px] border border-border bg-background px-3 transition-colors',
              'focus-within:border-goldDeep focus-within:ring-[3px] focus-within:ring-gold/20 hover:border-gold/60',
              fieldState.isDirty && 'border-goldDeep bg-cream/60',
              fieldState.invalid && 'border-destructive',
              className,
            )}
          >
            <FormControl>
              <input
                {...field}
                className={cn(
                  'min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none disabled:cursor-not-allowed disabled:opacity-50',
                  isPrice ? 'text-right font-semibold tabular-nums' : 'font-medium',
                  'md:text-base',
                )}
                inputMode={isPrice ? 'numeric' : 'text'}
                type="text"
                value={typeof field.value === 'number' ? field.value.toLocaleString('ko-KR') : String(field.value)}
                onChange={event =>
                  isPrice ? onPriceChange(event, field.onChange) : field.onChange(event.target.value)
                }
              />
            </FormControl>
            {isPrice && (
              <span aria-hidden="true" className="text-[13px] text-muted-foreground">
                원
              </span>
            )}
          </div>
          <FormMessage className="whitespace-normal text-left" />
        </FormItem>
      )}
      rules={isPrice ? PRICE_RULES : LABEL_RULES}
    />
  );
}
