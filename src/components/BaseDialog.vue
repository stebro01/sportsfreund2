<template>
  <q-dialog v-model="modelValue">
    <q-card class="my-popup-card text-center white-shadow">
      <q-card-section v-if="title">{{ title }}</q-card-section>
      <slot />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: Boolean,
  title: String,
});

const emit = defineEmits(["update:modelValue"]);

const modelValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>
