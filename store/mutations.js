export default {
  updateSuggestions: function (state, payload) {
    state.suggestions = payload;
    return state;
  },
  setCurrentSelectedOptionIndex: function (state, payload) {
    state.selectedOptionIndex = payload;
    return state;
  },
};
