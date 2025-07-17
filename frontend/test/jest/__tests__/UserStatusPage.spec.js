import { beforeEach, describe, it, expect, jest } from "@jest/globals";
import { installQuasarPlugin } from "@quasar/quasar-app-extension-testing-unit-jest";
import { shallowMount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import UserStatusPage from "pages/UserStatusPage.vue";
import { useAuthStore } from "stores/authStore";

jest.mock("stores/apiStore", () => ({
  useApiStore: () => ({ init: jest.fn() }),
}));

installQuasarPlugin();

describe("UserStatusPage", () => {
  let wrapper;
  let store;

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    store = useAuthStore();
    wrapper = shallowMount(UserStatusPage, {
      global: {
        plugins: [pinia],
        stubs: { "q-input": true, "q-btn": true },
      },
    });
  });

  it("renders header", () => {
    const header = wrapper.find(".text-h5");
    expect(header.exists()).toBe(true);
    expect(header.text()).toBe("User Status");
  });
});
