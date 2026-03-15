/**
 * @module objects
 * @description A set of helpers to work with JavaScript objects
 */

export default {
  /**
   * Extends a given target by
   * @param {Object} target object to extend
   * @param {Object} source
   * @returns {Object}
   */
  extend(target, source) {
    (typeof target !== 'object' || target === null) && (target = {})

    for(let i = 1, len = arguments.length; i < len; i++) {
      const obj = arguments[i]
      if(obj) {
        for(const [key, val] of Object.entries(obj))
          target[key] = val
      }
    }

    return target
  },

  /**
   * Check whether a given object is empty (contains no enumerable properties)
   * @param {Object} obj
   * @returns {Boolean}
   */
  isEmpty(obj) {
    return Object.keys(obj).length === 0
  },

  /**
   * Generic iterator function over object
   * @param {Object} obj object to iterate
   * @param {Function} fn callback
   * @param {Object} [ctx] callbacks's context
   */
  each(obj, fn, ctx) {
    for(const [key, val] of Object.entries(obj))
      ctx ? fn.call(ctx, val, key) : fn(val, key)
  }
}
