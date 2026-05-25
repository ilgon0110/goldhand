interface IRuleItem {
  number: string;
  contents: string;
}

interface IPolicyItem {
  number: string;
  title: string;
  contents: string;
}

export const ruleList: IRuleItem[] = [
  { number: 'I', contents: '출산 및 육아의 경험이 있는 신체 건강한 분' },
  { number: 'II', contents: '병원에서 건강검진을 받고 건강에 이상이 없는 분' },
  { number: 'III', contents: '산모, 신생아에 대한 전문적인 교육을 수료한 분' },
  { number: 'IV', contents: '성품과 용모가 단정한 분' },
  { number: 'V', contents: '산후관리에 필요한 다양하고 전문적인 프로그램 교육을 수강하신 분' },
  { number: 'VI', contents: '배상보험에 가입되어 있는 분' },
  { number: 'VII', contents: '아기의 안전과 산모의 회복을 최우선으로 하는 자세' },
];

export const policyList: IPolicyItem[] = [
  { number: '01', title: '산모와 신생아 건강', contents: '산모의 빠른 회복 및 신생아 건강관리에 최선을 다합니다.' },
  { number: '02', title: '청결과 단정함', contents: '청결과 단정한 차림을 항상 유지합니다.' },
  { number: '03', title: '의료 행위 금지', contents: '어떠한 경우에도 절대 의료 행위를 하지 않습니다.' },
  { number: '04', title: '근무시간 엄수', contents: '근무시간을 엄수합니다.' },
  {
    number: '05',
    title: '산모 존중과 사생활 보호',
    contents: '산모가 원하는 것을 먼저 살피고, 산모의 의견을 존중하며 사생활을 절대 누설하지 않습니다.',
  },
  {
    number: '06',
    title: '금품 수수 금지',
    contents: '규정된 이용요금 이외의 어떠한 금품 및 사례도 요구하지 않습니다.',
  },
  {
    number: '07',
    title: '내 가정처럼',
    contents: '산모 가정을 내 가정처럼 여기며, 행복한 생활을 유지할 수 있도록 세심한 주의를 기울입니다.',
  },
];
