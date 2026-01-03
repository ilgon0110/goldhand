import { cn } from '@/lib/utils';
import { formatPrice } from '@/src/shared/utils';

export const SinglePriceTable = ({ title = '베이직', priceList }: { title?: string; priceList: number[] }) => {
  return (
    <table className={cn('w-full table-auto border-collapse border border-slate-200 text-center shadow', 'lg:w-fit')}>
      <tbody>
        <tr>
          <td className={cn('border bg-slate-100 px-2 py-3', 'md:px-6')}>{title === '하루돌봄' ? '8시간' : '1주'}</td>
          <td className={cn('border px-2 py-1', 'md:px-24')}>{formatPrice(priceList[0])}</td>
        </tr>
        {priceList.length > 1 && (
          <tr>
            <td className={cn('border bg-slate-100 px-2 py-3', 'md:px-6')}>2주</td>
            <td className={cn('border px-2 py-1', 'md:px-24')}>{formatPrice(priceList[1])}</td>
          </tr>
        )}
        {priceList.length > 2 && (
          <tr>
            <td className={cn('border bg-slate-100 px-2 py-3', 'md:px-6')}>3주</td>
            <td className={cn('border px-2 py-1', 'md:px-24')}>{formatPrice(priceList[2])}</td>
          </tr>
        )}
        {priceList.length > 3 && (
          <tr>
            <td className={cn('border bg-slate-100 px-2 py-3', 'md:px-6')}>4주</td>
            <td className={cn('border px-2 py-1', 'md:px-24')}>{formatPrice(priceList[3])}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
