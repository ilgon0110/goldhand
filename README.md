# 고운황금손

> 산후도우미 서비스 **고운황금손**의 대리점인 수원&amp;용인점 공식 웹사이트입니다.

![Website](https://img.shields.io/badge/Website-nicegoldhand.com-9B7A35?style=flat-square)
![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github)

## 접속 링크

- 운영 서비스: [https://nicegoldhand.com](https://nicegoldhand.com/)
- GitHub 저장소: [https://github.com/ilgon0110/goldhand](https://github.com/ilgon0110/goldhand)

## Tech Stack


| 영역                 | 기술                                                                  |
| ------------------ | ------------------------------------------------------------------- |
| Frontend           | Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Radix UI |
| State &amp; Data   | TanStack Query, Zustand, React Hook Form, Zod                       |
| Editor &amp; Media | Lexical, Firebase Storage, Sharp, Next/Image                        |
| Auth &amp; Backend | Firebase Auth, Firebase Admin SDK, Firestore, Cloud Functions       |
| Test               | Vitest, Testing Library, MSW                                        |
| Infra              | Docker, Docker Compose, Nginx, GitHub Actions, AWS EC2              |


## 주요 기능

- 서비스 소개, 지점 안내, 이용요금 및 정부지원 바우처 정보 제공
- 네이버·카카오 OAuth 로그인과 회원가입, 탈퇴 및 재가입
- 회원·비회원 예약 상담 신청과 비밀글 조회·수정·삭제
- Lexical Rich Editor를 사용한 회원·비회원 이용후기 작성
- 본인과 연관된 이벤트를 한눈에 확인할 수 있는 알람 패널 및 바로가기
- 관리자는 예약상담/이용후기/소식 게시글·댓글이 새롭게 달리거나, 기존 게시글을 수정하거나, 댓글이 달릴 때마다 카카오톡 알림 발송
- 회원은 본인이 작성한 게시글에 댓글이 달릴 때만 카카오톡 알림 발송
- 산후관리사 소개, 업무 안내와 비회원 지원서 접수
- 마이페이지와 관리자 전용 사용자·콘텐츠 관리

## Tech Points

### 1. 브라우저 토큰 의존성을 제거한 서버 중심 인증

- Firebase ID Token을 여러 클라이언트 흐름에서 직접 다루던 구조를 **HttpOnly Session Cookie** 기반으로 전환했습니다.
- Route Handler에서 `verifySessionCookie()`로 사용자를 식별하며, 요청 본문의 `userId`를 신뢰하지 않고 검증된 세션의 `uid`를 권한 판단의 기준으로 사용합니다.
- 관리자 권한이 필요한 요청은 세션 폐기 여부까지 검사합니다. 일반 사용자 요청에는 불필요한 원격 검사를 생략해 보안과 요청 비용 사이의 균형을 맞췄습니다.
- 마이페이지와 관리자 경로는 Middleware의 1차 리디렉션과 Server Component의 2차 검증으로 보호합니다.

### 2. OAuth와 데이터 접근 경계 강화

- 네이버·카카오 로그인을 내부 start route에서 시작하고, 암호학적으로 생성한 일회성 `state`를 HttpOnly 쿠키에 저장해 콜백에서 비교함으로써 **Login CSRF**를 방어합니다.
- 후기·상담·사용자 관련 API를 Firebase Client SDK에서 **Admin SDK 기반 서버 접근**으로 전환했습니다. Firestore를 클라이언트에 직접 개방하지 않고 애플리케이션 계층에서 인증·인가·응답 필터링을 수행할 수 있습니다.
- 공개 목록과 상세 응답에서는 전화번호 등 개인정보를 서버에서 마스킹하고, 비밀 상담 데이터가 비인가 조회 응답에 포함되지 않도록 분리했습니다.

### 3. 회원과 비회원이 공존하는 소유권 검증

- 회원 요청은 세션의 `uid`, 비회원 예약은 `bcrypt`로 해시한 비밀번호, 비회원 후기는 SMS 인증 결과를 기준으로 소유권을 검증합니다.
- 비회원 후기 작성·수정·삭제와 관리자 모더레이션을 지원하면서도 공개 조회에서는 PII를 노출하지 않습니다.
- 회원/비회원별 로직과 공통 저장 로직을 분리하고, 상세 페이지의 데이터 처리·권한 판별·UI 책임을 나눠 복잡한 분기와 회귀 가능성을 낮췄습니다.

### 4. 검색엔진이 실제 콘텐츠를 읽는 SSR·SEO 설계

- 공개 목록의 TanStack Query 캐시를 서버에서 prefetch한 뒤 `HydrationBoundary`로 전달해 사용자 경험과 서버 렌더링을 함께 가져갑니다.
- 홈·후기·소식의 주요 콘텐츠가 JavaScript 실행 전 HTML에도 존재하도록 SSR 회귀를 수정했습니다.
- 페이지별 Metadata, canonical, Open Graph, sitemap, robots를 구성하고 `WebSite`와 `LocalBusiness` JSON-LD를 `@id`로 연결했습니다.
- 비공개 경로는 `noindex` 처리하고, 운영 빌드 응답을 검사하는 `verify:seo` 스크립트로 canonical·robots·sitemap·구조화 데이터·SSR 결과를 회귀 테스트합니다.

### 5. 실시간 알림과 서버 상태의 일관성

- Firebase Cloud Functions으로 예약·댓글 관련 알림을 실시간 전달합니다.
- 스트림 연결과 알림 조회·확인 API에도 동일한 Session Cookie 인증을 적용했습니다.

### 6. 이미지·렌더링·번들 성능 개선

- 업로드 전에 이미지를 리사이즈·압축하고 별도 썸네일을 생성해 저장·전송 비용을 줄였습니다. 측정 당시 썸네일 기준 이미지 용량을 약 **99% 절감**했습니다.
- `next/image`, 반응형 크기 지정과 핵심 홈 캐러셀 이미지 preload를 적용해 이미지 로딩 우선순위를 조정했습니다.
- 불필요한 Client Component와 중복 FSD view 계층을 제거하고 RSC 경계를 재설계해 측정 당시 클라이언트 번들을 약 **44% 축소**했습니다.
- 후기·소식 페이지의 LCP는 Chrome DevTools 측정 기준 약 **70% 단축**했습니다.

### 7. 실패를 전제로 한 배포와 회귀 테스트

- Next.js standalone multi-stage Docker 이미지와 non-root 실행 환경으로 런타임 이미지를 구성했습니다.
- GitHub Actions에서 이미지를 빌드·배포하고, EC2의 Nginx가 Next.js 컨테이너를 reverse proxy합니다.
- `/api/health` 상태가 제한 시간 안에 정상화되지 않으면 배포 스크립트가 직전 이미지 태그로 **자동 롤백**합니다.
- Vitest, Testing Library, MSW로 인증·API·UI·SEO 회귀를 검증합니다.

### 8. App Router와 FSD를 조합한 책임 분리

Next.js App Router의 `app/`은 라우팅, layout, Route Handler와 서버 조합을 담당하고 비즈니스 코드는 `src/` 아래에 배치했습니다. FSD의 `pages` 레이어는 App Router와 책임이 겹쳐 제거했습니다.


| 레이어            | 역할                                             |
| -------------- | ---------------------------------------------- |
| `app`          | 라우팅, metadata, 서버 데이터 prefetch, API 진입점        |
| `src/shared`   | 전역 설정, 서버 인증, 공통 유틸과 UI                        |
| `src/entities` | user, reservation, review, event 등 도메인 모델과 API |
| `src/feature`  | 상세 댓글·삭제, 홈 화면 등 사용자 시나리오                      |
| `src/widgets`  | 에디터, 헤더처럼 여러 도메인을 조합한 UI 블록                    |


## 성과 지표


| 영역         | 결과                                                   | 확인 방법                        |
| ---------- | ---------------------------------------------------- | ---------------------------- |
| 이미지        | 썸네일 기준 용량 약 99% 감소                                   | 이미지 최적화 전후 산출물 비교            |
| LCP        | 후기·소식 페이지 약 70% 단축                                   | Chrome DevTools 측정           |
| 번들         | 클라이언트 번들 약 44% 감소                                    | `ANALYZE=true yarn build` 비교 |
| Lighthouse | 주요 페이지 Performance 95, SEO 100, Accessibility 94~100 | Lighthouse 및 접근성 점검          |
| 배포 복구      | 헬스체크 실패 시 직전 이미지 자동 롤백                               | 배포 스크립트와 컨테이너 health-check   |


> 성능 수치는 각 개선 시점의 동일 페이지 전후 측정값이며 네트워크와 실행 환경에 따라 달라질 수 있습니다.

