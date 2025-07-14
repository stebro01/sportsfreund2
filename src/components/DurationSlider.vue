<template>
  <div class="row items-center q-gutter-sm">
    <q-slider
      v-model="proxyValue"
      :step="step"
      :min="min"
      :max="max"
      :label-value="labelValue"
      color="white"
      label
      label-text-color="dark"
      thumb-size="40px"
      class="col-grow"
    />
    <q-btn flat dense round size="sm" icon="edit" @click.stop="openEdit" />
    <q-popup-edit ref="popup" v-model="proxyValue" auto-save>
      <q-input
        type="number"
        v-model.number="proxyValue"
        dense
        autofocus
        :min="min"
        :max="max"
        @keyup.enter="closeEdit"
      />
    </q-popup-edit>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  step: {
    type: Number,
    default: undefined,
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 3600,
  },
});

const emit = defineEmits(["update:modelValue"]);

const proxyValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (val) => {
    proxyValue.value = val;
  }
);

watch(proxyValue, (val) => {
  emit("update:modelValue", val);
});

const step = computed(() => props.step ?? (proxyValue.value < 60 ? 5 : 10));

const labelValue = computed(() => {
  const val = proxyValue.value;
  if (val < 60) {
    return `${val}s`;
  }
  const minutes = Math.floor(val / 60);
  const seconds = val % 60;
  return seconds ? `${minutes}m ${seconds}s` : `${minutes}m`;
});

const popup = ref(null);
function openEdit() {
  popup.value && popup.value.show();
}
function closeEdit() {
  popup.value && popup.value.hide();
}
</script>
