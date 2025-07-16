import { defineStore } from "pinia";
import { useApiStore } from "stores/apiStore";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    uid: null,
    username: "",
  }),
  actions: {
    async register(username, password) {
      const api = useApiStore();
      try {
        const res = await api.post("/register", { username, password });
        this.uid = res.data.uid;
        this.username = username;
        localStorage.setItem("uid", this.uid);
      } catch (err) {
        throw err;
      }
    },
    async login(username, password) {
      const api = useApiStore();
      try {
        const res = await api.post("/login", { username, password });
        this.uid = res.data.uid;
        this.username = username;
        localStorage.setItem("uid", this.uid);
      } catch (err) {
        throw err;
      }
    },
    autoLogin() {
      const id = localStorage.getItem("uid");
      if (id) this.uid = id;
    },
    async sendFriendRequest(friend_uid) {
      const api = useApiStore();
      await api.post("/friend/request", { uid: this.uid, friend_uid });
    },
    async acceptFriend(friend_uid) {
      const api = useApiStore();
      await api.post("/friend/accept", { uid: this.uid, friend_uid });
    },
  },
});
