import { defineStore } from "pinia";
import playSound from "src/tools/sound.js";

export const useTimerStore = defineStore("timer", {
  state: () => ({
    // Simple timer state
    duration: 0,
    progress: 0,
    running: false,
    finished: false,
    _interval: null,

    // Program timer state
    programRunning: false,
    programFinished: false,
    programHalted: false,
    timeData: undefined,
    timeIndex: undefined,
    programProgress: 0,
    _programInterval: null,
  }),

  getters: {
    // Simple timer getters
    isActive: (state) => state.running,
    isFinished: (state) => state.finished,

    // Program timer getters
    isProgramActive: (state) => state.programRunning,
    isProgramFinished: (state) => state.programFinished,
    isProgramHalted: (state) => state.programHalted,

    currentTimerValue() {
      if (!this.timeData || this.timeIndex === undefined) return 0;
      const currentTimer = this.timeData[this.timeIndex];
      return currentTimer ? currentTimer.value - this.programProgress : 0;
    },

    currentTimerPercentage() {
      if (!this.timeData || this.timeIndex === undefined) return 0;
      const currentTimer = this.timeData[this.timeIndex];
      if (!currentTimer) return 0;
      return (this.programProgress / currentTimer.value) * 100;
    },

    currentTimerType() {
      if (!this.timeData || this.timeIndex === undefined) return "";
      const currentTimer = this.timeData[this.timeIndex];
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

    currentTimerColor() {
      if (!this.timeData || this.timeIndex === undefined) return "";
      const currentTimer = this.timeData[this.timeIndex];

      if (this.programHalted) return "grey-7";
      if (this.programFinished) return "dark";
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
  },

  actions: {
    // Simple timer actions
    start(duration) {
      this.stop();
      this.duration = duration;
      this.progress = 0;
      this.finished = false;
      this.running = true;
      this._interval = setInterval(() => {
        this.tick();
      }, 1000);
    },

    tick() {
      this.progress += 1;
      if (this.progress >= this.duration) {
        this.stop(false);
        this.finished = true;
        this.progress = 0;
      }
    },

    stop(reset = true) {
      if (this._interval) {
        clearInterval(this._interval);
        this._interval = null;
      }
      this.running = false;
      if (reset) {
        this.progress = 0;
        this.finished = false;
      }
    },

    // Program timer actions
    async startProgramTimer(timeData, audioPlayback = true) {
      this.programFinished = false;
      this.programHalted = false;
      this.timeData = timeData;

      // Countdown sound
      if (audioPlayback) {
        playSound("beepbeepbeep_1s", audioPlayback);
      }
      await this.delay(1500);

      this.nextProgramTimer();
    },

    nextProgramTimer(value = 0) {
      if (!this.timeData) return;

      // Find next timer where _check is false
      this.timeIndex = this.timeData.findIndex((time) => time._check === false);

      // If no timer is left, finish
      if (this.timeIndex === -1) {
        this.programFinished = true;
        this.programProgress = 0;
        this.programRunning = false;
        playSound("tada", true);
        return;
      }

      const nextTimer = this.timeData[this.timeIndex];
      this.programProgress = value;
      this.programRunning = true;

      // Start interval with 1s ticks
      this._programInterval = setInterval(() => {
        // Check if timer is finished
        if (this.programProgress === nextTimer.value - 1) {
          playSound("beep_1s", true);
        }

        if (this.programProgress >= nextTimer.value) {
          // Mark current timer as finished
          nextTimer._check = true;
          // Stop current timer
          this.stopProgramInterval();
          // Start next timer
          this.nextProgramTimer();
        } else {
          this.programProgress += 1;
        }
      }, 1000);
    },

    proceedProgramTimer() {
      this.programHalted = false;
      this.nextProgramTimer(this.programProgress);
    },

    stopProgramTimer() {
      this.stopProgramInterval();
      this.programFinished = false;
      this.programHalted = true;
      this.programRunning = false;
    },

    clearProgramTimer() {
      this.stopProgramTimer();
      this.timeData = undefined;
      this.timeIndex = undefined;
      this.programProgress = 0;
      this.programHalted = false;
      this.programFinished = false;
      this.programRunning = false;
    },

    stopProgramInterval() {
      if (this._programInterval) {
        clearInterval(this._programInterval);
        this._programInterval = null;
      }
      this.programRunning = false;
    },

    // Helper methods
    delay(time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    },
  },
});
