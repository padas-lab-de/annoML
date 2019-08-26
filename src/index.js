/* eslint-disable no-console,no-param-reassign,max-len */
import axios from 'axios';
import store from '@/store/plugin';
import utils from '@/util/';
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
    throw new Error('Please initialise plugin with the required configs.');
  }

  // Exports plugin settings and store to components
  Vue.prototype.$annomlsettings = config;
  Vue.prototype.$annomlstore = store;

  Vue.prototype.$annomlutils = utils;

  Vue.prototype.$resourceApi = axios.create({
    baseURL: config.resourceProvider.baseURL,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      Authorization: `Bearer ${config.resourceProvider.accessToken}`,
    },
  });


  const serviceApi = axios.create({
    baseURL: config.baseURL,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    },
  });

  const serviceApiAuthenticated = () => {
    serviceApi.defaults.headers.common.Authorization = `Bearer ${
      config.authenticationProvider.authToken
    }`;
    return serviceApi;
  };

  Vue.prototype.$serviceApi = serviceApi;
  Vue.prototype.$serviceApiAuthenticated = serviceApiAuthenticated();

  Vue.prototype.$startDiscussionWithUrl = visualizationUrl => APIService(serviceApiAuthenticated())
    .createDiscussionWithUrl(visualizationUrl)
    .then(discussion => discussion.id)
    .catch((message) => {
      console.log(message);
    });

  Vue.prototype.$startDiscussionWithReference = visualizationId => APIService(serviceApiAuthenticated())
    .createDiscussionWithId(visualizationId)
    .then(discussion => discussion.id)
    .catch((message) => {
      console.log(message);
    });

  Vue.prototype.$startDiscussionWithImport = visualizationSchema => APIService(serviceApiAuthenticated())
    .createDiscussionWithSchema(visualizationSchema)
    .then(discussion => discussion.id)
    .catch((message) => {
      console.log(message);
    });

  store.commit('importSettings', config);

  if (config.debug) {
    console.log('DEBUG MODE');
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
