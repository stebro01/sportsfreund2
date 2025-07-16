import { beforeEach, describe, it, expect, jest } from "@jest/globals";
import { installQuasarPlugin } from "@quasar/quasar-app-extension-testing-unit-jest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import MainLayout from "layouts/MainLayout.vue";
import { useAuthStore } from "stores/authStore";
import { useErrorStore } from "stores/errorStore";

jest.mock("stores/apiStore", () => {
  const getMock = jest.fn();
  return { useApiStore: () => ({ get: getMock }), getMock };
});
import { getMock } from "stores/apiStore";

installQuasarPlugin();

describe("MainLayout", () => {
  let wrapper;
  let store;
  let errorStore;

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    store = useAuthStore();
    errorStore = useErrorStore();
    store.uid = "abc";
    getMock.mockImplementation(() => {
      errorStore.setOk();
      return Promise.resolve({});
    });
    wrapper = mount(MainLayout, {
      global: {
        plugins: [pinia],
        stubs: {
          EssentialLink: true,
          "router-view": true,
        },
      },
    });
    global.navigator.clipboard = { writeText: jest.fn() };
  });

  it("copies uid to clipboard", async () => {
    const btn = wrapper.get('[data-testid="login-menu-btn"]');
    await btn.trigger("click");
    const copy = wrapper.get('[data-testid="copy-btn"]');
    await copy.trigger("click");
    expect(global.navigator.clipboard.writeText).toHaveBeenCalledWith("abc");
  });

  it("clears auth data on logout", async () => {
    store.username = "user";
    localStorage.setItem("uid", "abc");
    localStorage.setItem("username", "user");
    const btn = wrapper.get('[data-testid="login-menu-btn"]');
    await btn.trigger("click");
    const logout = wrapper.get('[data-testid="logout-btn"]');
    await logout.trigger("click");
    expect(store.uid).toBeNull();
    expect(store.username).toBe("");
    expect(localStorage.getItem("uid")).toBeNull();
    expect(localStorage.getItem("username")).toBeNull();
  });

  it("shows server reachable tooltip when ping succeeds", async () => {
    await wrapper.vm.$nextTick();
    expect(errorStore.apiStatus).toBe("ok");
    expect(wrapper.vm.apiTooltip).toBe("Server reachable");
  });

  it("shows error tooltip when ping fails", async () => {
    getMock.mockImplementation(() => {
      errorStore.setError("fail");
      return Promise.reject(new Error("fail"));
    });
    const pinia = createPinia();
    setActivePinia(pinia);
    useAuthStore().uid = "abc";
    errorStore = useErrorStore();
    wrapper = mount(MainLayout, {
      global: {
        plugins: [pinia],
        stubs: { EssentialLink: true, "router-view": true },
      },
    });
    await wrapper.vm.$nextTick();
    expect(errorStore.apiStatus).toBe("error");
    expect(wrapper.vm.apiTooltip).toBe("fail");
  });
});
