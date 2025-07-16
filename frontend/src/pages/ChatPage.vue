<template>
  <q-page class="column items-center q-pa-md">
    <div class="column q-gutter-sm items-center" style="max-width: 300px">
      <q-select
        v-model="friend"
        :options="friends"
        label="Friend UID"
        input-class="text-white"
        label-color="grey-7"
      />
      <q-btn label="Open Chat" color="primary" @click="connect" />
    </div>
    <div class="q-mt-md" v-if="connected && friend">
      <div
        class="q-pa-sm"
        style="height: 200px; overflow: auto; border: 1px solid #ccc"
      >
        <div v-for="m in messages" :key="m.time" class="text-white">
          <span class="text-bold">{{ m.from }}</span
          >: {{ m.text }}
        </div>
      </div>
      <div class="row q-gutter-sm q-mt-sm">
        <q-form @submit="send" class="row q-gutter-sm">
          <q-input
            v-model="text"
            label="Message"
            input-class="text-white"
            label-color="grey-7"
          />
          <q-btn icon="send" type="submit" color="primary" />
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { useQuasar } from "quasar";
import { useAuthStore } from "stores/authStore";
import { useApiStore } from "stores/apiStore";

const store = useAuthStore();
const api = useApiStore();
const $q = useQuasar();
const friend = ref("");
const friends = ref([]);
const text = ref("");
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

const connect = async () => {
  if (!friend.value) return;
  try {
    await store.sendFriendRequest(friend.value);
    await store.acceptFriend(friend.value);
  } catch (err) {
    const msg = err.response?.data?.detail || err.message;
    $q.notify({ type: "negative", message: msg });
    return;
  }
  await loadHistory(friend.value);
};

watch(friend, (val) => {
  if (val) loadHistory(val);
});

const send = () => {
  if (!ws || !friend.value) return;
  ws.send(JSON.stringify({ to: friend.value, message: text.value }));
  const selfMsg = { from: store.uid, text: text.value, time: Date.now() };
  if (!histories[friend.value]) histories[friend.value] = [];
  histories[friend.value].push(selfMsg);
  messages.value.push(selfMsg);
  text.value = "";
};
</script>
