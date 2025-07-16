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
        localStorage.setItem("username", username);
        if (password) localStorage.setItem("password", password);
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
        localStorage.setItem("username", username);
        if (password) localStorage.setItem("password", password);
      } catch (err) {
        throw err;
      }
    },
    async autoLogin() {
      const id = localStorage.getItem("uid");
      if (!id) return;
      this.uid = id;
      const name = localStorage.getItem("username");
      if (name) {
        this.username = name;
        return;
      }
      const api = useApiStore();
      try {
        const res = await api.get(`/user/${id}`);
        if (res.data && res.data.username) {
          this.username = res.data.username;
          localStorage.setItem("username", this.username);
        }
      } catch (err) {
        // ignore errors
      }
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
