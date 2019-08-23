import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    auth: {
      profile: {
        username: 'annoml',
      },
      token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aG9tYm9yZyIsImV4cCI6MTU2NjU4MDU2MSwiaWF0IjoxNTY2NTc4NzYxfQ.YigKi4Ugtp27tUu8n9NZC-gtLpSPI0QNFGYLQbto4mwATgnvk1k1VIMDb08I52MhUiUgXGHzg6h4arEC6gLU5w',
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
