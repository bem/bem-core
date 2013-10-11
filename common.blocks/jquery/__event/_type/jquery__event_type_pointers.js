/**
 * Basic polyfill for "Pointer Events" W3C Candidate Recommendation
 * with addition of custom pointerpress/pointerrelease events.
 *
 * @see http://www.w3.org/TR/pointerevents/
 * @see https://dvcs.w3.org/hg/pointerevents/raw-file/tip/pointerEvents.html
 * @see https://dvcs.w3.org/hg/webevents/raw-file/default/touchevents.html
 * @see http://msdn.microsoft.com/en-US/library/ie/hh673557.aspx
 * @see http://www.benalman.com/news/2010/03/jquery-special-events/
 * @see http://api.jquery.com/category/events/event-object/
 *
 * @modules pointerevents
 *
 * @author Kir Belevich <kir@soulshine.in>
 * @copyright Kir Belevich 2013
 * @license MIT
 * @version 0.1.0
 */
modules.define('jquery', function(provide, $) {

// nothing to do
if(window.navigator.pointerEnabled) {
    provide($);
    return;
}

// current events type and aliases
var current;

// touch
// https://github.com/ariya/phantomjs/issues/10375
if('ontouchstart' in window && !('_phantom' in window)) {
    current = {
        type : 'touch',
        enter : 'touchstart',
        over : 'touchstart',
        down : 'touchstart',
        move : 'touchmove',
        up : 'touchend',
        out : 'touchend',
        leave : 'touchend',
        cancel : 'touchcancel'
    };
// msPointer
} else if(window.navigator.msPointerEnabled) {
    current = {
        type : 'mspointer',
        enter : 'mouseenter', // :(
        over : 'MSPointerOver',
        down : 'MSPointerDown',
        move : 'MSPointerMove',
        up : 'MSPointerUp',
        out : 'MSPointerOut',
        leave : 'mouseleave', // :(
        cancel : 'MSPointerCancel'
    };
// mouse
} else {
    current = {
        type : 'mouse',
        enter : 'mouseenter',
        over : 'mouseover',
        down : 'mousedown',
        move : 'mousemove',
        up : 'mouseup',
        out : 'mouseout',
        leave : 'mouseleave'
    };
}

var isTouch = current.type === 'touch',
    isMouse = current.type === 'mouse';

/**
 * Mutate an argument event to PointerEvent.
 *
 * @param {Object} e current event
 * @param {String} type new pointerevent type
 */
function PointerEvent(e, type) {
    e.type = type;
    // do not do anything with multiple touch-events because of gestures
    if(!(type === 'touch' && e.originalEvent.changedTouches.length > 1)) {
        normalizeToJQueryEvent(e);
        extendToPointerEvent(e);
        $.extend(this, e);
    }
}

/**
 * Dispatch current event.
 *
 * @param {Element} target target element
 */
PointerEvent.prototype.dispatch = function(target) {
    this.type && ($.event.handle || $.event.dispatch).call(target, this);
    return this;
};

/**
 * Normalize only touch-event to jQuery event interface.
 *
 * @see http://api.jquery.com/category/events/event-object/
 *
 * @param {Object} e input event
 */
function normalizeToJQueryEvent(e) {
    if(!isTouch) return;

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
    e.offsetX = e.layerX - e.currentTarget.offsetLeft;
    e.offsetY = e.layerY - e.currentTarget.offsetTop;
    e.target = touchPoint.target;
    e.identifier = touchPoint.identifier;
}

/**
 * Extend event to match PointerEvent Interface.
 *
 * @see https://dvcs.w3.org/hg/pointerevents/raw-file/tip/pointerEvents.html#pointer-events-and-interfaces
 * @see https://dvcs.w3.org/hg/webevents/raw-file/default/touchevents.html
 * @param {Object} e input event
 */
function extendToPointerEvent(e) {
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
    e.pointerType = e.pointerType || current.type;

    // https://dvcs.w3.org/hg/pointerevents/raw-file/tip/pointerEvents.html#the-primary-pointer
    e.isPrimary = true;

    // "1" is always for mouse, need to +2 for touch which can start from "0"
    e.pointerId = e.identifier? e.identifier + 2 : 1;
}

function addSpecialEvent(eventType, extend) {
    var pointerEventType = 'pointer' + eventType,
        handlerFn = 'handler' + (isTouch? 'Touch' : 'NonTouch'),
        specialEvent = $.event.special[pointerEventType] = {
            setup : function() {
                $(this).on(current[eventType], specialEvent.handler);
            },

            teardown : function() {
                $(this).off(current[eventType], specialEvent.handler);
            },

            handler : function() {
                specialEvent[handlerFn].apply(this, arguments);
            },

            handlerTouch : function(e) {
                var pointerEvent = new PointerEvent(e, pointerEventType);
                pointerEvent.dispatch(pointerEvent.target);
            },

            handlerNonTouch : function(e) {
                new PointerEvent(e, pointerEventType).dispatch(this);
            }
        };

    extend && $.extend(specialEvent, extend(specialEvent, pointerEventType));
}

function extendHandlerTouchByElement(specialEvent, pointerEventType) {
    return {
        handlerTouch : function(e) {
            var pointerEvent = new PointerEvent(e, pointerEventType),
                target = document.elementFromPoint(pointerEvent.clientX, pointerEvent.clientY);
            pointerEvent.dispatch(target);
        }
    };
}

addSpecialEvent('enter');
addSpecialEvent('over');
addSpecialEvent('down');
addSpecialEvent('up', extendHandlerTouchByElement);
addSpecialEvent('out', extendHandlerTouchByElement);
addSpecialEvent('leave', extendHandlerTouchByElement);
addSpecialEvent('move', function(specialEvent) {
    return {
        setup : function() {
            isTouch && $(this).on(current.down, specialEvent.downHandler);
            $(this).on(current.move, specialEvent.moveHandler);
        },

        teardown : function() {
            isTouch && $(this).off(current.down, specialEvent.downHandler);
            $(this).off(current.move, specialEvent.moveHandler);
        },

        downHandler : function(e) {
            var pointerEvent = new PointerEvent(e, 'pointerdown');
            specialEvent.target = pointerEvent.target;
        },

        moveHandler : function(e) {
            var pointerEvent = new PointerEvent(e, 'pointermove');
            if(isTouch) {
                var newTarget = document.elementFromPoint(pointerEvent.clientX, pointerEvent.clientY),
                    currentTarget = specialEvent.target;

                pointerEvent.dispatch(currentTarget);

                if(currentTarget !== newTarget) {
                    // out current target
                    pointerEvent = new PointerEvent(e, 'pointerout');
                    pointerEvent.dispatch(currentTarget);

                    // new target is not a child of the current -> leave current target
                    if(!currentTarget.contains(newTarget)) {
                        pointerEvent = new PointerEvent(e, 'pointerleave');
                        pointerEvent.dispatch(currentTarget);
                    }

                    // new target is not the parent of the current -> leave new target
                    if(!newTarget.contains(currentTarget)) {
                        pointerEvent = new PointerEvent(e, 'pointerenter');
                        pointerEvent.dispatch(newTarget);
                    }

                    // over new target
                    pointerEvent = new PointerEvent(e, 'pointerover');
                    pointerEvent.dispatch(newTarget);

                    // new target -> current target
                    specialEvent.target = newTarget;
                }
            } else {
                pointerEvent.dispatch(this);
            }
        }
    };
});

addSpecialEvent('press', function(specialEvent) {
    return {
        setup : function() {
            isMouse?
                $(this).on(current.down, specialEvent.handlerMouse) :
                $(this)
                    .on(current.down, specialEvent.handlerNonMouseDown)
                    .on(current.move, specialEvent.handlerNonMouseMove)
                    .on(current.up, specialEvent.handlerNonMouseUp);
        },

        teardown : function() {
            isMouse?
                $(this).off(current.down, specialEvent.handlerMouse) :
                $(this)
                    .off(current.down, specialEvent.handlerNonMouseDown)
                    .off(current.move, specialEvent.handlerNonMouseMove)
                    .off(current.up, specialEvent.handlerNonMouseUp);
        },

        handlerNonMouseDown : function(e) {
            specialEvent.data = {
                timer : (function() {
                    return setTimeout(function() {
                        if(!specialEvent.data.move) {
                            var pointerevent = new PointerEvent(e, 'pointerpress');
                            pointerevent.dispatch(pointerevent.target);
                        }
                    }, 80);
                })(),
                clientX : e.clientX,
                clientY : e.clientY
            };
        },

        handlerNonMouseMove : function(e) {
            var data = specialEvent.data;
            if(Math.abs(e.clientX - data.clientX) > 5 ||
                Math.abs(e.clientY - data.clientY) > 5) {
                data.move = true;
            }
        },

        handlerNonMouseUp : function() {
            clearTimeout(specialEvent.data.timer);
            delete specialEvent.data;
        },

        handlerMouse : function(e) {
            // only left mouse button
            e.which === 1 && new PointerEvent(e, 'pointerpress').dispatch(this);
        }
    };
});

addSpecialEvent('release', function(specialEvent) {
    return {
        setup : function() {
            isMouse?
                $(this).on(current.up, specialEvent.handlerMouse) :
                $(this)
                    .on(current.down, specialEvent.handlerNonMouseDown)
                    .on(current.move, specialEvent.handlerNonMouseMove)
                    .on(current.up, specialEvent.handlerNonMouseUp);
        },

        teardown : function() {
            isMouse?
                $(this).off(current.down, specialEvent.handlerMouse) :
                $(this)
                    .off(current.down, specialEvent.handlerNonMouseDown)
                    .off(current.move, specialEvent.handlerNonMouseMove)
                    .off(current.up, specialEvent.handlerNonMouseUp);
        },

        handlerNonMouseDown : function(e) {
            var data = specialEvent.data = {
                timer : (function() {
                    return setTimeout(function() {
                        data.move || (data.pressed = true);
                    }, 80);
                })(),
                clientX : e.clientX,
                clientY : e.clientY
            };
        },

        handlerNonMouseMove : function(e) {
            var data = specialEvent.data;
            if(Math.abs(e.clientX - data.clientX) > 5 ||
                Math.abs(e.clientY - data.clientY) > 5) {
                data.move = true;
            }
        },

        handlerNonMouseUp : function(e) {
            clearTimeout(specialEvent.data.timer);

            if(specialEvent.data.pressed) {
                var pointerEvent = new PointerEvent(e, 'pointerrelease'),
                    target = document.elementFromPoint(pointerEvent.clientX, pointerEvent.clientY);
                pointerEvent.dispatch(target);
            }

            delete specialEvent.data;
        },

        handlerMouse : function(e) {
            // only left mouse button
            e.which === 1 && new PointerEvent(e, 'pointerrelease').dispatch(this);
        }
    };
});

provide($);

});
