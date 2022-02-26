import { verify } from '@/api/user';
import { useUserInfoStore } from '@/store/user';

const localStorageKey = '__isie_auth_token__';

export const isExist = () => window.localStorage.getItem(localStorageKey) !== null;

export const getToken = () => window.localStorage.getItem(localStorageKey);

export const setToken = (token: string) =>
  window.localStorage.setItem(localStorageKey, token || '');

export const removeToken = () => window.localStorage.removeItem(localStorageKey);

export const isAuthenticated = async () => {
  if (isExist()) {
    const { data }: any = await verify();
    const userInfoStore = useUserInfoStore();
    userInfoStore.initUserInfo(data);
    return data ?? false;
  } else {
    return false;
  }
};
