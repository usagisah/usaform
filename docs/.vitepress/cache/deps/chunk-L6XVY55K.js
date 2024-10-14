// node_modules/.pnpm/vitepress@1.3.4_@algolia+client-search@4.24.0_@types+node@20.16.10_async-validator@4.2.5_post_bd76admbe4plqdpyomwb7sli3y/node_modules/vitepress/lib/vue-demi.mjs
var isVue2 = false;
var isVue3 = true;
function set(target, key, val) {
  if (Array.isArray(target)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val;
  }
  target[key] = val;
  return val;
}
function del(target, key) {
  if (Array.isArray(target)) {
    target.splice(key, 1);
    return;
  }
  delete target[key];
}

export {
  isVue2,
  isVue3,
  set,
  del
};
/*! Bundled license information:

vitepress/lib/vue-demi.mjs:
  (**
   * vue-demi v0.14.7
   * Copyright (c) 2020-present, Anthony Fu
   * @license MIT
   *)
*/
//# sourceMappingURL=chunk-L6XVY55K.js.map
