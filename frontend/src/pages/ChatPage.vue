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
import { onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useChatStore } from "stores/chatStore";
import ChatInvite from "components/ChatInvite.vue";
import ChatList from "components/ChatList.vue";
import ChatWindow from "components/ChatWindow.vue";

const chat = useChatStore();
const { friend, friends, messages, connected } = storeToRefs(chat);

onMounted(async () => {
  await chat.connect();
});

watch(friend, (val) => {
  if (val) chat.fetchHistory(val);
});

const send = (msg) => {
  chat.send(msg);
};

const onInvite = async (uid) => {
  if (!friends.value.includes(uid)) friends.value.push(uid);
  friend.value = uid;
  await chat.fetchHistory(uid);
};
</script>
