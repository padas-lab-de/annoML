/*!
 * annoml v1.0.0 
 * (c) 2019 Thomas Haefeker <thomas@haefeker.de>
 * Released under the undefined License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@/store/module')) :
  typeof define === 'function' && define.amd ? define(['@/store/module'], factory) :
  (global = global || self, global.Annoml = factory(global.module));
}(this, function (module) { 'use strict';

  module = module && module.hasOwnProperty('default') ? module['default'] : module;

  /* eslint-disable no-console */
  var version = '1.0.0';

  var install = function install(Vue, store, options) {
    /*
     * NOTE:
     *   if you need to extend Vue contstructor, you can extend it in here.
     */

    /*
     * NOTE:
     *  somthing implementation here ...
     */
    if (!options || !store) {
      throw new Error('Please initialise plugin with the required options and a Vuex store.');
    }

    if (options.debug) {
      console.log('DEBUG MODE');
    } // register annoML module to provided Vuex storage


    if (options.moduleName) {
      store.registerModule(options.moduleName, module);
    } else {
      store.registerModule('annoml', module);
    }
  };

  var plugin = {
    install: install,
    version: version
  };
  /* Only for automatic plugin install
  * if (typeof window !== 'undefined' && window.Vue) {
  *  window.Vue.use(plugin);
  * }
  */

  return plugin;

}));
