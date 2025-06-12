import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  naverUserId: string | null;
  hydrated: boolean;
  setAccessToken: (token: string | null) => void;
  setNaverUserId: (naverUserId: string | null) => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>(set => ({
  accessToken: null,
  naverUserId: null,
  hydrated: false,
  setAccessToken: token => set({ accessToken: token }),
  setNaverUserId: naverUserId => set({ naverUserId: naverUserId }),
  setHydrated: hydrated => set({ hydrated: hydrated }),
}));
