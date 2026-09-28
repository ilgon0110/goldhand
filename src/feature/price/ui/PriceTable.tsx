import { cn } from '@/lib/utils';
import { formatPrice } from '@/src/shared/utils';

type TPriceRow = { label: string; values: number[] };

type TPriceTableProps = {
  caption: string;
  /** 첫 열(항목) 제목 */
  labelHeader: string;
  columns: string[];
  rows: TPriceRow[];
};

// 가로 구분선만 사용하는 요금표. 금액은 우측 정렬 + tabular 숫자로 자릿수를 맞춘다.
// 금액 열은 내용 폭(w-px)만 쓰고, 항목 열이 남은 폭을 가져가 모바일에서도 줄바꿈을 줄인다.
export const PriceTable = ({ caption, labelHeader, columns, rows }: TPriceTableProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-muted/50">
          <tr>
            <th className={cn('px-3 py-3.5 text-left font-semibold text-muted-foreground', 'md:px-5')} scope="col">
              {labelHeader}
            </th>
            {columns.map(column => (
              <th
                className={cn('w-px whitespace-nowrap px-3 py-3.5 text-right font-semibold text-goldDeep', 'md:px-5')}
                key={column}
                scope="col"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ label, values }) => (
            <tr className="border-t border-border" key={label}>
              <th className={cn('break-keep px-3 py-3.5 text-left font-medium text-foreground', 'md:px-5')} scope="row">
                {label}
              </th>
              {values.map((value, index) => (
                <td
                  className={cn(
                    'w-px whitespace-nowrap px-3 py-3.5 text-right text-sm font-semibold tabular-nums text-foreground',
                    'md:px-5 md:text-base',
                  )}
                  key={columns[index]}
                >
                  {formatPrice(value)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
