import { defineStore } from "pinia";
import { useAuthStore } from "./authStore";

export const useAppStore = defineStore("app", {
  state: () => {
    let pinnedTimers;
    try {
      const rawPinned = localStorage.getItem("pinned_timers");
      if (rawPinned !== null) pinnedTimers = JSON.parse(rawPinned);
    } catch (e) {
      pinnedTimers = [];
    }

    return {
      SETTINGS: {
        audio_playback: true,
        quick_timer_start_value: 20, // in seconds
      },
      PINNED_TIMERS: pinnedTimers || [],
    };
  },
  getters: {
    essentialLinks: () => {
      const auth = useAuthStore();
      const links = [
        { titel: "Home", caption: "zurück", icon: "home", route: "Index" },
        { seperator: true },
        { titel: "Über", caption: "about", icon: "info", route: "About" },
        {
          titel: "ChangeLog",
          caption: "changelog",
          icon: "info",
          route: "ChangeLog",
        },
      ];
      if (!auth.uid) {
        links.push({
          titel: "Login",
          caption: "login",
          icon: "login",
          route: "Login",
        });
      } else {
        links.push({
          titel: "Chat",
          caption: "chat",
          icon: "chat",
          route: "Chat",
        });
        links.push({
          titel: "Status",
          caption: "status",
          icon: "person",
          route: "UserStatus",
        });
      }
      return links;
    },
    env: () => ({
      APP_URL: process.env.APP_URL,
      APP_VERSION: process.env.APP_VERSION,
      APP_NAME: process.env.APP_NAME,
    }),
    settings: (state) => state.SETTINGS,
    pinnedTimers: (state) => state.PINNED_TIMERS,
  },
  actions: {
    setSettingsAudioPlayback(payload) {
      this.SETTINGS.audio_playback = payload;
    },
    setSettingsQuickTimerStartValue(payload) {
      this.SETTINGS.quick_timer_start_value = payload;
    },

    pinTimer(duration) {
      const existingIndex = this.PINNED_TIMERS.indexOf(duration);
      if (existingIndex !== -1) {
        this.PINNED_TIMERS.splice(existingIndex, 1);
      }
      this.PINNED_TIMERS.unshift(duration);
      this.PINNED_TIMERS = this.PINNED_TIMERS.slice(0, 5);
      window.localStorage.setItem(
        "pinned_timers",
        JSON.stringify(this.PINNED_TIMERS)
      );
    },
    unpinTimer(duration) {
      this.PINNED_TIMERS = this.PINNED_TIMERS.filter((t) => t !== duration);
      window.localStorage.setItem(
        "pinned_timers",
        JSON.stringify(this.PINNED_TIMERS)
      );
    },
    removePinnedTimers() {
      this.PINNED_TIMERS = [];
      window.localStorage.setItem(
        "pinned_timers",
        JSON.stringify(this.PINNED_TIMERS)
      );
    },
    log(payload) {
      console.log(payload);
    },
  },
});
