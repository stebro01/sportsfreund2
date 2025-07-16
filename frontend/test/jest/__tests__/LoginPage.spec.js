import { beforeEach, describe, it, expect, jest } from "@jest/globals";
import { installQuasarPlugin } from "@quasar/quasar-app-extension-testing-unit-jest";
import { shallowMount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import LoginPage from "pages/LoginPage.vue";
import { useAuthStore } from "stores/authStore";

installQuasarPlugin();

describe("LoginPage", () => {
  let store;
  let wrapper;

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    store = useAuthStore();
    store.login = jest.fn();
    store.register = jest.fn();
    wrapper = shallowMount(LoginPage, {
      global: {
        plugins: [pinia],
        stubs: { "q-page": true, "q-input": true, "q-btn": true },
      },
    });
  });

  it("calls login on doLogin", async () => {
    wrapper.vm.username = "u";
    wrapper.vm.password = "p";
    await wrapper.vm.doLogin();
    expect(store.login).toHaveBeenCalledWith("u", "p");
  });

  it("calls register on doRegister", async () => {
    wrapper.vm.username = "u";
    wrapper.vm.password = "p";
    await wrapper.vm.doRegister();
    expect(store.register).toHaveBeenCalledWith("u", "p");
  });
});
