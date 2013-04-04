modules.define('objects', function(provide) {

provide({
    extend : function(target) {
        for(var i = 1, len = arguments.length; i < len; i++) {
            var obj = arguments[i];
            if(obj) {
                for(var key in obj) {
                    obj.hasOwnProperty(key) && (target[key] = obj[key]);
                }
            }
        }

        return target;
    },

    isEmpty : function(obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key)) {
                return false;
            }
        }

        return true;
    },

    each : function(obj, fn, ctx) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key)) {
                ctx? fn.call(ctx, obj[key], key) : fn(obj[key], key);
            }
        }
    }
});

});