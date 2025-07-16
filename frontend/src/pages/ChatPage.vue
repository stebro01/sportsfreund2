<template>
  <q-page class="column items-center q-pa-md">
    <div class="column q-gutter-sm items-center">
      <q-input v-model="friend" label="Friend UID" input-class="text-white" label-color="grey-7" />
      <q-btn label="Connect" color="primary" @click="connect" />
    </div>
    <div class="q-mt-md" v-if="connected">
      <div
        class="q-pa-sm"
        style="height: 200px; overflow: auto; border: 1px solid #ccc"
      > {{ messages }}
        <div v-for="m in messages" :key="m.time" class="text-white">
          <span class="text-bold">{{ m.from }}</span>: {{ m.text }}
          {{ m.from }}: {{ m.text }}
        </div>
      </div>
      <div class="row q-gutter-sm q-mt-sm">
        <q-form @submit="send" class="row q-gutter-sm">
          <q-input v-model="text" label="Message" input-class="text-white" label-color="grey-7" />
          <q-btn icon="send" type="submit" color="primary" />
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useAuthStore } from "stores/authStore";

const store = useAuthStore();
const $q = useQuasar();
const friend = ref("");
const text = ref("");
const messages = ref([]);
const connected = ref(false);
let ws;

store.autoLogin();

const connect = async () => {
  try {
    await store.sendFriendRequest(friend.value);
    await store.acceptFriend(friend.value);
  } catch (err) {
    const msg = err.response?.data?.detail || err.message;
    $q.notify({ type: "negative", message: msg });
    return;
  }

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
  ws.onerror = () => {
    $q.notify({ type: "negative", message: "WebSocket error" });
  };
  ws.onclose = (e) => {
    connected.value = false;
    $q.notify({ type: "negative", message: e.reason || "Connection closed" });
  };
};

const send = () => {
  ws.send(JSON.stringify({ to: friend.value, message: text.value }));
  text.value = "";
};
</script>
