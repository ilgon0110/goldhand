import dynamic from 'next/dynamic';

import { cn } from '@/lib/utils';
import { FaqSection, FranchiseeSheetList, ImageSlideList, MainTitle, PriceList, SponsorList } from '@/src/feature/home';
import { EventModal } from '@/src/widgets/event/ui/EventModal';

const ReviewCarousel = dynamic(
  () => import('@/src/feature/home/reviewCarousel/ui/ReviewCarousel').then(m => m.ReviewCarousel),
  { ssr: false, loading: () => <div className="h-48 w-full animate-pulse rounded-md bg-gray-200" /> },
);

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '정부바우처 지원이 되나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '네, 고운황금손은 보건복지부 지정 산모신생아 건강관리 서비스 제공기관입니다. 정부바우처를 통해 출산 가정에서 경제적 부담 없이 전문 산후도우미 서비스를 이용하실 수 있습니다.',
      },
    },
    {
      '@type': 'Question',
      name: '광교에서도 서비스 이용이 가능한가요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '네, 수원 광교 지역을 포함하여 수원 전 지역에서 서비스를 제공하고 있습니다. 용인 지역도 서비스 대상 지역에 포함됩니다.',
      },
    },
    {
      '@type': 'Question',
      name: '용인 산후도우미 예약은 어떻게 하나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '홈페이지 예약상담 페이지를 통해 온라인으로 신청하시거나, 전화(010-4437-0431)로 직접 문의 주시면 친절하게 안내해 드립니다.',
      },
    },
    {
      '@type': 'Question',
      name: '산후도우미 파견 기간은 어떻게 되나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '정부바우처 기준으로 단태아 5~25일, 쌍태아 10~40일 서비스를 제공합니다.',
      },
    },
    {
      '@type': 'Question',
      name: '보건복지부 인증 산후도우미인가요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '네, 고운황금손은 보건복지부가 지정한 산모신생아 건강관리 서비스 제공기관으로, 전문 교육을 이수한 건강관리사가 서비스를 제공합니다.',
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} type="application/ld+json" />
      <EventModal />
      <section>
        <ImageSlideList />
      </section>
      <section>
        <MainTitle />
      </section>
      <section className={cn('mx-auto mt-24 max-w-7xl space-y-24 px-4', 'sm:space-y-48')}>
        <ReviewCarousel />
        <FranchiseeSheetList />
        <PriceList />
        <FaqSection />
        <SponsorList />
      </section>
    </>
  );
}
