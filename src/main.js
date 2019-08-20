import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import App from './AnnoML.vue';
import store from './store/store';
import annoML from './plugin';

Vue.config.productionTip = false;


Vue.use(BootstrapVue);
Vue.use(annoML, store, {
  debug: true,
  moduleName: 'ANNOML',
});


new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
