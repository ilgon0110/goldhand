import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import type { TBoundStore, TStoreMutators } from '@/shared/lib/zustand';
import { createSelectors } from '@/shared/lib/zustand';

const useBoundStore = create<TBoundStore, TStoreMutators>(
  devtools(
    immer(
      persist(
        (..._a) => ({
          // ...Slice(...a)
          // ex) ...useSlice(...a)
        }),
        {
          name: 'store',
          // pesist로 저장할 state filter
          // ex) partialize: state => ({ user: state.user })
        },
      ),
    ),
    {
      name: 'store',
      enabled: process.env.NEXT_PUBLIC_ENVIRONMENT === 'development',
    },
  ),
);

export default createSelectors(useBoundStore);
