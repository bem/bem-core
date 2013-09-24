/**
 * @module functions
 */

modules.define('functions', function(provide) {

var toStr = Object.prototype.toString;

provide({
    /**
     * Checks whether a given object is function
     * @param {*} obj
     * @returns {Boolean}
     */
    isFunction : function(obj) {
        return toStr.call(obj) === '[object Function]';
    },

    /**
     * @type {Function}
     */
    noop : function() {}
});

});