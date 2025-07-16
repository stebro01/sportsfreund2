<template>
  <div v-if="friend" class="q-mt-md">
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
import { ref, watch } from "vue";

const props = defineProps({
  friend: String,
  messages: { type: Array, default: () => [] },
});

const emit = defineEmits(["send"]);

const text = ref("");

const onSubmit = () => {
  if (!text.value) return;
  emit("send", text.value);
  text.value = "";
};

watch(
  () => props.friend,
  () => {
    text.value = "";
  },
);
</script>
