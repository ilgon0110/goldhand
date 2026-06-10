'use client';

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
  title: string;
  help: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}

const NotifyRow = ({ title, help, checked, onCheckedChange: handleCheckedChange }: INotifyRowProps) => (
  <div className={cn('flex items-center justify-between gap-4 py-3.5', 'border-b border-stone-100 last:border-0')}>
    <div className="flex flex-col gap-0.5">
      <span className="text-[15px] font-medium tracking-[-0.005em] text-stone-900">{title}</span>
      <span className="text-[13px] text-stone-500">{help}</span>
    </div>
    <Switch
      checked={checked}
      className="shrink-0 data-[state=checked]:bg-kakao"
      onCheckedChange={handleCheckedChange}
    />
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

  return (
    <section aria-label="카카오톡 알림 설정" className={cn('mt-6 px-4', 'md:px-0')}>
      {/* 섹션 헤더 */}
      <div className="mb-5">
        <h2 className="text-[20px] font-bold tracking-[-0.02em] text-stone-900">카카오톡 알림 설정</h2>
        <p className="mt-1 text-[13.5px] text-stone-500">받고 싶은 알림만 켜고 끄세요. 변경 사항은 즉시 저장됩니다.</p>
      </div>

      {/* 카드 목록 */}
      <div className="flex flex-col gap-5">
        {/* 일반 알림 카드 */}
        <div className="border border-stone-200 bg-white">
          <div
            className={cn('flex items-center justify-between border-b border-stone-200 px-5 py-3.5', 'bg-stone-50/60')}
          >
            <div className="flex flex-col gap-0.5">
              <span className="inline-flex items-center gap-2 text-[14px] font-semibold text-stone-900">
                <span className="h-2.5 w-2.5 rounded-full bg-kakao" />
                일반 알림
              </span>
              <span className="text-[12px] text-stone-500">카카오 알림톡으로 발송</span>
            </div>
          </div>
          <div className="px-5">
            <NotifyRow
              checked={alarms.alarmComment}
              help="내 게시글이나 댓글에 누군가 댓글을 달면 알림을 보내드려요."
              title="댓글 알림 받기"
              onCheckedChange={handleToggle('alarmComment')}
            />
            <NotifyRow
              checked={alarms.alarmNews}
              help="새 소식, 이벤트, 공지사항을 알림으로 알려드려요."
              title="고운황금손 소식 받기"
              onCheckedChange={handleToggle('alarmNews')}
            />
          </div>
        </div>

        {/* 운영 알림 카드 (관리자 전용) */}
        {isAdmin && (
          <div className="border border-stone-200 bg-white">
            <div
              className={cn(
                'flex items-center justify-between border-b border-stone-200 px-5 py-3.5',
                'bg-stone-50/60',
              )}
            >
              <div className="flex flex-col gap-0.5">
                <span className="inline-flex items-center gap-2 text-[14px] font-semibold text-stone-900">
                  <span className="h-2.5 w-2.5 rounded-full bg-kakao" />
                  운영 알림
                </span>
                <span className="text-[12px] text-stone-500">관리자 등급에게만 노출됩니다</span>
              </div>
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1',
                  'text-[10.5px] font-medium tracking-[0.04em]',
                  'bg-purple-100 text-purple-800',
                )}
              >
                <span className="h-[5px] w-[5px] rounded-full bg-purple-500" />
                관리자 전용
              </span>
            </div>
            <div className="px-5">
              <NotifyRow
                checked={alarms.alarmNewPost}
                help="새 게시글이 등록되면 알림을 보내드려요."
                title="새 게시글 알림 받기"
                onCheckedChange={handleToggle('alarmNewPost')}
              />
              <NotifyRow
                checked={alarms.alarmEditPost}
                help="게시글이 수정되면 알림을 보내드려요."
                title="게시글 수정 알림 받기"
                onCheckedChange={handleToggle('alarmEditPost')}
              />
              <NotifyRow
                checked={alarms.alarmNewComment}
                help="새 댓글이 생성되면 알림을 보내드려요."
                title="댓글 생성 알림 받기"
                onCheckedChange={handleToggle('alarmNewComment')}
              />
              <NotifyRow
                checked={alarms.alarmEditComment}
                help="댓글이 수정되면 알림을 보내드려요."
                title="댓글 수정 알림 받기"
                onCheckedChange={handleToggle('alarmEditComment')}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
