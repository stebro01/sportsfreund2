import { beforeEach, describe, it, expect, jest } from "@jest/globals";
import { createPinia, setActivePinia } from "pinia";
import { useAuthStore } from "stores/authStore";

jest.mock("stores/apiStore", () => {
  const postMock = jest.fn(() => Promise.resolve({ data: { uid: "123" } }));
  return { useApiStore: () => ({ post: postMock }), postMock };
});
import { postMock } from "stores/apiStore";

describe("authStore", () => {
  let store;
  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    localStorage.clear();
    store = useAuthStore();
  });

  it("register saves uid", async () => {
    await store.register("a", "b");
    expect(store.uid).toBe("123");
    expect(localStorage.getItem("uid")).toBe("123");
  });

  it("login saves uid", async () => {
    await store.login("a", "b");
    expect(store.uid).toBe("123");
  });

  it("autoLogin loads uid", () => {
    localStorage.setItem("uid", "xyz");
    store.autoLogin();
    expect(store.uid).toBe("xyz");
  });

  it("sendFriendRequest posts to backend", async () => {
    store.uid = "me";
    await store.sendFriendRequest("other");
    expect(postMock).toHaveBeenCalledWith("/friend/request", {
      uid: "me",
      friend_uid: "other",
    });
  });

  it("acceptFriend posts to backend", async () => {
    store.uid = "me";
    await store.acceptFriend("other");
    expect(postMock).toHaveBeenCalledWith("/friend/accept", {
      uid: "me",
      friend_uid: "other",
    });
  });
});
