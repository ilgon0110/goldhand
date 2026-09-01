import { describe, expect, it } from 'vitest';

import { metadata as eventEditMetadata } from '@/app/event/[docId]/edit/layout';
import { metadata as eventFormMetadata } from '@/app/event/form/layout';
import { metadata as loginMetadata } from '@/app/login/layout';
import { metadata as managerDetailMetadata } from '@/app/manager/[docId]/layout';
import { metadata as managerApplyMetadata } from '@/app/manager/apply/layout';
import { metadata as managerListMetadata } from '@/app/manager/list/layout';
import { metadata as mypageMetadata } from '@/app/mypage/layout';
import { metadata as reservationApplyMetadata } from '@/app/reservation/apply/layout';
import { metadata as reservationEditMetadata } from '@/app/reservation/edit/layout';
import { metadata as reservationFormMetadata } from '@/app/reservation/form/layout';
import { metadata as reservationListMetadata } from '@/app/reservation/list/layout';
import { metadata as reviewEditMetadata } from '@/app/review/[docId]/edit/layout';
import { metadata as reviewFormMetadata } from '@/app/review/form/layout';
import sitemap from '@/app/sitemap';
import { noIndexMetadata } from '@/src/shared/seo/noIndexMetadata';
import { metadata as signupMetadata } from '@/app/signup/layout';

const expectedPublicUrls = [
  'https://nicegoldhand.com',
  'https://nicegoldhand.com/company',
  'https://nicegoldhand.com/manager/about',
  'https://nicegoldhand.com/manager/work',
  'https://nicegoldhand.com/price',
  'https://nicegoldhand.com/voucher',
  'https://nicegoldhand.com/franchisee',
  'https://nicegoldhand.com/rental',
  'https://nicegoldhand.com/event',
  'https://nicegoldhand.com/review',
  'https://nicegoldhand.com/reservation',
];

describe('technical SEO metadata policy', () => {
  it('marks private routes noindex/nofollow and clears inherited canonical', () => {
    expect(noIndexMetadata).toMatchObject({
      alternates: { canonical: null },
      robots: {
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
      },
    });
  });

  it.each([
    ['login', loginMetadata],
    ['signup', signupMetadata],
    ['mypage', mypageMetadata],
    ['manager apply', managerApplyMetadata],
    ['manager list', managerListMetadata],
    ['manager detail', managerDetailMetadata],
    ['reservation apply', reservationApplyMetadata],
    ['reservation form', reservationFormMetadata],
    ['reservation list', reservationListMetadata],
    ['reservation edit', reservationEditMetadata],
    ['review form', reviewFormMetadata],
    ['review edit', reviewEditMetadata],
    ['event form', eventFormMetadata],
    ['event edit', eventEditMetadata],
  ])('%s is noindex', (_name, metadata) => {
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
  });

  it('publishes only the approved static public canonical URLs', () => {
    const entries = sitemap();

    expect(entries.map(entry => entry.url)).toEqual(expectedPublicUrls);
    expect(entries.every(entry => entry.lastModified === undefined)).toBe(true);
  });

  it('does not publish private/action URLs', () => {
    const urls = sitemap().map(entry => entry.url);

    expect(urls.some(url => /\/(login|signup|mypage)(\/|$)/.test(url))).toBe(false);
    expect(urls.some(url => /\/(apply|form|edit|list)(\/|$)/.test(url))).toBe(false);
  });
});
