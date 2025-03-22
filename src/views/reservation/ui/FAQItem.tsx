import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";

type FAQItemProps = {
  title: string;
  content: string;
};

export const FAQItem = ({ title, content }: FAQItemProps) => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="flex justify-start items-center relative text-lg md:text-2xl font-medium">
          {title}
        </AccordionTrigger>
        <AccordionContent className="mt-2 text-sm md:text-xl">
          {content}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
