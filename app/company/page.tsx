import Image from 'next/image';
import { PiEnvelopeSimple } from 'react-icons/pi';

import { cn } from '@/lib/utils';
import FadeInWhenVisible from '@/src/shared/ui/FadeInWhenVisible';

export const dynamic = 'force-dynamic';

// 대표 인사말은 '읽는' 페이지: 본문 폭 62ch, 행간 1.85로 편지처럼 읽히게 한다. 타입 스케일은 다른 안내 페이지와 동일.
const CompanyPage = () => {
  return (
    <article className="break-keep">
      {/* 1. 제목: 인사말 첫 문장을 헤드라인으로 */}
      <div className={cn('pb-8 pt-16', 'md:pb-10 md:pt-24')}>
        <FadeInWhenVisible>
          <h1 className="space-y-4">
            <span className="flex items-center gap-2 text-base font-bold text-goldDeep">
              <PiEnvelopeSimple aria-hidden="true" className="h-5 w-5" />
              고운황금손 대표 인사말
            </span>
            <span
              className={cn(
                'block text-2xl font-bold leading-[1.3] tracking-[-0.01em] text-foreground [text-wrap:balance]',
                'md:text-3xl md:leading-[1.3]',
                'xl:whitespace-nowrap xl:text-4xl xl:leading-[1.3]',
              )}
            >
              저희 고운황금손을 찾아주신 분들께 진심으로 감사드립니다.
            </span>
          </h1>
        </FadeInWhenVisible>
      </div>

      {/* 2. 대표 사진 + 인사말 본문 */}
      <div
        className={cn('grid gap-8 border-t-2 border-foreground pt-8', 'md:pt-10', 'lg:grid-cols-[260px_1fr] lg:gap-16')}
      >
        <FadeInWhenVisible>
          {/* lg 미만: 작은 썸네일 + 이름 가로 한 줄 (본문이 첫 화면에서 바로 시작되도록). lg 이상: 큰 사진 세로 카드, 스크롤 시 고정 */}
          <figure className={cn('flex items-center gap-4', 'lg:sticky lg:top-16 lg:block')}>
            <div
              className={cn(
                'relative aspect-[623/740] w-24 shrink-0 overflow-hidden rounded-xl bg-muted',
                'sm:w-28',
                'lg:w-full lg:rounded-2xl',
              )}
            >
              <Image
                alt="고운황금손 대표 차복규"
                className="object-cover object-[center_15%]"
                fill
                sizes="(min-width: 1024px) 260px, 112px"
                src="/ceo_profile.jpeg"
              />
            </div>
            <figcaption className="lg:mt-4">
              <span className="block text-sm text-muted-foreground">고운황금손 대표</span>
              <span className="mt-0.5 block text-lg font-bold text-foreground">차복규</span>
            </figcaption>
          </figure>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.1}>
          <div
            className={cn(
              'max-w-[62ch] space-y-6 text-base leading-[1.85] text-foreground/80 [text-wrap:pretty]',
              'md:text-lg md:leading-[1.85]',
            )}
          >
            <p>
              여자로 태어나 가장 큰 고통과 기쁨을 함께하며, 세상에서 가장 소중한 새 생명을 탄생시킨 어머니들의 지친 몸과
              마음을 따스한 사랑의 손길로 감싸드리고자 합니다.
            </p>
            <p>
              출산의 고통이 채 가시기 전에 마주하게 되는 낯선 육아. 그것이 처음 겪는 일이건 경험했던 일이건, 새로운
              시작은 언제나 설레고도 두려운 법입니다.{' '}
              <strong className="font-semibold text-foreground">
                육아의 건강한 첫걸음은 바로 편안한 산후조리에서 시작됩니다.
              </strong>
            </p>
            <p>
              가정을 위해 온갖 어려움을 이겨내고, 누구보다 크고 푸르게 자라날 아기를 지켜나갈 산모님을 위해 이제 저희가
              든든한 버팀목이 되어 드리겠습니다.
            </p>
            <p>
              가장 편안하고 따뜻한 만남을 통해 산모님과 아가가 온전한 쉼을 누릴 수 있도록 전문가의 손길로 정성을 다해
              보살펴 드리겠습니다.
            </p>
            <p>출산의 어려움과 육아의 두려움이 기분 좋은 자신감이 되도록, 늘 곁에서 정성으로 함께하겠습니다.</p>

            {/* 맺음말 + 서명 */}
            <div className="border-t border-border pt-6">
              <p className="font-semibold text-foreground">감사합니다.</p>
              <p className="mt-2 text-base text-muted-foreground">
                고운황금손 대표 <span className="font-bold text-foreground">차복규</span>
              </p>
            </div>
          </div>
        </FadeInWhenVisible>
      </div>
    </article>
  );
};

export default CompanyPage;
