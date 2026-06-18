import { cn } from '@/lib/utils';
import { formatPrice } from '@/src/shared/utils';

export const BasicPremiumPriceTable = ({
  basicTitle = '베이직',
  premiumTitle = '프리미엄',
  basicPriceList,
  premiumPriceList,
}: {
  basicTitle?: string;
  premiumTitle?: string;
  basicPriceList: number[];
  premiumPriceList: number[];
}) => {
  const weeks = ['1주', '2주', '3주', '4주'];

  return (
    <div className="w-full overflow-x-auto">
      <table
        className={cn(
          'w-full border-collapse bg-white text-center font-[tabular-nums] text-sm',
          '[&_td]:border [&_td]:border-lineWarm [&_td]:px-4 [&_td]:py-3.5',
          '[&_th]:border [&_th]:border-lineWarm [&_th]:px-4 [&_th]:py-3.5',
        )}
      >
        <caption className="sr-only">
          {basicTitle} / {premiumTitle} 이용요금표
        </caption>
        <thead>
          <tr>
            <th aria-label="기간" className="bg-paper2 text-inkMid" scope="col" />
            <th
              className="bg-cream py-4 text-sm font-semibold tracking-wider text-goldDeep"
              scope="col"
            >
              {basicTitle}
            </th>
            <th
              className="bg-cream py-4 text-sm font-semibold tracking-wider text-goldDeep"
              scope="col"
            >
              {premiumTitle}
            </th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, i) => (
            <tr className="group" key={week}>
              <th className="bg-paper2 text-sm font-medium text-inkMid" scope="row">
                {week}
              </th>
              <td className="text-base group-hover:bg-gold/5">{formatPrice(basicPriceList[i])}</td>
              <td className="bg-goldSoft/5 text-base group-hover:bg-gold/5">
                {formatPrice(premiumPriceList[i])}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
