import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    auth: {
      profile: {
        id: 'thomborg',
        accessToken: '87d59798-f7f5-4da7-8dc7-66d74732353c',
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
