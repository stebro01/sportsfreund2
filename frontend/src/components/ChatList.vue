<template>
  <div class="chat-section column q-gutter-sm items-center">
    <q-select
      v-model="model"
      :options="options"
      label="Friend"
      input-class="text-white"
      label-color="grey-7"
      dark
      outlined
    >
      <template #option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section avatar>
            <q-icon
              name="circle"
              :color="scope.opt.online ? 'positive' : 'grey-6'"
              size="8px"
            />
          </q-item-section>
          <q-item-section>{{ scope.opt.label }}</q-item-section>
        </q-item>
      </template>
      <template #selected-item="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section avatar>
            <q-icon
              name="circle"
              :color="scope.opt.online ? 'positive' : 'grey-6'"
              size="8px"
            />
          </q-item-section>
          <q-item-section>{{ scope.opt.label }}</q-item-section>
        </q-item>
      </template>
    </q-select>
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
  props.friends.map((f) => ({ label: f.name, value: f.uid, online: f.online })),
);
</script>
