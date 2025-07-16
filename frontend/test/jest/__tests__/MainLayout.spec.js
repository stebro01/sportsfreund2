import { beforeEach, describe, it, expect, jest } from "@jest/globals";
import { installQuasarPlugin } from "@quasar/quasar-app-extension-testing-unit-jest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import MainLayout from "layouts/MainLayout.vue";
import { useAuthStore } from "stores/authStore";

installQuasarPlugin();

describe("MainLayout", () => {
  let wrapper;
  let store;

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    store = useAuthStore();
    store.uid = "abc";
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
    const copy = wrapper.find('[data-testid="copy-btn"]');
    await copy.trigger("click");
    expect(global.navigator.clipboard.writeText).toHaveBeenCalledWith("abc");
  });
});
