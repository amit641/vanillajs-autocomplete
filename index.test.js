import { fireEvent } from "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";
import { getFilteredList } from "./utils";
import store from "./store/index";
import {
  inputElement,
  suggestionsSection,
  suggestionListElement,
  renderDropdownItem,
  searchHandler,
  onSelectHandler,
  inputChangeHandler,
  keyDownEventHandler,
} from "./index";

describe("Autocomplete", () => {
  beforeEach(() => {
    document.body.innerHTML = `
            <div>
                <input type="text" id="search-input" />
                <div id="suggestion-list-wrapper"></div>
            </div>
        `;
  });

  it("should render the suggestion list when input is changed", async () => {
    const searchStr = "test";
    const filteredList = ["test1", "test2", "test3"];
    jest.spyOn(store, "getFilteredData").mockReturnValue(filteredList);
    jest.spyOn(store.events, "publish");
    await searchHandler(searchStr);
    expect(suggestionListElement).toContainHTML(
      `<li class="suggestion-list-item">${filteredList[0]}</li>`
    );
    expect(store.events.publish).toHaveBeenCalledWith("stateChange");
  });

  it("should select the suggestion when clicked", () => {
    const suggestion = "test";
    jest.spyOn(store, "setSelectedData");
    const suggestionListItem = document.createElement("li");
    suggestionListItem.classList.add("suggestion-list-item");
    suggestionListItem.textContent = suggestion;
    suggestionListElement.appendChild(suggestionListItem);
    fireEvent.click(suggestionListItem);
    expect(store.setSelectedData).toHaveBeenCalledWith(suggestion);
  });

  it("should select the suggestion when enter key is pressed", () => {
    const suggestion = "test";
    jest.spyOn(store, "setSelectedData");
    const suggestionListItem = document.createElement("li");
    suggestionListItem.classList.add("suggestion-list-item");
    suggestionListItem.textContent = suggestion;
    suggestionListElement.appendChild(suggestionListItem);
    const event = new KeyboardEvent("keydown", { key: "Enter" });
    inputElement.dispatchEvent(event);
    expect(store.setSelectedData).toHaveBeenCalledWith(suggestion);
  });

  it("should not select any suggestion when other key is pressed", () => {
    const suggestion = "test";
    jest.spyOn(store, "setSelectedData");
    const suggestionListItem = document.createElement("li");
    suggestionListItem.classList.add("suggestion-list-item");
    suggestionListItem.textContent = suggestion;
    suggestionListElement.appendChild(suggestionListItem);
    const event = new KeyboardEvent("keydown", { key: "Escape" });
    inputElement.dispatchEvent(event);
    expect(store.setSelectedData).not.toHaveBeenCalled();
  });

  it("should render the dropdown item when state changes", () => {
    const selectedData = "test";
    jest.spyOn(store, "getSelectedData").mockReturnValue(selectedData);
    renderDropdownItem();
    expect(inputElement.value).toBe(selectedData);
  });

  it("should debounce the input change handler", () => {
    jest.useFakeTimers();
    const event = new Event("input");
    jest.spyOn(window, "clearTimeout");
    inputElement.dispatchEvent(event);
    expect(clearTimeout).toHaveBeenCalledTimes(1);
    jest.runAllTimers();
    expect(inputChangeHandler).toHaveBeenCalledTimes(1);
  });
});
