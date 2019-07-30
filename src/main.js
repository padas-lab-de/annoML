import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import App from './AnnoML.vue';
import store from './store/store';
import './plugin';

Vue.config.productionTip = false;

Vue.use(BootstrapVue);

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
