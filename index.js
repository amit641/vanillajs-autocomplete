import { getFilteredList, debounceFn } from "./utils.js";
import store from "./store/index.js";

/**
 * The input element for search
 * @type {HTMLInputElement}
 */
const inputElement = document.querySelector("#search-input");

/**
 * The suggestions section element
 * @type {HTMLElement}
 */
const suggestionsSection = document.querySelector("#suggestion-list-wrapper");

/**
 * The suggestion list element
 * @type {HTMLUListElement}
 */
let suggestionListElement = document.createElement("ul");
suggestionListElement.classList.add("suggestion-list");
suggestionsSection.appendChild(suggestionListElement);

/**
 * Renders the dropdown list
 */
export const renderDropdownItem = () => {
  let currentIndex = store.state.selectedOptionIndex;
  let suggestionsOptions = store.state.suggestions;
  console.log(" renderDropdownItem fn called!!!");
  console.log("suggestionsOptions.length: ", suggestionsOptions.length);
  if (suggestionsOptions.length !== 0) {
    suggestionListElement.classList.add("suggestion-list-visible");
  }
  suggestionListElement.innerHTML = "";
  suggestionsOptions.forEach((item, index) => {
    const liElement = document.createElement("li");
    if (index === currentIndex) {
      liElement.classList.add("active");
    }
    liElement.innerText = item;
    liElement.setAttribute("data-key", item);
    suggestionListElement.appendChild(liElement);
  });
};

/**
 * Handles the input search
 * @param {string} str - The search string
 */
export const searchHandler = async (str) => {
  try {
    const result = await getFilteredList(str);
    console.log("result: ", result);
    if (result.length) {
      store.dispatch("updateSuggestions", result);
    }
  } catch (error) {}
};

/**
 * Handles the selection of result
 * @param {Event} e - The click event
 */
export const onSelectHandler = (e) => {
  const { key } = e.target.dataset;
  if (key) {
    inputElement.value = key;
    suggestionListElement.classList.remove("suggestion-list-visible");
    store.dispatch("setSelectedOptionIndex", 0);
    store.dispatch("updateSuggestions", []);
  }
};

/**
 * Handles the input change event
 * @param {Event} e - The input change event
 */
export const inputChangeHandler = (e) => {
  if (e.target.value !== "") {
    searchHandler(e.target.value);
  } else {
    suggestionListElement.classList.remove("suggestion-list-visible");
  }
};

/**
 * Handles the selection of option on keydown event
 * @param {Event} e - The keydown event
 */
export const keyDownEventHandler = (e) => {
  let currentIndex = store.state.selectedOptionIndex;
  if (e.keyCode === 13) {
    inputElement.value = store.state.suggestions[currentIndex];
    suggestionListElement.classList.remove("suggestion-list-visible");
    store.dispatch("updateSuggestions", []);
    store.dispatch("setCurrentSelectedOptionIndex", 0);
  }
  if (e.keyCode === 38) {
    currentIndex === 0
      ? null
      : store.dispatch("setCurrentSelectedOptionIndex", currentIndex - 1);
  }
  if (e.keyCode === 40) {
    currentIndex === store.state.suggestions.length - 1
      ? null
      : store.dispatch("setCurrentSelectedOptionIndex", currentIndex + 1);
  }
};

// Event listener for input change event
inputElement.addEventListener("input", debounceFn(inputChangeHandler, 500));

// Event listener for click event
suggestionListElement.addEventListener("click", onSelectHandler);

// Event listener for keyDown event
inputElement.addEventListener("keydown", keyDownEventHandler);

store.events.subscribe("stateChange", renderDropdownItem);
