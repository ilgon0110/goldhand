import { cn } from '@/lib/utils';
import { formatPrice } from '@/src/shared/utils';

export const SinglePriceTable = ({ title = '베이직', priceList }: { title?: string; priceList: number[] }) => {
  return (
    <table className={cn('w-full table-auto border-collapse border border-slate-200 text-center shadow', 'lg:w-fit')}>
      <caption className="sr-only">{title} 이용요금표</caption>
      <thead>
        <tr>
          <th className={cn('border bg-slate-100 px-2 py-3', 'md:px-6')} scope="col">
            기간
          </th>
          <th className={cn('border px-2 py-1', 'md:px-24')} scope="col">
            요금
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th className={cn('border bg-slate-100 px-2 py-3', 'md:px-6')} scope="row">
            {title === '하루돌봄' ? '8시간' : '1주'}
          </th>
          <td className={cn('border px-2 py-1', 'md:px-24')}>{formatPrice(priceList[0])}</td>
        </tr>
        {priceList.length > 1 && (
          <tr>
            <th className={cn('border bg-slate-100 px-2 py-3', 'md:px-6')} scope="row">
              2주
            </th>
            <td className={cn('border px-2 py-1', 'md:px-24')}>{formatPrice(priceList[1])}</td>
          </tr>
        )}
        {priceList.length > 2 && (
          <tr>
            <th className={cn('border bg-slate-100 px-2 py-3', 'md:px-6')} scope="row">
              3주
            </th>
            <td className={cn('border px-2 py-1', 'md:px-24')}>{formatPrice(priceList[2])}</td>
          </tr>
        )}
        {priceList.length > 3 && (
          <tr>
            <th className={cn('border bg-slate-100 px-2 py-3', 'md:px-6')} scope="row">
              4주
            </th>
            <td className={cn('border px-2 py-1', 'md:px-24')}>{formatPrice(priceList[3])}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
