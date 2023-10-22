import { suggestions } from "./data.js";

export const getFilteredList = (str) => {
  const result = suggestions.filter((suggestion) =>
    suggestion.toLocaleLowerCase().includes(str.toLocaleLowerCase())
  );
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(result);
    }, 1000);
  });
};

export const debounceFn = function (fn, delay = 200) {
  let timerId;
  return function (...arg) {
    const context = this;
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.call(context, ...arg);
    }, delay);
  };
};
