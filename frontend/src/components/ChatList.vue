<template>
  <div class="column q-gutter-sm items-center" style="max-width: 300px">
    <q-select
      v-model="model"
      :options="options"
      label="Friend"
      input-class="text-white"
      label-color="grey-7"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: String,
  friends: { type: Array, default: () => [] },
});

const emit = defineEmits(["update:modelValue"]);

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const options = computed(() =>
  props.friends.map((f) => ({ label: f.name, value: f.uid }))
);
</script>
