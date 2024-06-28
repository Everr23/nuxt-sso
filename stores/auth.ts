import { defineStore } from "pinia";

export const useAuthStore = defineStore({
  id: "AuthStore",
  state: (): IAuthState => ({
    user: null,
    authData: null,
  }),
  actions: {
    update(userInfo: IUserInfo, authData: IAuthData) {
      this.user = userInfo;
      this.authData = authData;
    },
    async logout() {
      const { $signOut } = useNuxtApp();
      await $signOut();
    },
  },
});
