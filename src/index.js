const version = '__VERSION__';
// const install = (Vue) => {
const install = () => {
  /*
   * NOTE:
   *   if you need to extend Vue contstructor, you can extend it in here.
   */
  /*
   * NOTE:
   *  somthing implementation here ...
   */
};

const plugin = {
  install,
  version,
};

export default plugin;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin);
}
