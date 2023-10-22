class PubSub {
  constructor() {
    this.events = {};
  }

  /**
   * Either create a new event array or
   * push the callback into the existing array
   * @param {string} eventName
   * @param {function} cb
   */
  subscribe(eventName, cb) {
    this.events[eventName] = this.events[eventName]
      ? this.events[eventName]
      : [];
    this.events[eventName].push(cb);
  }

  /**
   * Remove the callback from the event array
   * @param {string} eventName
   * @param {function} cb
   */
  unsubscribe(eventName, cb) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((fn, index) => {
        if (fn === cb) {
          this.events[eventName].splice(index, 1);
        }
      });
    }
  }

  /**
   * If the passed event has callbacks attached to it, loop through each one
   * and call it
   * @param {string} eventName
   * @param {any} data
   */
  publish(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((fn) => {
        fn(data);
      });
    }
  }
}

export default PubSub;
