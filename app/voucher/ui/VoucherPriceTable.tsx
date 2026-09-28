import { cn } from '@/lib/utils';

type TSupportAmounts = readonly [short: string, standard: string, extended: string];

type TIncomeRow = {
  code: string;
  criterion: string;
  support: TSupportAmounts;
  copayment: TSupportAmounts;
};

type TBirthGroup = {
  birthOrder: string;
  service: TSupportAmounts;
  incomes: readonly TIncomeRow[];
};

type TBabyGroup = {
  babyType: string;
  births: readonly TBirthGroup[];
};

const DAILY_PRICES = [
  ['단태아', '146,400원'],
  ['쌍태아 1명', '183,200원'],
  ['쌍태아 2명', '284,800원'],
  ['삼태아 2명', '369,600원'],
  ['삼태아 3명', '427,200원'],
  ['사태아 이상 2명', '398,400원'],
  ['사태아 이상 4명', '569,600원'],
] as const;

const PRICE_GROUPS: readonly TBabyGroup[] = [
  {
    babyType: '단태아',
    births: [
      {
        birthOrder: '첫째아',
        service: ['5일\n(732,000)', '10일\n(1,464,000)', '15일\n(2,196,000)'],
        incomes: [
          {
            code: 'A-가①',
            criterion: '자격확인',
            support: ['659,000', '1,165,000', '1,525,000'],
            copayment: ['73,000', '299,000', '671,000'],
          },
          {
            code: 'A-통합①',
            criterion: '150% 이하',
            support: ['569,000', '1,002,000', '1,303,000'],
            copayment: ['163,000', '462,000', '893,000'],
          },
          {
            code: 'A-라①',
            criterion: '150% 초과\n(예외지원)',
            support: ['456,000', '764,000', '1,035,000'],
            copayment: ['276,000', '700,000', '1,161,000'],
          },
        ],
      },
      {
        birthOrder: '둘째아',
        service: ['10일\n(1,464,000)', '15일\n(2,196,000)', '20일\n(2,928,000)'],
        incomes: [
          {
            code: 'A-가②',
            criterion: '자격확인',
            support: ['1,345,000', '1,794,000', '2,094,000'],
            copayment: ['119,000', '402,000', '834,000'],
          },
          {
            code: 'A-통합②',
            criterion: '150% 이하',
            support: ['1,165,000', '1,525,000', '1,767,000'],
            copayment: ['299,000', '671,000', '1,161,000'],
          },
          {
            code: 'A-라②',
            criterion: '150% 초과\n(예외지원)',
            support: ['943,000', '1,193,000', '1,440,000'],
            copayment: ['521,000', '1,003,000', '1,488,000'],
          },
        ],
      },
      {
        birthOrder: '셋째아\n이상',
        service: ['10일\n(1,464,000)', '15일\n(2,196,000)', '20일\n(2,928,000)'],
        incomes: [
          {
            code: 'A-가③',
            criterion: '자격확인',
            support: ['1,374,000', '1,838,000', '2,154,000'],
            copayment: ['90,000', '358,000', '774,000'],
          },
          {
            code: 'A-통합③',
            criterion: '150% 이하',
            support: ['1,195,000', '1,548,000', '1,797,000'],
            copayment: ['269,000', '648,000', '1,131,000'],
          },
          {
            code: 'A-라③',
            criterion: '150% 초과\n(예외지원)',
            support: ['973,000', '1,236,000', '1,499,000'],
            copayment: ['491,000', '960,000', '1,429,000'],
          },
        ],
      },
    ],
  },
  {
    babyType: '쌍태아\n(중증 +\n단태아)',
    births: [
      {
        birthOrder: '관리사\n1명',
        service: ['10일\n(1,832,000)', '15일\n(2,748,000)', '20일\n(3,664,000)'],
        incomes: [
          {
            code: 'B-가①',
            criterion: '자격확인',
            support: ['1,758,000', '2,357,000', '2,771,000'],
            copayment: ['74,000', '391,000', '893,000'],
          },
          {
            code: 'B-통합①',
            criterion: '150% 이하',
            support: ['1,572,000', '2,050,000', '2,436,000'],
            copayment: ['260,000', '698,000', '1,228,000'],
          },
          {
            code: 'B-라①',
            criterion: '150% 초과\n(예외지원)',
            support: ['1,274,000', '1,605,000', '1,952,000'],
            copayment: ['558,000', '1,143,000', '1,712,000'],
          },
        ],
      },
      {
        birthOrder: '관리사\n2명',
        service: ['10일\n(2,848,000)', '15일\n(4,272,000)', '20일\n(5,696,000)'],
        incomes: [
          {
            code: 'B-가②',
            criterion: '자격확인',
            support: ['2,614,000', '3,478,000', '4,289,000'],
            copayment: ['234,000', '794,000', '1,407,000'],
          },
          {
            code: 'B-통합②',
            criterion: '150% 이하',
            support: ['2,369,000', '3,165,000', '3,915,000'],
            copayment: ['479,000', '1,107,000', '1,781,000'],
          },
          {
            code: 'B-라②',
            criterion: '150% 초과\n(예외지원)',
            support: ['2,004,000', '2,698,000', '3,353,000'],
            copayment: ['844,000', '1,574,000', '2,343,000'],
          },
        ],
      },
    ],
  },
  {
    babyType: '삼태아\n(중증 +\n쌍태아)',
    births: [
      {
        birthOrder: '관리사\n2명',
        service: ['15일\n(5,544,000)', '25일\n(9,240,000)', '40일\n(14,784,000)'],
        incomes: [
          {
            code: 'C-가①',
            criterion: '자격확인',
            support: ['5,431,000', '8,303,000', '12,088,000'],
            copayment: ['113,000', '937,000', '2,696,000'],
          },
          {
            code: 'C-통합①',
            criterion: '150% 이하',
            support: ['4,983,000', '7,368,000', '11,039,000'],
            copayment: ['561,000', '1,872,000', '3,745,000'],
          },
          {
            code: 'C-라①',
            criterion: '150% 초과\n(예외지원)',
            support: ['4,253,000', '6,337,000', '9,540,000'],
            copayment: ['1,291,000', '2,903,000', '5,244,000'],
          },
        ],
      },
      {
        birthOrder: '관리사\n3명',
        service: ['15일\n(6,408,000)', '25일\n(10,680,000)', '40일\n(17,088,000)'],
        incomes: [
          {
            code: 'C-가②',
            criterion: '자격확인',
            support: ['6,278,000', '9,596,000', '13,968,000'],
            copayment: ['130,000', '1,084,000', '3,120,000'],
          },
          {
            code: 'C-통합②',
            criterion: '150% 이하',
            support: ['5,759,000', '8,514,000', '12,755,000'],
            copayment: ['649,000', '2,166,000', '4,333,000'],
          },
          {
            code: 'C-라②',
            criterion: '150% 초과\n(예외지원)',
            support: ['4,914,000', '7,321,000', '11,020,000'],
            copayment: ['1,494,000', '3,359,000', '6,068,000'],
          },
        ],
      },
    ],
  },
  {
    babyType: '사태아 이상\n(중증 +\n삼태아 이상)',
    births: [
      {
        birthOrder: '관리사\n2명',
        service: ['15일\n(5,976,000)', '25일\n(9,960,000)', '40일\n(15,936,000)'],
        incomes: [
          {
            code: 'D-가①',
            criterion: '자격확인',
            support: ['5,854,000', '8,952,000', '13,035,000'],
            copayment: ['122,000', '1,008,000', '2,901,000'],
          },
          {
            code: 'D-통합①',
            criterion: '150% 이하',
            support: ['5,372,000', '7,946,000', '11,906,000'],
            copayment: ['604,000', '2,014,000', '4,030,000'],
          },
          {
            code: 'D-라①',
            criterion: '150% 초과\n(예외지원)',
            support: ['4,586,000', '6,836,000', '10,293,000'],
            copayment: ['1,390,000', '3,124,000', '5,643,000'],
          },
        ],
      },
      {
        birthOrder: '관리사\n4명',
        service: ['15일\n(8,544,000)', '25일\n(14,240,000)', '40일\n(22,784,000)'],
        incomes: [
          {
            code: 'D-가②',
            criterion: '자격확인',
            support: ['8,369,000', '12,789,000', '18,604,000'],
            copayment: ['175,000', '1,451,000', '4,180,000'],
          },
          {
            code: 'D-통합②',
            criterion: '150% 이하',
            support: ['7,674,000', '11,338,000', '16,978,000'],
            copayment: ['870,000', '2,902,000', '5,806,000'],
          },
          {
            code: 'D-라②',
            criterion: '150% 초과\n(예외지원)',
            support: ['6,542,000', '9,740,000', '14,655,000'],
            copayment: ['2,002,000', '4,500,000', '8,129,000'],
          },
        ],
      },
    ],
  },
] as const;

const cell = 'border-b border-r border-border px-3 py-2.5 text-center align-middle last:border-r-0';

function Multiline({ children }: { children: string }) {
  return <span className="whitespace-pre-line">{children}</span>;
}

export const VoucherPriceTable = () => {
  return (
    <div>
      <dl className="grid grid-cols-2 border-l border-t border-border text-center sm:grid-cols-4 xl:grid-cols-8">
        <div className="flex items-center justify-center border-b border-r border-border bg-[#F4E4BC] px-3 py-3">
          <dt className="text-sm font-bold text-foreground">1일당 단가</dt>
        </div>
        {DAILY_PRICES.map(([label, price]) => (
          <div className="border-b border-r border-border px-3 py-3" key={label}>
            <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
            <dd className="mt-1 text-sm font-bold tabular-nums text-foreground">{price}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-3 text-sm text-muted-foreground md:hidden" id="voucher-table-scroll-help">
        표를 좌우로 밀어 전체 내용을 확인해 주세요.
      </p>
      <div
        aria-describedby="voucher-table-scroll-help"
        className="mt-4 overflow-x-auto rounded-xl border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-goldDeep focus-visible:ring-offset-2"
        role="region"
        // 가로 스크롤 표를 키보드만으로 탐색할 수 있게 한다.
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
      >
        <table className="w-full min-w-[1180px] table-fixed border-collapse text-[12px] leading-[1.35] text-foreground">
          <caption className="sr-only">2026년 산모·신생아 건강관리 서비스 가격, 정부지원금 및 본인부담금</caption>
          <colgroup>
            <col className="w-[86px]" />
            <col className="w-[78px]" />
            <col className="w-[76px]" />
            <col className="w-[84px]" />
            {Array.from({ length: 9 }, (_, index) => (
              <col className="w-[95px]" key={index} />
            ))}
          </colgroup>
          <thead className="bg-[#F4E4BC]">
            <tr className="border-b border-border">
              <th className={cell} rowSpan={2} scope="col">
                태아유형
              </th>
              <th className={cell} rowSpan={2} scope="col">
                출산순위
              </th>
              <th className={cell} colSpan={2} scope="colgroup">
                소득유형
              </th>
              <th className={cell} colSpan={3} scope="colgroup">
                서비스기간 및 총금액
              </th>
              <th className={cell} colSpan={3} scope="colgroup">
                정부지원금
              </th>
              <th className={cell} colSpan={3} scope="colgroup">
                본인부담금
              </th>
            </tr>
            <tr className="border-b-2 border-goldDeep/50 bg-[#FBF4E5]">
              <th className={cell} scope="col">
                구분
              </th>
              <th className={cell} scope="col">
                선정기준
              </th>
              {['단축', '표준', '연장', '단축', '표준', '연장', '단축', '표준', '연장'].map((label, index) => (
                <th className={cell} key={`${label}-${index}`} scope="col">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PRICE_GROUPS.map(group => {
              const babyRowSpan = group.births.reduce((sum, birth) => sum + birth.incomes.length, 0);

              return group.births.flatMap((birth, birthIndex) =>
                birth.incomes.map((income, incomeIndex) => (
                  <tr
                    className={cn(
                      'bg-background hover:bg-gold/5',
                      incomeIndex === 0 && birthIndex > 0 && 'border-t border-foreground/40',
                      incomeIndex === 0 && birthIndex === 0 && 'border-t-2 border-goldDeep/50',
                    )}
                    key={income.code}
                  >
                    {birthIndex === 0 && incomeIndex === 0 ? (
                      <th className={cn(cell, 'bg-[#F4E4BC]/65 font-bold')} rowSpan={babyRowSpan} scope="rowgroup">
                        <Multiline>{group.babyType}</Multiline>
                      </th>
                    ) : null}
                    {incomeIndex === 0 ? (
                      <th
                        className={cn(cell, 'bg-[#FBF4E5] font-bold')}
                        rowSpan={birth.incomes.length}
                        scope="rowgroup"
                      >
                        <Multiline>{birth.birthOrder}</Multiline>
                      </th>
                    ) : null}
                    <th className={cn(cell, 'font-semibold')} scope="row">
                      {income.code}
                    </th>
                    <td className={cn(cell, 'text-[11px] text-muted-foreground')}>
                      <Multiline>{income.criterion}</Multiline>
                    </td>
                    {incomeIndex === 0
                      ? birth.service.map((value, index) => (
                          <td
                            className={cn(cell, 'bg-muted/30 font-medium tabular-nums')}
                            key={index}
                            rowSpan={birth.incomes.length}
                          >
                            <Multiline>{value}</Multiline>
                          </td>
                        ))
                      : null}
                    {income.support.map((value, index) => (
                      <td className={cn(cell, 'tabular-nums')} key={index}>
                        {value}
                      </td>
                    ))}
                    {income.copayment.map((value, index) => (
                      <td className={cn(cell, 'font-semibold tabular-nums text-[#B46A00]')} key={index}>
                        {value}
                      </td>
                    ))}
                  </tr>
                )),
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        금액 단위는 원이며, 소득유형의 150%는 기준중위소득 기준입니다. 괄호 안 금액은 서비스 총금액입니다.
      </p>
    </div>
  );
};
