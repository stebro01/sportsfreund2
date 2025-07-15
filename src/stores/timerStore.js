import { defineStore } from "pinia";

export const useTimerStore = defineStore("timer", {
  state: () => ({
    duration: 0,
    progress: 0,
    running: false,
    finished: false,
    _interval: null,
  }),
  actions: {
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
  },
});
