/**
 * @module functions
 * @description A set of helpers to work with JavaScript functions
 */

var toStr = Object.prototype.toString;

export default {
    /**
     * Checks whether a given object is function
     * @param {*} obj
     * @returns {Boolean}
     */
    isFunction : function(obj) {
        return toStr.call(obj) === '[object Function]';
    },

    /**
     * Empty function
     */
    noop : function() {}
};
