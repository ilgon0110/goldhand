import type { IReservationDetailData } from '@/src/shared/types';

interface IConsultData extends IReservationDetailData {
  id: string;
}

interface IReservationListPageProps {
  message: string;
  consultData: IConsultData[] | null;
  totalDataLength: number;
}

export const mockReservationListData: IReservationListPageProps = {
  message: 'ok',
  consultData: [
    {
      id: '890bdef9-2720-4924-b630-2c8f3803e4d5',
      createdAt: {
        seconds: 1753970558,
        nanoseconds: 95000000,
      },
      bornDate: '2025-06-30T15:00:00.000Z',
      userId: null,
      secret: true,
      location: '호호',
      franchisee: '전체',
      name: '김일곤',
      title: '야야',
      password: '$2b$10$AaydXekUzDbVL0yi5XDW3.ARVyThtlNTcBtywAHu4RjtAGndS9Vp2',
      content: '도메인샀습니다',
      phoneNumber: '01055362578',
      updatedAt: {
        seconds: 1753970558,
        nanoseconds: 95000000,
      },
    },
    {
      id: '7fabf408-8b79-42b5-a91c-a1eefb532a01',
      bornDate: '2025-07-02T15:00:00.000Z',
      name: '김일곤',
      createdAt: {
        seconds: 1753957744,
        nanoseconds: 372000000,
      },
      updatedAt: {
        seconds: 1753957744,
        nanoseconds: 372000000,
      },
      title: '도메인 테스트',
      userId: '12321ㅇㄴㄹㅁㄴㄹㅁ',
      secret: false,
      phoneNumber: '01055362578',
      password: null,
      location: 'ㅇㄹㅁㄴㄹ',
      franchisee: '화성동탄점',
      content: '도메인 구매 후 운영계 테스트',
    },
    {
      id: 'df8bc75d-2117-41b1-af40-6b9579e77598',
      franchisee: '전체',
      content: 'ㅇㄹㅁㄴㅇㄹㅁㄴ',
      userId: null,
      bornDate: null,
      title: '1231',
      name: 'ㅇㄹㅁㅇㄹ',
      location: '231231',
      updatedAt: {
        seconds: 1752670537,
        nanoseconds: 412000000,
      },
      createdAt: {
        seconds: 1752670537,
        nanoseconds: 412000000,
      },
      phoneNumber: '01012345678',
      secret: true,
      password: '$2b$10$KyHOL0EH4NCS0eYLINEwzuDpy7hKQC8zL2rjjJ1/kHY99oqJZ4vfi',
    },
    {
      id: '9b77ed99-ec6b-491e-89dd-cab49beb3615',
      bornDate: '2025-07-29T15:00:00.000Z',
      secret: true,
      password: '$2b$10$ok1op8H/em.2zIy93NF3k.jHOSbG1QP08WwUyMTBC5C1NOYIldoki',
      location: 'ㄹㅁㅇㄴㄹ',
      phoneNumber: '0101234566',
      content: 'ㅇㄹㅁㄴㄹㅁㅇㄴ',
      userId: null,
      franchisee: '화성동탄점',
      updatedAt: {
        seconds: 1752669918,
        nanoseconds: 182000000,
      },
      title: 'ㅇㄹㅁ',
      createdAt: {
        seconds: 1752669918,
        nanoseconds: 182000000,
      },
      name: '자임',
    },
    {
      id: 'f81b29a6-59f0-4cd9-b43a-ca330a7827d9',
      bornDate: null,
      userId: null,
      createdAt: {
        seconds: 1752669562,
        nanoseconds: 643000000,
      },
      phoneNumber: '01012345678',
      updatedAt: {
        seconds: 1752669562,
        nanoseconds: 643000000,
      },
      franchisee: '전체',
      title: '나는카카오',
      password: '$2b$10$9MOera9lz9IGoMy4TgG3kOuQ/oA6NA/T3sqgzIFQ5cQfrzx7M0tHm',
      name: '마이네임',
      content: '회원가입은 아직안했지',
      location: '지만',
      secret: false,
    },
    {
      id: 'f60ebfca-3511-4e76-8665-7fb216ba647b',
      phoneNumber: '01012345678',
      location: 'ㄹㅇㄹㅇ',
      password: '$2b$10$t5mmbyMQIv04.bvJYumqKuSdFw7iQo3EW3pHnZMzRXiv39dkZQKdG',
      updatedAt: {
        seconds: 1752666021,
        nanoseconds: 56000000,
      },
      secret: true,
      createdAt: {
        seconds: 1752666021,
        nanoseconds: 56000000,
      },
      name: '나는회원',
      title: '회원이지만 아직 회원가입안한',
      bornDate: '2025-07-01T15:00:00.000Z',
      franchisee: '전체',
      userId: null,
      content: '비회원으로 글 써지는지 테스트',
    },
    {
      id: 'ab9e8ea8-59cc-4578-9caa-a093c1a9684e',
      userId: 'GdoJvrgrhFNrxpSP4NM3ux77D7T2',
      content: '식',
      password: null,
      location: '준',
      bornDate: '2025-07-09T15:00:00.000Z',
      secret: true,
      name: '김일곤',
      updatedAt: {
        seconds: 1752662181,
        nanoseconds: 734000000,
      },
      createdAt: {
        seconds: 1752662181,
        nanoseconds: 734000000,
      },
      title: '엄',
      franchisee: '전체',
      phoneNumber: '01055362578',
    },
    {
      id: '954e4c99-674a-45fb-a870-499bfe20da09',
      userId: '1ㅇㄹㅁㅍㅋㅇㄹㄱㄷ',
      location: 'ㄹㅇㄹㅇㄹㅇㅇ',
      password: null,
      phoneNumber: '01055362578',
      title: 'ㅇㄹㅇ',
      content: 'ㄹㅇㄹㅇㄹㅇㄹㅇ',
      bornDate: '2025-07-08T15:00:00.000Z',
      name: '김일곤',
      franchisee: '전체',
      secret: true,
      updatedAt: {
        seconds: 1751802487,
        nanoseconds: 813000000,
      },
      createdAt: {
        seconds: 1751802487,
        nanoseconds: 813000000,
      },
    },
    {
      id: '70259978-b3e9-45d3-bbda-414612239e31',
      bornDate: '2025-07-23T15:00:00.000Z',
      title: '상담신청',
      phoneNumber: '01055362578',
      location: '인계동',
      secret: true,
      franchisee: '수원점',
      password: null,
      content: '응애 애기가 태어났어용\n수정했어용 한번 더 수정헀어용 한번더..',
      name: '김일곤',
      userId: '1ㅌㅊㅍㅌㄹㄹㄱ2',
      createdAt: {
        seconds: 1751545750,
        nanoseconds: 883000000,
      },
      updatedAt: {
        seconds: 1751547105,
        nanoseconds: 542000000,
      },
    },
    {
      id: '756aa24b-80db-48b8-aaae-8ccd0b744b34',
      phoneNumber: '01055362578',
      secret: true,
      location: '인계동',
      createdAt: {
        seconds: 1751457946,
        nanoseconds: 789000000,
      },
      franchisee: '수원점',
      userId: null,
      bornDate: '2025-07-23T15:00:00.000Z',
      title: '상담신청',
      content: '응애 애기가 태어났어용 수수정 tntnwjd=수정',
      updatedAt: {
        seconds: 1751547137,
        nanoseconds: 139000000,
      },
      password: '$2b$10$qKNmNDulHx4xZhs4rRZjnOK3CgyrK8HcZ.n5Kaidbdbe9F8IwSP3.',
      name: '김일곤',
    },
  ],
  totalDataLength: 19,
};
