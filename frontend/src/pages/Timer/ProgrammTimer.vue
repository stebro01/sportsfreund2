<template>
  <q-page data-cy="page_about" class="full-height">
    <q-btn icon="close" size="lg" flat round class="absolute-top-right" @click="goBack()" />
    <q-btn :icon="!store.settings.audio_playback ? 'volume_off' : 'volume_up'" size="lg" flat round
      class="absolute-top-left" @click="store.setSettingsAudioPlayback(!store.settings.audio_playback)" />
    <div class="column text-center" style="height: 100vh; width: 100vw">
      <div class="col-1">Program</div>
      <!-- TIMER ELEMENT -->
      <!-- BTN -->
      <div class="col-2">
        <MY_ITEM_BTN v-if="!timerStore.isProgramActive && !timerStore.isProgramHalted" :label="'START'"
          :icon="'play_arrow'" @clicked="startTimer()" />
        <MY_ITEM_BTN v-if="!timerStore.isProgramActive && timerStore.isProgramHalted" :label="'ABBRECHEN'"
          :icon="'close'" @clicked="clearTimer()" />
        <MY_ITEM_BTN v-if="timerStore.isProgramActive && !timerStore.isProgramFinished" :label="'STOP'" :icon="'stop'"
          @clicked="stopTimer()" />
        <MY_ITEM_BTN v-if="timerStore.isProgramActive && timerStore.isProgramFinished" :label="'ZURÜCK'"
          :icon="'arrow_back'" @clicked="clearTimer()" />
      </div>

      <!-- DURATION -->
      <div class="col-1">
        <q-chip class="bg-orange-5">
          <span class="text-caption q-mr-sm" v-if="!timerStore.timeData">Total:</span>
          <span class="text-caption q-mr-sm" v-else>Rest:</span>
          <span class="text-h6">{{ formatTime(DURATION_CALC) }}</span>
        </q-chip>
      </div>

      <!-- OPTIONS -->
      <div v-if="!timerStore.isProgramActive && !timerStore.isProgramHalted" class="row justify-center">
        <!-- STEUER ELEMENTE -->
        <div class="row q-gutter-y-md" style="width: 100vw; max-width: 1000px">
          <!-- SELECTION / PREVIOUS -->
          <div class="col-12">
            <q-item clickable v-ripple class="q-ma-sm"
              style="border-radius: 10px; border-color: #f0f0f0; border-width: 1px; border-style: solid;">
              <q-item-section avatar><q-icon name="today" /></q-item-section>
              <q-item-section>
                <q-btn flat no-caps @click="showPresetDialog = true">{{
                  PRESET_LABEL
                  }}</q-btn>
                <ProgramSelectDialog v-model="showPresetDialog" :current-settings="localData" @select="selectPreset" />
              </q-item-section>

            </q-item>
          </div>

          <ProgramBaseSettings :local-data="localData" />
        </div>
      </div>

      <!-- TIMER -->
      <div v-else class="col-2">
        <q-knob show-value class="text-white q-ma-md" v-model="TIMER_PERCENTAGE" size="150px" :thickness="0.2"
          color="grey-3" :center-color="TIMER_COLOR" track-color="transparent" readonly="">
          <div v-if="timerStore.isProgramFinished">
            <span style="font-size: 3em">🥇</span>
          </div>
          <div v-else-if="timerStore.timeData && timerStore.timeData[timerStore.timeIndex]">
            <div v-if="!timerStore.isProgramHalted">
              <div>
                {{ formatTime(TIMER_VALUE) }}
                <q-tooltip v-if="timerStore.timeData[timerStore.timeIndex].name">{{
                  timerStore.timeData[timerStore.timeIndex].name
                  }}</q-tooltip>
              </div>
              <div class="text-caption">{{ TIMER_TYPE }}</div>
            </div>
            <div v-else class="cursor-pointer" @click="proceedTimer()">
              <div class="text-caption">Unterbrochen</div>
            </div>
          </div>
        </q-knob>

        <!-- EXERCISE LABEL BANNER -->
        <div v-if="timerStore.isProgramActive && !timerStore.isProgramFinished && CURRENT_EXERCISE_NAME"
          class="exercise-banner q-my-md q-px-lg">
          <q-banner class="bg-green-5 text-white text-center">
            <q-icon name="fitness_center" class="q-mr-sm" />
            {{ CURRENT_EXERCISE_NAME }}
          </q-banner>
        </div>

        <div v-if="timerStore.timeData && timerStore.timeData[timerStore.timeIndex] && !timerStore.isProgramHalted">
          <q-chip>Schritt: {{ timerStore.timeData[timerStore.timeIndex].step_ind + 1 }} /
            {{ programSteps.length }}</q-chip>
          <q-chip>Wdh.: {{ timerStore.timeData[timerStore.timeIndex].rep_ind + 1 }} /
            {{
              programSteps[timerStore.timeData[timerStore.timeIndex].step_ind].repetitions || 1
            }}</q-chip>
        </div>
        <div v-else-if="timerStore.timeData && timerStore.timeData[timerStore.timeIndex] && timerStore.isProgramHalted">
          <MY_ITEM_BTN :label="'WEITER'" :icon="'play_arrow'" @clicked="proceedTimer()" />
        </div>
        <div v-else-if="timerStore.isProgramFinished" class="text-orange-4">
          <div>
            {{ ZITAT.text_de }}
          </div>
          <div class="text-caption q-mt-md">
            {{ ZITAT.author }}
          </div>
        </div>
      </div>

      <!-- ENDE COL -->
    </div>


  </q-page>
</template>

<script>
import MY_ITEM_BTN from "components/MyItemBtn.vue";
import ProgramSelectDialog from "components/ProgramSelectDialog.vue";
import ProgramBaseSettings from "components/ProgramBaseSettings.vue";
import getRandomCitation from "src/tools/citate.js";
import { useAppStore } from "stores/appStore";
import { useProgramStore } from "stores/programStore";
import { useTimerStore } from "stores/timerStore";
import { formatTime, calcDuration } from "src/utils/timeUtils";

export default {
  name: "ProgrammTimer",
  components: {
    MY_ITEM_BTN,
    ProgramSelectDialog,
    ProgramBaseSettings,
  },
  setup() {
    const store = useAppStore();
    const programStore = useProgramStore();
    const timerStore = useTimerStore();
    return {
      store,
      programStore,
      timerStore,
      formatTime,
    };
  },
  data() {
    return {
      localData: {
        ...JSON.parse(JSON.stringify(this.programStore.currentSelectedPreset)),
        exerciseNames: this.programStore.currentSelectedPreset.exerciseNames || [],
      },
      label_new_preset: "Neues Programm",
      dragIndex: null,
      showPresetDialog: false,
      stepDialogIndex: null,
      repDialogIndex: null,
    };
  },
  mounted() {
    this.programStore.PROGRAM_STEPS = [];
    // Reset timer state when entering the page to avoid stale state
    if (this.timerStore.isProgramHalted && !this.timerStore.isProgramActive) {
      this.timerStore.clearProgramTimer();
    }

    // Automatically load the current selected preset
    this.localData = JSON.parse(JSON.stringify(this.programStore.currentSelectedPreset));
    this.localData.exerciseNames = this.programStore.currentSelectedPreset.exerciseNames || [];
  },

  unmounted() {
    // Clean up timer when leaving the page
    this.timerStore.stopProgramTimer();
  },

  computed: {
    programSteps() {
      return this.programStore.programSteps;
    },

    STEP_OPTIONS() {
      return [
        { label: "Action", value: "action" },
        { label: "Pause", value: "break" },
        { label: "Rundenpause", value: "round_break" },
      ];
    },
    TIMER_VALUE() {
      return this.timerStore.currentTimerValue;
    },

    TIMER_PERCENTAGE() {
      return this.timerStore.currentTimerPercentage;
    },

    TIMER_TYPE() {
      return this.timerStore.currentTimerType;
    },

    TIMER_COLOR() {
      return this.timerStore.currentTimerColor;
    },

    DURATION_CALC() {
      if (this.timerStore.timeData) return calcDuration(this.timerStore.timeData, this.timerStore.programProgress);
      if (this.programSteps.length) return calcDuration(this.programSteps);
      return calcDuration(this.localData);
    },

    PRESETS() {
      return this.programStore.presets;
    },

    PRESET_LABEL() {
      return this.localData.label;
    },

    ZITAT() {
      return getRandomCitation();
    },

    CURRENT_EXERCISE_NAME() {
      if (this.timerStore.timeData &&
        this.timerStore.timeData[this.timerStore.timeIndex] &&
        this.timerStore.timeData[this.timerStore.timeIndex].name &&
        this.timerStore.timeData[this.timerStore.timeIndex].type === 'action') {
        return this.timerStore.timeData[this.timerStore.timeIndex].name;
      }
      return null;
    },
  },

  watch: {
    "localData.action.value": "generateStepsFromSettings",
    "localData.break.value": "generateStepsFromSettings",
    "localData.rounds.value": "generateStepsFromSettings",
    "localData.round_break.value": "generateStepsFromSettings",
    "localData.exercises.value"(val) {
      if (val > this.localData.exerciseNames.length) {
        for (let i = this.localData.exerciseNames.length; i < val; i++) {
          this.localData.exerciseNames.push("");
        }
      } else if (val < this.localData.exerciseNames.length) {
        this.localData.exerciseNames.splice(val);
      }
      this.generateStepsFromSettings();
    },
  },

  methods: {
    goBack() {
      this.timerStore.stopProgramTimer();
      this.$router.go(-1);
    },



    addPreset() {
      this.localData = JSON.parse(JSON.stringify(this.programStore.lastPreset));
      this.localData.label = this.label_new_preset;
    },

    removePreset(label) {
      //ask if really delete
      this.$q
        .dialog({
          title: "Programm löschen",
          message: `Soll das Programm "${label}" wirklich gelöscht werden?`,
          cancel: true,
          persistent: true,
          dark: true,
        })
        .onOk(() => {
          // remove preset
          this.programStore.removePreset(label);
          this.localData.label = "Letztes Programm";
        });
    },

    selectPreset(preset) {
      this.localData = this.programStore.selectPreset(preset, this.localData);
    },

    saveNewPreset() {
      //dialog with prompt of new name
      this.$q
        .dialog({
          title: "Name des Programms",
          prompt: {
            model: this.label_new_preset,
            type: "text",
          },
          cancel: true,
          persistent: true,
          dark: true,
        })
        .onOk((data) => {
          const input = data.trim();
          if (!this.programStore.isPresetNameValid(input, this.label_new_preset)) {
            return this.$q.notify({
              message: "Bitte einen anderen Namen eingeben",
              color: "red-5",
              textColor: "white",
              icon: "warning",
            });
          }
          this.localData.label = input;
          this.programStore.createNewPreset(input, this.localData);
        });
    },

    removeStep(index) {
      this.programStore.removeProgramStep(index);
    },

    openStepDurationDialog(idx) {
      this.stepDialogIndex = idx;
    },

    openStepRepDialog(idx) {
      this.repDialogIndex = idx;
    },

    generateStepsFromSettings() {
      this.programStore.generateStepsFromSettings(this.localData);
    },

    onDragStart(idx) {
      this.dragIndex = idx;
    },

    onDrop(idx) {
      if (this.dragIndex === null) return;
      this.programStore.moveProgramStep(this.dragIndex, idx);
      this.dragIndex = null;
    },

    // TIMER
    async startTimer() {
      this.generateStepsFromSettings();
      const timeData = this._prepareTimer();

      this.programStore.setLastPreset(
        JSON.parse(JSON.stringify(this.localData))
      );

      await this.timerStore.startProgramTimer(timeData, this.store.settings.audio_playback);
    },

    proceedTimer() {
      this.timerStore.proceedProgramTimer();
    },

    _prepareTimer() {
      return this.programStore.prepareTimerData();
    },

    stopTimer() {
      this.timerStore.stopProgramTimer();
    },

    clearTimer() {
      this.timerStore.clearProgramTimer();
    },

    // ENDE
  },
};
</script>

<style scoped>
.exercise-banner {
  z-index: 1000;
}

.exercise-banner .q-banner {
  border-radius: 0;
  font-size: 1.2em;
  font-weight: bold;
  padding: 12px;
}
</style>
