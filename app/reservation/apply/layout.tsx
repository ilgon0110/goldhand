import type { Metadata } from 'next';

import { noIndexMetadata } from '@/src/shared/seo/noIndexMetadata';

export const metadata: Metadata = {
  ...noIndexMetadata,
  title: '상담 신청',
  description: '고운황금손 산후도우미 서비스 상담을 신청하세요. 회원·비회원 모두 문의하실 수 있습니다.',
};

export default function ReviewApplyLayout({ children }: { children: React.ReactNode }) {
  return <section>{children}</section>;
}
