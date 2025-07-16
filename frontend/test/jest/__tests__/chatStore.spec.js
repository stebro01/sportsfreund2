import { beforeEach, describe, it, expect, jest } from "@jest/globals";
import { createPinia, setActivePinia } from "pinia";
import { useChatStore } from "stores/chatStore";
import { useAuthStore } from "stores/authStore";
import { Notify } from "quasar";

jest.mock("stores/apiStore", () => {
  const postMock = jest.fn(() => Promise.resolve({ data: {} }));
  const getMock = jest.fn(() => Promise.resolve({ data: {} }));
  return {
    useApiStore: () => ({ post: postMock, get: getMock }),
    postMock,
    getMock,
  };
});
import { postMock, getMock } from "stores/apiStore";

describe("chatStore requests", () => {
  let store;
  let auth;
  let ws;

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    store = useChatStore();
    auth = useAuthStore();
    auth.uid = "me";
    Notify.create = jest.fn();
    ws = { send: jest.fn() };
    global.WebSocket = jest.fn(() => ws);
    store.openSocket();
  });

  it("stores chat requests without duplicates", () => {
    ws.onmessage({
      data: JSON.stringify({ event: "chat_request", from: "u1" }),
    });
    expect(store.requests).toEqual(["u1"]);
    ws.onmessage({
      data: JSON.stringify({ event: "chat_request", from: "u1" }),
    });
    expect(store.requests).toEqual(["u1"]);
  });

  it("acceptRequest posts and clears entry", async () => {
    store.requests.push("u1");
    await store.acceptRequest("u1");
    expect(postMock).toHaveBeenCalledWith("/friend/accept", {
      uid: "me",
      friend_uid: "u1",
    });
    expect(store.requests).toEqual([]);
  });

  it("declineRequest posts and clears entry", async () => {
    store.requests.push("u2");
    await store.declineRequest("u2");
    expect(postMock).toHaveBeenCalledWith("/friend/decline", {
      uid: "me",
      friend_uid: "u2",
    });
    expect(store.requests).toEqual([]);
  });

  it("connect loads friend usernames", async () => {
    getMock.mockResolvedValueOnce({ data: { friends: ["f1"], requests: [] } });
    getMock.mockResolvedValueOnce({ data: { username: "Bob" } });
    await store.connect();
    expect(store.friends).toEqual([{ uid: "f1", name: "Bob" }]);
  });
});
