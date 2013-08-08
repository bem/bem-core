/**
 * @modules jquery__resize-event
 */

modules.define('jquery', ['ua'], function(provide, ua, $) {

var event = $.event.special.winresize = {
        setup: function() {
            $(this).on('resize', event.handler);
        },

        teardown: function() {
            $(this).off('resize', event.handler);
        },

        handler: function(e) {
            e.type = 'winresize';
            $.event.dispatch.apply(this, arguments);
            e.type = 'resize';
        }
    };

provide($);

});