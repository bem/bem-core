/**
 * Additional pointerpress and pointerrelease events on top of
 * jquery-pointerevents. Goal – to prevent an accidental pressed
 * states when you just move your finger through the element on
 * touch devices.
 *
 * @author Kir Belevich <kir@soulshine.in>
 * @copyright Kir Belevich 2013
 * @license MIT
 * @version 0.1.0
 */
modules.define('jquery', function(provide, $) {

// nothing to do without jquery-ppinterevents
if(!('PointerEvent' in $)) {
    provide($);
    return;
}

/**
 * Create new $.event.special wrapper with some default behavior.
 *
 * @param {string} type event type
 * @param {object} toExtend object to extend default wrapper
 */
function addPointerEvent(type, toExtend) {

    var eventName = 'pointer' + type,

        eventSpecial = $.event.special[eventName] = {
            // bind
            setup: function() {
                $(this).on({
                    pointerdown: eventSpecial.handlerDown,
                    pointermove: eventSpecial.handlerMove,
                    pointerup: eventSpecial.handlerUp
                });
            },

            // unbind
            teardown: function() {
                $(this).off({
                    pointerdown: eventSpecial.handlerDown,
                    pointermove: eventSpecial.handlerMove,
                    pointerup: eventSpecial.handlerUp
                });
            },

            handlerMove: function(e) {

                if(e.pointerType === 'touch') {
                    var data = eventSpecial.data;

                    // if there is a touch move
                    if(
                       data &&
                       (Math.abs(e.clientX - data.clientX) > 5 ||
                       Math.abs(e.clientY - data.clientY) > 5)
                    ) {
                        // save that
                        data.move = true;
                    }
                }
            }
        };

    // extend this $.event.special wrapper
    if(toExtend) {
        $.extend(eventSpecial, toExtend({
            event: eventSpecial,
            name: eventName,
            type: type
        }));
    }

}

/**
 * Object to extend $.event.special to handle pointerpress.
 *
 * @param {object} params
 * @param {object} params.event event object
 * @param {string} params.name event name
 * @param {string} params.type event type
 * @returns {object}
 */
function extendPointerPress(params) {

    var data = params.event.data;

    return {
        handlerDown: function(e) {
            var target = e.target,
                pointerevent;

            // touch
            if(e.pointerType === 'touch') {
                data = {
                    timer: (function() {
                        // if there was no touchmove in 80ms – trigger pointerpress
                        return setTimeout(function() {
                            if(data && !data.move) {
                                pointerevent = new $.PointerEvent(e, params.name);
                                $(e.currentTarget).triggerHandler(pointerevent);
                            }
                        }, 80);
                    })(),
                    clientX: e.clientX,
                    clientY: e.clientY
                };
            // mouse – only left button
            } else if(e.which === 1) {
                pointerevent = new $.PointerEvent(e, params.name);
                $(e.currentTarget).triggerHandler(pointerevent);
            }
        },

        handlerUp: function(e) {
            if(e.pointerType === 'touch') {
                if(data) {
                    clearTimeout(data.timer);
                }
                data = null;
            }
        }
    };

}

/**
 * Object to extend $.event.special to handle pointerpress.
 *
 * @param {object} params
 * @param {object} params.event event object
 * @param {string} params.name event name
 * @param {string} params.type event type
 * @returns {object}
 */
function extendPointerRelease(params) {

    var data = params.event.data;

    return {
        handlerDown: function(e) {
            var target = e.target,
                pointerevent;

            // touch
            if(e.pointerType === 'touch') {
                data = {
                    timer: (function() {
                        // if there was no touchmove in 80ms – trigger pointerpress
                        return setTimeout(function() {
                            if(data && !data.move) {
                                data.pressed = true;
                            }
                        }, 80);
                    })(),
                    clientX: e.clientX,
                    clientY: e.clientY
                };
            }
        },

        handlerUp: function(e) {
            var pointerevent;

            // touch
            if(e.pointerType === 'touch') {
                if(data && data.pressed) {
                    pointerevent = new $.PointerEvent(e, params.name);
                    $(e.target).trigger(pointerevent);
                }

                if(data) {
                    clearTimeout(data.timer);
                }

                data = null;
            // mouse – only left button
            } else if(e.which === 1) {
                pointerevent = new $.PointerEvent(e, params.name);
                $(e.currentTarget).triggerHandler(pointerevent);
            }
        }
    };

}

// init pointer events
addPointerEvent('press', extendPointerPress);
addPointerEvent('release', extendPointerRelease);

provide($);

});
