<template>
  <div class="row q-gutter-sm items-end">
    <q-select
      v-model="uid"
      :options="options"
      label="Friend UID"
      input-class="text-white"
      label-color="grey-7"
    />
    <q-btn label="Send" color="primary" @click="sendRequest" />
    <q-btn label="Accept" color="primary" @click="acceptRequest" />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import { useChatStore } from "stores/chatStore";

const emit = defineEmits(["added"]);

const uid = ref("");
const $q = useQuasar();
const chat = useChatStore();

const options = computed(() =>
  chat.friends.map((f) => ({ label: f.name, value: f.uid }))
);

async function handle(action) {
  if (!uid.value) return;
  try {
    await action(uid.value);
    emit("added", uid.value);
    $q.notify({ type: "positive", message: "Request sent" });
  } catch (err) {
    const msg = err.response?.data?.detail || err.message;
    $q.notify({ type: "negative", message: msg });
  }
}

const sendRequest = () => handle(chat.sendFriendRequest);
const acceptRequest = () => handle(chat.acceptFriend);
</script>
