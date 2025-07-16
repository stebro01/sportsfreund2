<template>
  <div v-if="friend" class="q-mt-md">
    <div class="text-h6 text-white q-mb-sm">{{ friend.name }}</div>
    <div
      ref="container"
      class="q-pa-sm"
      style="height: 200px; overflow: auto; border: 1px solid #ccc"
    >
      <div v-for="m in messages" :key="m.time" class="text-white">
        <span class="text-bold">{{ senderName(m.from) }}</span
        >: {{ m.text }}
      </div>
    </div>
    <div class="row q-gutter-sm q-mt-sm">
      <q-form @submit.prevent="onSubmit" class="row q-gutter-sm">
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
</template>

<script setup>
import { ref, watch, nextTick } from "vue";
import { useAuthStore } from "stores/authStore";

const props = defineProps({
  friend: { type: Object, default: null },
  messages: { type: Array, default: () => [] },
});

const emit = defineEmits(["send"]);

const text = ref("");
const container = ref(null);
function scrollToBottom() {
  const el = container.value;
  if (el) el.scrollTop = el.scrollHeight;
}
const auth = useAuthStore();

function senderName(uid) {
  return uid === auth.uid ? auth.username || uid : props.friend?.name || uid;
}

const onSubmit = () => {
  if (!text.value) return;
  emit("send", text.value);
  text.value = "";
};

watch(
  () => props.friend,
  () => {
    text.value = "";
  }
);

watch(
  () => props.messages,
  () => {
    nextTick(scrollToBottom);
  },
  { deep: true }
);

defineExpose({ scrollToBottom });
</script>
