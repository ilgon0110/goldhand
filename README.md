# 고운황금손 웹 프로젝트

> 산후도우미 서비스 "고운황금손" 웹 리뉴얼 프로젝트 입니다.

## ⚙️ Tech Stack

| Category      | Techs                                                                                                                                                                                                                                                                                                                                    |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework** | ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![TypeScript](https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=black) ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=Next.js&logoColor=white) |
| **DB**        | ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)                                                                                                                                                                                                                              |
| **Style**     | ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)                                                                                                                                                                                                                     |
| **Test**      | ![Vitest](https://img.shields.io/badge/Vitest-FCC72B?style=for-the-badge&logo=vitest&logoColor=white)                                                                                                                                                                                                                                    |
| **Deploy**    | ![AWS](https://img.shields.io/badge/AmazonAWS-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white)                                                                                                                                                                                                                                 |

## Deploy Link

### [MAIN](https://nicegoldhand.com/)

### [BACKUP](https://goldhand.vercel.app/)

```
WARN : Backup deploy의 경우 Cold Start 존재
```

## 폴더구조

- FSD 아키텍처 사용
- Next.js app directory와의 충돌 방지를 위해 `pages` -> `views`로 폴더 이름 변경

```
📂__test__
📂app
 ┣ 📂api
 ┣ 📂company
 ┣ 📂fonts
 ┣ 📂franchisee
 ┣ 📂login
 ┣ 📂manager
 ┣ 📂mypage
 ┣ 📂price
 ┣ 📂rental
 ┣ 📂reservation
 ┣ 📂review
 ┣ 📂signup
 ┣ 📂voucher
 ┣ 📜error.tsx
 ┣ 📜globals.css
 ┣ 📜layout.tsx
 ┗ 📜page.tsx
📂src
 ┣ 📂__mock__
 ┣ 📂app
 ┣ 📂entities
 ┣ 📂shared
 ┣ 📂views //app의 폴더 구조와 동일. FSD에서 pages 계층 담당
 ┗ 📂widgets
```

## 주요 Feature

### 🔑 OAuth 로그인 & 회원 관리

- **Naver / Kakao OAuth** 로그인 지원
- OAuth 통신 후 획득한 uid를 DB에 저장, 웹에서는 jwt로 발급한 후 쿠키에 저장
- 이후 FireAuth의 `verifyIdToken()` 메서드를 사용하여 jwt인증처리

### 📌 예약 상담 (회원/비회원)

- 회원 : uid를 통해 회원 식별
- 비회원 : password를 입력 후 bcrypt로 암호화하여 DB 저장
- recaptcha를 통해 비정상 클라이언트 접근 차단

### 📝 후기 작성 기능

- Lexcial 라이브러리 사용
- 사용이유
  - 라이브러리 핵심 코드를 프로젝트에 import하여 변형 가능
  - Paragraph, Node로 이루어진 직관적인 Editor 상태관리 아키텍처
- 작성된 후기는 이미지와 텍스트를 분리하여 DB에 저장 후, 각 `ImageNode`의 key를 이용해 FireStore에서 알맞은 이미지를 찾아 `<img>` tag에 src 매핑

## ⚡ 개발 Point: 성능 최적화

Server Component에서 Data Fetching 후,

```
<Suspense fallback={<LoadingSpinnerWithOverlay />}>
    <ClientComponent data={data} />
</Suspense>
```

형태로 data를 전달하는 구조 적극 사용

- 데이터 호출에서 발생하는 네트워크 지연 최소화 및 isLoading상태 로직 분리

**체감 성능**

- 네트워크 호출 작업 같은 어쩔 수 없는 지연에는 `useTransition` 훅을 사용하여 사용자에게 현재 로딩 상태 노출
- Ex)후기 업로드 시, 각 이미지 업로드 progress bar 및 최종 업로드 상태를 Modal로 노출하여 사용자 경험 향상

## 🛠 개선해야할 점

### **FSD 아키텍처 적용 미숙**

- Widget과 Feature계층 분리 없이 Widget계층에 컴포넌트 과부화
- Widget의 컴포넌트들의 추상화 레벨이 다른 문제

### **후기 저장 방식 개선 필요**

- 현재는 Lexical Editor 상태를 string으로 변환하여 저장
- 데이터가 커질수록 긴 HTML string이 DB에 저장되는 문제

### **테스트 커버리지 확대**

- Vitest를 통해 주요 비즈니스 로직 단위 테스트 완료
- Playwright를 도입하여 통합 테스트 구축 필요

## 📚 학습 포인트

1. React Server Component를 활용한 초기 렌더링 최적화 경험

2. Lexical Editor 커스터마이징 및 DB 구조 설계

3. OAuth → JWT → Firebase 인증 플로우 구현

4. 성능 최적화(UX 관점 + 렌더링 관점)를 프로젝트 전반에 적용

5. Github Action을 통한 무중단 배포 파이프라인 구축
