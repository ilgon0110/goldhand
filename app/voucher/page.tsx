import Image from 'next/image';
import { PiArrowSquareOut, PiMagnifyingGlassPlus, PiTicket } from 'react-icons/pi';

import { cn } from '@/lib/utils';
import FadeInWhenVisible from '@/src/shared/ui/FadeInWhenVisible';

import { VoucherPriceTable } from './ui/VoucherPriceTable';

// 타입 스케일·섹션 구분은 /price 페이지와 동일하게 맞춘다: h1 24/30/36, h2 20/24/30, h3 18/20
const SECTION = cn('border-t-2 border-foreground pb-24 pt-10', 'md:pb-32 md:pt-12');
const H2 = cn('break-keep text-xl font-bold leading-[1.35] text-foreground', 'md:text-2xl', 'xl:text-3xl');
const BULLETS = cn('list-disc space-y-2 pl-5 leading-relaxed text-foreground/80 marker:text-goldDeep');
const EMPHASIS = 'font-semibold text-goldDeep';
const PRICE_TABLE_SRC = '/voucher_price_table_26.jpg';

// 안내 항목 하나: 좌측 제목, 우측 내용. 모든 항목이 같은 구조로 반복된다.
function InfoRow({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <FadeInWhenVisible>
      <div className={cn('grid gap-3 py-8', 'lg:grid-cols-[1fr_2fr] lg:gap-12')} id={id}>
        <h3 className={cn('text-lg font-bold text-foreground', 'md:text-xl')}>{title}</h3>
        <div className="break-keep">{children}</div>
      </div>
    </FadeInWhenVisible>
  );
}

const VoucherPage = () => {
  return (
    <div className="break-keep">
      {/* 1. 제목 */}
      <div className={cn('pb-16 pt-16', 'md:pb-20 md:pt-24')}>
        <FadeInWhenVisible>
          <h1 className="space-y-4">
            <span className="flex items-center gap-2 text-base font-bold text-goldDeep">
              <PiTicket aria-hidden="true" className="h-5 w-5" />
              고운황금손 2026년 바우처 이용 안내
            </span>
            <span
              className={cn(
                'block text-2xl font-bold leading-[1.3] tracking-[-0.01em] text-foreground [text-wrap:balance]',
                'md:text-3xl md:leading-[1.3]',
                'xl:text-4xl xl:leading-[1.3]',
              )}
            >
              보건복지부
              <br className="md:hidden" /> 산모·신생아 건강관리 바우처
            </span>
          </h1>
          <p
            className={cn(
              'mt-6 max-w-[65ch] text-base leading-relaxed text-muted-foreground [text-wrap:pretty]',
              'md:text-lg',
            )}
          >
            출산가정에 건강관리사를 파견하여 산모의 산후 회복과 신생아의 양육을 지원하고 출산가정의 경제적 부담을 경감
            및 산모, 신생아 건강관리사 양성을 통해 일자리를 창출하는 제도입니다.
          </p>
        </FadeInWhenVisible>
      </div>

      {/* 2. 신청 안내 */}
      <div className={SECTION}>
        <h2 className={H2}>신청 안내</h2>
        {/* 항목 사이에만 구분선(divide-y). 첫 항목은 위 선·여백 없이 섹션 제목 바로 아래에서 시작한다. */}
        <div className={cn('mt-8 divide-y divide-border [&>*:first-child>div]:pt-0', 'md:mt-10')}>
          <InfoRow id="target" title="신청 대상">
            <p className="leading-relaxed text-foreground/80">
              국내에 주민등록(주민등록을 한 재외국민 포함) 또는 외국인 등록을 둔 출산가정으로써,
            </p>
            <ul className={cn(BULLETS, 'mt-3')}>
              <li>산모 또는 배우자가 생계·의료·주거·교육급여 수급자 또는 차상위계층에 해당하는 출산가정</li>
              <li>기준중위소득 100%이하의 출산 가정(임신 16주 이후 발생한 유산·사산의 경우도 포함)</li>
            </ul>
          </InfoRow>

          <InfoRow id="period" title="신청 기간">
            <p className="leading-relaxed text-foreground/80">
              <span className={EMPHASIS}>출산 예정일 40일 전부터 출산일로부터 30일까지</span>
              <br />
              (임신 16주 이후 발생한 유산·사산의 경우도 포함)
            </p>
          </InfoRow>

          <InfoRow id="hours" title="서비스 제공시간">
            <ul className={BULLETS}>
              <li>평일 : 9시부터 18시까지 (휴게시간 1시간 포함)</li>
              <li>토요일 또는 공휴일 : 9시부터 14시까지 (서비스 원할 경우 협의)</li>
            </ul>
          </InfoRow>

          <InfoRow id="place" title="신청 장소">
            <ul className={BULLETS}>
              <li>산모의 주민등록 주소지 관할 시·군·구 보건소</li>
              <li>
                온라인신청 : 복지로{' '}
                <a
                  className={cn(
                    'inline-flex items-center gap-1 font-semibold text-goldDeep underline underline-offset-4',
                    'hover:text-[#6B5224]',
                  )}
                  href="https://www.bokjiro.go.kr/ssis-tbu/index.do"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  www.bokjiro.go.kr
                  <PiArrowSquareOut aria-hidden="true" className="h-4 w-4" />
                  <span className="sr-only">(새 탭에서 열림)</span>
                </a>
              </li>
            </ul>
            <p className={cn('mt-4 leading-relaxed', EMPHASIS)}>
              (단, 바우처 유효기간은 원칙적으로 출산일로부터 60일 이내)
            </p>
            <p className="mt-1 leading-relaxed text-foreground/80">
              바우처 잔량이 있는 경우라도 출산일로부터 60일이 경과하면 바우처 소멸
            </p>
          </InfoRow>

          <InfoRow id="documents" title="구비 서류">
            <ul className={BULLETS}>
              <li>신청서 1부 (보건소 비치)</li>
              <li>건강보험자격확인서 (피부양자 표시 필) 발급</li>
              <li>건강보험납부확인서 : 최근 월 고지금액 납부확인서</li>
              <li>
                산모신분증, 대리인 신청시 대리인 신분증, 산모수첩(출생 후 출생증명서)
                <p className={cn('mt-1 text-sm', EMPHASIS)}>※ 예외지원의 경우 별도 해당서류 첨부(전화문의)</p>
              </li>
              <li>
                1개월 이상 휴직중인 경우 휴직증명서(휴직기간, 유급/무급 기재)
                <p className={cn('mt-1 text-sm', EMPHASIS)}>※ 유급 시 최근월분 급여명세서 첨부</p>
              </li>
              <li>가족관계증명서 : 외국인 산모, 부부간 주소시 다를 시</li>
            </ul>
          </InfoRow>
        </div>
      </div>

      {/* 3. 이용요금표: 접근 가능한 HTML 표와 원본 이미지를 함께 제공한다. */}
      <div className={cn(SECTION, 'pb-0 md:pb-0')} id="price-table">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className={H2}>2026년 서비스 가격 및 정부지원금</h2>
            <h3 className="mt-2 text-base font-bold leading-relaxed text-goldDeep md:text-lg">
              26년도 서비스가격 및 정부지원금&amp;본인부담금_고운황금손 수원지사
            </h3>
          </div>
          <a
            className={cn(
              'inline-flex h-10 w-fit items-center gap-1.5 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors duration-200',
              'hover:border-gold/60 hover:text-goldDeep',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-goldDeep',
            )}
            href={PRICE_TABLE_SRC}
            rel="noopener noreferrer"
            target="_blank"
          >
            <PiMagnifyingGlassPlus aria-hidden="true" className="h-4 w-4" />
            원본 크게 보기
            <span className="sr-only">(새 탭에서 열림)</span>
          </a>
        </div>
        <FadeInWhenVisible>
          <div className="mt-8 md:mt-10">
            <VoucherPriceTable />
          </div>
        </FadeInWhenVisible>

        <FadeInWhenVisible>
          <div className="mt-16 md:mt-20">
            <h3 className="text-lg font-bold text-foreground md:text-xl">원본 이미지로 확인하기</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              위 표의 내용을 고운황금손 수원지사 원본 안내 이미지로도 확인할 수 있습니다.
            </p>
          </div>
          <div className={cn('mt-5 overflow-hidden rounded-2xl border border-border', 'md:mt-6')}>
            <Image
              alt="2026년 서비스 가격 및 정부지원금, 본인부담금 요금표 (고운황금손 수원지사)"
              height={848}
              sizes="(min-width: 1152px) 1080px, 100vw"
              src={PRICE_TABLE_SRC}
              style={{ width: '100%', height: 'auto' }}
              width={1200}
            />
          </div>
        </FadeInWhenVisible>
      </div>
    </div>
  );
};

export default VoucherPage;
