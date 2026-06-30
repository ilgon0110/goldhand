# 고운황금손 웹 프로젝트

> 산후도우미 서비스 "고운황금손" 웹 노후화 개편 프로젝트 입니다.

## Tech Stack

| Category      | Techs                                                                                                                                                                                                                                                                                                                                    |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework** | ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![TypeScript](https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=black) ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=Next.js&logoColor=white) |
| **DB**        | ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)                                                                                                                                                                                                                              |
| **Style**     | ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)                                                                                                                                                                                                                     |
| **Test**      | ![Vitest](https://img.shields.io/badge/Vitest-FCC72B?style=for-the-badge&logo=vitest&logoColor=white)                                                                                                                                                                                                                                    |
| **Deploy**    | ![AWS](https://img.shields.io/badge/AmazonAWS-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white)                                                                                                                                                                                                                                 |

## Deploy Link

### [nicegoldhand.com](https://nicegoldhand.com/)

## 아키텍처

Next.js App Router(`app/`)를 라우팅 전용으로 두고, 비즈니스 로직은 `src/` 하위 FSD 레이어로 분리했습니다.

| 레이어 | 역할 |
| --- | --- |
| `shared` | 전역 유틸·훅·UI 컴포넌트 |
| `entities` | 도메인 모델 (reservation, review, user 등) |
| `feature` | 단일 사용자 시나리오 단위 기능 (홈 캐러셀, 알림 등) |
| `widgets` | 여러 entity/feature를 조합한 페이지 블록 (header, editor, 후기 등) |

> FSD 표준의 `pages` 레이어는 Next.js App Router와의 충돌을 피하기 위해 사용하지 않고, 라우팅은 `app/`이 전담합니다.

## 주요 Feature

### OAuth 로그인 & 회원 관리

- **Naver / Kakao OAuth** 로그인 지원
- OAuth 통신 후 획득한 uid를 DB에 저장, 웹에서는 JWT로 발급한 후 쿠키에 저장
- 이후 Firebase Auth의 `verifyIdToken()` 메서드를 사용하여 JWT 인증 처리

### 예약 상담 (회원/비회원)

- 회원 : uid를 통해 회원 식별
- 비회원 : password를 입력 후 bcrypt로 암호화하여 DB 저장
- reCAPTCHA를 통해 비정상 클라이언트 접근 차단

### 후기 작성 기능

- Lexical 에디터 라이브러리 사용 — Paragraph·Node 기반의 직관적인 상태 관리 구조
- 이미지와 텍스트를 분리하여 DB에 저장, 각 `ImageNode`의 key로 Firebase Storage 이미지를 조회해 `src` 매핑

### 실시간 알림 수신

- Firebase Cloud Functions + SSE를 통한 실시간 알림 구현
- 놓친 알림은 DB에 저장하여 재접속 시 읽지 않은 알림만 식별 가능

## 개발 Point: SEO 최적화

- Next.js Metadata API로 페이지별 `title` / `description` / `canonical` / OG 태그 정적 설정
- `robots.ts`로 크롤러 접근 제어 — 비회원 데이터가 포함된 경로는 `disallow`, 공개 콘텐츠 경로만 `allow`로 명시적 분리
- `next/image`로 Firebase Storage 이미지 자동 최적화 — 표시 크기 기준 리사이즈 및 WebP 변환으로 불필요한 대역폭 제거
- 루트 layout에 `LocalBusiness` JSON-LD 구조화 데이터 삽입으로 리치 결과 노출 대응
