<template>
  <div v-if="requests.length" class="chat-section column q-gutter-sm">
    <div
      v-for="uid in requests"
      :key="uid"
      class="row q-gutter-sm items-center"
    >
      <span class="text-white">{{ uid }}</span>
      <q-btn label="Accept" size="sm" color="primary" @click="accept(uid)" />
      <q-btn label="Decline" size="sm" color="negative" @click="decline(uid)" />
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useChatStore } from "stores/chatStore";

const chat = useChatStore();
const { requests } = storeToRefs(chat);

const accept = (uid) => {
  chat.acceptRequest(uid);
};
const decline = (uid) => {
  chat.declineFriend(uid);
};
</script>
