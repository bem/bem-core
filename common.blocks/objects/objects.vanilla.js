modules.define('objects', function(provide) {

var bindCall = function(fn) {
        return fn.call.bind(fn);
    },
    hasOwnProp = bindCall(Object.prototype.hasOwnProperty);

provide({
    extend : function(target) {
        typeof target !== 'object' && (target = {});

        for(var i = 1, len = arguments.length; i < len; i++) {
            var obj = arguments[i];
            if(obj) {
                for(var key in obj) {
                    hasOwnProp(obj, key) && (target[key] = obj[key]);
                }
            }
        }

        return target;
    },

    isEmpty : function(obj) {
        for(var key in obj) {
            if(hasOwnProp(obj, key)) {
                return false;
            }
        }

        return true;
    },

    each : function(obj, fn, ctx) {
        for(var key in obj) {
            if(hasOwnProp(obj, key)) {
                ctx? fn.call(ctx, obj[key], key) : fn(obj[key], key);
            }
        }
    }
});

});
