import { defineStore } from "pinia";

export const useErrorStore = defineStore("error", {
  state: () => ({
    apiStatus: "unknown",
    lastError: null,
  }),
  actions: {
    setOk() {
      this.apiStatus = "ok";
      this.lastError = null;
    },
    setError(message) {
      this.apiStatus = "error";
      this.lastError = message;
    },
  },
});
