import { beforeEach, describe, it, expect, jest } from "@jest/globals";
import { installQuasarPlugin } from "@quasar/quasar-app-extension-testing-unit-jest";
import { shallowMount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import RegisterPage from "pages/RegisterPage.vue";
import { useAuthStore } from "stores/authStore";

installQuasarPlugin();

describe("RegisterPage", () => {
  let store;
  let wrapper;

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    store = useAuthStore();
    store.register = jest.fn();
    wrapper = shallowMount(RegisterPage, {
      global: {
        plugins: [pinia],
        stubs: { "q-page": true, "q-input": true, "q-btn": true },
      },
    });
  });

  it("calls register on doRegister", async () => {
    wrapper.vm.username = "u";
    wrapper.vm.password = "p";
    await wrapper.vm.doRegister();
    expect(store.register).toHaveBeenCalledWith("u", "p");
  });
});
