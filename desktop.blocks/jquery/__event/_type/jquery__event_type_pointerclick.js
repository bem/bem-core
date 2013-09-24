/**
 * @modules jquery__event_type_pointerclick
 * @version 1.0.2
 * @author Filatov Dmitry <dfilatov@yandex-team.ru>
 */

modules.define('jquery', function(provide, $) {

var event = $.event.special.pointerclick = {
        setup : function() {
            $(this).on('click', event.handler);
        },

        teardown : function() {
            $(this).off('click', event.handler);
        },

        handler : function(e) {
            if(!e.button) {
                e.type = 'pointerclick';
                $.event.dispatch.apply(this, arguments);
                e.type = 'click';
            }
        }
    };

provide($);

});