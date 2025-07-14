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
        <MY_ITEM_BTN v-if="!isActive && timer_halted === false" :label="'START'" :icon="'play_arrow'"
          @clicked="startTimer()" />
        <MY_ITEM_BTN v-if="!isActive && timer_halted === true" :label="'ABBRECHEN'" :icon="'close'"
          @clicked="clearTimer()" />
        <MY_ITEM_BTN v-if="isActive && !timer_finished" :label="'STOP'" :icon="'stop'" @clicked="stopTimer()" />
        <MY_ITEM_BTN v-if="isActive && timer_finished" :label="'ZURÜCK'" :icon="'arrow_back'" @clicked="clearTimer()" />
      </div>

      <!-- DURATION -->
      <div class="col-1">
        <q-chip class="bg-orange-5">
          <span class="text-caption q-mr-sm" v-if="!TIME_DATA">Total:</span>
          <span class="text-caption q-mr-sm" v-else>Rest:</span>
          <span class="text-h6">{{ formatTime(DURATION_CALC) }}</span>
        </q-chip>
      </div>

      <!-- OPTIONS -->
      <div v-if="!isActive && timer_halted === false" class="col">
        <!-- STEUER ELEMENTE -->
        <div class="row q-gutter-y-sm justify-center" style="width: 100vw; max-width: 1000px">
          <!-- SELECTION / PREVIOUS -->
          <div class="col-12">
            <q-item clickable v-ripple class="q-ma-sm">
              <q-item-section avatar><q-icon name="today" /></q-item-section>
              <q-item-section>
                <q-btn-dropdown flat no-caps :label="PRESET_LABEL">
                  <q-list class="bg-dark">
                    <q-item clickable v-close-popup v-ripple v-for="preset in PRESETS"
                      :key="preset.label + 'presetlist'" @click="selectPreset(preset)">
                      <q-item-section>{{ preset.label }}</q-item-section>
                      <q-item-section v-if="preset.data" side>
                        <q-icon name="av_timer" />{{
                          formatTime(calcDuration(preset.data))
                        }}</q-item-section>
                    </q-item>
                    <q-item avatar v-close-popup="">
                      <q-btn flat size="md" icon="add" @click="addPreset()"></q-btn>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </q-item-section>
              <q-item-section side v-if="localData.label === label_new_preset"><q-btn flat icon="save"
                  @click="saveNewPreset()" color="white"></q-btn></q-item-section>
              <q-item-section side v-else-if="
                localData.label !== label_new_preset &&
                localData.label !== 'Default'
              "><q-btn flat icon="delete" @click="removePreset(this.localData.label)"
                  color="grey-5"></q-btn></q-item-section>
            </q-item>
          </div>

          <!-- Action -->
          <div class="col-12">
            <q-btn no-caps class="my-main-btn" @click="showActionDialog = true">
              <q-icon name="play_circle" class="q-mr-sm" />Action:
              {{ formatTime(localData.action.value) }}
            </q-btn>
            <q-dialog v-model="showActionDialog">
              <q-card class="my-popup-card text-center shadow-1">
                <q-card-section>Action anpassen</q-card-section>
                <q-card-section>
                  <DurationSlider v-model="localData.action.value" :min="5" :max="3600" :step="5" />
                </q-card-section>
              </q-card>
            </q-dialog>
          </div>

          <!-- Pause -->
          <div class="col-12">
            <q-btn no-caps class="my-main-btn" color="negative" @click="showBreakDialog = true">
              <q-icon name="pause_circle" class="q-mr-sm" />Pause:
              {{ formatTime(localData.break.value) }}
            </q-btn>
            <q-dialog v-model="showBreakDialog">
              <q-card class="my-popup-card text-center shadow-1">
                <q-card-section>Pause anpassen</q-card-section>
                <q-card-section>
                  <DurationSlider v-model="localData.break.value" :min="0" :max="3600" :step="5" />
                </q-card-section>
              </q-card>
            </q-dialog>
          </div>

          <!-- Excercises -->
          <div class="col-12">
            <q-btn no-caps class="my-main-btn" color="secondary" @click="showExerciseDialog = true">
              <q-icon name="fitness_center" class="q-mr-sm" />Übungen:
              {{ localData.exercises.value }} {{ localData.exercises.unit }}
            </q-btn>
            <q-dialog v-model="showExerciseDialog">
              <q-card class="my-popup-card text-center shadow-1">
                <q-card-section>Übungen anpassen</q-card-section>
                <q-card-section>
                  <q-slider v-model="localData.exercises.value" label label-text-color="dark" color="white"
                    thumb-size="50px" :step="1" :min="1" :max="50" />
                </q-card-section>
                <q-card-section v-if="localData.exercises.value > 1">
                  <div class="q-gutter-sm">
                    <q-input v-for="n in localData.exercises.value" :key="'name' + n" dense type="text"
                      :label="'Übung ' + n" v-model="localData.exerciseNames[n - 1]" />
                  </div>
                </q-card-section>
              </q-card>
            </q-dialog>
          </div>

          <q-separator class="q-my-md" />

          <!-- Repetitions -->
          <div class="col-12">
            <q-btn no-caps class="my-main-btn" color="secondary" @click="showRoundsDialog = true">
              <q-icon name="restart_alt" class="q-mr-sm" />Wiederholungen:
              {{ localData.rounds.value }} {{ localData.rounds.unit }}
            </q-btn>
            <q-dialog v-model="showRoundsDialog">
              <q-card class="my-popup-card text-center shadow-1">
                <q-card-section>Wiederholungen anpassen</q-card-section>
                <q-card-section>
                  <q-slider v-model="localData.rounds.value" label label-text-color="dark" color="white"
                    thumb-size="50px" :step="1" :min="1" :max="50" />
                </q-card-section>
              </q-card>
            </q-dialog>
          </div>

          <!-- BREAKS -->
          <div class="col-12">
            <q-btn no-caps class="my-main-btn" color="negative" @click="showRoundBreakDialog = true">
              <q-icon name="restore" class="q-mr-sm" />Rundenpause:
              {{ formatTime(localData.round_break.value) }}
            </q-btn>
            <q-dialog v-model="showRoundBreakDialog">
              <q-card class="my-popup-card text-center shadow-1">
                <q-card-section>Rundenpause anpassen</q-card-section>
                <q-card-section>
                  <DurationSlider v-model="localData.round_break.value" :min="0" :max="3600" :step="5" />
                </q-card-section>
              </q-card>
            </q-dialog>
          </div>

          <q-separator class="q-my-md" />

        </div>
      </div>

      <!-- TIMER -->
      <div v-else class="col-2">
        <q-knob show-value class="text-white q-ma-md" v-model="TIMER_PERCENTAGE" size="150px" :thickness="0.2"
          color="grey-3" :center-color="TIMER_COLOR" track-color="transparent" readonly="">
          <div v-if="timer_finished === true">
            <span style="font-size: 3em">🥇</span>
          </div>
          <div v-else-if="TIME_DATA && TIME_DATA[TIME_IND]">
            <div v-if="!timer_halted">
              <div>
                {{ formatTime(TIMER_VALUE) }}
                <q-tooltip v-if="TIME_DATA[TIME_IND].name">{{
                  TIME_DATA[TIME_IND].name
                  }}</q-tooltip>
              </div>
              <div class="text-caption">{{ TIMER_TYPE }}</div>
            </div>
            <div v-else class="cursor-pointer" @click="proceedTimer()">
              <div class="text-caption">Unterbrochen</div>
            </div>
          </div>
        </q-knob>

        <div v-if="TIME_DATA && TIME_DATA[TIME_IND] && !timer_halted">
          <q-chip>Schritt: {{ TIME_DATA[TIME_IND].step_ind + 1 }} /
            {{ programSteps.length }}</q-chip>
          <q-chip>Wdh.: {{ TIME_DATA[TIME_IND].rep_ind + 1 }} /
            {{
              programSteps[TIME_DATA[TIME_IND].step_ind].repetitions || 1
            }}</q-chip>
        </div>
        <div v-else-if="TIME_DATA && TIME_DATA[TIME_IND] && timer_halted">
          <MY_ITEM_BTN :label="'WEITER'" :icon="'play_arrow'" @clicked="proceedTimer()" />
        </div>
        <div v-else-if="timer_finished" class="text-orange-4">
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
import DurationSlider from "components/DurationSlider.vue";
import getRandomCitation from "src/tools/citate.js";
import { useAppStore } from "stores/appStore";
import playSound from "src/tools/sound.js";
import useTimer from "src/composables/useTimer";

export default {
  name: "ProgrammTimer",
  components: {
    MY_ITEM_BTN,
    DurationSlider,
  },
  setup() {
    const store = useAppStore();
    const {
      start: startInterval,
      stop: stopInterval,
      progress,
      isActive,
    } = useTimer();
    return { store, startInterval, stopInterval, progress, isActive };
  },
  data() {
    return {
      timer_finished: false,
      timer_halted: false,
      localData: {
        ...JSON.parse(JSON.stringify(this.store.lastPreset)),
        exerciseNames: this.store.lastPreset.exerciseNames || [],
      },
      // progress state handled by composable
      TIME_DATA: undefined,
      TIME_IND: undefined,
      label_new_preset: "Neues Programm",
      dragIndex: null,
      showActionDialog: false,
      showBreakDialog: false,
      showExerciseDialog: false,
      showRoundsDialog: false,
      showRoundBreakDialog: false,
      stepDialogIndex: null,
      repDialogIndex: null,
    };
  },
  mounted() {
    this.store.PROGRAM_STEPS = [];
  },

  computed: {
    programSteps() {
      return this.store.programSteps;
    },

    STEP_OPTIONS() {
      return [
        { label: "Action", value: "action" },
        { label: "Pause", value: "break" },
        { label: "Rundenpause", value: "round_break" },
      ];
    },
    TIMER_VALUE() {
      if (!this.TIME_DATA) return 0;
      // return the value of the current timer as difference from value and the current time
      const currentTimer = this.TIME_DATA[this.TIME_IND];
      return currentTimer.value - this.progress;
    },

    TIMER_PERCENTAGE() {
      if (!this.TIME_DATA) return 0;
      // return the value of the current timer as difference from value and the current time
      const currentTimer = this.TIME_DATA[this.TIME_IND];
      if (!currentTimer) return 0;
      return (this.progress / currentTimer.value) * 100;
    },

    TIMER_TYPE() {
      // return a string matching the value of the current timer
      if (!this.TIME_DATA) return "";
      const currentTimer = this.TIME_DATA[this.TIME_IND];
      if (!currentTimer) return "";
      switch (currentTimer.type) {
        case "action":
          return "Action";
        case "break":
          return "Pause";
        case "round_break":
          return "Rundenpause";
        default:
          return "";
      }
    },

    TIMER_COLOR() {
      // create a color string matching the value of the current timer
      if (!this.TIME_DATA) return "";
      const currentTimer = this.TIME_DATA[this.TIME_IND];
      if (this.timer_halted) return "grey-7";
      if (this.timer_finished) return "dark";
      if (!currentTimer) return "";
      switch (currentTimer.type) {
        case "action":
          return "green-4";
        case "break":
          return "red-4";
        case "round_break":
          return "grey-6";
        default:
          return "";
      }
    },

    DURATION_CALC() {
      if (this.TIME_DATA) return this.calcDuration(this.TIME_DATA);
      if (this.programSteps.length) return this.calcDuration(this.programSteps);
      return this.calcDuration(this.localData);
    },

    PRESETS() {
      return this.store.presets;
    },

    PRESET_LABEL() {
      return this.localData.label;
    },

    ZITAT() {
      return getRandomCitation();
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
      this.stopInterval(false);
      this.$router.go(-1);
    },

    // input is in seconds, output: mm:ss
    formatTime(seconds) {
      const date = new Date(null);
      date.setSeconds(seconds);
      return date.toISOString().substr(14, 5);
    },

    calcDuration(data) {
      let total = 0; // in seconds
      if (Array.isArray(data)) {
        if (data.length && data[0]._check !== undefined) {
          data.forEach((time) => {
            if (time._check === false) total += time.value;
          });
          total -= this.progress;
        } else {
          data.forEach((step) => {
            total += step.duration * (step.repetitions || 1);
          });
        }
      } else {
        const { action, break: _break, exercises, rounds, round_break } = data;
        const action_time = action.value * exercises.value * rounds.value;
        const break_time = _break.value * (exercises.value - 1) * rounds.value;
        const round_break_time = round_break.value * (rounds.value - 1);
        total = action_time + break_time + round_break_time;
      }
      return total;
    },

    addPreset() {
      this.localData = JSON.parse(JSON.stringify(this.store.lastPreset));
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
          this.store.removePreset(label);
          this.localData.label = "Letztes Programm";
        });
    },

    selectPreset(preset) {
      if (preset.data === undefined) {
        // load last workout
        this.localData = JSON.parse(JSON.stringify(this.store.lastPreset));
        return;
      } else {
        this.localData.action.value = preset.data.action.value;
        this.localData.break.value = preset.data.break.value;
        this.localData.exercises.value = preset.data.exercises.value;
        this.localData.rounds.value = preset.data.rounds.value;
        this.localData.round_break.value = preset.data.round_break.value;
        this.localData.label = preset.label;
      }
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
          // save preset
          const input = data.trim();
          // check if name already exists
          const preset_exists = this.store.presets.find(
            (preset) =>
              preset.label.trim().toLowerCase() === input.toLowerCase()
          );
          if (
            input.toLowerCase() ===
            this.label_new_preset.trim().toLowerCase() ||
            preset_exists
          ) {
            return this.$q.notify({
              message: "Bitte einen anderen Namen eingeben",
              color: "red-5",
              textColor: "white",
              icon: "warning",
            });
          } //else
          this.localData.label = input;
          const new_preset = {
            label: input,
            data: {
              action: {
                value: this.localData.action.value,
              },
              break: {
                value: this.localData.break.value,
              },
              exercises: {
                value: this.localData.exercises.value,
              },
              rounds: {
                value: this.localData.rounds.value,
              },
              round_break: {
                value: this.localData.round_break.value,
              },
            },
          };
          this.store.addPreset(new_preset);
        });
    },

    removeStep(index) {
      this.store.removeProgramStep(index);
    },

    openStepDurationDialog(idx) {
      this.stepDialogIndex = idx;
    },

    openStepRepDialog(idx) {
      this.repDialogIndex = idx;
    },

    generateStepsFromSettings() {
      const steps = [];
      const {
        action,
        break: brk,
        exercises,
        rounds,
        round_break,
        exerciseNames,
      } = this.localData;
      for (let r = 0; r < rounds.value; r++) {
        for (let e = 0; e < exercises.value; e++) {
          steps.push({
            type: "action",
            duration: action.value,
            repetitions: 1,
            name: exerciseNames[e],
          });
          if (e < exercises.value - 1) {
            steps.push({ type: "break", duration: brk.value, repetitions: 1 });
          }
        }
        if (r < rounds.value - 1) {
          steps.push({
            type: "round_break",
            duration: round_break.value,
            repetitions: 1,
          });
        }
      }
      this.store.PROGRAM_STEPS = steps;
    },

    onDragStart(idx) {
      this.dragIndex = idx;
    },

    onDrop(idx) {
      if (this.dragIndex === null) return;
      this.store.moveProgramStep(this.dragIndex, idx);
      this.dragIndex = null;
    },

    // TIMER
    async startTimer() {
      this.timer_finished = false;
      this.timer_halted = false;
      this.generateStepsFromSettings();
      this.TIME_DATA = this._prepareTimer(); // prepare an array with the times
      // COUNT DOWN 1s
      playSound("beepbeepbeep_1s", this.store.settings.audio_playback);
      await this.delay(1500);

      this.store.setLastPreset(JSON.parse(JSON.stringify(this.localData)));

      // start timer
      this.nextTimer();
    },

    // go through the times array and set the timer, set times[X]._check to true if finished
    nextTimer(VALUE) {
      //determine next timer, where _check is false
      if (this.TIME_DATA === undefined) return;
      // get the indes of the next timer
      this.TIME_IND = this.TIME_DATA.findIndex((time) => time._check === false);
      // if no timer is left, stop
      if (this.TIME_IND === -1) {
        this.timer_finished = true;
        this.progress = 0;
        playSound("tada", this.store.settings.audio_playback);
        return;
      } // else

      const nextTimer = this.TIME_DATA[this.TIME_IND];

      this.progress = VALUE || 0;
      // now start the intervall with ticks of 1s
      this.startInterval(() => {
        // check if timer is finished
        if (this.progress === nextTimer.value - 1)
          playSound("beep_1s", this.store.settings.audio_playback);
        if (this.progress >= nextTimer.value) {
          // set _check to true
          nextTimer._check = true;
          // stop timer
          this.stopInterval();
          // start next timer
          this.nextTimer();
        }
      });
    },

    proceedTimer() {
      this.timer_halted = false;
      this.nextTimer(this.progress);
    },

    _prepareTimer() {
      const times = [];
      this.programSteps.forEach((step, stepInd) => {
        const reps = step.repetitions || 1;
        for (let i = 0; i < reps; i++) {
          times.push({
            type: step.type,
            value: step.duration,
            name: step.name,
            step_ind: stepInd,
            rep_ind: i,
            _check: false,
          });
        }
      });
      return times;
    },

    stopTimer() {
      // stopp the timer / intervall
      this.stopInterval();
      this.timer_finished = false;
      this.timer_halted = true;
    },

    clearTimer() {
      // clear the timer
      this.stopTimer();
      this.TIME_DATA = undefined;
      this.progress = 0;
      this.timer_halted = false;
      this.timer_finished = false;
    },

    // SOME HELPER

    delay(time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    },

    // ENDE
  },
};
</script>
