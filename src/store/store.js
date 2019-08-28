import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    auth: {
      profile: {
        id: 'thomborg',
        accessToken: 'ee30a1db-eb06-449b-9c53-ff289e0ed86b',
      },
      token: null,
      isAuthenticated: true,
    },
  },
  getters: {
    getAccessToken: state => state.auth.profile.accessToken,
    getToken: state => state.auth.token,
    getId: state => state.auth.profile.id,
    getAuthenticated: state => state.auth.isAuthenticated,
  },

  mutations: {
    token(state, payload) {
      state.auth.token = payload.token;
    },
  },
});

export default store;
