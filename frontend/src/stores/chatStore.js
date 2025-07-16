import { defineStore } from "pinia";
import { Notify } from "quasar";
import { useAuthStore } from "./authStore";
import { useApiStore } from "./apiStore";

export const useChatStore = defineStore("chat", {
  state: () => ({
    ws: null,
    connected: false,
    friends: [],
    friend: "",
    histories: {},
    messages: [],
  }),
  actions: {
    openSocket() {
      const auth = useAuthStore();
      this.ws = new WebSocket(`ws://localhost:8000/ws/${auth.uid}`);
      this.ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.event === "chat_request") {
          if (!this.friends.includes(data.from)) this.friends.push(data.from);
          Notify.create({
            type: "info",
            message: `Chat request from ${data.from}`,
          });
          return;
        }
        const msg = { from: data.from, text: data.message, time: Date.now() };
        if (!this.histories[data.from]) this.histories[data.from] = [];
        this.histories[data.from].push(msg);
        if (this.friend === data.from) this.messages.push(msg);
      };
      this.ws.onopen = () => {
        this.connected = true;
      };
      this.ws.onerror = () => {
        Notify.create({ type: "negative", message: "WebSocket error" });
      };
      this.ws.onclose = (e) => {
        this.connected = false;
        Notify.create({
          type: "negative",
          message: e.reason || "Connection closed",
        });
      };
    },
    async connect() {
      const auth = useAuthStore();
      const api = useApiStore();
      await auth.autoLogin();
      api.init && api.init();
      if (auth.uid) {
        this.openSocket();
        try {
          const res = await api.get(`/user/${auth.uid}`);
          this.friends = res.data.friends || [];
        } catch (err) {
          // ignore
        }
      }
    },
    async fetchHistory(fid) {
      const auth = useAuthStore();
      const api = useApiStore();
      try {
        const res = await api.get(`/messages/${auth.uid}/${fid}`);
        this.histories[fid] = res.data || [];
        if (this.friend === fid) this.messages = this.histories[fid];
      } catch (err) {
        this.histories[fid] = [];
      }
    },
    async sendFriendRequest(friend_uid) {
      const auth = useAuthStore();
      const api = useApiStore();
      await api.post("/friend/request", { uid: auth.uid, friend_uid });
    },
    async acceptFriend(friend_uid) {
      const auth = useAuthStore();
      const api = useApiStore();
      await api.post("/friend/accept", { uid: auth.uid, friend_uid });
    },
    send(msg) {
      const auth = useAuthStore();
      if (!this.ws || !this.friend) return;
      this.ws.send(JSON.stringify({ to: this.friend, message: msg }));
      const selfMsg = { from: auth.uid, text: msg, time: Date.now() };
      if (!this.histories[this.friend]) this.histories[this.friend] = [];
      this.histories[this.friend].push(selfMsg);
      this.messages.push(selfMsg);
    },
  },
});
