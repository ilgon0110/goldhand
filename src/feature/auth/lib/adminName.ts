import type { z } from 'zod';

// 알림톡에서 관리자를 '관리자'로 표기하므로, 일반 사용자가 이름으로 관리자를 사칭하지 못하게 막는다.
// '고운황금손 관리자', '관 리 자'처럼 단어가 포함되기만 해도(공백·zero-width 문자 무시) 관리자 전용 이름으로 본다.
// ponytail: 유사 문자('괸리자', '관.리.자')는 못 막음, 필요해지면 정규화 테이블 추가
const ADMIN_NAME_KEYWORD = '관리자';

export const ADMIN_NAME_ERROR_MESSAGE = `'${ADMIN_NAME_KEYWORD}'가 포함된 이름은 사용할 수 없습니다.`;

export const isAdminOnlyName = (name: string) => name.replace(/[\s\u200B-\u200D\uFEFF]/g, '').includes(ADMIN_NAME_KEYWORD);

export const canUseName = (name: string, isAdmin: boolean) => isAdmin || !isAdminOnlyName(name);

// 폼 스키마에 `.superRefine(refineAdminOnlyName(isAdmin))`로 붙여 name 필드에 에러를 표시한다.
export const refineAdminOnlyName =
  (isAdmin: boolean) =>
  ({ name }: { name: string }, ctx: z.RefinementCtx) => {
    if (!canUseName(name, isAdmin)) {
      ctx.addIssue({ code: 'custom', path: ['name'], message: ADMIN_NAME_ERROR_MESSAGE });
    }
  };
