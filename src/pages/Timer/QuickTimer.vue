<template>
  <q-page data-cy="page_about" class="full-height">
    <!-- TOP BAR -->
    <div>
      <q-btn
        icon="close"
        size="lg"
        flat
        round
        class="absolute-top-right"
        @click="goBack()"
      />
      <q-btn
        :icon="!store.settings.audio_playback ? 'volume_off' : 'volume_up'"
        size="lg"
        flat
        round
        class="absolute-top-left"
        @click="store.setSettingsAudioPlayback(!store.settings.audio_playback)"
      />
    </div>

    <!-- CONTENT -->
    <div
      class="column justify-center items-center"
      style="height: 100vh; width: 100vw"
    >
      <!-- TITLE -->
      <div class="col-1 full-width text-center">QuickTimer</div>

      <!-- TIMER ELEMENT -->
      <!-- BTN -->
      <div class="col-2">
        <!-- START -->
        <q-btn v-if="!isActive" class="my-main-btn" @click="startTimer()"
          >Start</q-btn
        >
        <!-- STOP -->
        <q-btn v-if="isActive" class="my-main-btn" @click="stopTimer()"
          >Stop</q-btn
        >
      </div>

      <!-- CIRCLE -->
      <div
        class="col-6 row justify-center items-center"
        style="position: relative"
      >
        <q-knob
          show-value
          class="text-white q-ma-md timer-knob"
          v-model="TIMER_VALUE"
          size="180px"
          :thickness="0.2"
          color="green-4"
          :center-color="timer_finished ? 'green-4' : 'grey-6'"
          track-color="transparent"
          readonly=""
        >
          <div class="text-center">
            <div>
              {{ formatTime(time - timer.progress) }}
              <q-popup-edit
                v-if="!isActive"
                v-model="time"
                auto-save
                v-slot="scope"
              >
                <q-input
                  v-model="scope.value"
                  dense
                  autofocus
                  counter
                  @keyup.enter="scope.set"
                />
              </q-popup-edit>
            </div>
            <div class="my-small-text">Sekunden</div>
          </div>
        </q-knob>

        <q-btn
          flat
          round
          dense
          size="lg"
          icon="push_pin"
          :color="isPinned ? 'amber-7' : 'grey-6'"
          @click="togglePin"
          class="absolute"
          style="top: 10px; right: 10px"
        >
          <q-tooltip>Pin</q-tooltip>
        </q-btn>
      </div>

      <!-- BUTTONS -->
      <div class="col-1">
        <div class="row justify-center q-gutter-md" v-if="!isActive">
          <q-btn
            class="my-decent-text"
            color="positive"
            @click="addTime(bigStep)"
            round
            >+{{ bigStep }}</q-btn
          >
          <q-btn
            class="my-decent-text"
            color="positive"
            @click="addTime(1)"
            round
            >+1</q-btn
          >
          <q-btn
            class="my-decent-text"
            color="negative"
            @click="addTime(-1)"
            round
            >-1</q-btn
          >
          <q-btn
            class="my-decent-text"
            color="negative"
            @click="addTime(-bigStep)"
            round
            >-{{ bigStep }}</q-btn
          >
        </div>
      </div>
      <div class="col-2"></div>
    </div>
    <div
      class="col-1 bottom-container fixed-bottom row justify-center items-center q-pa-sm"
      v-if="store.pinnedTimers.length"
    >
      <q-btn
        v-for="t in store.pinnedTimers"
        :key="'p' + t"
        round
        size="sm"
        color="amber-7"
        class="q-mx-md"
        no-caps
        @click="selectTime(t)"
      >
        {{ t }}s
      </q-btn>

      <q-btn
        class="absolute-bottom-right"
        @click="store.removePinnedTimers()"
        icon="delete"
        round
      >
        <q-tooltip>Entferne alle voreingestellten Timer</q-tooltip>
      </q-btn>
    </div>
  </q-page>
</template>

<script>
import { useAppStore } from "stores/appStore";
import playSound from "src/tools/sound.js";
import { useTimerStore } from "stores/timerStore";
export default {
  name: "QuickTimer",
  components: {},
  setup() {
    const store = useAppStore();
    const timer = useTimerStore();
    return { store, timer };
  },
  data() {
    return {
      time: this.store.settings.quick_timer_start_value,
      timer_finished: false,
    };
  },
  mounted() {},

  computed: {
    TIMER_VALUE() {
      return (this.timer.progress / this.time) * 100;
    },
    bigStep() {
      return this.time >= 60 ? 10 : 5;
    },
    isPinned() {
      return this.store.pinnedTimers.includes(this.time);
    },
    isActive() {
      return this.timer.running;
    },
  },

  watch: {
    "timer.finished"(val) {
      this.timer_finished = val;
      if (val) {
        playSound("gong", this.store.settings.audio_playback);
        this.store.setSettingsQuickTimerStartValue(this.time);
        if (typeof this.store.addRecentTimer === "function") {
          this.store.addRecentTimer(this.time);
        }
      }
    },
  },

  methods: {
    goBack() {
      this.timer.stop();
      this.$router.go(-1);
    },

    addTime(value) {
      this.timer_finished = false;
      this.time = this.time + value;
      if (this.time <= 0) {
        this.time = this.store.settings.quick_timer_start_value;
      }
    },

    formatTime(seconds) {
      if (seconds >= 60) {
        const date = new Date(null);
        date.setSeconds(seconds);
        return date.toISOString().substr(14, 5);
      }
      return seconds;
    },

    // TIMER
    startTimer() {
      playSound("gong", this.store.settings.audio_playback);
      this.timer_finished = false;
      this.timer.start(this.time);
    },

    stopTimer() {
      this.timer.stop();
      this.timer_finished = false;
    },
    selectTime(t) {
      this.time = t;
      this.timer_finished = false;
    },
    pinTimer(t) {
      this.store.pinTimer(t);
    },
    unpinTimer(t) {
      this.store.unpinTimer(t);
    },
    togglePin() {
      if (this.isPinned) {
        this.unpinTimer(this.time);
      } else {
        this.pinTimer(this.time);
      }
    },

    // ENDE
  },
};
</script>

<style scoped>
.timer-knob {
  box-shadow: 0 0 15px rgba(0, 255, 100, 0.6);
  border-radius: 50%;
}

.bottom-container {
  background: rgba(0, 0, 0, 0.4);
}
</style>
