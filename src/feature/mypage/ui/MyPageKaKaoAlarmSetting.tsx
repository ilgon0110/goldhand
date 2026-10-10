'use client';

import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { DEFAULT_ALARM_SETTINGS, useUpdateKakaoAlarmSettingMutation } from '@/src/entities/mypage';
import type { IKakaoAlarmSettings, IMyPageResponseData } from '@/src/shared/types';
import { Switch } from '@/src/shared/ui/switch';
import { toastError, toastSuccess } from '@/src/shared/utils';

interface IMyPageKaKaoAlarmSettingProps {
  myPageData: IMyPageResponseData;
}

const ALARM_LABELS: Record<keyof IKakaoAlarmSettings, string> = {
  alarmComment: '댓글',
  alarmNews: '소식',
  alarmNewPost: '새 게시글',
  alarmEditPost: '게시글 수정',
  alarmNewComment: '댓글 생성',
  alarmEditComment: '댓글 수정',
};

interface INotifyRowProps {
  id: string;
  title: string;
  help: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}

const NotifyRow = ({ id, title, help, checked, onCheckedChange: handleCheckedChange }: INotifyRowProps) => (
  <div className={cn('flex items-center justify-between gap-4 py-4', 'border-b border-border last:border-0')}>
    <div className="flex flex-col gap-0.5">
      <span className="font-semibold text-foreground" id={id}>
        {title}
      </span>
      <span className="text-sm text-muted-foreground">{help}</span>
    </div>
    <Switch
      aria-labelledby={id}
      checked={checked}
      className="shrink-0 data-[state=checked]:bg-kakao"
      onCheckedChange={handleCheckedChange}
    />
  </div>
);

// 섹션 제목·설명은 다른 페이지의 h2 스케일(20/24)과 본문 스케일에 맞춘다.
const SECTION = cn('mt-16 border-t border-border pt-10', 'md:mt-20 md:pt-12');
const SectionHeader = () => (
  <div className="mb-6">
    <h2 className={cn('text-xl font-bold text-foreground', 'md:text-2xl')}>카카오톡 알림 설정</h2>
    <p className="mt-2 text-muted-foreground">받고 싶은 알림만 켜고 끄세요. 변경 사항은 즉시 저장됩니다.</p>
  </div>
);

const KakaoAlarmLinkFallback = () => (
  <section aria-label="카카오톡 알림 설정" className={SECTION}>
    <SectionHeader />
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-muted/50 px-5 py-10 text-center">
      <Image alt="카카오톡" height={40} src="/icon/kakaotalk.png" width={40} />
      <div className="flex flex-col gap-1">
        <span className="font-bold text-foreground">전화번호 인증이 필요합니다</span>
        <span className="text-sm text-muted-foreground">
          카카오톡 알림은 전화번호 인증을 완료한 회원에게만 제공됩니다.
        </span>
      </div>
      <Link
        className={cn(
          'mt-2 inline-flex h-11 items-center justify-center rounded-full bg-[#FAE100] px-6 text-sm font-semibold text-[#3C1E1E] transition-colors duration-200',
          'hover:bg-[#f0d600]',
        )}
        href="/signup/phone"
      >
        지금 인증하기
      </Link>
    </div>
  </section>
);

// 알림 묶음 카드: 헤더(제목·설명·선택 배지) + 토글 행 목록
const AlarmGroup = ({
  title,
  description,
  badge,
  children,
}: {
  title: string;
  description: string;
  badge?: string;
  children: React.ReactNode;
}) => (
  <div className="overflow-hidden rounded-2xl border border-border">
    <div className={cn('flex items-center justify-between gap-3 bg-muted/50 px-5 py-4', 'md:px-6')}>
      <div className="flex flex-col gap-0.5">
        <span className="font-bold text-foreground">{title}</span>
        <span className="text-sm text-muted-foreground">{description}</span>
      </div>
      {badge && (
        <span className="shrink-0 rounded-md bg-gold/10 px-2 py-0.5 text-xs font-semibold text-goldDeep">{badge}</span>
      )}
    </div>
    <div className={cn('px-5', 'md:px-6')}>{children}</div>
  </div>
);

export const MyPageKaKaoAlarmSetting = ({ myPageData }: IMyPageKaKaoAlarmSettingProps) => {
  const isAdmin = myPageData.data.userData?.grade === 'admin';
  const alarms: IKakaoAlarmSettings = {
    ...DEFAULT_ALARM_SETTINGS,
    ...myPageData.data.userData?.kakaoAlarmSettings,
  };

  const { mutate } = useUpdateKakaoAlarmSettingMutation({
    onSuccess: (_, vars) => {
      const label = ALARM_LABELS[vars.key];
      if (vars.value) {
        toastSuccess(`${label}알람 수신 동의 완료되었습니다.`);
      } else {
        toastSuccess(`${label}알람 수신 거부 완료되었습니다.`);
      }
    },
    onError: err => {
      toastError(err.message || '알람 설정 도중 에러가 발생하였습니다.');
    },
  });

  const handleToggle = (key: keyof IKakaoAlarmSettings) => (value: boolean) => {
    mutate({ key, value });
  };

  if (!myPageData.data.isLinked) {
    return <KakaoAlarmLinkFallback />;
  }

  return (
    <section aria-label="카카오톡 알림 설정" className={SECTION}>
      <SectionHeader />
      <div className="flex flex-col gap-5">
        <AlarmGroup description="카카오 알림톡으로 발송" title="일반 알림">
          <NotifyRow
            checked={alarms.alarmComment}
            help="내 게시글이나 댓글에 누군가 댓글을 달면 알림을 보내드려요."
            id="alarm-comment"
            title="댓글 알림 받기"
            onCheckedChange={handleToggle('alarmComment')}
          />
          <NotifyRow
            checked={alarms.alarmNews}
            help="새 소식, 공지사항을 알림으로 알려드려요."
            id="alarm-news"
            title="고운황금손 소식 받기"
            onCheckedChange={handleToggle('alarmNews')}
          />
        </AlarmGroup>

        {isAdmin && (
          <AlarmGroup badge="관리자 전용" description="관리자 등급에게만 노출됩니다" title="운영 알림">
            <NotifyRow
              checked={alarms.alarmNewPost}
              help="새 게시글이 등록되면 알림을 보내드려요."
              id="alarm-new-post"
              title="새 게시글 알림 받기"
              onCheckedChange={handleToggle('alarmNewPost')}
            />
            <NotifyRow
              checked={alarms.alarmEditPost}
              help="게시글이 수정되면 알림을 보내드려요."
              id="alarm-edit-post"
              title="게시글 수정 알림 받기"
              onCheckedChange={handleToggle('alarmEditPost')}
            />
            <NotifyRow
              checked={alarms.alarmNewComment}
              help="새 댓글이 생성되면 알림을 보내드려요."
              id="alarm-new-comment"
              title="댓글 생성 알림 받기"
              onCheckedChange={handleToggle('alarmNewComment')}
            />
            <NotifyRow
              checked={alarms.alarmEditComment}
              help="댓글이 수정되면 알림을 보내드려요."
              id="alarm-edit-comment"
              title="댓글 수정 알림 받기"
              onCheckedChange={handleToggle('alarmEditComment')}
            />
          </AlarmGroup>
        )}
      </div>
    </section>
  );
};
