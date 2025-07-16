import { defineStore } from "pinia";
import { Notify } from "quasar";
import { useAuthStore } from "./authStore";
import { useApiStore } from "./apiStore";

export const useChatStore = defineStore("chat", {
  state: () => ({
    ws: null,
    connected: false,
    friends: [],
    requests: [],
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
          if (!this.requests.includes(data.from)) this.requests.push(data.from);
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
          const fids = res.data.friends || [];
          this.requests = res.data.requests || [];
          const infos = await Promise.all(
            fids.map(async (uid) => {
              try {
                const ures = await api.get(`/user/${uid}`);
                return { uid, name: ures.data.username };
              } catch (err) {
                return { uid, name: uid };
              }
            })
          );
          this.friends = infos;
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
    async acceptRequest(uid) {
      await this.acceptFriend(uid);
      this.requests = this.requests.filter((r) => r !== uid);
      if (!this.friends.some((f) => f.uid === uid)) {
        const api = useApiStore();
        try {
          const res = await api.get(`/user/${uid}`);
          this.friends.push({ uid, name: res.data.username });
        } catch (err) {
          this.friends.push({ uid, name: uid });
        }
      }
    },
    async declineRequest(friend_uid) {
      const auth = useAuthStore();
      const api = useApiStore();
      await api.post("/friend/decline", { uid: auth.uid, friend_uid });
      this.requests = this.requests.filter((r) => r !== friend_uid);
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
