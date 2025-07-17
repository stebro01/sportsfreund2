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
  let notifyMock;

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    store = useAuthStore();
    store.login = jest.fn().mockResolvedValue();
    store.register = jest.fn();
    wrapper = shallowMount(LoginPage, {
      global: {
        plugins: [pinia],
        stubs: { "q-input": true, "q-btn": true },
      },
    });
    notifyMock = jest.fn();
    wrapper.vm.$q.notify = notifyMock;
  });

  it("shows success notify on login", async () => {
    wrapper.vm.username = "u";
    wrapper.vm.password = "p";
    await wrapper.vm.doLogin();
    expect(store.login).toHaveBeenCalledWith("u", "p");
    expect(notifyMock).toHaveBeenCalledWith({
      type: "positive",
      message: "Login successful",
    });
  });

  it("shows error notify on failed login", async () => {
    store.login.mockRejectedValue(new Error("bad"));
    wrapper.vm.username = "u";
    wrapper.vm.password = "p";
    await wrapper.vm.doLogin();
    expect(notifyMock).toHaveBeenCalledWith({
      type: "negative",
      message: "bad",
    });
  });

  it("calls register on doRegister", async () => {
    wrapper.vm.username = "u";
    wrapper.vm.password = "p";
    await wrapper.vm.doRegister();
    expect(store.register).toHaveBeenCalledWith("u", "p");
  });

  it("renders header", () => {
    const header = wrapper.find(".text-h5");
    expect(header.exists()).toBe(true);
    expect(header.text()).toBe("Login");
  });
});
