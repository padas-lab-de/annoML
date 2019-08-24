import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    auth: {
      profile: {
        username: 'annoml',
        accessToken: 'a5fc7b2a-b8af-4562-b38d-aabb31c1397e',
      },
      token: null,
      isAuthenticated: false,
    },
  },
  getters: {
    getAccessToken: state => state.auth.profile.accessToken,
    getToken: state => state.auth.token,
    getUsername: state => state.auth.profile.username,
    getAuthenticated: state => state.auth.isAuthenticated,
  },

  mutations: {
    token(state, payload) {
      state.auth.token = payload.token;
    },
  },
});

export default store;
