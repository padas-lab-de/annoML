/* eslint-disable no-undef */
import Vue from 'vue';
import App from './App.vue';
import store from './store/store';
import router from './router';
import annoML from './plugin';

Vue.config.productionTip = false;

Vue.use(annoML, {
  debug: true,
  moduleName: 'ANNOML',
  annomlBaseURL: 'http://localhost:9999',
  store: {
    username: store.getters.getUsername,
    accessToken: store.getters.getToken,
  },
  authenticationProvider: {
    baseURL: 'http:localhost:8080',
    endpoints: {
      authorization: 'http://localhost:8080/oauth/authorize',
      userInfo: 'http://localhost:8080/api/users/me',
      userInfoById: 'http://localhost:8080/api/users',
    },
  },
  visualizationProvider: {
    endpoint: 'http:localhost:3000/visualization',
  },
});

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
