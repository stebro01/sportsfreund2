import { beforeEach, describe, it, expect, jest } from "@jest/globals";
import { createPinia, setActivePinia } from "pinia";
import { useAuthStore } from "stores/authStore";

jest.mock("stores/apiStore", () => {
  const postMock = jest.fn(() => Promise.resolve({ data: { uid: "123" } }));
  const getMock = jest.fn(() => Promise.resolve({ data: { username: "bob" } }));
  return {
    useApiStore: () => ({ post: postMock, get: getMock }),
    postMock,
    getMock,
  };
});
import { postMock, getMock } from "stores/apiStore";

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
    expect(localStorage.getItem("username")).toBe("a");
    expect(localStorage.getItem("password")).toBe("b");
  });

  it("login saves uid", async () => {
    await store.login("a", "b");
    expect(store.uid).toBe("123");
    expect(localStorage.getItem("username")).toBe("a");
    expect(localStorage.getItem("password")).toBe("b");
  });

  it("autoLogin loads stored username", async () => {
    localStorage.setItem("uid", "xyz");
    localStorage.setItem("username", "saved");
    await store.autoLogin();
    expect(store.uid).toBe("xyz");
    expect(store.username).toBe("saved");
  });

  it("autoLogin fetches username when missing", async () => {
    localStorage.setItem("uid", "xyz");
    await store.autoLogin();
    expect(getMock).toHaveBeenCalledWith("/user/xyz");
    expect(store.username).toBe("bob");
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
