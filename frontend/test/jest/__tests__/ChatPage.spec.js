import { beforeEach, describe, it, expect, jest } from "@jest/globals";
import { installQuasarPlugin } from "@quasar/quasar-app-extension-testing-unit-jest";
import { shallowMount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import ChatPage from "pages/ChatPage.vue";
import { useAuthStore } from "stores/authStore";

installQuasarPlugin();

describe("ChatPage", () => {
  let store;
  let wrapper;
  let wsMock;

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    store = useAuthStore();
    store.sendFriendRequest = jest.fn();
    store.acceptFriend = jest.fn();
    store.uid = "me";
    wsMock = { send: jest.fn() };
    global.WebSocket = jest.fn(() => wsMock);
    wrapper = shallowMount(ChatPage, {
      global: {
        plugins: [pinia],
        stubs: { "q-page": true, "q-input": true, "q-btn": true },
      },
    });
  });

  it("connect opens websocket and updates state", async () => {
    wrapper.vm.friend = "you";
    await wrapper.vm.connect();
    expect(global.WebSocket).toHaveBeenCalledWith("ws://localhost:8000/ws/me");
    wsMock.onopen();
    expect(wrapper.vm.connected).toBe(true);
    wsMock.onmessage({ data: JSON.stringify({ from: "you", message: "hi" }) });
    expect(wrapper.vm.messages[0].text).toBe("hi");
  });

  it("send forwards message over websocket", async () => {
    wrapper.vm.friend = "you";
    await wrapper.vm.connect();
    wrapper.vm.text = "hello";
    wrapper.vm.send();
    expect(wsMock.send).toHaveBeenCalledWith(
      JSON.stringify({ to: "you", message: "hello" })
    );
    expect(wrapper.vm.text).toBe("");
  });
});
