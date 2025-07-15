import { describe, it, expect } from "@jest/globals";
import { installQuasarPlugin } from "@quasar/quasar-app-extension-testing-unit-jest";
import { shallowMount } from "@vue/test-utils";
import DurationSlider from "components/DurationSlider.vue";

installQuasarPlugin();

describe("DurationSlider", () => {
  function mountSlider(value, props = {}) {
    return shallowMount(DurationSlider, {
      props: { modelValue: value, ...props },
      global: {
        stubs: {
          "q-slider": true,
          "q-btn": true,
          "q-popup-edit": true,
          "q-input": true,
        },
      },
    });
  }

  it("formats label for values below 60s", () => {
    const wrapper = mountSlider(30);
    expect(wrapper.vm.labelValue).toBe("30s");
    expect(wrapper.vm.currentStep).toBe(5);
  });

  it("formats label for values of one minute or more", () => {
    const wrapper = mountSlider(75);
    expect(wrapper.vm.labelValue).toBe("01:15");
    expect(wrapper.vm.currentStep).toBe(15);
  });

  it("uses provided step prop", () => {
    const wrapper = mountSlider(120, { step: 1 });
    expect(wrapper.vm.step).toBe(1);
  });
});
