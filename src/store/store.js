import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    auth: {
      profile: {
        id: 'thomborg',
        accessToken: 'f8a7ce26-2ba7-42b4-8fe2-1f134a271931',
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
