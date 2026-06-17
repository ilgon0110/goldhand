import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/src/shared/ui/accordion';
import SectionTitleHero from '@/src/shared/ui/SectionTitleHero';

const FAQ_ITEMS = [
  {
    id: 'q1',
    question: '정부바우처 지원이 되나요?',
    answer:
      '네, 고운황금손은 보건복지부 지정 산모신생아 건강관리 서비스 제공기관입니다. 정부바우처를 통해 출산 가정에서 경제적 부담 없이 전문 산후도우미 서비스를 이용하실 수 있습니다. 자세한 바우처 지원 내용은 정부바우처 안내 페이지를 확인해 주세요.',
  },
  {
    id: 'q2',
    question: '광교에서도 서비스 이용이 가능한가요?',
    answer:
      '네, 수원 광교 지역을 포함하여 수원 전 지역에서 서비스를 제공하고 있습니다. 용인 지역도 서비스 대상 지역에 포함되며, 서비스 가능 여부는 전화(010-4437-0431) 문의를 통해 확인하실 수 있습니다.',
  },
  {
    id: 'q3',
    question: '용인 산후도우미 예약은 어떻게 하나요?',
    answer:
      '홈페이지 예약상담 페이지를 통해 온라인으로 신청하시거나, 전화(010-4437-0431)로 직접 문의 주시면 친절하게 안내해 드립니다. 예약 상담 후 파견 일정을 조율해 드립니다.',
  },
  {
    id: 'q4',
    question: '산후도우미 파견 기간은 어떻게 되나요?',
    answer:
      '정부바우처 기준으로 단태아 5~25일, 쌍태아 10~40일 서비스를 제공합니다. 서비스 기간 및 이용 가격에 대한 자세한 안내는 이용요금 페이지를 확인해 주세요.',
  },
  {
    id: 'q5',
    question: '보건복지부 인증 산후도우미인가요?',
    answer:
      '네, 고운황금손은 보건복지부가 지정한 산모신생아 건강관리 서비스 제공기관으로, 전문 교육을 이수한 건강관리사가 서비스를 제공합니다. 안심하고 믿을 수 있는 공인 서비스입니다.',
  },
] as const;

export function FaqSection() {
  return (
    <section className={cn('mx-auto')}>
      <SectionTitleHero label="자주 묻는 질문" />
      <Accordion className="mx-auto max-w-lg" collapsible type="single">
        {FAQ_ITEMS.map(({ id, question, answer }) => (
          <AccordionItem key={id} value={id}>
            <AccordionTrigger>{question}</AccordionTrigger>
            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
