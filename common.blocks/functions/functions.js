modules.define('functions', function(provide) {

var bindCall = function(fn) {
        return fn.call.bind(fn);
    },
    toStr = bindCall(Object.prototype.toString);

provide({
    isFunction : function(obj) {
        return toStr(obj) === '[object Function]';
    },

    debounce : function(fn, timeout, invokeAsap, ctx) {
        if(arguments.length == 3 && typeof invokeAsap != 'boolean') {
            ctx = invokeAsap;
            invokeAsap = false;
        }

        var timer;
        return function() {
            var args = arguments;
            ctx = ctx || this;

            invokeAsap && !timer && fn.apply(ctx, args);

            clearTimeout(timer);

            timer = setTimeout(function() {
                invokeAsap || fn.apply(ctx, args);
                timer = null;
            }, timeout);
        };
    },

    throttle : function(fn, timeout, ctx) {
        var timer, args, needInvoke;
        return function() {
            args = arguments;
            needInvoke = true;
            ctx = ctx || this;

            timer || (function() {
                if(needInvoke) {
                    fn.apply(ctx, args);
                    needInvoke = false;
                    timer = setTimeout(arguments.callee, timeout);
                }
                else {
                    timer = null;
                }
            })();
        };
    }
});

});