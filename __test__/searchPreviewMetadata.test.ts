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
vi.mock('@/src/shared/ui/OAuthSuccessHandler', () => ({ OAuthSuccessHandler: () => null }));
vi.mock('@/src/widgets/footer/ui/footer', () => ({ Footer: () => null }));
vi.mock('@/src/widgets/header', () => ({ Header: () => null }));

import { metadata as companyMetadata } from '@/app/company/layout';
import { metadata as rootMetadata } from '@/app/layout';
import { metadata as managerMetadata } from '@/app/manager/about/layout';
import { metadata as reservationMetadata } from '@/app/reservation/layout';
import { metadata as reviewMetadata } from '@/app/review/layout';
import sitemap from '@/app/sitemap';
import { metadata as voucherMetadata } from '@/app/voucher/layout';

describe('검색 결과 미리보기 메타데이터', () => {
  it('메인 검색 결과에 짧은 브랜드 제목과 자연스러운 한 문장 설명을 제공한다', () => {
    expect(rootMetadata.title).toEqual({
      default: '고운황금손 산후도우미',
      template: '%s | 고운황금손',
    });
    expect(rootMetadata.description).toBe(
      '산모와 아기의 편안한 일상을 함께하는 고운황금손 산후도우미입니다. 전문적인 산모신생아 돌봄 서비스를 만나보세요.',
    );
    expect(rootMetadata.openGraph).toMatchObject({
      title: '고운황금손 산후도우미',
      description:
        '산모와 아기의 편안한 일상을 함께하는 고운황금손 산후도우미입니다. 전문적인 산모신생아 돌봄 서비스를 만나보세요.',
    });
    expect(rootMetadata.twitter).toMatchObject({
      title: '고운황금손 산후도우미',
      description:
        '산모와 아기의 편안한 일상을 함께하는 고운황금손 산후도우미입니다. 전문적인 산모신생아 돌봄 서비스를 만나보세요.',
    });
  });

  it('사이트링크 후보 5개에 명확한 제목과 canonical URL을 제공한다', () => {
    expect([
      [companyMetadata.title, companyMetadata.alternates?.canonical],
      [managerMetadata.title, managerMetadata.alternates?.canonical],
      [voucherMetadata.title, voucherMetadata.alternates?.canonical],
      [reservationMetadata.title, reservationMetadata.alternates?.canonical],
      [reviewMetadata.title, reviewMetadata.alternates?.canonical],
    ]).toEqual([
      ['인사말', 'https://nicegoldhand.com/company'],
      ['산후관리사 안내', 'https://nicegoldhand.com/manager/about'],
      ['정부바우처', 'https://nicegoldhand.com/voucher'],
      ['상담신청', 'https://nicegoldhand.com/reservation'],
      ['이용후기', 'https://nicegoldhand.com/review'],
    ]);
    expect([
      companyMetadata.openGraph?.title,
      managerMetadata.openGraph?.title,
      voucherMetadata.openGraph?.title,
      reservationMetadata.openGraph?.title,
      reviewMetadata.openGraph?.title,
    ]).toEqual([
      '인사말 | 고운황금손',
      '산후관리사 안내 | 고운황금손',
      '정부바우처 | 고운황금손',
      '상담신청 | 고운황금손',
      '이용후기 | 고운황금손',
    ]);
  });

  it('사이트맵에 사이트링크 후보 5개를 모두 포함한다', () => {
    const urls = sitemap().map(entry => entry.url);

    expect(urls).toEqual(
      expect.arrayContaining([
        'https://nicegoldhand.com/company',
        'https://nicegoldhand.com/manager/about',
        'https://nicegoldhand.com/voucher',
        'https://nicegoldhand.com/reservation',
        'https://nicegoldhand.com/review',
      ]),
    );
  });
});
