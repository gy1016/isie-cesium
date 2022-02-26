import { defineStore } from 'pinia';
import { IUserInfo } from '#/user';

export const useUserInfoStore = defineStore('user', {
  state: () => {
    return {
      userInfo: {} as IUserInfo,
    };
  },
  getters: {},
  actions: {
    initUserInfo(userInfo: IUserInfo) {
      this.userInfo = userInfo;
    },
  },
});
