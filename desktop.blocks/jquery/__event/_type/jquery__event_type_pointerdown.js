modules.define('jquery', ['ua'], function(provide, ua, $) {

var event = $.event.special.pointerdown = {
        setup : function() {
            $(this).on('mousedown', event.handler);
        },

        teardown : function() {
            $(this).off('mousedown', event.handler);
        },

        handler : function(e) {
            if(!e.button || (ua.msie && ua.version < 9 && e.button === 1) ) {
                e.type = 'pointerdown';
                $.event.dispatch.apply(this, arguments);
                e.type = 'mousedown';
            }
        }
    };

provide($);

});