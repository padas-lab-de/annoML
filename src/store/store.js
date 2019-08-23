import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    auth: {
      profile: {
        username: 'annoml',
        uid: '1',
      },
      token: 'TOKEN',
      isAuthenticated: true,
    },
  },
  getters: {
    getToken: state => state.auth.token,
    getUserId: state => state.auth.profile.uid,
    getUsername: state => state.auth.profile.username,
  },

  mutations: {
    isAuthenticated(state, payload) {
      state.auth.isAuthenticated = payload.isAuthenticated;
    },
    token(state, payload) {
      state.auth.token = payload.token;
    },
    setProfile(state, payload) {
      state.auth.profile = payload.profile;
    },
  },
});

export default store;
