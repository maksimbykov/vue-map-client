import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    places: []
  },
  mutations: {
    ADD_PLACE(state, place) {
      state.places.push(place);
    }
  },
  actions: {
    addPlace({ commit }, place) {
      commit("ADD_PLACE", {
        place
      });
    }
  },
  modules: {}
});
