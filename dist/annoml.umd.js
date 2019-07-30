/*!
 * annoml v1.0.0 
 * (c) 2019 Thomas Haefeker <thomas@haefeker.de>
 * Released under the undefined License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Annoml = factory());
}(this, function () { 'use strict';

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

  return plugin;

}));
