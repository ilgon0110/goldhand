/* eslint-disable react/jsx-handler-names */
'use client';

import { useState } from 'react';

import { ReviewStepIndicator } from '@/src/entities/review';
import { useGetUserData } from '@/src/entities/user';
import SectionTitleHero from '@/src/shared/ui/SectionTitleHero';

import type { TGuestVerification } from '../model';
import { GuestConfirmationStep } from './_GuestConfirmationStep';
import { GuestReviewFormStep } from './_GuestReviewFormStep';
import { MemberReviewForm } from './_MemberReviewForm';

export const ReviewFormPage = () => {
  const { data: userData } = useGetUserData();
  const isGuest = userData.userData == null;
  const [guestVerification, setGuestVerification] = useState<TGuestVerification | null>(null);

  return (
    <>
      <SectionTitleHero description="후기를 작성할 수 있습니다." label="고운황금손 후기남기기" />
      {isGuest ? (
        <>
          <ReviewStepIndicator
            ariaLabel="후기 작성 단계"
            isVerified={guestVerification !== null}
            secondStepLabel="후기 작성"
          />
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
