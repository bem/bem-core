/**
 * @module functions
 */

modules.define('functions', function(provide) {

var toStr = Object.prototype.toString;

provide({
    isFunction : function(obj) {
        return toStr.call(obj) === '[object Function]';
    },
    
    noop : function() {}
});

});