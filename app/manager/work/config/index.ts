import type { IconType } from 'react-icons';
import { PiBaby, PiHandHeart, PiStudent, PiUsersThree } from 'react-icons/pi';

interface ICareArea {
  title: string;
  icon: IconType;
  /** 산모·신생아 돌봄은 주 업무, 그 외는 지원 업무 */
  primary: boolean;
  contentList: string[];
  note?: string;
}

export const CARE_AREAS: ICareArea[] = [
  {
    title: '산모 케어',
    icon: PiHandHeart,
    primary: true,
    contentList: ['산모 식사 준비(점심)', '좌욕실시 (자연분만시 1회)', '부종관리(젖몸살, 복부)'],
    note: '부종 관리는 유료 항목입니다.',
  },
  {
    title: '신생아 케어',
    icon: PiBaby,
    primary: true,
    contentList: [
      '체온관리, 황달체크',
      '목욕시키기, 기저귀체크, 배꼽관리',
      '모유 수유 지도 및 보조, 분유수유',
      '젖병 살균 세척, 예방 접종 관리 (병원동행)',
    ],
  },
  {
    title: '큰아이 케어',
    icon: PiStudent,
    primary: false,
    contentList: ['아이 식사/간식 준비', '의복 세탁', '어린이집/유치원/학교 등하교'],
  },
  {
    title: '기타(가족) 케어',
    icon: PiUsersThree,
    primary: false,
    contentList: ['아빠 식사 준비, 간단한 집안 청소', '산모, 아기방, 주방 청소', '세탁, 장보기(근무시간 내)'],
  },
];
