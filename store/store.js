import PubSub from "../lib/pubSub.js";
export default class Store {
  constructor(params) {
    let self = this;

    self.actions = params.actions || {};
    self.status = "resting";
    self.mutations = params.mutations || {};

    self.events = new PubSub();

    self.state = new Proxy(params.state || {}, {
      set: function (state, key, value) {
        state[key] = value;
        console.log(`stateChange: ${key}: ${value}`);

        self.events.publish("stateChange", self.state);

        if (self.status !== "mutation") {
          console.warn(`You should use mutation to set ${key}`);
        }
        this.status = "resting";
        return true;
      },
    });
  }

  dispatch(actionKey, payload) {
    let self = this;
    if (typeof self.actions[actionKey] !== "function") {
      console.error(`Action ${actionKey} doesn't exist`);
      return false;
    }

    // console.groupCollapsed(`Action ${actionKey}`);
    self.status = "action";
    self.actions[actionKey](self, payload);
    // console.groupEnd();
    return true;
  }

  commit(mutationKey, payload) {
    let self = this;
    if (typeof self.mutations[mutationKey] !== "function") {
      console.error(`Mutation ${mutationKey} doesn't exist`);
      return false;
    }
    self.status = "mutation";
    let newState = self.mutations[mutationKey](self.state, payload);
    self.state = Object.assign(self.state, newState);
    return true;
  }
}
