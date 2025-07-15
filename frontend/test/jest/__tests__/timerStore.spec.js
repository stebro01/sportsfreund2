import {
  beforeEach,
  afterEach,
  describe,
  it,
  expect,
  jest,
} from "@jest/globals";
import { createPinia, setActivePinia } from "pinia";
import { useTimerStore } from "stores/timerStore";

describe("timerStore", () => {
  let store;

  beforeEach(() => {
    jest.useFakeTimers();
    setActivePinia(createPinia());
    store = useTimerStore();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("starts timer and finishes after duration", () => {
    store.start(2);
    expect(store.running).toBe(true);
    jest.advanceTimersByTime(1000);
    expect(store.progress).toBe(1);
    jest.advanceTimersByTime(1000);
    expect(store.finished).toBe(true);
    expect(store.running).toBe(false);
  });

  it("stop resets state by default", () => {
    store.start(5);
    jest.advanceTimersByTime(1000);
    store.stop();
    expect(store.running).toBe(false);
    expect(store.progress).toBe(0);
    expect(store.finished).toBe(false);
  });

  it("stop(false) keeps progress", () => {
    store.start(3);
    jest.advanceTimersByTime(1000);
    store.stop(false);
    expect(store.progress).toBe(1);
    expect(store.finished).toBe(false);
  });
});
