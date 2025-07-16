import { beforeEach, describe, it, expect, jest } from "@jest/globals";
import { installQuasarPlugin } from "@quasar/quasar-app-extension-testing-unit-jest";
import { shallowMount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import RegisterPage from "pages/RegisterPage.vue";
import { useAuthStore } from "stores/authStore";
import { createRouter, createMemoryHistory } from "vue-router";

installQuasarPlugin();

describe("RegisterPage", () => {
  let store;
  let wrapper;
  let routerPush;
  let notifyMock;

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    store = useAuthStore();
    store.register = jest.fn().mockResolvedValue();
    routerPush = jest.fn();
    const router = createRouter({ history: createMemoryHistory(), routes: [] });
    router.push = routerPush;
    wrapper = shallowMount(RegisterPage, {
      global: {
        plugins: [pinia, router],
        stubs: { "q-page": true, "q-input": true, "q-btn": true },
      },
    });
    notifyMock = jest.fn();
    wrapper.vm.$q.notify = notifyMock;
  });

  it("calls register on doRegister", async () => {
    wrapper.vm.username = "u";
    wrapper.vm.password = "p";
    wrapper.vm.passwordConfirm = "p";
    await wrapper.vm.doRegister();
    expect(store.register).toHaveBeenCalledWith("u", "p");
  });

  it("prevents registration when passwords mismatch", async () => {
    wrapper.vm.username = "u";
    wrapper.vm.password = "a";
    wrapper.vm.passwordConfirm = "b";
    await wrapper.vm.doRegister();
    expect(store.register).not.toHaveBeenCalled();
    expect(notifyMock).toHaveBeenCalled();
  });

  it("navigates to Login on success", async () => {
    wrapper.vm.username = "u";
    wrapper.vm.password = "p";
    wrapper.vm.passwordConfirm = "p";
    await wrapper.vm.doRegister();
    expect(routerPush).toHaveBeenCalledWith({ name: "Login" });
  });
});
