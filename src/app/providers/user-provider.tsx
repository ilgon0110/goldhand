import { createContext } from 'react';

const defaultValue = {
  user: null,
  setUser: (user: any) => {},
  isLogin: false,
  setIsLogin: (isLogin: boolean) => {},
};

export const userProvider = createContext(defaultValue);
