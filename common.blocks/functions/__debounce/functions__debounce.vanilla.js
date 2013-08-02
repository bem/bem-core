modules.define('functions__debounce', function(provide) {

var global = this.global;

provide(function(fn, timeout, invokeAsap, ctx) {
    if(arguments.length === 3 && typeof invokeAsap !== 'boolean') {
        ctx = invokeAsap;
        invokeAsap = false;
    }

    var timer;
    return function() {
        var args = arguments;
        ctx || (ctx = this);

        invokeAsap && !timer && fn.apply(ctx, args);

        global.clearTimeout(timer);

        timer = global.setTimeout(function() {
            invokeAsap || fn.apply(ctx, args);
            timer = null;
        }, timeout);
    };
});

});