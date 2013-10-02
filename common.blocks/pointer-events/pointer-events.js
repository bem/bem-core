// https://handjs.codeplex.com/

(function () {
    // Installing Hand.js
    var supportedEventsNames = ["PointerDown", "PointerUp", "PointerMove", "PointerOver", "PointerOut", "PointerCancel", "PointerEnter", "PointerLeave",
                                "pointerdown", "pointerup", "pointermove", "pointerover", "pointerout", "pointercancel", "pointerenter", "pointerleave"
    ];

    var POINTER_TYPE_TOUCH = "touch";
    var POINTER_TYPE_PEN = "pen";
    var POINTER_TYPE_MOUSE = "mouse";

    var previousTargets = {};

    // Touch events
    var generateTouchClonedEvent = function (sourceEvent, newName) {
        // Considering touch events are almost like super mouse events
        var evObj;

        if (document.createEvent) {
            evObj = document.createEvent('MouseEvents');
            evObj.initMouseEvent(newName, true, true, window, 1, sourceEvent.screenX, sourceEvent.screenY,
                sourceEvent.clientX, sourceEvent.clientY, sourceEvent.ctrlKey, sourceEvent.altKey,
                sourceEvent.shiftKey, sourceEvent.metaKey, sourceEvent.button, null);
        }
        else {
            evObj = document.createEventObject();
            evObj.screenX = sourceEvent.screenX;
            evObj.screenY = sourceEvent.screenY;
            evObj.clientX = sourceEvent.clientX;
            evObj.clientY = sourceEvent.clientY;
            evObj.ctrlKey = sourceEvent.ctrlKey;
            evObj.altKey = sourceEvent.altKey;
            evObj.shiftKey = sourceEvent.shiftKey;
            evObj.metaKey = sourceEvent.metaKey;
            evObj.button = sourceEvent.button;
        }
        // offsets
        if (evObj.offsetX === undefined) {
            if (sourceEvent.offsetX !== undefined) {

                // For Opera which creates readonly properties
                if (Object && Object.defineProperty !== undefined) {
                    Object.defineProperty(evObj, "offsetX", {
                        writable: true
                    });
                    Object.defineProperty(evObj, "offsetY", {
                        writable: true
                    });
                }

                evObj.offsetX = sourceEvent.offsetX;
                evObj.offsetY = sourceEvent.offsetY;
            }
            else if (sourceEvent.layerX !== undefined) {
                evObj.offsetX = sourceEvent.layerX - sourceEvent.currentTarget.offsetLeft;
                evObj.offsetY = sourceEvent.layerY - sourceEvent.currentTarget.offsetTop;
            }
        }

        // adding missing properties

        if (sourceEvent.isPrimary !== undefined)
            evObj.isPrimary = sourceEvent.isPrimary;
        else
            evObj.isPrimary = true;

        if (sourceEvent.pressure)
            evObj.pressure = sourceEvent.pressure;
        else {
            var button = 0;

            if (sourceEvent.which !== undefined)
                button = sourceEvent.which;
            else if (sourceEvent.button !== undefined) {
                button = sourceEvent.button;
            }
            evObj.pressure = (button == 0) ? 0 : 0.5;
        }


        if (sourceEvent.rotation)
            evObj.rotation = sourceEvent.rotation;
        else
            evObj.rotation = 0;

        // Timestamp
        if (sourceEvent.hwTimestamp)
            evObj.hwTimestamp = sourceEvent.hwTimestamp;
        else
            evObj.hwTimestamp = 0;

        // Tilts
        if (sourceEvent.tiltX)
            evObj.tiltX = sourceEvent.tiltX;
        else
            evObj.tiltX = 0;

        if (sourceEvent.tiltY)
            evObj.tiltY = sourceEvent.tiltY;
        else
            evObj.tiltY = 0;

        // Width and Height
        if (sourceEvent.height)
            evObj.height = sourceEvent.height;
        else
            evObj.height = 0;

        if (sourceEvent.width)
            evObj.width = sourceEvent.width;
        else
            evObj.width = 0;

        // preventDefault
        evObj.preventDefault = function () {
            if (sourceEvent.preventDefault !== undefined)
                sourceEvent.preventDefault();
        };

        // stopPropagation
        if (evObj.stopPropagation !== undefined) {
            var current = evObj.stopPropagation;
            evObj.stopPropagation = function () {
                if (sourceEvent.stopPropagation !== undefined)
                    sourceEvent.stopPropagation();
                current.call(this);
            };
        }

        // Constants
        evObj.POINTER_TYPE_TOUCH = POINTER_TYPE_TOUCH;
        evObj.POINTER_TYPE_PEN = POINTER_TYPE_PEN;
        evObj.POINTER_TYPE_MOUSE = POINTER_TYPE_MOUSE;

        // Pointer values
        evObj.pointerId = sourceEvent.pointerId;
        evObj.pointerType = sourceEvent.pointerType;

        switch (evObj.pointerType) {// Old spec version check
            case 2:
                evObj.pointerType = evObj.POINTER_TYPE_TOUCH;
                break;
            case 3:
                evObj.pointerType = evObj.POINTER_TYPE_PEN;
                break;
            case 4:
                evObj.pointerType = evObj.POINTER_TYPE_MOUSE;
                break;
        }

        // If force preventDefault
        if (sourceEvent.currentTarget && sourceEvent.currentTarget.handjs_forcePreventDefault === true)
            evObj.preventDefault();

        // Fire event
        if (sourceEvent.target) {
            sourceEvent.target.dispatchEvent(evObj);
        } else {
            sourceEvent.srcElement.fireEvent("on" + getMouseEquivalentEventName(newName), evObj); // We must fallback to mouse event for very old browsers
        }
    };

    var generateMouseProxy = function (evt, eventName) {
        if (!evt.button) {
            evt.pointerId = 1;
            evt.pointerType = POINTER_TYPE_MOUSE;
            generateTouchClonedEvent(evt, eventName);
        }
    };

    var generateTouchEventProxy = function (name, touchPoint, target, eventObject) {
        var touchPointId = touchPoint.identifier + 2; // Just to not override mouse id

        touchPoint.pointerId = touchPointId;
        touchPoint.pointerType = POINTER_TYPE_TOUCH;
        touchPoint.currentTarget = target;
        touchPoint.target = target;

        if (eventObject.preventDefault !== undefined) {
            touchPoint.preventDefault = function () {
                eventObject.preventDefault();
            };
        }

        generateTouchClonedEvent(touchPoint, name);
    };

    var generateTouchEventProxyIfRegistered = function (eventName, touchPoint, target, eventObject) { // Check if user registered this event
        if (target.__handjsGlobalRegisteredEvents && target.__handjsGlobalRegisteredEvents[eventName]) {
            generateTouchEventProxy(eventName, touchPoint, target, eventObject);
        }
    };

    var handleOtherEvent = function (eventObject, name, useLocalTarget, checkRegistration) {
        if (eventObject.preventManipulation)
            eventObject.preventManipulation();

        for (var i = 0; i < eventObject.changedTouches.length; ++i) {
            var touchPoint = eventObject.changedTouches[i];

            if (useLocalTarget) {
                previousTargets[touchPoint.identifier] = touchPoint.target;
            }

            if (checkRegistration) {
                generateTouchEventProxyIfRegistered(name, touchPoint, previousTargets[touchPoint.identifier], eventObject);
            } else {
                generateTouchEventProxy(name, touchPoint, previousTargets[touchPoint.identifier], eventObject);
            }
        }
    };

    var getMouseEquivalentEventName = function (eventName) {
        return eventName.toLowerCase().replace("pointer", "mouse");
    };

    var getPrefixEventName = function (item, prefix, eventName) {
        var newEventName;

        if (eventName == eventName.toLowerCase()) {
            var indexOfUpperCase = supportedEventsNames.indexOf(eventName) - (supportedEventsNames.length / 2);
            newEventName = prefix + supportedEventsNames[indexOfUpperCase];
        }
        else {
            newEventName = prefix + eventName;
        }

        // Fallback to PointerOver if PointerEnter is not currently supported
        if (newEventName === prefix + "PointerEnter" && item["on" + prefix.toLowerCase() + "pointerenter"] === undefined) {
            newEventName = prefix + "PointerOver";
        }

        // Fallback to PointerOut if PointerLeave is not currently supported
        if (newEventName === prefix + "PointerLeave" && item["on" + prefix.toLowerCase() + "pointerleave"] === undefined) {
            newEventName = prefix + "PointerOut";
        }

        return newEventName;
    };

    var registerOrUnregisterEvent = function (item, name, func, enable) {
        if (item.__handjsRegisteredEvents === undefined) {
            item.__handjsRegisteredEvents = [];
        }

        if (enable) {
            if (item.__handjsRegisteredEvents[name] !== undefined) {
                item.__handjsRegisteredEvents[name]++;
                return;
            }

            item.__handjsRegisteredEvents[name] = 1;
            item.addEventListener(name, func, false);
        } else {

            if (item.__handjsRegisteredEvents.indexOf(name) !== -1) {
                item.__handjsRegisteredEvents[name]--;

                if (item.__handjsRegisteredEvents[name] != 0) {
                    return;
                }
            }
            item.removeEventListener(name, func);
            item.__handjsRegisteredEvents[name] = 0;
        }
    };

    var setTouchAware = function (item, eventName, enable) {
        // If item is already touch aware, do nothing
        if (item.onpointerdown !== undefined) {
            return;
        }

        // IE 10
        if (item.onmspointerdown !== undefined) {
            var msEventName = getPrefixEventName(item, "MS", eventName);

            registerOrUnregisterEvent(item, msEventName, function (evt) { generateTouchClonedEvent(evt, eventName); }, enable);

            // We can return because MSPointerXXX integrate mouse support
            return;
        }

        // Chrome, Firefox
        if (item.ontouchstart !== undefined) {
            switch (eventName) {
                case "pointermove":
                    registerOrUnregisterEvent(item, "touchmove", function (evt) { handleOtherEvent(evt, eventName); }, enable);
                    break;
                case "pointercancel":
                    registerOrUnregisterEvent(item, "touchcancel", function (evt) { handleOtherEvent(evt, eventName); }, enable);
                    break;
                case "pointerdown":
                case "pointerup":
                case "pointerout":
                case "pointerover":
                case "pointerleave":
                case "pointerenter":
                    // These events will be handled by the window.ontouchmove function
                    if (!item.__handjsGlobalRegisteredEvents) {
                        item.__handjsGlobalRegisteredEvents = [];
                    }

                    if (enable) {
                        if (item.__handjsGlobalRegisteredEvents[eventName] !== undefined) {
                            item.__handjsGlobalRegisteredEvents[eventName]++;
                            return;
                        }
                        item.__handjsGlobalRegisteredEvents[eventName] = 1;
                    } else {
                        if (item.__handjsGlobalRegisteredEvents[eventName] !== undefined) {
                            item.__handjsGlobalRegisteredEvents[eventName]--;
                            if (item.__handjsGlobalRegisteredEvents[eventName] < 0) {
                                item.__handjsGlobalRegisteredEvents[eventName] = 0;
                            }
                        }
                    }
                    break;
            }
        }

        // Fallback to mouse
        switch (eventName) {
            case "pointerdown":
                registerOrUnregisterEvent(item, "mousedown", function (evt) { generateMouseProxy(evt, eventName); }, enable);
                break;
            case "pointermove":
                registerOrUnregisterEvent(item, "mousemove", function (evt) { generateMouseProxy(evt, eventName); }, enable);
                break;
            case "pointerup":
                registerOrUnregisterEvent(item, "mouseup", function (evt) { generateMouseProxy(evt, eventName); }, enable);
                break;
            case "pointerover":
                registerOrUnregisterEvent(item, "mouseover", function (evt) { generateMouseProxy(evt, eventName); }, enable);
                break;
            case "pointerout":
                registerOrUnregisterEvent(item, "mouseout", function (evt) { generateMouseProxy(evt, eventName); }, enable);
                break;
            case "pointerenter":
                if (item.onmouseenter === undefined) { // Fallback to mouseover
                    registerOrUnregisterEvent(item, "mouseover", function (evt) { generateMouseProxy(evt, eventName); }, enable);
                } else {
                    registerOrUnregisterEvent(item, "mouseenter", function (evt) { generateMouseProxy(evt, eventName); }, enable);
                }
                break;
            case "pointerleave":
                if (item.onmouseleave === undefined) { // Fallback to mouseout
                    registerOrUnregisterEvent(item, "mouseout", function (evt) { generateMouseProxy(evt, eventName); }, enable);
                } else {
                    registerOrUnregisterEvent(item, "mouseleave", function (evt) { generateMouseProxy(evt, eventName); }, enable);
                }
                break;
        }
    };

    // Intercept addEventListener calls by changing the prototype
    var interceptAddEventListener = function (root) {
        var current = root.prototype ? root.prototype.addEventListener : root.addEventListener;

        var customAddEventListener = function (name, func, capture) {
            // Branch when a PointerXXX is used
            if (supportedEventsNames.indexOf(name) != -1) {
                setTouchAware(this, name, true);
            }

            if (current === undefined) {
                this.attachEvent("on" + getMouseEquivalentEventName(name), func);
            } else {
                current.call(this, name, func, capture);
            }
        };

        if (root.prototype) {
            root.prototype.addEventListener = customAddEventListener;
        } else {
            root.addEventListener = customAddEventListener;
        }
    };

    // Intercept removeEventListener calls by changing the prototype
    var interceptRemoveEventListener = function (root) {
        var current = root.prototype ? root.prototype.removeEventListener : root.removeEventListener;

        var customRemoveEventListener = function (name, func, capture) {
            // Release when a PointerXXX is used
            if (supportedEventsNames.indexOf(name) != -1) {
                setTouchAware(this, name, false);
            }

            if (current === undefined) {
                this.detachEvent(getMouseEquivalentEventName(name), func);
            } else {
                current.call(this, name, func, capture);
            }
        };
        if (root.prototype) {
            root.prototype.removeEventListener = customRemoveEventListener;
        } else {
            root.removeEventListener = customRemoveEventListener;
        }
    };

    // Hooks
    interceptAddEventListener(document);
    interceptRemoveEventListener(document);

    if (window.HTMLElement) {
        interceptAddEventListener(HTMLElement);
        interceptRemoveEventListener(HTMLElement);
    }

    if (window.HTMLBodyElement) {
        interceptAddEventListener(HTMLBodyElement);
        interceptRemoveEventListener(HTMLBodyElement);
    }

    if (window.HTMLDivElement) {
        interceptAddEventListener(HTMLDivElement);
        interceptRemoveEventListener(HTMLDivElement);
    }

    if (window.HTMLImageElement) {
        interceptAddEventListener(HTMLImageElement);
        interceptRemoveEventListener(HTMLImageElement);
    }

    if (window.HTMLAnchorElement) {
        interceptAddEventListener(HTMLAnchorElement);
        interceptRemoveEventListener(HTMLAnchorElement);
    }

    if (window.HTMLUListElement) {
        interceptAddEventListener(HTMLUListElement);
        interceptRemoveEventListener(HTMLUListElement);
    }

    if (window.HTMLLIElement) {
        interceptAddEventListener(HTMLLIElement);
        interceptRemoveEventListener(HTMLLIElement);
    }

    if (window.HTMLTableElement) {
        interceptAddEventListener(HTMLTableElement);
        interceptRemoveEventListener(HTMLTableElement);
    }

    if (window.HTMLSpanElement) {
        interceptAddEventListener(HTMLSpanElement);
        interceptRemoveEventListener(HTMLSpanElement);
    }

    if (window.HTMLCanvasElement) {
        interceptAddEventListener(HTMLCanvasElement);
        interceptRemoveEventListener(HTMLCanvasElement);
    }

    if (window.SVGElement) {
        interceptAddEventListener(SVGElement);
        interceptRemoveEventListener(SVGElement);
    }

    // Handling move on window to detect pointerleave/out/over
    if (window.ontouchstart !== undefined) {
        window.addEventListener('touchstart', function (eventObject) {
            for (var i = 0; i < eventObject.changedTouches.length; ++i) {
                var touchPoint = eventObject.changedTouches[i];
                previousTargets[touchPoint.identifier] = touchPoint.target;

                generateTouchEventProxyIfRegistered("pointerenter", touchPoint, touchPoint.target, eventObject);
                generateTouchEventProxyIfRegistered("pointerover", touchPoint, touchPoint.target, eventObject);
                generateTouchEventProxyIfRegistered("pointerdown", touchPoint, touchPoint.target, eventObject);
            }
        });

        window.addEventListener('touchend', function (eventObject) {
            for (var i = 0; i < eventObject.changedTouches.length; ++i) {
                var touchPoint = eventObject.changedTouches[i];
                var currentTarget = previousTargets[touchPoint.identifier];

                generateTouchEventProxyIfRegistered("pointerup", touchPoint, currentTarget, eventObject);
                generateTouchEventProxyIfRegistered("pointerout", touchPoint, currentTarget, eventObject);
                generateTouchEventProxyIfRegistered("pointerleave", touchPoint, currentTarget, eventObject);
            }
        });

        window.addEventListener('touchmove', function (eventObject) {
            for (var i = 0; i < eventObject.changedTouches.length; ++i) {
                var touchPoint = eventObject.changedTouches[i];
                var newTarget = document.elementFromPoint(touchPoint.clientX, touchPoint.clientY);
                var currentTarget = previousTargets[touchPoint.identifier];

                if (currentTarget === newTarget) {
                    continue; // We can skip this as the pointer is effectively over the current target
                }

                if (currentTarget) {
                    // Raise out
                    generateTouchEventProxyIfRegistered("pointerout", touchPoint, currentTarget, eventObject);

                    // Raise leave
                    if (!currentTarget.contains(newTarget)) { // Leave must be called if the new target is not a child of the current
                        generateTouchEventProxyIfRegistered("pointerleave", touchPoint, currentTarget, eventObject);
                    }
                }

                if (newTarget) {
                    // Raise over
                    generateTouchEventProxyIfRegistered("pointerover", touchPoint, newTarget, eventObject);

                    // Raise enter
                    if (!newTarget.contains(currentTarget)) { // Leave must be called if the new target is not the parent of the current
                        generateTouchEventProxyIfRegistered("pointerenter", touchPoint, newTarget, eventObject);
                    }
                }
                previousTargets[touchPoint.identifier] = newTarget;
            }
        });
    }

    // Extension to navigator
    if (navigator.pointerEnabled === undefined) {

        // Indicates if the browser will fire pointer events for pointing input
        navigator.pointerEnabled = true;

        // IE
        if (navigator.msPointerEnabled) {
            navigator.maxTouchPoints = navigator.msMaxTouchPoints;
        }
    }

})();
