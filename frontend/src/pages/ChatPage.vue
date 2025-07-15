<template>
  <q-page class="column items-start q-pa-md">
    <div class="row q-gutter-sm items-center">
      <q-input v-model="friend" label="Friend UID" />
      <q-btn label="Connect" color="primary" @click="connect" />
    </div>
    <div class="q-mt-md" v-if="connected">
      <div
        class="q-pa-sm"
        style="height: 200px; overflow: auto; border: 1px solid #ccc"
      >
        <div v-for="m in messages" :key="m.time">
          {{ m.from }}: {{ m.text }}
        </div>
      </div>
      <div class="row q-gutter-sm q-mt-sm">
        <q-input v-model="text" label="Message" />
        <q-btn label="Send" @click="send" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "stores/authStore";

const store = useAuthStore();
const friend = ref("");
const text = ref("");
const messages = ref([]);
const connected = ref(false);
let ws;

store.autoLogin();

const connect = async () => {
  await store.sendFriendRequest(friend.value);
  await store.acceptFriend(friend.value);
  ws = new WebSocket(`ws://localhost:8000/ws/${store.uid}`);
  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    messages.value.push({
      from: data.from,
      text: data.message,
      time: Date.now(),
    });
  };
  ws.onopen = () => {
    connected.value = true;
  };
};

const send = () => {
  ws.send(JSON.stringify({ to: friend.value, message: text.value }));
  text.value = "";
};
</script>
