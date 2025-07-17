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
  let notifyMock;

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
        stubs: {
          "q-page": true,
          "q-input": true,
          "q-btn": true,
          "q-select": true,
        },
      },
    });
    notifyMock = jest.fn();
    wrapper.vm.$q.notify = notifyMock;
  });

  it("opens websocket on mount and loads messages", async () => {
    expect(global.WebSocket).toHaveBeenCalledWith("ws://localhost:8000/ws/me");
    wsMock.onopen();
    wrapper.vm.friend = "you";
    wsMock.onmessage({ data: JSON.stringify({ from: "you", message: "hi" }) });
    expect(store.histories["you"][0].text).toBe("hi");
  });

  it("send forwards message over websocket", async () => {
    wrapper.vm.friend = "you";
    await store.connect();
    wrapper.vm.text = "hello";
    wrapper.vm.send();
    expect(wsMock.send).toHaveBeenCalledWith(
      JSON.stringify({ to: "you", message: "hello" }),
    );
    expect(wrapper.vm.text).toBe("");
  });

  it("shows error notify when api fails", async () => {
    store.sendFriendRequest.mockRejectedValue(new Error("boom"));
    wrapper.vm.friend = "you";
    await store.connect();
    expect(notifyMock).toHaveBeenCalledWith({
      type: "negative",
      message: "boom",
    });
  });
});
