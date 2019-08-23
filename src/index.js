/* eslint-disable no-console,no-param-reassign */
import axios from 'axios';
import store from '@/store/plugin';
import APIService from '@/service/APIService';

const version = '__VERSION__';

const install = (Vue, config) => {
  /*
   * NOTE:
   *   if you need to extend Vue contstructor, you can extend it in here.
   */
  /*
   * NOTE:
   *  somthing implementation here ...
   */


  if (!config) {
    throw new Error(
      'Please initialise plugin with the required configs.',
    );
  }

  Vue.prototype.$annomlsettings = config;
  Vue.prototype.$annomlstore = store;

  const serviceApi = axios.create({
    baseURL: config.annomlBaseURL,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    },
  });

  Vue.prototype.$serviceApi = serviceApi;

  Vue.prototype.$authApi = axios.create({
    baseURL: config.authenticationProvider.baseURL,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    },
  });

  Vue.prototype.$startDiscussion = (
    visualizationId,
    visualizationUrl,
    userId,
    token,
  ) => APIService(serviceApi)
    .createDiscussion(visualizationId, visualizationUrl, userId, token)
    .then((result) => {
      console.log(result);
      return result.data.id;
    })
    .catch((message) => {
      console.log(message);
    });
  /*
  // register annoML module to provided Vuex storage
  if (config.moduleName) {
    store.registerModule(config.moduleName, module);
  } else {
    store.registerModule('annoml', module);
  }

  */
  store.commit('importSettings', config);

  if (config.debug) {
    console.log('DEBUG MODE');
    console.log(store.getters.getSettings);
  }
};

const plugin = {
  install,
  version,
};

export default plugin;

/* Only for automatic plugin install
 * if (typeof window !== 'undefined' && window.Vue) {
 *  window.Vue.use(plugin);
 * }
 */
