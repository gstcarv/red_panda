import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { LoginResponse } from '@/api/auth-api';
import { queryClient } from '@/lib/react-query';

export const AUTH_STORAGE_KEY = 'auth-storage';

type AuthData = Pick<LoginResponse, 'token' | 'expiresIn' | 'email' | 'userId'>;

export type AuthStore = AuthData & {
  setAuth: (auth: AuthData) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
};

const EMPTY_AUTH: AuthData = {
  token: '',
  expiresIn: 0,
  email: '',
  userId: 0,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...EMPTY_AUTH,
      setAuth: (auth) => set(auth),
      logout: () => {
        set(EMPTY_AUTH);
        queryClient.clear();
      },
      isAuthenticated: () => Boolean(get().token && get().userId),
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ token, expiresIn, email, userId }) => ({
        token,
        expiresIn,
        email,
        userId,
      }),
    },
  ),
);
