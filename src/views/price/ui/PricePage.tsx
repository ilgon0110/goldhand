import { cn } from '@/lib/utils';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';
import { BasicPremiumPriceTable, SinglePriceTable } from '@/src/widgets/pricewidgets';
import {
  commuteCheckList,
  dayoffCheckList,
  inHouseCheckList,
  onDayCheckList,
} from '@/src/widgets/pricewidgets/config/const';

export const PricePage = () => {
  return (
    <>
      <SectionTitle title="고운황금손 이용요금" />
      <div className={cn('flex flex-col justify-center gap-20', 'lg:flex-row')}>
        <div>
          <div className="mt-6 w-full text-center text-lg font-bold lg:text-2xl">출퇴근형</div>
          <div className="mb-2 mt-1 text-center text-slate-700 lg:text-lg">산후관리사가 산모 집으로 방문해요.</div>
          <div className="w-full overflow-x-auto">
            <BasicPremiumPriceTable
              basicPriceList={[850000, 1500000, 2250000, 3000000]}
              iconMode={false}
              premiumPriceList={[900000, 1600000, 2400000, 3200000]}
            />
          </div>
          {commuteCheckList.map(checkList => (
            <div className="ml-2 mt-2 text-sm text-slate-700 lg:text-base" key={checkList}>
              {checkList}
            </div>
          ))}
        </div>
        <div>
          <div className="mt-6 w-full text-center text-lg font-bold lg:text-2xl">입주형</div>
          <div className="mb-2 mt-1 text-center text-slate-700 lg:text-lg">산모 집에서 산후관리사가 함께해요.</div>
          <div className="w-full overflow-x-auto">
            <BasicPremiumPriceTable
              basicPriceList={[1350000, 2450000, 3600000, 4800000]}
              basicTitle="주5일 입주형"
              iconMode={false}
              premiumPriceList={[16000000, 3000000, 4500000, 6000000]}
              premiumTitle="주6일 입주형"
            />
          </div>
          {inHouseCheckList.map(checkList => (
            <div className="ml-2 mt-2 text-sm text-slate-700 lg:text-base" key={checkList}>
              {checkList}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10 h-[1px] w-full bg-slate-200" />
      <div className={cn('flex flex-col justify-center gap-20', 'lg:flex-row')}>
        <div>
          <div className="mt-6 w-full text-center text-lg font-bold lg:text-2xl">오전, 오후 돌봄</div>
          <div className="mb-2 mt-1 text-center text-slate-700 lg:text-lg">오전 및 오후에만 돌봐드려요.</div>
          <SinglePriceTable priceList={[600000, 1150000, 1700000, 2200000]} title="오전, 오후 돌봄" />
          {dayoffCheckList.map(checkList => (
            <div className="ml-2 mt-2 text-sm text-slate-700 lg:text-base" key={checkList}>
              {checkList}
            </div>
          ))}
        </div>
        <div>
          <div className="mt-6 w-full text-center text-lg font-bold lg:text-2xl">하루돌봄</div>
          <div className="mb-2 mt-1 text-center text-slate-700 lg:text-lg">원하는 날 하루만 돌봐드려요.</div>
          <SinglePriceTable priceList={[200000]} title="하루돌봄" />
          {onDayCheckList.map(checkList => (
            <div className="ml-2 mt-2 text-sm text-slate-700 lg:text-base" key={checkList}>
              {checkList}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 h-[1px] w-full bg-slate-200" />
      <div className="mt-6 w-full text-center text-lg font-bold lg:text-2xl">그 외 요금 안내</div>
      <div className="mb-2 mt-1 text-center text-slate-700 lg:text-lg">
        09:00 ~ 15:00 / 10:00 ~ 16:00 (근무시간 외 1시간 당 20,000원)
      </div>
      {/* 요금 안내 표 */}
      <div className="mt-6 w-full overflow-x-auto">
        <table className="w-full min-w-[600px] border border-gray-300 text-center text-sm md:text-base">
          <thead>
            <tr>
              <th className="col-span-2 border-r border-white bg-slate-200 px-4 py-2" colSpan={2}>
                구 분
              </th>
              <th className="border-r border-white bg-slate-200 px-4 py-2">출퇴근형</th>
              <th className="bg-slate-200 px-4 py-2">입주형</th>
            </tr>
          </thead>
          <tbody>
            {/* 큰아이 추가비용 */}
            <tr>
              <td className="row-span-6 border border-gray-300 py-4 align-middle font-bold" rowSpan={6}>
                큰아이
                <br />
                추가비용
              </td>
              <td className="border border-gray-300 py-2">미취학 20개월 미만</td>
              <td className="border border-gray-300 py-2">15,000</td>
              <td className="border border-gray-300 py-2">20,000</td>
            </tr>
            <tr>
              <td className="border border-gray-300 py-2">미취학 20개월 이상</td>
              <td className="border border-gray-300 py-2">10,000</td>
              <td className="border border-gray-300 py-2">15,000</td>
            </tr>
            <tr>
              <td className="border border-gray-300 py-2">어린이집 유치원</td>
              <td className="border border-gray-300 py-2">6,000</td>
              <td className="border border-gray-300 py-2">10,000</td>
            </tr>
            <tr>
              <td className="border border-gray-300 py-2">어린이집 방학</td>
              <td className="border border-gray-300 py-2">10,000</td>
              <td className="border border-gray-300 py-2">20,000</td>
            </tr>
            <tr>
              <td className="border border-gray-300 py-2">초등학교 이상 학생</td>
              <td className="border border-gray-300 py-2">5,000</td>
              <td className="border border-gray-300 py-2">8,000</td>
            </tr>
            <tr>
              <td className="border border-gray-300 py-2">초등학교 이상 학생 방학</td>
              <td className="border border-gray-300 py-2">6,000</td>
              <td className="border border-gray-300 py-2">10,000</td>
            </tr>
            {/* 남편 재택근무 및 성인가족 추가 */}
            <tr>
              <td className="col-span-2 border border-gray-300 py-2 font-bold" colSpan={2}>
                남편 재택근무 및 성인가족 추가
              </td>
              <td className="border border-gray-300 py-2">5,000</td>
              <td className="border border-gray-300 py-2">6,000</td>
            </tr>
            {/* 시간 연장 */}
            <tr>
              <td className="col-span-2 border border-gray-300 py-2 font-bold" colSpan={2}>
                시간연장(시간당)
              </td>
              <td className="border border-gray-300 py-2">20,000</td>
              <td className="border border-gray-300 py-2">20,000</td>
            </tr>
            {/* 명절 휴일 추가 */}
            <tr>
              <td className="col-span-2 border border-gray-300 py-2 font-bold" colSpan={2}>
                명절 휴일 추가
              </td>
              <td className="border border-gray-300 py-2">100,000</td>
              <td className="border border-gray-300 py-2">100,000</td>
            </tr>
            {/* 관리사 지정 추가 */}
            <tr>
              <td className="col-span-2 border border-gray-300 py-2 font-bold" colSpan={2}>
                관리사 지정 추가
              </td>
              <td className="border border-gray-300 py-2">10,000</td>
              <td className="border border-gray-300 py-2">10,000</td>
            </tr>
            {/* 쌍둥이 케어 */}
            <tr>
              <td className="col-span-2 border border-gray-300 py-2 font-bold" colSpan={2}>
                쌍둥이 케어
              </td>
              <td className="border border-gray-300 py-2">50,000</td>
              <td className="border border-gray-300 py-2">60,000</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};
