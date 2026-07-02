export const RENTAL_ITEMS = [
  {
    category: '모유 수유에 도움을 주는',
    name: '스펙트라 유축기',
    src: '/spectra_origin.jpg',
    alt: '스펙트라 유축기',
  },
  {
    category: '안전한 산후조리를 위한',
    name: '홈 카메라',
    src: '/webcam.jpg',
    alt: '홈 카메라',
  },
  {
    category: '산모의 회복을 도와주는',
    name: '스탠 좌욕기',
    src: '/stanseat.png',
    alt: '스탠 좌욕기',
  },
] as const;

export const RENTAL_NOTES = [
  { n: '01', text: '서비스 기간 동안 이용 가능하며, 택배로 배송해 드립니다.', tail: '' },
  { n: '02', text: '물품 대여를 희망하실 경우, 서비스 해당 지점으로 문의 바랍니다.', tail: '' },
  { n: '03', text: '대여 물품은 별도 구매가 불가능합니다.', tail: '' },
  { n: '04', text: '대여 이용 금액은 전액 무료입니다.', tail: '' },
] as const;
