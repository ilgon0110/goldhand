import { cn } from '@/lib/utils';
import { formatPrice } from '@/src/shared/utils';

export const SinglePriceTable = ({ title = '베이직', priceList }: { title?: string; priceList: number[] }) => {
  const isOneDay = title === '하루돌봄';
  const periods = isOneDay ? ['8시간'] : ['1주', '2주', '3주', '4주'];

  return (
    <div className="w-full overflow-x-auto">
      <table
        className={cn(
          'w-full border-collapse bg-white text-center text-sm',
          '[&_td]:border [&_td]:border-lineWarm [&_td]:px-4 [&_td]:py-3.5',
          '[&_th]:border [&_th]:border-lineWarm [&_th]:px-4 [&_th]:py-3.5',
        )}
      >
        <caption className="sr-only">{title} 이용요금표</caption>
        <thead>
          <tr>
            <th className="bg-cream py-4 text-sm font-semibold tracking-wider text-goldDeep" scope="col">
              기간
            </th>
            <th className="bg-cream py-4 text-sm font-semibold tracking-wider text-goldDeep" scope="col">
              요금
            </th>
          </tr>
        </thead>
        <tbody>
          {periods.map((period, i) => (
            <tr className="group" key={period}>
              <th className="bg-paper2 text-sm font-medium text-inkMid" scope="row">
                {period}
              </th>
              <td className="text-base group-hover:bg-gold/5">
                {formatPrice(priceList[i])}
                <span className="ml-px text-xs text-inkLight">원</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
