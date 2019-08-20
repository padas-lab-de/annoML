/* eslint-disable no-console */
import module from '@/store/module';

const version = '__VERSION__';
const install = (Vue, store, options) => {
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
  }

  // register annoML module to provided Vuex storage
  if (options.moduleName) {
    store.registerModule(options.moduleName, module);
  } else {
    store.registerModule('annoml', module);
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
