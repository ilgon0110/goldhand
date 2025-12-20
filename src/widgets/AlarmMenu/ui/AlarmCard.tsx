import { cn } from '@/lib/utils';
import type { INotificationDetailData } from '@/src/shared/types';
import { Badge } from '@/src/shared/ui/badge';
import TruncateText from '@/src/shared/ui/TruncateText';
import { formatDateToYMD } from '@/src/shared/utils';

interface IAlarmCardProps {
  noti: INotificationDetailData;
  label: string;
  handleClick: () => void;
}

export const AlarmCard = ({ noti, label, handleClick }: IAlarmCardProps) => {
  return (
    <button
      className={cn(
        'w-full space-y-1 rounded-sm border border-slate-300 p-2 text-start shadow-sm hover:bg-slate-100',
        noti.isRead ? 'opacity-30' : null,
      )}
      onClick={handleClick}
    >
      <div className="flex flex-row items-center gap-2 text-sm">
        <Badge>{label}</Badge>
        <span className="text-slate-500">{formatDateToYMD(noti.createdAt)}</span>
      </div>
      <TruncateText className="text-sm" maxLines={1} text={noti.message} />
    </button>
  );
};
