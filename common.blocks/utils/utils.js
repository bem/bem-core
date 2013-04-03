modules.define(
    'utils',
    ['identify', 'inherit', 'nextTick'],
    function(provide, identify, inherit, nextTick) {

var bindCall = function(fn) {
        return fn.call.bind(fn);
    },
    toStr = bindCall(Object.prototype.toString);

provide({
    extend : function(target) {
        for(var i = 1, len = arguments.length; i < len; i++) {
            var obj = arguments[i];
            if(obj) {
                for(var name in obj) {
                    obj.hasOwnProperty(name) && (target[name] = obj[name]);
                }
            }
        }

        return target;
    },

    identify : identify,

    inherit : inherit.inherit,
    inheritSelf : inherit.inheritSelf,

    isObjectEmpty : function(obj) {
        for(var i in obj) {
            if(obj.hasOwnProperty(i)) {
                return false;
            }
        }

        return true;
    },

    isFunction : function(obj) {
        return toStr(obj) === '[object Function]';
    },

    nextTick : nextTick
});

});