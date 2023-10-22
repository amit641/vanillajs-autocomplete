export default {
  updateSuggestions: function (context, payload) {
    context.commit("updateSuggestions", payload);
  },
  setCurrentSelectedOptionIndex: function (context, payload) {
    context.commit("setCurrentSelectedOptionIndex", payload);
  },
};
