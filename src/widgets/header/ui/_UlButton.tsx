import { forwardRef } from 'react';

import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/accordion';

export const UlButton = forwardRef(
  (
    {
      text,
      enText,
      children,
    }: {
      text: string;
      enText?: string;
      children?: React.ReactNode;
    },
    ref,
  ) => {
    return children ? (
      <Accordion className="text-black lg:hidden" collapsible type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger className="relative flex items-center justify-center py-2 text-base font-semibold">
            {text}
          </AccordionTrigger>
          <AccordionContent>{children}</AccordionContent>
        </AccordionItem>
      </Accordion>
    ) : (
      <div className={cn('flex flex-row items-center justify-center -space-y-2 px-4 py-2 lg:flex-col')}>
        <div className="text-base">{text}</div>
        {!!enText && <div className="hidden text-[10px] text-[#00552a] lg:block">{enText}</div>}
      </div>
    );
  },
);

UlButton.displayName = 'UlButton';
