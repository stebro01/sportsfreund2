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
    expect(store.presets.find((p) => p.label === "Tabata").data.action.value).toBe(10);
  });
});
