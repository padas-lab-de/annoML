import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    auth: {
      profile: {
        id: 'thomborg',
        accessToken: '8a943784-c6a4-4c6c-b91a-d644938844ed',
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
