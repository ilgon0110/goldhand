/* eslint-disable react/jsx-handler-names */
'use client';

import { Check } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { useGetUserData } from '@/src/entities/user';
import SectionTitleHero from '@/src/shared/ui/SectionTitleHero';

import type { TGuestVerification } from '../model';
import { GuestConfirmationStep } from './_GuestConfirmationStep';
import { GuestReviewFormStep } from './_GuestReviewFormStep';
import { MemberReviewForm } from './_MemberReviewForm';

const GuestStepIndicator = ({ isVerified }: { isVerified: boolean }) => (
  <ol aria-label="후기 작성 단계" className="mx-auto mb-8 flex max-w-xl items-center text-sm">
    <li
      aria-current={!isVerified ? 'step' : undefined}
      className={cn('flex items-center gap-2 font-medium', !isVerified ? 'text-primary' : 'text-green-700')}
    >
      <span
        aria-label={isVerified ? '본인 인증 완료' : undefined}
        className={cn(
          'flex size-7 items-center justify-center rounded-full border',
          isVerified && 'border-green-600 bg-green-600 text-white',
        )}
      >
        {isVerified ? <Check aria-hidden="true" className="size-4" /> : '1'}
      </span>
      <span>본인 인증</span>
    </li>
    <li aria-hidden="true" className="mx-3 h-px flex-1 bg-slate-200" />
    <li
      aria-current={isVerified ? 'step' : undefined}
      className={cn('flex items-center gap-2 font-medium', isVerified ? 'text-primary' : 'text-slate-400')}
    >
      <span className="flex size-7 items-center justify-center rounded-full border">2</span>
      <span>후기 작성</span>
    </li>
  </ol>
);

export const ReviewFormPage = () => {
  const { data: userData } = useGetUserData();
  const isGuest = userData.userData == null;
  const [guestVerification, setGuestVerification] = useState<TGuestVerification | null>(null);

  return (
    <>
      <SectionTitleHero description="후기를 작성할 수 있습니다." label="고운황금손 후기남기기" />
      {isGuest ? (
        <>
          <GuestStepIndicator isVerified={guestVerification !== null} />
          {guestVerification ? (
            <GuestReviewFormStep
              verification={guestVerification}
              onRestartVerification={() => setGuestVerification(null)}
            />
          ) : (
            <GuestConfirmationStep onConfirmed={setGuestVerification} />
          )}
        </>
      ) : (
        <MemberReviewForm />
      )}
    </>
  );
};
