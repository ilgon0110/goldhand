import type { StoreApi, UseBoundStore } from 'zustand';

import type { TAliasAny } from '@/src/shared/types';

type TState = object;

type TWithSelectors<S> = S extends { getState: () => infer T } ? S & { use: { [K in keyof T]: () => T[K] } } : never;

// @see https://zustand.docs.pmnd.rs/guides/auto-generating-selectors#auto-generating-selectors
export const createSelectors = <S extends UseBoundStore<StoreApi<TState>>>(_store: S) => {
  const store = _store as TWithSelectors<typeof _store>;
  store.use = {};
  for (const k of Object.keys(store.getState())) {
    (store.use as TAliasAny)[k] = () => store(s => s[k as keyof typeof s]);
  }

  return store;
};

export default createSelectors;
