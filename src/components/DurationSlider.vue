<template>
  <div class="column q-gutter-sm">
    <!-- Mode Toggle Buttons -->
    <div class="row q-gutter-sm justify-center">
      <q-btn v-if="!showXOption" :color="mode === 'seconds' ? 'primary' : 'grey'" :outline="mode !== 'seconds'"
        size="sm" @click="mode = 'seconds'" label="Sekunden" />
      <q-btn v-if="!showXOption" :color="mode === 'minutes' ? 'primary' : 'grey'" :outline="mode !== 'minutes'"
        size="sm" @click="mode = 'minutes'" label="Minuten" />
      <q-btn v-if="showXOption" :color="mode === 'x' ? 'primary' : 'grey'" :outline="mode !== 'x'" size="sm"
        @click="mode = 'x'" label="x" />
    </div>

    <!-- Current Value Display -->
    <div class="text-center text-h6 text-white">
      {{ displayValue }}
    </div>

    <!-- Slider -->
    <div class="row items-center q-gutter-sm">
      <q-slider v-model="proxyValue" :step="currentStep" :min="currentMin" :max="currentMax" :label-value="labelValue"
        color="white" label label-text-color="dark" thumb-size="40px" class="col-grow" />
      <q-btn flat dense round size="sm" icon="edit" @click.stop="openEdit" />
      <q-popup-edit ref="popup" v-model="proxyValue" auto-save>
        <q-input type="number" v-model.number="proxyValue" dense autofocus :min="min" :max="max"
          @keyup.enter="closeEdit" />
      </q-popup-edit>
    </div>
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
  mid: {
    type: Number,
    default: 60,
  },
  max: {
    type: Number,
    default: 3600,
  },
  showXOption: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const proxyValue = ref(props.modelValue);
const isInUpperRange = ref(props.modelValue >= props.mid);
const mode = ref('seconds'); // 'seconds', 'minutes', or 'x'

// Initialize mode based on current value and showXOption
if (props.showXOption) {
  mode.value = 'x';
} else if (props.modelValue >= 60) {
  mode.value = 'minutes';
} else {
  mode.value = 'seconds';
}

watch(
  () => props.modelValue,
  (val) => {
    proxyValue.value = val;
    isInUpperRange.value = val >= props.mid;

    // Update mode based on value (only if not in x mode)
    if (!props.showXOption) {
      if (val >= 60) {
        mode.value = 'minutes';
      } else {
        mode.value = 'seconds';
      }
    }
  }
);

watch(proxyValue, (val, oldVal) => {
  // For x mode, just emit the value directly
  if (mode.value === 'x') {
    emit("update:modelValue", val);
    return;
  }

  // Switch to upper range when crossing mid threshold
  if (val >= props.mid && oldVal < props.mid) {
    isInUpperRange.value = true;
  }
  // Switch to lower range when moving left (decreasing)
  if (val < oldVal && isInUpperRange.value) {
    isInUpperRange.value = false;
  }
  emit("update:modelValue", val);
});

// Computed properties for different modes
const currentMin = computed(() => {
  if (mode.value === 'x') return 1;
  if (mode.value === 'seconds') return 5;
  return 60; // minutes mode
});

const currentMax = computed(() => {
  if (mode.value === 'x') return 100;
  if (mode.value === 'seconds') return 60;
  return 3600; // minutes mode (60:00)
});

const currentStep = computed(() => {
  if (mode.value === 'x') return 1;
  if (mode.value === 'seconds') return 5;
  return 15; // minutes mode (15s steps)
});

const labelValue = computed(() => {
  if (mode.value === 'x') return `${proxyValue.value}x`;

  const val = proxyValue.value;
  if (mode.value === 'seconds') {
    return `${val}s`;
  }
  const minutes = Math.floor(val / 60);
  const seconds = val % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

const displayValue = computed(() => {
  if (mode.value === 'x') return `${proxyValue.value}x`;

  const val = proxyValue.value;
  if (mode.value === 'seconds') {
    return `${val}s`;
  }
  const minutes = Math.floor(val / 60);
  const seconds = val % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

const popup = ref(null);
function openEdit() {
  popup.value && popup.value.show();
}
function closeEdit() {
  popup.value && popup.value.hide();
}
</script>
