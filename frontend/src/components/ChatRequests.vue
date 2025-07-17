<template>
  <div v-if="requests.length" class="chat-section column q-gutter-sm">
    <div
      v-for="req in requests"
      :key="req.uid"
      class="row q-gutter-sm items-center"
    >
      <span class="text-white">{{ req.name }}</span>
      <q-btn
        label="Accept"
        size="sm"
        color="primary"
        @click="accept(req.uid)"
      />
      <q-btn
        label="Decline"
        size="sm"
        color="negative"
        @click="decline(req.uid)"
      />
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
