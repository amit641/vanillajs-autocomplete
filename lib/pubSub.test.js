const PubSub = require("./pubSub");

describe("PubSub", () => {
  let pubSub;

  beforeEach(() => {
    pubSub = new PubSub();
  });

  describe("subscribe", () => {
    it("should create a new event array if one does not exist", () => {
      pubSub.subscribe("test", () => {});
      expect(pubSub.events.test).toEqual(expect.any(Array));
      expect(pubSub.events.test.length).toBe(1);
    });

    it("should add a callback to an existing event array", () => {
      const cb1 = () => {};
      const cb2 = () => {};
      pubSub.subscribe("test", cb1);
      pubSub.subscribe("test", cb2);
      expect(pubSub.events.test.length).toBe(2);
      expect(pubSub.events.test).toContain(cb1);
      expect(pubSub.events.test).toContain(cb2);
    });
  });

  describe("unsubscribe", () => {
    it("should remove a callback from an event array", () => {
      const cb1 = () => {};
      const cb2 = () => {};
      pubSub.subscribe("test", cb1);
      pubSub.subscribe("test", cb2);
      pubSub.unsubscribe("test", cb1);
      expect(pubSub.events.test.length).toBe(1);
      expect(pubSub.events.test).not.toContain(cb1);
      expect(pubSub.events.test).toContain(cb2);
    });
  });

  describe("publish", () => {
    it("should call all callbacks attached to an event", () => {
      const cb1 = jest.fn();
      const cb2 = jest.fn();
      pubSub.subscribe("test", cb1);
      pubSub.subscribe("test", cb2);
      pubSub.publish("test", "data");
      expect(cb1).toHaveBeenCalledWith("data");
      expect(cb2).toHaveBeenCalledWith("data");
    });

    it("should not call callbacks attached to other events", () => {
      const cb1 = jest.fn();
      const cb2 = jest.fn();
      pubSub.subscribe("test1", cb1);
      pubSub.subscribe("test2", cb2);
      pubSub.publish("test1", "data");
      expect(cb1).toHaveBeenCalledWith("data");
      expect(cb2).not.toHaveBeenCalled();
    });

    it("should not throw an error if no callbacks are attached to an event", () => {
      expect(() => pubSub.publish("test", "data")).not.toThrow();
    });
  });
});
