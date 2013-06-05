modules.define('functions__throttle', function(provide) {

provide(function(fn, timeout, ctx) {
    var timer, args, needInvoke;
    return function() {
        args = arguments;
        needInvoke = true;
        ctx || (ctx = this);

        if(!timer) {
            var wrapperFn = function() {
                    if(needInvoke) {
                        fn.apply(ctx, args);
                        needInvoke = false;
                        timer = setTimeout(wrapperFn, timeout);
                    }
                    else {
                        timer = null;
                    }
                };
            wrapperFn();
        }
    };
});

});