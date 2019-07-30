/*!
 * annoml v1.0.0 
 * (c) 2019 Thomas Haefeker <thomas@haefeker.de>
 * Released under the undefined License.
 */
'use strict';

var version = '1.0.0'; // const install = (Vue) => {

var install = function install() {
  /*
   * NOTE:
   *   if you need to extend Vue contstructor, you can extend it in here.
   */

  /*
   * NOTE:
   *  somthing implementation here ...
   */
};

var plugin = {
  install: install,
  version: version
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin);
}

module.exports = plugin;
