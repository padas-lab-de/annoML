/* eslint-disable no-undef */
import Vue from 'vue';
import App from './App.vue';
import store from './store/store';
import router from './router';
import annoML from './plugin';

Vue.config.productionTip = false;

Vue.use(annoML, {
  debug: true,
  baseURL: 'http://localhost:9999',
  isAuthenticated: store.getters.getAuthenticated,
  currentUser: 'thomborg',
  authenticationProvider: {
    baseURL: 'http://localhost:8080',
    authToken: window.localStorage.getItem('token'),
    endpoints: {
      authorization: 'http://localhost:8080/oauth/login',
      userInfo: 'http://localhost:8080/api/users/me',
      userInfoById: 'http://localhost:8080/api/users',
    },
  },
  resourceProvider: {
    baseURL: 'http://localhost:8080',
    accessToken: store.getters.getAccessToken,
    endpoints: {
      visualization: '/api/visualizations',
    },
  },
});

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
