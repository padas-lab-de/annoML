/*!
 * annoml v1.0.0 
 * (c) 2019 Thomas Haefeker <thomas@haefeker.de>
 * Released under the undefined License.
 */
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var module$1 = _interopDefault(require('@/store/module'));

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
    store.registerModule(options.moduleName, module$1);
  } else {
    store.registerModule('annoml', module$1);
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

module.exports = plugin;
