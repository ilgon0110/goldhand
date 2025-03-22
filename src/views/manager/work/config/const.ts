interface ICardInfo {
  title: string;
  iconSrc: string;
  contentList: string[];
}

export const MotherCardInfo: ICardInfo = {
  title: "산모 케어",
  iconSrc: "/icon/mother_green.png",
  contentList: [
    "산모 식사 준비(점심)",
    "좌욕실시 (자연분만시 1회)",
    "부종관리 유료(젖몸살, 복부)",
  ],
};

export const BabyCardInfo: ICardInfo = {
  title: "신생아 케어",
  iconSrc: "/icon/baby_green.png",
  contentList: [
    "체온관리, 황달체크",
    "목욕시키기, 귀저기체크, 배꼽관리",
    "모유 수유 지도 및 보조, 분유수유",
    "젖병, 살균 세척, 예방 접종 관리 (병원동행)",
  ],
};

export const StudentCardInfo: ICardInfo = {
  title: "큰아이 케어",
  iconSrc: "/icon/student_green.png",
  contentList: [
    "아이 식사/간식 준비",
    "의복 세탁",
    "어린이집/유치원/학교 등하교",
  ],
};

export const FamilyCardInfo: ICardInfo = {
  title: "기타(가족) 케어",
  iconSrc: "/icon/family_green.png",
  contentList: [
    "아빠 식사 준비, 간단한 집안 청소",
    "산모, 아기방, 주방 청소",
    "세탁, 장보기(근무시간 내)",
  ],
};
