# 접근성 개선 지표

## Lighthouse Accessibility 점수

| 페이지 | Before | After | 변화 |
|---|---|---|---|
| 홈 (`/`) | - | - | - |
| 예약 (`/reservation`) | - | - | - |
| 마이페이지 (`/mypage`) | - | - | - |

> 측정 기준: `yarn build && yarn start` 후 production 모드 / Lighthouse CLI

## ESLint 기반 지표

| 지표 | Before | After | 개선율 |
|---|---|---|---|
| ESLint a11y violations (총) | 35 | 23 | -34% |
| alt-text 누락 | 0 | 0 | - |
| control-has-associated-label 누락 | 12 | 0 | -100% |
| label-has-associated-control 누락 | 2 | 2 | 0% |
| no-noninteractive-element-interactions | 0 | 0 | - |
