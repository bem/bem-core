modules.define('jquery', ['ua'], function(provide, ua, $) {

var event = $.event.special.pointerup = {
        setup : function() {
            $(this).on('mouseup', event.handler);
        },

        teardown : function() {
            $(this).off('mouseup', event.handler);
        },

        handler : function(e) {
            if(!e.button || (ua.msie && ua.version < 9 && e.button === 1) ) {
                e.type = 'pointerup';
                $.event.dispatch.apply(this, arguments);
                e.type = 'mouseup';
            }
        }
    };

provide($);

});
