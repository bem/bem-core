/**
 * @module functions
 * @description A set of helpers to work with JavaScript functions
 */

export default {
  /**
   * Checks whether a given object is function
   * @param {*} obj
   * @returns {Boolean}
   */
  isFunction(obj) {
    // In some browsers, typeof returns "function" for HTML <object> elements
    // (i.e., `typeof document.createElement( "object" ) === "function"`).
    // We don't want to classify *any* DOM node as a function.
    return typeof obj === 'function' && typeof obj.nodeType !== 'number'
  },

  /**
   * Empty function
   */
  noop() {}
}
