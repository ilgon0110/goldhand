import { SectionTitle } from '@/src/shared/ui/sectionTitle';
import {
  basicCheckList,
  basicPriceList,
  costEffectivenessCheckList,
  costEffectivenessPriceList,
  premiumCheckList,
  premiumHouseFiveDayPriceList,
  premiumHouseSixDayCheckList,
  premiumHouseSixDayPriceList,
  premiumPriceList,
  PriceCard,
} from '@/src/widgets/pricewidgets';
import {
  etcInsertCheckList,
  etcWorkOutCheckList,
  oneDayCheckList,
  oneDayPriceList,
} from '@/src/widgets/pricewidgets/config/const';

export const PricePage = () => {
  return (
    <div>
      <SectionTitle buttonTitle="" title="고운황금손 이용요금" onClickButtonTitle={() => {}} />
      <div className="mt-6 w-full text-center text-2xl font-bold lg:text-4xl">출퇴근형</div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <PriceCard checkList={basicCheckList} description="" priceList={basicPriceList} title="베이직" />
        <PriceCard checkList={premiumCheckList} description="" priceList={premiumPriceList} title="프리미엄" />
      </div>
      <div className="mt-10 h-[1px] w-full bg-slate-300" />
      <div className="mt-6 w-full text-center text-2xl font-bold lg:text-4xl">입주형</div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <PriceCard
          checkList={premiumHouseSixDayCheckList}
          description=""
          priceList={premiumHouseFiveDayPriceList}
          title="프리미엄(주5일 입주형)"
        />
        <PriceCard
          checkList={premiumHouseSixDayCheckList}
          description=""
          priceList={premiumHouseSixDayPriceList}
          title="프리미엄(주6일 입주형)"
        />
      </div>
      <div className="mt-10 h-[1px] w-full bg-slate-300" />
      <div className="mt-6 w-full text-center text-2xl font-bold lg:text-4xl">실속형</div>
      <div className="mt-4 text-center text-lg text-slate-500 md:text-xl">평일 09:00 ~ 14:00/평일 10:00 ~ 15:00</div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <PriceCard
          checkList={costEffectivenessCheckList}
          description=""
          priceList={costEffectivenessPriceList}
          title="실속형"
        />
      </div>
      <div className="mt-10 h-[1px] w-full bg-slate-300" />
      <div className="mt-6 w-full text-center text-2xl font-bold lg:text-4xl">하루돌봄</div>
      <div className="mt-4 text-center text-lg text-slate-500 md:text-xl">
        09:00 ~ 15:00 / 10:00 ~ 16:00 (근무시간 외 1시간 당 20,000원)
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <PriceCard checkList={oneDayCheckList} description="" priceList={oneDayPriceList} title="하루돌봄" />
      </div>
      <div className="mt-10 h-[1px] w-full bg-slate-300" />
      <div className="mt-6 w-full text-center text-2xl font-bold lg:text-4xl">그 외 요금 안내</div>
      <div className="mt-4 text-center text-lg text-slate-500 md:text-xl">
        09:00 ~ 15:00 / 10:00 ~ 16:00 (근무시간 외 1시간 당 20,000원)
      </div>
      {/* 요금 안내 표 */}
      <div className="mt-6 w-full overflow-x-auto">
        <div className="grid grid-cols-4 border border-gray-300 text-center text-[10px] sm:text-sm md:text-base">
          {/* Header */}
          <div className="col-span-2 border-r border-white bg-[#728146] px-4 py-2 font-bold text-white">구 분</div>
          <div className="col-span-1 border-r border-white bg-[#728146] px-4 py-2 font-bold text-white">출퇴근형</div>
          <div className="col-span-1 bg-[#728146] px-4 py-2 font-bold text-white">입주형</div>
          <div className="row-span-6 flex flex-col justify-center border border-gray-300 py-4">
            큰아이
            <br />
            추가비용
          </div>
          <div className="col-span-1 row-span-6">
            <div className="flex flex-col justify-center border border-gray-300 py-2">미취학 20개월 미만</div>
            <div className="flex flex-col justify-center border border-gray-300 py-2">미취학 20개월 이상</div>
            <div className="flex flex-col justify-center border border-gray-300 py-2">어린이집 유치원</div>
            <div className="flex flex-col justify-center border border-gray-300 py-2">어린이집 방학</div>
            <div className="flex flex-col justify-center border border-gray-300 py-2">초등학교 이상 학생</div>
            <div className="flex flex-col justify-center border border-gray-300 py-2">초등학교 이상 학생 방학</div>
          </div>
          {/* 미취학 */}
          <div className="border border-gray-300 py-2">15,000</div>
          <div className="border border-gray-300 py-2">20,000</div>
          <div className="border border-gray-300 py-2">10,000</div>
          <div className="border border-gray-300 py-2">15,000</div>

          {/* 어린이집/유치원 */}
          <div className="border border-gray-300 py-2">6,000</div>
          <div className="border border-gray-300 py-2">10,000</div>
          <div className="border border-gray-300 py-2">10,000</div>
          <div className="border border-gray-300 py-2">20,000</div>

          {/* 초등학교 이상 */}
          <div className="border border-gray-300 py-2">5,000</div>
          <div className="border border-gray-300 py-2">8,000</div>
          <div className="border border-gray-300 py-2">6,000</div>
          <div className="border border-gray-300 py-2">10,000</div>

          {/* 남편 재택근무 */}
          <div className="col-span-2 border border-gray-300 py-2">남편 재택근무 및 성인가족 추가</div>
          <div className="border border-gray-300 py-2">5,000</div>
          <div className="border border-gray-300 py-2">6,000</div>

          {/* 시간 연장 */}
          <div className="col-span-2 border border-gray-300 py-2">시간연장(시간당)</div>
          <div className="border border-gray-300 py-2">20,000</div>
          <div className="border border-gray-300 py-2">20,000</div>

          {/* 명절 휴일 추가 */}
          <div className="col-span-2 border border-gray-300 py-2">명절 휴일 추가</div>
          <div className="border border-gray-300 py-2">100,000</div>
          <div className="border border-gray-300 py-2">100,000</div>

          {/* 관리사 지정 추가 */}
          <div className="col-span-2 border border-gray-300 py-2">관리사 지정 추가</div>
          <div className="border border-gray-300 py-2">10,000</div>
          <div className="border border-gray-300 py-2">10,000</div>

          {/* 쌍둥이 케어 */}
          <div className="col-span-2 border border-gray-300 py-2">쌍둥이 케어</div>
          <div className="border border-gray-300 py-2">50,000</div>
          <div className="border border-gray-300 py-2">60,000</div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <PriceCard checkList={etcWorkOutCheckList} description="" priceList={[]} title="출퇴근형 근무시간 안내" />
        <PriceCard checkList={etcInsertCheckList} description="" priceList={[]} title="입주형 근무시간 안내" />
      </div>
      <div className="mt-10 h-[1px] w-full bg-slate-300" />
      <div className="mt-6 w-full text-center text-2xl font-bold lg:text-4xl">서비스내용</div>
      <div className="mt-4 flex flex-col gap-1 text-center text-lg text-slate-500 md:text-xl">
        <span>식사제공, 좌욕준비, 모유수유 원활하게 할 수 있도록 도와드립니다.</span>
        <span>분유수유, 아기목욕, 배꼽소독, 젖병세척 및 소독, 가정청소</span>
        <span>주방정리, 신생아 세탁물관리, 식재료장보기</span>
        <span>(추가서비스 : 등하원, 설거지, 빨래, 장난감정리, 손세수, 간식, 어린이집 식판 세척)</span>
        <span>(성인추가 : 점심식사, 반찬)</span>
      </div>
      <div className="mt-10 h-[1px] w-full bg-slate-300" />
      <div className="mt-6 w-full text-center text-2xl font-bold lg:text-4xl">실속형 5가지 서비스</div>
      <div className="mt-4 flex flex-col gap-1 text-center text-lg text-slate-500 md:text-xl">
        <span>신생아목욕, 신생아 젖병세척, 물품 위생관리, 아기 방청소, 신생아 세탁물 관리</span>
      </div>
    </div>
  );
};
