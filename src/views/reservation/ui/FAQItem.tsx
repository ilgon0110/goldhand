import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/accordion';

type FAQItemProps = {
  title: string;
  content: string;
};

export const FAQItem = ({ title, content }: FAQItemProps) => {
  return (
    <Accordion collapsible type="single">
      <AccordionItem value="item-1">
        <AccordionTrigger className="relative flex items-center justify-start py-3 text-lg font-medium md:text-2xl">
          {title}
        </AccordionTrigger>
        <AccordionContent className="mt-2 text-sm md:text-xl">{content}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
