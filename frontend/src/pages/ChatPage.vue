<template>
  <q-page class="column items-center q-pa-md">
    <chat-invite class="q-mb-md" @added="onInvite" />
    <chat-list v-model="friend" :friends="friends" />
    <chat-window
      v-if="connected && friend"
      class="q-mt-md"
      :friend="friend"
      :messages="messages"
      @send="send"
    />
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { useQuasar } from "quasar";
import { useAuthStore } from "stores/authStore";
import { useApiStore } from "stores/apiStore";
import ChatInvite from "components/ChatInvite.vue";
import ChatList from "components/ChatList.vue";
import ChatWindow from "components/ChatWindow.vue";

const store = useAuthStore();
const api = useApiStore();
const $q = useQuasar();
const friend = ref("");
const friends = ref([]);
const messages = ref([]);
const histories = reactive({});
const connected = ref(false);
let ws;

const openSocket = () => {
  ws = new WebSocket(`ws://localhost:8000/ws/${store.uid}`);
  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.event === "chat_request") {
      if (!friends.value.includes(data.from)) friends.value.push(data.from);
      $q.notify({ type: "info", message: `Chat request from ${data.from}` });
      return;
    }
    const msg = { from: data.from, text: data.message, time: Date.now() };
    if (!histories[data.from]) histories[data.from] = [];
    histories[data.from].push(msg);
    if (friend.value === data.from) messages.value.push(msg);
  };
  ws.onopen = () => {
    connected.value = true;
  };
  ws.onerror = () => {
    $q.notify({ type: "negative", message: "WebSocket error" });
  };
  ws.onclose = (e) => {
    connected.value = false;
    $q.notify({ type: "negative", message: e.reason || "Connection closed" });
  };
};

onMounted(async () => {
  await store.autoLogin();
  api.init && api.init();
  if (store.uid) {
    openSocket();
    try {
      const res = await api.get(`/user/${store.uid}`);
      friends.value = res.data.friends || [];
    } catch (err) {
      // ignore
    }
  }
});

const loadHistory = async (fid) => {
  try {
    const res = await api.get(`/messages/${store.uid}/${fid}`);
    histories[fid] = res.data || [];
    messages.value = histories[fid];
  } catch (err) {
    histories[fid] = [];
  }
};

watch(friend, (val) => {
  if (val) loadHistory(val);
});

const send = (msg) => {
  if (!ws || !friend.value) return;
  ws.send(JSON.stringify({ to: friend.value, message: msg }));
  const selfMsg = { from: store.uid, text: msg, time: Date.now() };
  if (!histories[friend.value]) histories[friend.value] = [];
  histories[friend.value].push(selfMsg);
  messages.value.push(selfMsg);
};

const onInvite = async (uid) => {
  if (!friends.value.includes(uid)) friends.value.push(uid);
  friend.value = uid;
  await loadHistory(uid);
};
</script>
