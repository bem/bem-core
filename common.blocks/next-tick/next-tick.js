modules.define('nextTick', function(provide) {

var global = this;

if(typeof process === 'object') { // nodejs
    return provide(process.nextTick);
}

if(global.setImmediate) { // ie10
    return provide(global.setImmediate);
}

var fns = [],
    callFns = function() {
        var fnsToCall = fns, i = 0, len = fns.length;
        fns = [];
        while(i < len) {
            fnsToCall[i++]();
        }
    };

if(global.postMessage) { // modern browsers
    var isPostMessageAsync = true;
    if(global.attachEvent) {
        var checkAsync = function() {
                isPostMessageAsync = false;
            };
        global.attachEvent('onmessage', checkAsync);
        global.postMessage('__checkAsync', '*');
        global.detachEvent('onmessage', checkAsync);
    }

    if(isPostMessageAsync) {
        var msg = '__nextTick' + +new Date,
            onMessage = function(e) {
                if(e.data === msg) {
                    e.stopPropagation && e.stopPropagation();
                    callFns();
                }
            };

        global.addEventListener?
            global.addEventListener('message', onMessage, true) :
            global.attachEvent('onmessage', onMessage);

        return provide(function(fn) {
            fns.push(fn) === 1 && global.postMessage(msg, '*');
        });
    }
}

var doc = global.document;
if('onreadystatechange' in doc.createElement('script')) { // ie6-ie8
    var createScript = function() {
            var script = doc.createElement('script');
            script.onreadystatechange = function() {
                script.parentNode.removeChild(script);
                script = script.onreadystatechange = null;
                callFns();
        };
        (doc.documentElement || doc.body).appendChild(script);
    };

    return provide(function(fn) {
        fns.push(fn) === 1 && createScript();
    });
}

return provide(function(fn) { // old browsers
    setTimeout(fn, 0);
});

});