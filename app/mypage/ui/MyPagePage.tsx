'use client';

import { useState } from 'react';

import { useGetMyPageData } from '@/src/entities/mypage';
import { MyPageInfoCard, MyPagePostList, WithdrawalModal } from '@/src/feature/mypage';
import SectionTitleHero from '@/src/shared/ui/SectionTitleHero';

export const MyPagePage = () => {
  const { data: myPageData } = useGetMyPageData();
  const [withDrawalModalOpen, setWithDrawalModalOpen] = useState(false);

  if (myPageData == null) return null;

  return (
    <>
      <WithdrawalModal isOpen={withDrawalModalOpen} setIsOpen={setWithDrawalModalOpen} />
      <SectionTitleHero description="내 정보와 그동안 남기신 글을 확인할 수 있습니다." label="고운황금손 마이페이지" />
      <MyPageInfoCard handleWithdrawModalOpen={() => setWithDrawalModalOpen(true)} myPageData={myPageData} />
      <MyPagePostList myPageData={myPageData} />
    </>
  );
};
