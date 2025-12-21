import type { InfiniteData } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

import { cn } from '@/lib/utils';
import { useNotificationMutation } from '@/src/feature/notification/api/useNotificationMutation';
import type { INotificationResponseData } from '@/src/shared/types';
import { NotificationType } from '@/src/shared/types';
import { LoadingSpinnerIcon } from '@/src/shared/ui/loadingSpinnerIcon';
import { toastError } from '@/src/shared/utils';

import { AlarmCard } from './AlarmCard';

interface IAlarmMenuProps {
  userId: string;
  notificationData: InfiniteData<INotificationResponseData, unknown> | undefined;
  hasNextPage: boolean;
  isFetching: boolean;
  handleClickNextNotifications: () => void;
  modalClose?: () => void;
}

export const AlarmMenu = ({
  userId,
  notificationData,
  hasNextPage,
  isFetching,
  handleClickNextNotifications,

  modalClose,
}: IAlarmMenuProps) => {
  const router = useRouter();
  const { isPending, mutate } = useNotificationMutation({
    onSuccess: data => {
      if (data.type === 'all_read') {
        return;
      }

      const { docType } = getAlarmType(data.type);
      router.push(`/${docType}/${data.docId}`);
    },
    onError: error => {
      toastError(`알림 읽음처리 실패: ${error.message}`);
    },
  });

  if (notificationData == null || notificationData.pages.length === 0) {
    return <div className="text-center text-sm text-slate-500">알림이 없습니다.</div>;
  }

  const getAlarmType = (type: string) => {
    switch (type) {
      case NotificationType.CONSULT_COMMENT:
        return { docType: 'reservation', label: '상담신청 신규 댓글' };
      case NotificationType.EVENT_COMMENT:
        return { docType: 'event', label: '이벤트 신규 댓글' };
      case NotificationType.NEW_CONNECTION:
        return { docType: 'connection', label: '새로운 알림 연결' };
      case NotificationType.NEW_MANAGER:
        return { docType: 'manager', label: '매니저 신청 알림' };
      case NotificationType.NEW_RESERVATION:
        return { docType: 'reservation', label: '예약 신청 알림' };
      case NotificationType.NEW_REVIEW:
        return { docType: 'review', label: '리뷰 작성 알림' };
      case NotificationType.REVIEW_COMMENT:
        return { docType: 'review', label: '리뷰 신규 댓글' };
      case NotificationType.NEW_EVENT:
        return { docType: 'event', label: '새로운 이벤트 알림' };
      default:
        return { docType: 'generic', label: '일반 알림' };
    }
  };

  if (isPending) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingSpinnerIcon />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col space-y-2">
      <button
        className={cn('self-end text-sm text-slate-500', 'hover:text-slate-800')}
        onClick={() => mutate({ userId, markAsRead: true, notificationId: '' })}
      >
        모든 알림 읽음처리
      </button>
      {notificationData?.pages.map(page => {
        return page.data.map(noti => {
          return (
            <AlarmCard
              handleClick={() => {
                mutate({ userId: noti.userId, notificationId: noti.id });
                modalClose?.();
              }}
              key={uuidv4()}
              label={getAlarmType(noti.type).label}
              noti={noti}
            />
          );
        });
      })}
      <button
        className={cn(
          'mt-3 w-full text-center text-sm',
          hasNextPage ? 'text-slate-500 hover:text-slate-800' : 'cursor-not-allowed text-slate-300',
        )}
        disabled={!hasNextPage || isFetching}
        onClick={handleClickNextNotifications}
      >
        {hasNextPage ? '알림 더 찾아보기' : '더 이상 알림이 없습니다.'}
      </button>
    </div>
  );
};
