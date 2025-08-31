// zustand를 사용하는 타입들을 import하여 연결함

import type { TAliasAny } from '@/shared/types';

export type TStoreMutators = [['zustand/devtools', never], ['zustand/immer', never], ['zustand/persist', unknown]];

// zustand사용하는 Slice들을 And로 묶어서 export하는 타입
export type TBoundStore = TAliasAny;
