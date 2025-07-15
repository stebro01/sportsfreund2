<template>
  <q-dialog v-model="modelValue">
    <q-card class="my-popup-card text-center" :style="size ? `height: ${size};` : ''">
      <q-btn class="absolute-top-right z-top" flat icon="close" @click="modelValue = false" />
      <q-card-section v-if="title">{{ title }}</q-card-section>
      <q-separator dark />
      <slot />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: Boolean,
  title: String,
  size: String,
});

const emit = defineEmits(["update:modelValue"]);

const modelValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>
