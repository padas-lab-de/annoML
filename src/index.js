/* eslint-disable no-console,no-param-reassign,max-len */
import axios from 'axios';
import BootstrapVue from 'bootstrap-vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import {
  FontAwesomeIcon,
  FontAwesomeLayers,
  FontAwesomeLayersText,
} from '@fortawesome/vue-fontawesome';
import store from './store/store';
import utils from './util';
import APIService from './service/APIService';

import AnnoML from './views/AnnoML.vue';

const components = {
  AnnoML,
};

const version = '__VERSION__';

const install = (Vue, config) => {
  /*
   * NOTE:
   *   if you need to extend Vue contstructor, you can extend it in here.
   */

  if (!config) {
    throw new Error('Please initialise plugin with the required configs.');
  }
  // install annoML component
  Vue.component('AnnoML', AnnoML);

  // Bootstrap and icon import
  library.add(fas);
  Vue.use(BootstrapVue);
  Vue.component('font-awesome-icon', FontAwesomeIcon);
  Vue.component('font-awesome-layers', FontAwesomeLayers);
  Vue.component('font-awesome-layers-text', FontAwesomeLayersText);

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
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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
  components,
};

export default plugin;
