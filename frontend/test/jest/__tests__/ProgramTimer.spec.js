import {
  beforeEach,
  afterEach,
  describe,
  it,
  expect,
  jest,
} from "@jest/globals";
import { installQuasarPlugin } from "@quasar/quasar-app-extension-testing-unit-jest";
import { shallowMount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
jest.mock("src/tools/sound.js", () => ({
  __esModule: true,
  default: jest.fn(),
}));
import ProgramTimer from "pages/Timer/ProgrammTimer.vue";
import ProgramSelectDialog from "components/ProgramSelectDialog.vue";
import { useAppStore } from "stores/appStore";
import { useProgramStore } from "stores/programStore";
import { calcDuration } from "src/utils/timeUtils";

installQuasarPlugin();

describe("ProgramTimer", () => {
  let wrapper;
  let appStore;
  let programStore;

  beforeEach(() => {
    jest.useFakeTimers();
    const pinia = createPinia();
    setActivePinia(pinia);
    appStore = useAppStore();
    programStore = useProgramStore();
    programStore.PROGRAM_STEPS = [
      { type: "action", duration: 1, repetitions: 1 },
    ];
    wrapper = shallowMount(ProgramTimer, {
      global: {
        plugins: [pinia],
        components: { ProgramSelectDialog },
        mocks: { $router: { go: jest.fn() } },
        stubs: {
          "q-page": true,
          "q-btn": true,
          "q-chip": true,
          "q-list": true,
          "q-item": true,
          "q-item-section": true,
          "q-dialog": true,
          "q-popup-proxy": true,
          "q-card": true,
          "q-card-section": true,
          "duration-slider": true,
          "q-slider": true,
          "q-select": true,
          "q-input": true,
          "q-tooltip": true,
          "q-separator": true,
          "q-icon": true,
          "q-knob": true,
        },
      },
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("runs program and resets progress when finished", () => {
    const timeData = wrapper.vm._prepareTimer();
    wrapper.vm.timerStore.timeData = timeData;
    wrapper.vm.timerStore.nextProgramTimer();
    jest.advanceTimersByTime(1000);
    expect(wrapper.vm.timerStore.isProgramFinished).toBe(true);
    expect(wrapper.vm.timerStore.programProgress).toBe(0);
  });

  it("stopTimer halts timer and resets progress", () => {
    wrapper.vm.startTimer();
    jest.advanceTimersByTime(1500);
    jest.advanceTimersByTime(500);
    wrapper.vm.stopTimer();
    expect(wrapper.vm.timerStore.isProgramHalted).toBe(true);
    expect(wrapper.vm.timerStore.programProgress).toBe(0);
  });

  it("generates program steps from settings", () => {
    wrapper.vm.localData.action.value = 2;
    wrapper.vm.localData.break.value = 1;
    wrapper.vm.localData.exercises.value = 2;
    wrapper.vm.localData.rounds.value = 1;
    wrapper.vm.localData.round_break.value = 0;
    wrapper.vm.localData.exerciseNames = ["a", "b"];
    wrapper.vm.generateStepsFromSettings();
    expect(programStore.programSteps).toEqual([
      { type: "action", duration: 2, repetitions: 1, name: "a" },
      { type: "break", duration: 1, repetitions: 1 },
      { type: "action", duration: 2, repetitions: 1, name: "b" },
    ]);
  });

  it("prepares timer data including names", () => {
    programStore.PROGRAM_STEPS = [
      { type: "action", duration: 1, repetitions: 1, name: "x" },
    ];
    const times = wrapper.vm._prepareTimer();
    expect(times[0].name).toBe("x");
  });

  it("uses last preset duration when no program steps exist on mount", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    localStorage.clear();
    const localStore = useProgramStore();
    const altWrapper = shallowMount(ProgramTimer, {
      global: {
        plugins: [pinia],
        components: { ProgramSelectDialog },
        mocks: { $router: { go: jest.fn() } },
        stubs: {
          "q-page": true,
          "q-btn": true,
          "q-chip": true,
          "q-list": true,
          "q-item": true,
          "q-item-section": true,
          "q-dialog": true,
          "q-popup-proxy": true,
          "q-card": true,
          "q-card-section": true,
          "duration-slider": true,
          "q-slider": true,
          "q-select": true,
          "q-input": true,
          "q-tooltip": true,
          "q-separator": true,
          "q-icon": true,
          "q-knob": true,
        },
      },
    });
    const expected = calcDuration(localStore.lastPreset);
    expect(altWrapper.vm.DURATION_CALC).toBe(expected);
  });

  it("updates program when preset is selected", async () => {
    const preset = programStore.presets.find((p) => p.data);
    wrapper.vm.selectPreset(preset);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.DURATION_CALC).toBe(calcDuration(preset.data));
    expect(wrapper.vm.timerStore.isProgramActive).toBe(false);
  });

  it("recalculates duration when settings change", async () => {
    const start = wrapper.vm.DURATION_CALC;
    wrapper.vm.localData.action.value += 1;
    wrapper.vm.generateStepsFromSettings();
    await wrapper.vm.$nextTick();
    const expected = calcDuration(wrapper.vm.programSteps);
    expect(wrapper.vm.DURATION_CALC).toBe(expected);
    expect(wrapper.vm.DURATION_CALC).not.toBe(start);
  });
});
