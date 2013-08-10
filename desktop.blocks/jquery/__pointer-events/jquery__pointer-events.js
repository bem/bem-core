/**
 * @modules jquery__pointer-events
 * @version 1.0.1
 * @author Filatov Dmitry <dfilatov@yandex-team.ru>
 */

modules.define('jquery', ['objects'], function(provide, objects, $) {

objects.each(
    {
        pointerclick : 'click',
        pointerdown : 'mousedown',
        pointerup : 'mouseup'
    },
    function(mouseEvent, pointerEvent) {
        var event = $.event.special[pointerEvent] = {
                setup : function() {
                    $(this).on(mouseEvent, event.handler);
                },

                teardown : function() {
                    $(this).off(mouseEvent, event.handler);
                },

                handler : function(e) {
                    if(!e.button) {
                        e.type = pointerEvent;
                        $.event.dispatch.apply(this, arguments);
                        e.type = mouseEvent;
                    }
                }
            };
    });

provide($);

});