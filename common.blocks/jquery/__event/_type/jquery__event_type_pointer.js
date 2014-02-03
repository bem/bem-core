/**
 * Basic polyfill for Pointer Events W3C Specification.
 *
 * @author Kir Belevich <kir@soulshine.in>
 * @copyright Kir Belevich 2013
 * @license MIT
 * @version 0.5.2
 */
modules.define('jquery', function(provide, $) {

/*
   http://www.w3.org/TR/pointerevents/
   https://dvcs.w3.org/hg/pointerevents/raw-file/tip/pointerEvents.html
   https://dvcs.w3.org/hg/webevents/raw-file/default/touchevents.html
   http://msdn.microsoft.com/en-US/library/ie/hh673557.aspx
   http://www.benalman.com/news/2010/03/jquery-special-events/
   http://api.jquery.com/category/events/event-object/
*/

var win = window,
    doc = win.document,
    binds = {
        mouse: {
            enter: 'mouseenter',
            over: 'mouseover',
            down: 'mousedown',
            move: 'mousemove',
            up: 'mouseup',
            out: 'mouseout',
            leave: 'mouseleave'
        },

        touch: {
            enter: 'touchstart',
            over: 'touchstart',
            down: 'touchstart',
            move: 'touchmove',
            up: 'touchend',
            out: 'touchend',
            leave: 'touchend',
            cancel: 'touchcancel'
        },

        mspointer: {
            over: 'MSPointerOver',
            down: 'MSPointerDown',
            move: 'MSPointerMove',
            up: 'MSPointerUp',
            out: 'MSPointerOut',
            cancel: 'MSPointerCancel'
        }
    };

/**
 * Normalize touch-event by keeping all the
 * possible properties normalized by jQuery.
 *
 * @see http://api.jquery.com/category/events/event-object/
 *
 * @param {Object} e event
 */
function normalizeTouchEvent(e) {

    if(e.pointerType === 'touch') {

        e.originalEvent = e.originalEvent || e;

        // multitouch
        if(e.originalEvent.touches.length > 1) {
            e.multitouch = true;
            return;
        }

        var touchPoint = e.originalEvent.changedTouches[0];

        // keep all the properties normalized by jQuery
        e.clientX = touchPoint.clientX;
        e.clientY = touchPoint.clientY;
        e.pageX = touchPoint.pageX;
        e.pageY = touchPoint.pageY;
        e.screenX = touchPoint.screenX;
        e.screenY = touchPoint.screenY;
        e.layerX = e.originalEvent.layerX;
        e.layerY = e.originalEvent.layerY;
        e.offsetX = e.layerX - e.target.offsetLeft;
        e.offsetY = e.layerY - e.target.offsetTop;
        e.identifier = touchPoint.identifier;
    }

}

/**
 * Extend event to match PointerEvent Interface.
 *
 * @see https://dvcs.w3.org/hg/pointerevents/raw-file/tip/pointerEvents.html#pointer-events-and-interfaces
 * @see https://dvcs.w3.org/hg/webevents/raw-file/default/touchevents.html
 *
 * @param {object} e event
 */
function extendToPointerEvent(e) {

    /*eslint complexity:0*/
    e.width = e.width ||
              e.webkitRadiusX ||
              e.radiusX ||
              0;

    e.height = e.width ||
               e.webkitRadiusY ||
               e.radiusY ||
               0;

    // TODO: stupid Android somehow could send "force" > 1 ;(
    e.pressure = e.pressure ||
                 e.mozPressure ||
                 e.webkitForce ||
                 e.force ||
                 e.which && 0.5 ||
                 0;

    e.tiltX = e.tiltX || 0;
    e.tiltY = e.tiltY || 0;

    switch(e.pointerType) {
        case 2: e.pointerType = 'touch'; break;
        case 3: e.pointerType = 'pen'; break;
        case 4: e.pointerType = 'mouse'; break;
        default: e.pointerType = e.pointerType;
    }

    e.isPrimary = true;

    // "1" is always for mouse, so +2 because of touch can start from 0
    e.pointerId = e.identifier ? e.identifier + 2 : 1;

}

/**
 * Mutate an event to PointerEvent.
 *
 * @param {object} e current event object
 * @param {string} type future pointerevent type
 */
function PointerEvent(e, type) {

    extendToPointerEvent(e);
    normalizeTouchEvent(e);
    e.type = type;

    $.extend(this, e);

}

// export PointerEvent class
$.PointerEvent = PointerEvent;

// nothing to do in IE11 for today
if(win.navigator.pointerEnabled) {
    provide($);
    return;
}

/**
 * Simple nextTick polyfill.
 *
 * @see http://jsperf.com/settimeout-vs-nexttick-polyfill
 *
 * @returns {Function}
 */
function nextTick(callback) {

    var msgName = 'nextTick-polyfill',
        timeouts = [];

    if(win.nextTick) {
        return win.nextTick(callback);
    }

    if(!win.postMessage || win.ActiveXObject) {
        return setTimeout(callback, 0);
    }

    win.addEventListener('message', function(e){
        if(e.source === win && e.data === msgName) {
            if(e.stopPropagation) {
                e.stopPropagation();
            }

            if(timeouts.length) {
                timeouts.shift()();
            }
        }
    }, false);

    timeouts.push(callback);
    win.postMessage(msgName, '*');

}

/**
 * Create new $.event.special wrapper with some default behavior.
 *
 * @param {string} type event type
 * @param {object} toExtend object to extend default wrapper
 */
function addPointerEvent(type, toExtend) {

    var eventName = 'pointer' + type,
        pointerevent,

        eventSpecial = $.event.special[eventName] = {
            // bind
            setup: function() {
                $(this)
                    .on(binds.mouse[type], eventSpecial.mouseHandler)
                    .on(binds.touch[type], eventSpecial.touchHandler)
                    .on(binds.mspointer[type], eventSpecial.msHandler);
            },

            // unbind
            teardown: function() {
                $(this)
                    .off(binds.mouse[type], eventSpecial.mouseHandler)
                    .off(binds.touch[type], eventSpecial.touchHandler)
                    .off(binds.mspointer[type], eventSpecial.msHandler);
            },

            // mouse
            mouseHandler: function(e) {
                // do not duplicate PointerEvent if
                // touch/mspointer is already processed
                if(!eventSpecial._noMouse) {
                    e.pointerType = 4;
                    pointerevent = new PointerEvent(e, eventName);
                    $(e.currentTarget).triggerHandler(pointerevent);
                }

                // clear the "processed" key right after
                // current event and all the bubblings
                nextTick(function() {
                    eventSpecial._noMouse = false;
                });
            },

            // touch
            touchHandler: function(e) {
                // stop mouse events handling
                eventSpecial._noMouse = true;

                e.pointerType = 2;
                pointerevent = new PointerEvent(e, eventName);

                $(e.currentTarget).triggerHandler(pointerevent);
            },

            // mspointer
            msHandler: function(e) {
                // stop mouse events handling
                eventSpecial._noMouse = true;

                pointerevent = new PointerEvent(e, eventName);
                $(e.target).trigger(pointerevent);
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
 * Object to extend $.event.special to touchmove-based events.
 *
 * @param {object} params
 * @param {object} params.event event object
 * @param {string} params.name event name
 * @param {string} params.type event type
 * @returns {object}
 */
function touchmoveBased(params) {

    var event = params.event,
        type = params.type;

    return {
        // bind
        setup: function() {
            $(this)
                .on(binds.mouse[type], event.mouseHandler)
                .on(binds.touch[type], event.touchHandler)
                .on(binds.touch.down, event.touchDownHandler)
                .on(binds.mspointer[type], event.msHandler);

            if(type !== 'move') {
                $(this).on(binds.touch.move, event.touchMoveHandler);
            }
        },

        // unbind
        teardown: function() {
            $(this)
                .off(binds.mouse[type], event.mouseHandler)
                .off(binds.touch[type], event.touchHandler)
                .off(binds.touch.down, event.touchDownHandler)
                .off(binds.mspointer[type], event.msHandler);

            if(type !== 'move') {
                $(this).off(binds.touch.move, event.touchMoveHandler);
            }
        },

        touchDownHandler: function(e) {
            // stop mouse events handling
            event._noMouse = true;
            // save initial target
            event._target = e.target;
        }
    };

}

/**
 * Object to extend $.event.special to pointerenter.
 *
 * @param {object} params
 * @param {object} params.event event object
 * @param {string} params.name event name
 * @param {string} params.type event type
 * @returns {object}
 */
function extendToEnter(params) {

    return $.extend(touchmoveBased(params), {
        touchMoveHandler: function(e) {
            e.pointerType = 2;

            var pointerevent = new PointerEvent(e, params.name),
                targetFromPoint = doc.elementFromPoint(
                    pointerevent.clientX,
                    pointerevent.clientY
                ),
                target = params.event._target;

            // new target
            if(target !== targetFromPoint) {
                // fix simulated event targets
                pointerevent.relatedTarget = pointerevent.target;
                pointerevent.target = pointerevent.targetFromPoint;

                // inner target
                if(target.contains(targetFromPoint)) {
                    $(targetFromPoint).triggerHandler(pointerevent);
                // truly new target
                } else if(!targetFromPoint.contains(target)) {
                    $(targetFromPoint).trigger(pointerevent);
                }

                // targetFromPoint -> target
                params.event._target = targetFromPoint;
            }
        }
    });

}

/**
 * Object to extend $.event.special to pointerover.
 *
 * @param {object} params
 * @param {object} params.event event object
 * @param {string} params.name event name
 * @param {string} params.type event type
 * @returns {object}
 */
function extendToOver(params) {

    return $.extend(touchmoveBased(params), {
        touchMoveHandler: function(e) {
            e.pointerType = 2;

            var pointerevent = new PointerEvent(e, params.name),
                targetFromPoint = doc.elementFromPoint(
                    pointerevent.clientX,
                    pointerevent.clientY
                ),
                target = params.event._target;

            // new target
            if(target !== targetFromPoint) {
                // fix simulated event targets
                pointerevent.relatedTarget = pointerevent.target;
                pointerevent.target = pointerevent.targetFromPoint;

                $(targetFromPoint).trigger(pointerevent);

                // targetFromPoint -> target
                params.event._target = targetFromPoint;
            }
        }
    });

}

/**
 * Object to extend $.event.special touchHandler with "target from point".
 *
 * @param {object} params
 * @param {object} params.event event object
 * @param {string} params.name event name
 * @param {string} params.type event type
 * @returns {object}
 */
function extendWithTargetFromPoint(params) {

    return {
        touchHandler: function(e) {
            // stop mouse events handling
            params.event._noMouse = true;

            e.pointerType = 2;

            var pointerevent = new PointerEvent(e, params.name),
                targetFromPoint = doc.elementFromPoint(
                    pointerevent.clientX,
                    pointerevent.clientY
                );

            // fix simulated event targets
            pointerevent.relatedTarget = pointerevent.target;
            pointerevent.target = pointerevent.targetFromPoint;

            $(targetFromPoint).triggerHandler(pointerevent);
        }
    };

}

/**
 * Object to extend $.event.special to pointerout.
 *
 * @param {object} params
 * @param {object} params.event event object
 * @param {string} params.name event name
 * @param {string} params.type event type
 * @returns {object}
 */
function extendToOut(params) {

    return $.extend(
        touchmoveBased(params),
        extendWithTargetFromPoint(params),
        {
            touchMoveHandler: function(e) {
                e.pointerType = 2;

                var pointerevent = new PointerEvent(e, params.name),
                    targetFromPoint = doc.elementFromPoint(
                        pointerevent.clientX,
                        pointerevent.clientY
                    ),
                    target = params.event._target;

                // new target
                if(target !== targetFromPoint) {
                    $(target).trigger(pointerevent);

                    // targetFromPoint -> target
                    params.event._target = targetFromPoint;
                }
            }
        }
    );

}

/**
 * Object to extend $.event.special to pointerleave.
 *
 * @param {object} params
 * @param {object} params.event event object
 * @param {string} params.name event name
 * @param {string} params.type event type
 * @returns {object}
 */
function extendToLeave(params) {

    return $.extend(
        touchmoveBased(params),
        extendWithTargetFromPoint(params),
        {
            touchMoveHandler: function(e) {
                e.pointerType = 2;

                var pointerevent = new PointerEvent(e, params.name),
                    targetFromPoint = doc.elementFromPoint(
                        pointerevent.clientX,
                        pointerevent.clientY
                    ),
                    target = params.event._target;

                // new target
                if(target !== targetFromPoint) {
                    if(targetFromPoint.contains(target)) {
                        $(target).triggerHandler(pointerevent);
                    } else {
                        $(e.currentTarget).triggerHandler(pointerevent);
                    }

                    // targetFromPoint -> target
                    params.event._target = targetFromPoint;
                }
            }
        }
    );

}

/**
 * Object to extend $.event.special to pointermove.
 *
 * @param {object} params
 * @param {object} params.event event object
 * @param {string} params.name event name
 * @param {string} params.type event type
 * @returns {object}
 */
function extendToMove(params) {

    return $.extend(
        touchmoveBased(params),
        extendWithTargetFromPoint(params)
    );

}

// init pointer events
addPointerEvent('enter', extendToEnter);
addPointerEvent('over', extendToOver);
addPointerEvent('down');
addPointerEvent('move', extendToMove);
addPointerEvent('up', extendWithTargetFromPoint);
addPointerEvent('out', extendToOut);
addPointerEvent('leave', extendToLeave);
addPointerEvent('cancel');

provide($);

});
