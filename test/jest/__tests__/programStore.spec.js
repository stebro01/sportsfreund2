import { beforeEach, describe, it, expect } from "@jest/globals";
import { createPinia, setActivePinia } from "pinia";
import { useProgramStore } from "stores/programStore";

describe("programStore", () => {
  let store;
  beforeEach(() => {
    localStorage.clear();
    const pinia = createPinia();
    setActivePinia(pinia);
    store = useProgramStore();
  });

  it("removePreset ignores surrounding spaces", () => {
    const initial = store.presets.length;
    store.removePreset("  Tabata  ");
    expect(store.presets.length).toBe(initial - 1);
    expect(store.presets.some((p) => p.label === "Tabata")).toBe(false);
  });

  it("updates preset data", () => {
    const data = {
      action: { value: 10 },
      break: { value: 1 },
      exercises: { value: 2 },
      rounds: { value: 1 },
      round_break: { value: 0 },
    };
    store.updatePreset("Tabata", data);
    expect(
      store.presets.find((p) => p.label === "Tabata").data.action.value
    ).toBe(10);
  });

  it("addPreset stores preset and persists", () => {
    const preset = {
      label: "Test",
      data: {
        action: { value: 1 },
        break: { value: 1 },
        exercises: { value: 1 },
        rounds: { value: 1 },
        round_break: { value: 0 },
      },
    };
    store.addPreset(preset);
    expect(store.presets).toContainEqual(preset);
    expect(JSON.parse(localStorage.getItem("presets"))).toContainEqual(preset);
  });

  it("removePreset deletes preset and updates storage", () => {
    const preset = { label: "Custom", data: { action: { value: 1 } } };
    store.addPreset(preset);
    store.removePreset("Custom");
    expect(store.presets.some((p) => p.label === "Custom")).toBe(false);
    expect(
      JSON.parse(localStorage.getItem("presets")).some(
        (p) => p.label === "Custom"
      )
    ).toBe(false);
  });

  it("step management functions modify program steps", () => {
    store.PROGRAM_STEPS = [
      { type: "action", duration: 1, repetitions: 1 },
      { type: "break", duration: 1, repetitions: 1 },
      { type: "action", duration: 2, repetitions: 1 },
    ];
    store.removeProgramStep(1);
    expect(store.programSteps.length).toBe(2);
    store.moveProgramStep(1, 0);
    expect(store.programSteps[0].duration).toBe(2);
    store.updateProgramStep(0, { duration: 5 });
    expect(store.programSteps[0].duration).toBe(5);
  });
});
