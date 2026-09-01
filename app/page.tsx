import type { SearchParams } from 'nuqs/server';

import { cn } from '@/lib/utils';
import { FaqSection, FranchiseeSheetList, ImageSlideList, MainTitle, PriceList, SponsorList } from '@/src/feature/home';
import { EventModal } from '@/src/widgets/event/ui/EventModal';
import { ReviewCarousel } from '@/src/feature/home/reviewCarousel/ui/ReviewCarousel';

type THomeProps = {
  searchParams: Promise<SearchParams>;
};

const toSearchKey = (searchParams: SearchParams) => {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams).sort(([first], [second]) => first.localeCompare(second))) {
    if (Array.isArray(value)) {
      for (const item of value) params.append(key, item);
    } else if (value != null) {
      params.set(key, value);
    }
  }

  return params.toString();
};

export default async function Home({ searchParams }: THomeProps) {
  const locationKey = toSearchKey(await searchParams);

  return (
    <>
      <EventModal locationKey={locationKey} />
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
