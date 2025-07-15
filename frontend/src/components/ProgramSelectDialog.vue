<template>
  <q-dialog v-model="modelValue">
    <q-card class="my-popup-card my-popup-card-xl text-center">
      <q-btn class="absolute-top-right z-top" flat round icon="close" @click="modelValue = false" />
      <q-card-section class="text-h6" style="height: 50px">Programm auswählen</q-card-section>
      <q-separator dark />
      <q-card-section class="q-pa-none" style="height: calc(100% - 100px)">
        <q-list style="height: 100%; overflow-y: auto" class="q-pa-sm">
          <q-item v-for="preset in sortedPresets" :key="preset.label" clickable @click="selectPreset(preset)"
            :class="{ 'bg-primary text-white': isCurrentPreset(preset) }">
            <q-item-section v-if="preset.data" side>
              <q-icon name="av_timer" class="q-mr-xs" />
              {{ formatTime(calcDuration(preset.data)) }}
            </q-item-section>
            <q-item-section>{{ preset.label }}</q-item-section>

            <q-item-section side class="q-gutter-xs">
              <q-btn v-if="preset.data && isCurrentPreset(preset) && isDifferent(preset.data, currentSettings)" flat
                dense icon="save" :color="isCurrentPreset(preset) ? 'white' : 'primary'"
                @click.stop="overwritePreset(preset)" />
              <q-btn v-if="preset.label !== 'Default'" flat dense icon="delete"
                :color="isCurrentPreset(preset) ? 'white' : 'grey-5'" @click.stop="deletePreset(preset)" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions align="center" style="height: 50px">
        <q-btn color="primary" label="Neues Programm" @click="createNewPreset" />
      </q-card-actions>
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

const sortedPresets = computed(() => {
  const allPresets = programStore.presets;
  const currentPreset = props.currentSettings;

  return [...allPresets].sort((a, b) => {
    const isAActive = a.label === currentPreset?.label;
    const isBActive = b.label === currentPreset?.label;

    if (isAActive && !isBActive) return -1;
    if (!isAActive && isBActive) return 1;
    return 0;
  });
});


function isDifferent(data, current) {
  return JSON.stringify(data) !== JSON.stringify(current);
}

function isCurrentPreset(preset) {
  return preset.label === props.currentSettings?.label;
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

function createNewPreset() {
  $q.dialog({
    title: 'Neues Programm erstellen',
    message: 'Bitte geben Sie einen Namen für das neue Programm ein:',
    prompt: {
      model: '',
      type: 'text',
      isValid: (val) => val.length > 0 && programStore.isPresetNameValid(val),
    },
    cancel: true,
    persistent: true,
    dark: true,
  }).onOk((data) => {
    const input = data.trim();
    if (!programStore.isPresetNameValid(input)) {
      $q.notify({
        message: 'Bitte einen anderen Namen eingeben',
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
      });
      return;
    }

    // Create new preset with current settings
    const newPreset = programStore.createNewPreset(input, props.currentSettings);

    // Select the newly created preset
    selectPreset(newPreset);

    $q.notify({
      message: `Programm "${input}" wurde erstellt`,
      color: 'positive',
      textColor: 'white',
      icon: 'check_circle',
    });
  });
}
</script>
