import { cn } from '@/lib/utils';
import { commuteCheckList, dayoffCheckList, inHouseCheckList, onDayCheckList } from '@/src/feature/price';
import { BasicPremiumPriceTable, SinglePriceTable } from '@/src/feature/price';
import SectionTitleHero from '@/src/shared/ui/SectionTitleHero';

function NotesList({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 space-y-0.5">
      {items.map(item => (
        <li
          className={cn(
            'relative pl-5 text-sm leading-loose text-inkLight',
            'break-keep',
            "before:absolute before:left-0 before:top-2.5 before:h-px before:w-2 before:bg-gold before:content-['']",
          )}
          key={item}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

const PricePage = () => {
  return (
    <>
      <SectionTitleHero
        description="산모님의 상황에 맞춰 선택하실 수 있도록 유형별 요금을 안내해 드립니다."
        label="고운황금손 이용요금"
      />
      {/* 주간 케어 요금 */}
      <section className={cn('mx-auto px-8')}>
        <div className={cn('py-11 text-center')}>
          <h2 className={cn('text-3xl font-medium tracking-tight', 'md:text-4xl')}>
            주간 케어 요금
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-inkLight">
            기간 단위로 이용하시는 출퇴근형과 입주형 요금입니다.
          </p>
        </div>

        <div className={cn('grid grid-cols-1 gap-14', 'lg:grid-cols-2 lg:gap-16')}>
          {/* 출퇴근형 */}
          <div>
            <div className="mb-6 text-center">
              <h3 className="text-2xl font-medium tracking-normal">출퇴근형</h3>
              <p className="mt-2 text-sm text-inkLight">산후관리사가 산모님 댁으로 방문해요.</p>
            </div>
            <BasicPremiumPriceTable
              basicPriceList={[900000, 1600000, 2400000, 3200000]}
              premiumPriceList={[950000, 1700000, 2550000, 3400000]}
            />
            <NotesList items={commuteCheckList} />
          </div>

          {/* 입주형 */}
          <div>
            <div className="mb-6 text-center">
              <h3 className="text-2xl font-medium tracking-normal">입주형</h3>
              <p className="mt-2 text-sm text-inkLight">산모님 댁에서 산후관리사가 함께해요.</p>
            </div>
            <BasicPremiumPriceTable
              basicPriceList={[1450000, 2600000, 3900000, 5200000]}
              basicTitle="주5일 입주형"
              premiumPriceList={[1650000, 3100000, 4650000, 6200000]}
              premiumTitle="주6일 입주형"
            />
            <NotesList items={inHouseCheckList} />
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className={cn('mx-auto mt-24 px-8')}>
        <div className="h-px bg-lineWarm" />
      </div>

      {/* 단기 돌봄 요금 */}
      <section className={cn('mx-auto px-8')}>
        <div className={cn('py-11 text-center')}>
          <h2 className={cn('text-3xl font-medium tracking-tight', 'md:text-4xl')}>
            단기 돌봄 요금
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-inkLight">
            필요한 시간만큼 가볍게 이용하실 수 있는 단기 케어입니다.
          </p>
        </div>

        <div className={cn('grid grid-cols-1 gap-14', 'lg:grid-cols-2 lg:gap-16')}>
          {/* 오전·오후 돌봄 */}
          <div>
            <div className="mb-6 text-center">
              <h3 className="text-2xl font-medium tracking-normal">오전·오후 돌봄</h3>
              <p className="mt-2 text-sm text-inkLight">오전 또는 오후 시간대에만 돌봐드려요.</p>
            </div>
            <SinglePriceTable priceList={[620000, 1180000, 1770000, 2360000]} title="오전·오후 돌봄" />
            <NotesList items={dayoffCheckList} />
          </div>

          {/* 하루돌봄 */}
          <div>
            <div className="mb-6 text-center">
              <h3 className="text-2xl font-medium tracking-normal">하루돌봄</h3>
              <p className="mt-2 text-sm text-inkLight">원하시는 날, 하루만 돌봐드려요.</p>
            </div>
            <SinglePriceTable priceList={[200000]} title="하루돌봄" />
            <NotesList items={onDayCheckList} />
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className={cn('mx-auto mt-24 px-8')}>
        <div className="h-px bg-lineWarm" />
      </div>

      {/* 그 외 요금 안내 */}
      <section className={cn('mx-auto px-8')}>
        <div className={cn('py-11 text-center')}>
          <h2 className={cn('text-3xl font-medium tracking-tight', 'md:text-4xl')}>그 외 요금 안내</h2>
          <p className="mt-4 text-sm leading-relaxed text-inkLight">
            기본 요금 외 추가되는 항목을 출퇴근형·입주형으로 나누어 안내드립니다.
          </p>
        </div>

        <div className="w-full overflow-x-auto">
          <table
            className={cn(
              'w-full min-w-[600px] border-collapse bg-white text-center text-sm',
              '[&_td]:border [&_td]:border-lineWarm [&_td]:px-4 [&_td]:py-3',
              '[&_th]:border [&_th]:border-lineWarm [&_th]:px-4 [&_th]:py-3',
            )}
          >
            <caption className="sr-only">추가 요금 안내 — 출퇴근형 및 입주형 비교</caption>
            <thead>
              <tr>
                <th className="bg-paper2" colSpan={2} scope="colgroup" />
                <th className="bg-cream font-semibold tracking-wider text-goldDeep" scope="col">
                  출퇴근형
                </th>
                <th className="bg-cream font-semibold tracking-wider text-goldDeep" scope="col">
                  입주형
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th
                  className="bg-paper2 font-semibold text-inkMid"
                  rowSpan={6}
                  scope="rowgroup"
                >
                  큰아이
                  <br />
                  추가비용
                </th>
                <th className="text-left text-inkLight font-normal pl-5" scope="row">미취학 20개월 미만</th>
                <td className="">15,000<span className="ml-px text-xs text-inkLight">원</span></td>
                <td className="">20,000<span className="ml-px text-xs text-inkLight">원</span></td>
              </tr>
              <tr>
                <th className="text-left text-inkLight font-normal pl-5" scope="row">미취학 20개월 이상</th>
                <td className="">10,000<span className="ml-px text-xs text-inkLight">원</span></td>
                <td className="">15,000<span className="ml-px text-xs text-inkLight">원</span></td>
              </tr>
              <tr>
                <th className="text-left text-inkLight font-normal pl-5" scope="row">어린이집·유치원</th>
                <td className="">6,000<span className="ml-px text-xs text-inkLight">원</span></td>
                <td className="">10,000<span className="ml-px text-xs text-inkLight">원</span></td>
              </tr>
              <tr>
                <th className="text-left text-inkLight font-normal pl-5" scope="row">어린이집 방학</th>
                <td className="">10,000<span className="ml-px text-xs text-inkLight">원</span></td>
                <td className="">20,000<span className="ml-px text-xs text-inkLight">원</span></td>
              </tr>
              <tr>
                <th className="text-left text-inkLight font-normal pl-5" scope="row">초등학교 이상 학생</th>
                <td className="">5,000<span className="ml-px text-xs text-inkLight">원</span></td>
                <td className="">8,000<span className="ml-px text-xs text-inkLight">원</span></td>
              </tr>
              <tr>
                <th className="text-left text-inkLight font-normal pl-5" scope="row">초등학교 이상 학생 방학</th>
                <td className="">6,000<span className="ml-px text-xs text-inkLight">원</span></td>
                <td className="">10,000<span className="ml-px text-xs text-inkLight">원</span></td>
              </tr>
              <tr>
                <th className="bg-paper2 font-semibold text-left text-inkMid pl-5" colSpan={2} scope="row">
                  남편 재택근무 및 성인가족 추가
                </th>
                <td className="">5,000<span className="ml-px text-xs text-inkLight">원</span></td>
                <td className="">6,000<span className="ml-px text-xs text-inkLight">원</span></td>
              </tr>
              <tr>
                <th className="bg-paper2 font-semibold text-left text-inkMid pl-5" colSpan={2} scope="row">
                  시간연장 (시간당)
                </th>
                <td className="">20,000<span className="ml-px text-xs text-inkLight">원</span></td>
                <td className="">20,000<span className="ml-px text-xs text-inkLight">원</span></td>
              </tr>
              <tr>
                <th className="bg-paper2 font-semibold text-left text-inkMid pl-5" colSpan={2} scope="row">
                  명절 휴일 추가
                </th>
                <td className="">100,000<span className="ml-px text-xs text-inkLight">원</span></td>
                <td className="">100,000<span className="ml-px text-xs text-inkLight">원</span></td>
              </tr>
              <tr>
                <th className="bg-paper2 font-semibold text-left text-inkMid pl-5" colSpan={2} scope="row">
                  관리사 지정 추가
                </th>
                <td className="">10,000<span className="ml-px text-xs text-inkLight">원</span></td>
                <td className="">10,000<span className="ml-px text-xs text-inkLight">원</span></td>
              </tr>
              <tr>
                <th className="bg-paper2 font-semibold text-left text-inkMid pl-5" colSpan={2} scope="row">
                  쌍둥이 케어
                </th>
                <td className="">50,000<span className="ml-px text-xs text-inkLight">원</span></td>
                <td className="">60,000<span className="ml-px text-xs text-inkLight">원</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-3.5 text-center text-sm text-inkLight">
          근무시간 09:00 ~ 15:00 / 10:00 ~ 16:00 · 근무시간 외 1시간 당 20,000원
        </p>
      </section>

      <div className="pb-24" />
    </>
  );
};

export default PricePage;
