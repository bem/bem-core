modules.define(
    'utils',
    ['identify', 'inherit', 'nextTick'],
    function(provide, identify, inherit, nextTick) {

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

    nextTick : nextTick
});

});