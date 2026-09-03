import { describe, expect, it, vi } from 'vitest';

vi.mock('next/font/local', () => ({
  default: () => ({ variable: '--font-pretendard' }),
}));
vi.mock('next/script', () => ({ default: () => null }));
vi.mock('nuqs/adapters/next/app', () => ({ NuqsAdapter: ({ children }: { children: React.ReactNode }) => children }));
vi.mock('react-toastify', () => ({ ToastContainer: () => null }));
vi.mock('@/src/app/providers/query-provider', () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));
vi.mock('@/src/app/providers/theme-provider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));
vi.mock('@/src/widgets/footer/ui/footer', () => ({ Footer: () => null }));
vi.mock('@/src/widgets/header', () => ({ Header: () => null }));

import { metadata as companyMetadata } from '@/app/company/layout';
import { metadata as eventMetadata } from '@/app/event/layout';
import { metadata as franchiseeMetadata } from '@/app/franchisee/layout';
import { metadata as rootMetadata } from '@/app/layout';
import { metadata as managerMetadata } from '@/app/manager/about/layout';
import { metadata as managerWorkMetadata } from '@/app/manager/work/layout';
import { metadata as priceMetadata } from '@/app/price/layout';
import { metadata as rentalMetadata } from '@/app/rental/layout';
import { metadata as reservationMetadata } from '@/app/reservation/layout';
import { metadata as reviewMetadata } from '@/app/review/layout';
import { metadata as voucherMetadata } from '@/app/voucher/layout';

describe('검색 결과 미리보기 메타데이터', () => {
  it('메인 검색 결과에 지역성과 canonical URL을 제공한다', () => {
    expect(rootMetadata.title).toMatchObject({ template: '%s | 고운황금손' });
    expect(rootMetadata.description).toContain('수원');
    expect(rootMetadata.alternates?.canonical).toBe('https://nicegoldhand.com');
  });

  const publicLayouts = [
    ['company', '대표 인사말', 'https://nicegoldhand.com/company', companyMetadata],
    ['manager about', '산후관리사란', 'https://nicegoldhand.com/manager/about', managerMetadata],
    ['manager work', '산후관리사가 하는 일', 'https://nicegoldhand.com/manager/work', managerWorkMetadata],
    ['price', '이용요금', 'https://nicegoldhand.com/price', priceMetadata],
    ['voucher', '정부바우처 안내', 'https://nicegoldhand.com/voucher', voucherMetadata],
    ['franchisee', '지점 안내', 'https://nicegoldhand.com/franchisee', franchiseeMetadata],
    ['rental', '렌탈 서비스', 'https://nicegoldhand.com/rental', rentalMetadata],
    ['event', '이벤트', 'https://nicegoldhand.com/event', eventMetadata],
    ['review', '이용 후기', 'https://nicegoldhand.com/review', reviewMetadata],
    ['reservation', '상담 신청', 'https://nicegoldhand.com/reservation', reservationMetadata],
  ] as const;

  it.each(publicLayouts)('%s provides its approved label and matching canonical Open Graph URL', (_route, title, url, metadata) => {
    expect(metadata.title).toBe(title);
    expect(metadata.alternates?.canonical).toBe(url);
    expect(metadata.openGraph).toMatchObject({ title: `${title} | 고운황금손`, url });
  });

  it('assigns each public layout a distinct canonical URL', () => {
    const canonicalUrls = publicLayouts.map(([, , url]) => url);

    expect(new Set(canonicalUrls).size).toBe(canonicalUrls.length);
  });
});
