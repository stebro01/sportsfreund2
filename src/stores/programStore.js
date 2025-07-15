import { defineStore } from "pinia";

const templatePresets = [
  { label: "letztes Workout laden", data: undefined },
  {
    label: "Tabata",
    data: {
      action: { value: 30 },
      break: { value: 5 },
      exercises: { value: 4 },
      rounds: { value: 5 },
      round_break: { value: 15 },
    },
  },
  {
    label: "Ohio",
    data: {
      action: { value: 30 },
      break: { value: 5 },
      exercises: { value: 3 },
      rounds: { value: 3 },
      round_break: { value: 5 },
    },
  },
];

const defaultPreset = {
  action: { value: 5, unit: "s" },
  break: { value: 2, unit: "s" },
  exercises: { value: 2, unit: "x" },
  rounds: { value: 2, unit: "x" },
  round_break: { value: 10, unit: "s" },
  label: "Default",
};

export const useProgramStore = defineStore("program", {
  state: () => {
    let lastPreset;
    try {
      const rawLastPreset = localStorage.getItem("last_preset");
      if (rawLastPreset !== null) lastPreset = JSON.parse(rawLastPreset);
    } catch (e) {
      lastPreset = undefined;
    }

    let presets;
    try {
      const rawPresets = localStorage.getItem("presets");
      if (rawPresets !== null) presets = JSON.parse(rawPresets);
    } catch (e) {
      presets = null;
    }

    return {
      LAST_PRESET: lastPreset || undefined,
      PRESETS: presets || templatePresets,
      PROGRAM_STEPS: [],
    };
  },
  getters: {
    lastPreset: (state) => state.LAST_PRESET || defaultPreset,
    presets: (state) => state.PRESETS,
    programSteps: (state) => state.PROGRAM_STEPS,
  },
  actions: {
    setLastPreset(payload) {
      localStorage.setItem("last_preset", JSON.stringify(payload));
      this.LAST_PRESET = payload;
    },
    addPreset(payload) {
      this.PRESETS.push(payload);
      localStorage.setItem("presets", JSON.stringify(this.PRESETS));
    },
    removePreset(label) {
      const target = label.trim().toLowerCase();
      this.PRESETS = this.PRESETS.filter(
        (preset) => preset.label.trim().toLowerCase() !== target
      );
      localStorage.setItem("presets", JSON.stringify(this.PRESETS));
    },
    removeProgramStep(index) {
      this.PROGRAM_STEPS.splice(index, 1);
    },
    moveProgramStep(from, to) {
      const item = this.PROGRAM_STEPS.splice(from, 1)[0];
      this.PROGRAM_STEPS.splice(to, 0, item);
    },
    updateProgramStep(index, partial) {
      this.PROGRAM_STEPS[index] = {
        ...this.PROGRAM_STEPS[index],
        ...partial,
      };
    },
  },
});
