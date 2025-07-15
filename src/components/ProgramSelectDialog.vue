<template>
  <q-dialog v-model="modelValue">
    <q-card class="my-popup-card text-center">
      <q-card-section>Programm auswählen</q-card-section>
      <q-card-section class="q-pa-none">
        <q-list style="max-height: 250px; overflow-y: auto">
          <q-item v-for="preset in programStore.presets" :key="preset.label" clickable @click="selectPreset(preset)">
            <q-item-section>{{ preset.label }}</q-item-section>
            <q-item-section v-if="preset.data" side>
              <q-icon name="av_timer" class="q-mr-xs" />
              {{ formatTime(calcDuration(preset.data)) }}
            </q-item-section>
            <q-item-section side class="q-gutter-xs">
              <q-btn v-if="preset.data && isDifferent(preset.data, currentSettings)" flat dense icon="save"
                @click.stop="overwritePreset(preset)" />
              <q-btn v-if="preset.label !== 'Default'" flat dense icon="delete" color="grey-5"
                @click.stop="deletePreset(preset)" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue';
import { useQuasar } from 'quasar';
import { useProgramStore } from 'stores/programStore';
import { formatTime, calcDuration } from 'src/utils/timeUtils';

const props = defineProps({
  modelValue: Boolean,
  currentSettings: Object,
});

const emit = defineEmits(['update:modelValue', 'select']);

const $q = useQuasar();
const programStore = useProgramStore();

const modelValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});



function isDifferent(data, current) {
  return JSON.stringify(data) !== JSON.stringify(current);
}

function selectPreset(preset) {
  emit('select', preset);
  emit('update:modelValue', false);
}

function overwritePreset(preset) {
  programStore.updatePreset(preset.label, props.currentSettings);
  emit('update:modelValue', false);
}

function deletePreset(preset) {
  if (preset.label === 'Default') return;
  $q.dialog({
    title: 'Programm löschen',
    message: `Soll das Programm "${preset.label}" wirklich gelöscht werden?`,
    cancel: true,
    persistent: true,
    dark: true,
  }).onOk(() => {
    programStore.removePreset(preset.label);
  });
}
</script>
