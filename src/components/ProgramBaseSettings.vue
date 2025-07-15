<template>
  <div class="row q-gutter-y-md" style="width: 100vw; max-width: 1000px">
    <!-- Action -->
    <div class="col-12">
      <q-btn no-caps class="my-main-btn" @click="showActionDialog = true">
        <q-icon name="play_circle" class="q-mr-sm" />Action:
        {{ formatTime(localData.action.value) }}
      </q-btn>
      <BaseDialog v-model="showActionDialog" title="Action anpassen" size="250px">
        <q-card-section>
          <DurationSlider v-model="localData.action.value" :min="5" :mid="60" :max="3600" :step="5" />
        </q-card-section>
      </BaseDialog>
    </div>

    <!-- Pause -->
    <div class="col-12">
      <q-btn no-caps class="my-main-btn" color="negative" @click="showBreakDialog = true">
        <q-icon name="pause_circle" class="q-mr-sm" />Pause:
        {{ formatTime(localData.break.value) }}
      </q-btn>
      <BaseDialog v-model="showBreakDialog" title="Pause anpassen" size="250px">
        <q-card-section>
          <DurationSlider v-model="localData.break.value" :min="0" :max="3600" :step="5" />
        </q-card-section>
      </BaseDialog>
    </div>

    <!-- Excercises -->
    <div class="col-12">
      <q-btn no-caps class="my-main-btn" color="secondary" @click="showExerciseDialog = true">
        <q-icon name="fitness_center" class="q-mr-sm" />Übungen:
        {{ localData.exercises.value }} {{ localData.exercises.unit }}
      </q-btn>
      <BaseDialog v-model="showExerciseDialog" title="Übungen anpassen" size="500px">
        <q-card-section>
          <DurationSlider v-model="localData.exercises.value" :min="1" :max="50" :showXOption="true" />
        </q-card-section>
        <q-card-section v-if="localData.exercises.value > 1">
          <div class="q-gutter-sm">
            <q-input v-for="n in localData.exercises.value" :key="'name' + n" dense type="text" input-class="text-white"
              label-color="grey-8" :label="'Übung ' + n" v-model="localData.exerciseNames[n - 1]" />
          </div>
        </q-card-section>
      </BaseDialog>
    </div>

    <q-separator class="q-my-md" />

    <!-- Repetitions -->
    <div class="col-12">
      <q-btn no-caps class="my-main-btn" color="secondary" @click="showRoundsDialog = true">
        <q-icon name="restart_alt" class="q-mr-sm" />Wiederholungen:
        {{ localData.rounds.value }} {{ localData.rounds.unit }}
      </q-btn>
      <BaseDialog v-model="showRoundsDialog" title="Wiederholungen anpassen" size="250px">
        <q-card-section>
          <DurationSlider v-model="localData.rounds.value" :min="1" :max="50" :showXOption="true" />
        </q-card-section>
      </BaseDialog>
    </div>

    <!-- BREAKS -->
    <div class="col-12">
      <q-btn no-caps class="my-main-btn" color="negative" @click="showRoundBreakDialog = true">
        <q-icon name="restore" class="q-mr-sm" />Rundenpause:
        {{ formatTime(localData.round_break.value) }}
      </q-btn>
      <BaseDialog v-model="showRoundBreakDialog" title="Rundenpause anpassen" size="250px">
        <q-card-section>
          <DurationSlider v-model="localData.round_break.value" :min="0" :max="3600" :step="5" />
        </q-card-section>
      </BaseDialog>
    </div>

    <q-separator class="q-my-md" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import DurationSlider from 'components/DurationSlider.vue';
import BaseDialog from 'components/BaseDialog.vue';
import { formatTime } from 'src/utils/timeUtils';

const props = defineProps({
  localData: {
    type: Object,
    required: true,
  },
});

const showActionDialog = ref(false);
const showBreakDialog = ref(false);
const showExerciseDialog = ref(false);
const showRoundsDialog = ref(false);
const showRoundBreakDialog = ref(false);
</script>
