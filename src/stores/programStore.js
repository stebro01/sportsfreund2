import { defineStore } from "pinia";
import { formatTime, calcDuration } from "src/utils/timeUtils";

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

    // Utility getters
    formatTime: () => formatTime,
    calcDuration: () => calcDuration,
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
    updatePreset(label, data) {
      const target = label.trim().toLowerCase();
      const preset = this.PRESETS.find(
        (p) => p.label.trim().toLowerCase() === target
      );
      if (preset) {
        preset.data = JSON.parse(JSON.stringify(data));
        localStorage.setItem("presets", JSON.stringify(this.PRESETS));
      }
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

    // Program generation methods
    generateStepsFromSettings(settings) {
      const steps = [];
      const {
        action,
        break: brk,
        exercises,
        rounds,
        round_break,
        exerciseNames = [],
      } = settings;

      for (let r = 0; r < rounds.value; r++) {
        for (let e = 0; e < exercises.value; e++) {
          steps.push({
            type: "action",
            duration: action.value,
            repetitions: 1,
            name: exerciseNames[e] || "",
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
      this.PROGRAM_STEPS = steps;
      return steps;
    },

    prepareTimerData() {
      const times = [];
      this.PROGRAM_STEPS.forEach((step, stepInd) => {
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

    // Preset management methods
    selectPreset(preset, currentData) {
      if (preset.data === undefined) {
        // load last workout
        return JSON.parse(JSON.stringify(this.lastPreset));
      } else {
        const newData = { ...currentData };
        newData.action.value = preset.data.action.value;
        newData.break.value = preset.data.break.value;
        newData.exercises.value = preset.data.exercises.value;
        newData.rounds.value = preset.data.rounds.value;
        newData.round_break.value = preset.data.round_break.value;
        newData.label = preset.label;
        return newData;
      }
    },

    createNewPreset(label, data) {
      const new_preset = {
        label,
        data: {
          action: { value: data.action.value },
          break: { value: data.break.value },
          exercises: { value: data.exercises.value },
          rounds: { value: data.rounds.value },
          round_break: { value: data.round_break.value },
        },
      };
      this.addPreset(new_preset);
      return new_preset;
    },

    isPresetNameValid(name, excludeLabel = null) {
      const input = name.trim();
      if (input.toLowerCase() === excludeLabel?.toLowerCase()) {
        return false;
      }

      const preset_exists = this.PRESETS.find(
        (preset) => preset.label.trim().toLowerCase() === input.toLowerCase()
      );

      return !preset_exists;
    },
  },
});
