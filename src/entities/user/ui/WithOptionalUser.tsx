'use client';

import type { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { useUserSuspenseQuery } from '../api/useUserQuery';
import type { IUserDetailData } from '../model/types';

type TWithOptionalUserProps = { children: (user: IUserDetailData | null) => ReactNode };

const ReadUser = ({ children }: TWithOptionalUserProps) => <>{children(useUserSuspenseQuery().data.userData)}</>;

// user가 본문에 부가 정보(관리자·작성자 버튼, 댓글 작성 가능 여부)뿐인 page용.
// user 조회가 실패해도 page를 app/error.tsx로 바꾸지 않고 비로그인 모양으로 렌더한다.
// 본문 쿼리의 에러도 이 경계에 잡히지만, fallback이 같은 본문을 다시 렌더하며 다시 throw하므로 app/error.tsx로 올라간다.
export const WithOptionalUser = ({ children }: TWithOptionalUserProps) => (
  <ErrorBoundary fallbackRender={() => children(null)}>
    <ReadUser>{children}</ReadUser>
  </ErrorBoundary>
);
