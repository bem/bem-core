modules.define('functions', function(provide) {

var bindCall = function(fn) {
        return fn.call.bind(fn);
    },
    toStr = bindCall(Object.prototype.toString);

provide({
    isFunction: function(obj) {
        return toStr(obj) === '[object Function]';
    },
    
    noop: function() {}
});

});