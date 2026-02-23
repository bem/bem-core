/**
 * @module next-tick
 */

/**
 * Executes given function on next tick.
 * @exports
 * @type Function
 * @param {Function} fn
 */

var fns = [],
    enqueueFn = function(fn) {
        fns.push(fn);
        return fns.length === 1;
    },
    callFns = function() {
        var fnsToCall = fns, i = 0, len = fns.length;
        fns = [];
        while(i < len) {
            fnsToCall[i++]();
        }
    };

var nextTick;

/* global process */
if(typeof process === 'object' && process.nextTick) { // nodejs
    nextTick = function(fn) {
        enqueueFn(fn) && process.nextTick(callFns);
    };
} else if(globalThis.setImmediate) { // ie10
    nextTick = function(fn) {
        enqueueFn(fn) && globalThis.setImmediate(callFns);
    };
} else if(globalThis.postMessage) { // modern browsers
    var isPostMessageAsync = true;
    if(globalThis.attachEvent) {
        var checkAsync = function() {
                isPostMessageAsync = false;
            };
        globalThis.attachEvent('onmessage', checkAsync);
        globalThis.postMessage('__checkAsync', '*');
        globalThis.detachEvent('onmessage', checkAsync);
    }

    if(isPostMessageAsync) {
        var msg = '__nextTick' + (+new Date),
            onMessage = function(e) {
                if(e.data === msg) {
                    e.stopPropagation && e.stopPropagation();
                    callFns();
                }
            };

        globalThis.addEventListener?
            globalThis.addEventListener('message', onMessage, true) :
            globalThis.attachEvent('onmessage', onMessage);

        nextTick = function(fn) {
            enqueueFn(fn) && globalThis.postMessage(msg, '*');
        };
    }
}

if(!nextTick) {
    var doc = globalThis.document;
    if(doc && 'onreadystatechange' in doc.createElement('script')) { // ie6-ie8
        var head = doc.getElementsByTagName('head')[0],
            createScript = function() {
                var script = doc.createElement('script');
                script.onreadystatechange = function() {
                    script.parentNode.removeChild(script);
                    script = script.onreadystatechange = null;
                    callFns();
                };
                head.appendChild(script);
            };

        nextTick = function(fn) {
            enqueueFn(fn) && createScript();
        };
    } else {
        nextTick = function(fn) { // old browsers
            enqueueFn(fn) && globalThis.setTimeout(callFns, 0);
        };
    }
}

export default nextTick;
