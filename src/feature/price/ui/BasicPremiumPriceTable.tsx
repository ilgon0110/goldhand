import { Plane, Rocket } from 'lucide-react';

import { cn } from '@/lib/utils';
import { formatPrice } from '@/src/shared/utils';

export const BasicPremiumPriceTable = ({
  iconMode,
  basicTitle = '베이직',
  premiumTitle = '프리미엄',
  basicPriceList,
  premiumPriceList,
}: {
  iconMode: boolean;
  basicTitle?: string;
  premiumTitle?: string;
  basicPriceList: number[];
  premiumPriceList: number[];
}) => {
  return (
    <table
      className={cn(
        'w-full table-auto border-collapse border border-slate-200 text-center text-sm shadow',
        'lg:w-fit lg:text-base',
      )}
    >
      <caption className="sr-only">
        {basicTitle} / {premiumTitle} 이용요금표
      </caption>
      <thead>
        <tr>
          <th aria-label="기간" className="bg-slate-100 px-2 py-1" scope="col"></th>
          <th className="border p-4" scope="col">
            <div className="flex flex-col items-center justify-center gap-2">
              {iconMode && <Plane aria-hidden="true" height={40} width={40} />}
              <span className="font-bold">{basicTitle}</span>
            </div>
          </th>
          <th className="border p-4" scope="col">
            <div className="flex flex-col items-center justify-center gap-2">
              {iconMode && <Rocket aria-hidden="true" height={40} width={40} />}
              <span className="font-bold">{premiumTitle}</span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th className="border bg-slate-100 px-2 py-3" scope="row">1주</th>
          <td className={cn('border px-2 py-1', 'hover:bg-slate-50')}>{formatPrice(basicPriceList[0])}</td>
          <td className={cn('border px-2 py-1', 'hover:bg-slate-50')}>{formatPrice(premiumPriceList[0])}</td>
        </tr>
        <tr>
          <th className="border bg-slate-100 px-2 py-3" scope="row">2주</th>
          <td className={cn('border px-2 py-1', 'hover:bg-slate-50')}>{formatPrice(basicPriceList[1])}</td>
          <td className={cn('border px-2 py-1', 'hover:bg-slate-50')}>{formatPrice(premiumPriceList[1])}</td>
        </tr>
        <tr>
          <th className="border bg-slate-100 px-2 py-3" scope="row">3주</th>
          <td className={cn('border px-2 py-1', 'hover:bg-slate-50')}>{formatPrice(basicPriceList[2])}</td>
          <td className={cn('border px-2 py-1', 'hover:bg-slate-50')}>{formatPrice(premiumPriceList[2])}</td>
        </tr>
        <tr>
          <th className={cn('border bg-slate-100 px-2 py-3', 'md:px-4')} scope="row">4주</th>
          <td className={cn('border px-2 py-1', 'hover:bg-slate-50 md:px-12')}>{formatPrice(basicPriceList[3])}</td>
          <td className={cn('border px-2 py-1', 'hover:bg-slate-50', 'md:px-12')}>
            {formatPrice(premiumPriceList[3])}
          </td>
        </tr>
      </tbody>
    </table>
  );
};
