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
    var current,
        pointerenter,
        pointerover,
        pointerdown,
        pointermove,
        pointerup,
        pointerout,
        pointerleave,
        pointerpress,
        pointerrelease;

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

    /**
     * Mutate an argument event to PointerEvent.
     *
     * @param {Object} e current event
     * @param {String} type new pointerevent type
     */
    function PointerEvent(e, type) {
        e.type = type;
        e = this._prepareEvent(e);

        if(e) {
            e = this._extendToPointer(e);
            $.extend(this, e);
        }
    }

    /**
     * Prepare (touch-)event and keep all the properties normalized by jQuery.
     *
     * @see http://api.jquery.com/category/events/event-object/
     *
     * @param {Object} e input event
     * @return {Object} output event
     */
    PointerEvent.prototype._prepareEvent = function(e) {

        if(current.type === 'touch') {
            // do not do anything with multiple touch-events bacause of gestures
            if(e.originalEvent.changedTouches.length > 1) {
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
            e.offsetX = e.layerX - e.currentTarget.offsetLeft;
            e.offsetY = e.layerY - e.currentTarget.offsetTop;
            e.target = touchPoint.target;
            e.identifier = touchPoint.identifier;
        }

        return e;

    };

    /**
     * Extend event to match PointerEvent Interface.
     *
     * @see https://dvcs.w3.org/hg/pointerevents/raw-file/tip/pointerEvents.html#pointer-events-and-interfaces
     * @see https://dvcs.w3.org/hg/webevents/raw-file/default/touchevents.html
     * @param {Object} e input event
     * @return {Object} output event
     */
    PointerEvent.prototype._extendToPointer = function(e) {

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

        return e;

    };

    /**
     * Dispatch current event.
     *
     * @param {Element} target target element
     */
    PointerEvent.prototype.dispatch = function(target) {

        if(this.type) {
            ($.event.handle || $.event.dispatch).call(target, this);
        }

        return this;

    };

    // pointerenter
    pointerenter = $.event.special.pointerenter = {

        setup : function() {
            $(this).on(current.enter, pointerenter.handler);
        },

        teardown : function() {
            $(this).off(current.enter, pointerenter.handler);
        },

        handler : function() {
            var handlerType = current.type === 'touch'? 'Touch' : 'NonTouch';
            pointerenter['handler' + handlerType].apply(this, arguments);
        },

        handlerTouch : function(e) {
            var pointerevent = new PointerEvent(e, 'pointerenter');
            pointerevent.dispatch(pointerevent.target);
        },

        handlerNonTouch : function(e) {
            var pointerevent = new PointerEvent(e, 'pointerenter');
            pointerevent.dispatch(this);
        }

    };

    // pointerover
    pointerover = $.event.special.pointerover = {

        setup : function() {
            $(this).on(current.over, pointerover.handler);
        },

        teardown : function() {
            $(this).off(current.over, pointerover.handler);
        },

        handler : function() {
            var handlerType = current.type === 'touch'? 'Touch' : 'NonTouch';
            pointerover['handler' + handlerType].apply(this, arguments);
        },

        handlerTouch : function(e) {
            var pointerevent = new PointerEvent(e, 'pointerover');
            pointerevent.dispatch(pointerevent.target);
        },

        handlerNonTouch : function(e) {
            var pointerevent = new PointerEvent(e, 'pointerover');
            pointerevent.dispatch(this);
        }

    };

    // pointerdown
    pointerdown = $.event.special.pointerdown = {

        setup : function() {
            $(this).on(current.down, pointerdown.handler);
        },

        teardown : function() {
            $(this).off(current.down, pointerdown.handler);
        },

        handler : function() {
            var handlerType = current.type === 'touch'? 'Touch' : 'NonTouch';
            pointerdown['handler' + handlerType].apply(this, arguments);
        },

        handlerTouch : function(e) {
            var pointerevent = new PointerEvent(e, 'pointerdown');
            pointerevent.dispatch(pointerevent.target);
        },

        handlerNonTouch : function(e) {
            var pointerevent = new PointerEvent(e, 'pointerdown');
            pointerevent.dispatch(this);
        }

    };

    // pointermove
    pointermove = $.event.special.pointermove = {

        setup : function() {
            if(current.type === 'touch') {
                $(this).on(current.down, pointermove.downHandler);
            }

            $(this).on(current.move, pointermove.moveHandler);
        },

        teardown : function() {
            if(current.type === 'touch') {
                $(this).off(current.down, pointermove.downHandler);
            }

            $(this).off(current.move, pointermove.moveHandler);
        },

        downHandler : function(e) {
            var pointerevent = new PointerEvent(e, 'pointerdown');
            pointermove.target = pointerevent.target;
        },

        moveHandler : function(e) {

            var pointerevent = new PointerEvent(e, 'pointermove');

            if(current.type === 'touch') {
                var newTarget = document.elementFromPoint(pointerevent.clientX, pointerevent.clientY),
                    currentTarget = pointermove.target;

                pointerevent.dispatch(currentTarget);

                if(currentTarget !== newTarget) {

                    // out current target
                    pointerevent = new PointerEvent(e, 'pointerout');
                    pointerevent.dispatch(currentTarget);

                    // new target is not a child of the current -> leave current target
                    if(!currentTarget.contains(newTarget)) {
                        pointerevent = new PointerEvent(e, 'pointerleave');
                        pointerevent.dispatch(currentTarget);
                    }

                    // new target is not the parent of the current -> leave new target
                    if(!newTarget.contains(currentTarget)) {
                        pointerevent = new PointerEvent(e, 'pointerenter');
                        pointerevent.dispatch(newTarget);
                    }

                    // over new target
                    pointerevent = new PointerEvent(e, 'pointerover');
                    pointerevent.dispatch(newTarget);

                    // new target -> current target
                    pointermove.target = newTarget;
                }
            } else {
                pointerevent.dispatch(this);
            }

        }

    };

    // pointerup
    pointerup = $.event.special.pointerup = {

        setup : function() {
            $(this).on(current.up, pointerup.handler);
        },

        teardown : function() {
            $(this).off(current.up, pointerup.handler);
        },

        handler : function() {
            var handlerType = current.type === 'touch'? 'Touch' : 'NonTouch';
            pointerup['handler' + handlerType].apply(this, arguments);
        },

        handlerTouch : function(e) {
            var pointerevent = new PointerEvent(e, 'pointerup'),
                data = pointerevent.e;

            pointerevent.dispatch(document.elementFromPoint(data.clientX, data.clientY));
        },

        handlerNonTouch : function(e) {
            var pointerevent = new PointerEvent(e, 'pointerup');
            pointerevent.dispatch(this);
        }

    };

    // pointerout
    pointerout = $.event.special.pointerout = {

        setup : function() {
            $(this).on(current.out, pointerout.handler);
        },

        teardown : function() {
            $(this).off(current.out, pointerout.handler);
        },

        handler : function() {
            var handlerType = current.type === 'touch'? 'Touch' : 'NonTouch';
            pointerout['handler' + handlerType].apply(this, arguments);
        },

        handlerTouch : function(e) {
            var pointerevent = new PointerEvent(e, 'pointerout'),
                data = pointerevent.e;

            pointerevent.dispatch(document.elementFromPoint(data.clientX, data.clientY));
        },

        handlerNonTouch : function(e) {
            var pointerevent = new PointerEvent(e, 'pointerout');
            pointerevent.dispatch(this);
        }

    };

    // pointerleave
    pointerleave = $.event.special.pointerleave = {

        setup : function() {
            $(this).on(current.leave, pointerleave.handler);
        },

        teardown : function() {
            $(this).off(current.leave, pointerleave.handler);
        },

        handler : function() {
            var handlerType = current.type === 'touch'? 'Touch' : 'NonTouch';
            pointerleave['handler' + handlerType].apply(this, arguments);
        },

        handlerTouch : function(e) {
            var pointerevent = new PointerEvent(e, 'pointerleave'),
                data = pointerevent.e;

            pointerevent.dispatch(document.elementFromPoint(data.clientX, data.clientY));
        },

        handlerNonTouch : function(e) {
            var pointerevent = new PointerEvent(e, 'pointerleave');
            pointerevent.dispatch(this);
        }

    };

    // pointerpress
    pointerpress = $.event.special.pointerpress = {

        setup : function() {
            if(current.type === 'mouse') {
                $(this).on(current.down, pointerpress.handlerMouse);
            } else {
                $(this)
                    .on(current.down, pointerpress.handlerNonMouseDown)
                    .on(current.move, pointerpress.handlerNonMouseMove)
                    .on(current.up, pointerpress.handlerNonMouseUp);
            }
        },

        teardown : function() {
            if(current.type === 'mouse') {
                $(this).off(current.down, pointerpress.handlerMouse);
            } else {
                $(this)
                    .off(current.down, pointerpress.handlerNonMouseDown)
                    .off(current.move, pointerpress.handlerNonMouseMove)
                    .off(current.up, pointerpress.handlerNonMouseUp);
            }
        },

        handler : function() {
            var handlerType = current.type === 'touch'? 'Touch' : 'NonTouch';
            pointerpress['handler' + handlerType].apply(this, arguments);
        },

        handlerNonMouseDown : function(e) {
            pointerpress.data = {
                timer : (function() {
                    return setTimeout(function() {
                        if(!pointerpress.data.move) {
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
            if(Math.abs(e.clientX - pointerpress.data.clientX) > 5 ||
               Math.abs(e.clientY - pointerpress.data.clientY) > 5) {
                pointerpress.data.move = true;
            }
        },

        handlerNonMouseUp : function() {
            clearTimeout(pointerpress.data.timer);
            delete pointerpress.data;
        },

        handlerMouse : function(e) {
            // only left mouse button
            if(e.which === 1) {
                var pointerevent = new PointerEvent(e, 'pointerpress');
                pointerevent.dispatch(this);
            }
        }

    };

    // pointerrelease
    pointerrelease = $.event.special.pointerrelease = {

        setup : function() {
            if(current.type === 'mouse') {
                $(this).on(current.up, pointerrelease.handlerMouse);
            } else {
                $(this)
                    .on(current.down, pointerrelease.handlerNonMouseDown)
                    .on(current.move, pointerrelease.handlerNonMouseMove)
                    .on(current.up, pointerrelease.handlerNonMouseUp);
            }
        },

        teardown : function() {
            if(current.type === 'mouse') {
                $(this).off(current.down, pointerrelease.handlerMouse);
            } else {
                $(this)
                    .off(current.down, pointerrelease.handlerNonMouseDown)
                    .off(current.move, pointerrelease.handlerNonMouseMove)
                    .off(current.up, pointerrelease.handlerNonMouseUp);
            }
        },

        handler : function() {
            var handlerType = current.type === 'touch'? 'Touch' : 'NonTouch';
            pointerrelease['handler' + handlerType].apply(this, arguments);
        },

        handlerNonMouseDown : function(e) {
            pointerrelease.data = {
                timer : (function() {
                    return setTimeout(function() {
                        if(!pointerrelease.data.move) {
                            pointerrelease.data.pressed = true;
                        }
                    }, 80);
                })(),
                clientX : e.clientX,
                clientY : e.clientY
            };
        },

        handlerNonMouseMove : function(e) {
            if(Math.abs(e.clientX - pointerrelease.data.clientX) > 5 ||
               Math.abs(e.clientY - pointerrelease.data.clientY) > 5) {
                pointerrelease.data.move = true;
            }
        },

        handlerNonMouseUp : function(e) {
            clearTimeout(pointerrelease.data.timer);

            if(pointerrelease.data.pressed) {
                var pointerevent = new PointerEvent(e, 'pointerrelease');
                pointerevent.dispatch(pointerevent.target);
            }

            delete pointerrelease.data;
        },

        handlerMouse : function(e) {
            // only left mouse button
            if(e.which === 1) {
                var pointerevent = new PointerEvent(e, 'pointerrelease');
                pointerevent.dispatch(this);
            }
        }

    };

    provide($);

});
