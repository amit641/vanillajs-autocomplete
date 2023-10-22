import Store from "./store.js";

describe("Store", () => {
  let store;

  beforeEach(() => {
    store = new Store();
  });

  it("should initialize with an empty state object", () => {
    expect(store.state).toEqual({});
  });

  it("should update the state object when a mutation is committed", () => {
    store.commit("updateName", "John");
    expect(store.state.name).toBe("John");
  });

  it("should trigger a subscriber callback when a mutation is committed", () => {
    const mockCallback = jest.fn();
    store.subscribe("updateName", mockCallback);
    store.commit("updateName", "John");
    expect(mockCallback).toHaveBeenCalledWith("John");
  });

  it("should trigger multiple subscriber callbacks when a mutation is committed", () => {
    const mockCallback1 = jest.fn();
    const mockCallback2 = jest.fn();
    store.subscribe("updateName", mockCallback1);
    store.subscribe("updateName", mockCallback2);
    store.commit("updateName", "John");
    expect(mockCallback1).toHaveBeenCalledWith("John");
    expect(mockCallback2).toHaveBeenCalledWith("John");
  });

  it("should dispatch an action with the correct payload", () => {
    const mockCallback = jest.fn();
    store.actions = {
      updateName: mockCallback,
    };
    store.dispatch("updateName", "John");
    expect(mockCallback).toHaveBeenCalledWith(store, "John");
  });
});
