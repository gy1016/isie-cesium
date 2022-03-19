import { verify } from '@/api/user';
import { useUserInfoStore } from '@/store/user';
import { to } from '@/utils/index';

const localStorageKey = '__isie_auth_token__';

export const isExist = () => window.localStorage.getItem(localStorageKey) !== null;

export const getToken = () => window.localStorage.getItem(localStorageKey);

export const setToken = (token: string) =>
  window.localStorage.setItem(localStorageKey, token || '');

export const removeToken = () => window.localStorage.removeItem(localStorageKey);

export const isAuthenticated = async () => {
  if (isExist()) {
    const [resErr, res] = await to(verify());
    if (resErr) {
      return false;
    } else {
      const { data }: any = res;
      const userInfoStore = useUserInfoStore();
      userInfoStore.initUserInfo(data);
      return data;
    }
  } else {
    return false;
  }
};
