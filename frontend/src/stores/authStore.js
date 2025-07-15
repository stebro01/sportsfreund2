import { defineStore } from "pinia";
import { api } from "boot/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    uid: null,
    username: "",
  }),
  actions: {
    async register(username, password) {
      const res = await api.post("/register", { username, password });
      this.uid = res.data.uid;
      this.username = username;
      localStorage.setItem("uid", this.uid);
    },
    async login(username, password) {
      const res = await api.post("/login", { username, password });
      this.uid = res.data.uid;
      this.username = username;
      localStorage.setItem("uid", this.uid);
    },
    autoLogin() {
      const id = localStorage.getItem("uid");
      if (id) this.uid = id;
    },
    async sendFriendRequest(friend_uid) {
      await api.post("/friend/request", { uid: this.uid, friend_uid });
    },
    async acceptFriend(friend_uid) {
      await api.post("/friend/accept", { uid: this.uid, friend_uid });
    },
  },
});
