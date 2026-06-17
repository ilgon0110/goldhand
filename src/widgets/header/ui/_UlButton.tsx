import { cn } from '@/lib/utils';

export function UlButton({ text, enText }: { text: string; enText?: string }) {
  return (
    <div className={cn('flex flex-row items-center justify-center -space-y-2 px-4 py-2 lg:flex-col')}>
      <div className="text-base">{text}</div>
      {!!enText && <div className="hidden text-[10px] text-[#00552a] lg:block">{enText}</div>}
    </div>
  );
}
