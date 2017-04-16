(function(undefined) {

'use strict'; // needed to support `apply`/`call` with `undefined`

var ptp = Array.prototype,
    defineProperty = (function() {
        var res;
        // IE 8 only supports `Object.defineProperty` on DOM elements
        try {
            var object = {},
                defProp = Object.defineProperty;
            res = defProp(object, object, object) && defProp;
        } catch(_) {}
        return res;
    }());

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
 * @param {Function} predicate
 * @param {Object} [thisArg]
 * @returns {*}
 */
function find(predicate) {
    /*jshint validthis:true*/
    if(typeof predicate !== 'function') {
        throw new TypeError('Array#find: predicate must be a function');
    }

    var list = Object(this),
        len = list.length >>> 0; // ES.ToUint32;

    if(len === 0) return undefined;

    var thisArg = arguments[1],
        i = -1,
        val;

    while(++i < len) {
        if(i in list && predicate.call(thisArg, val = list[i], i, list))
            return val;
    }

    return undefined;
}

defineProperty?
    defineProperty(ptp, 'find', {
        value : find,
        configurable : true,
        enumerable : false,
        writable : true
    }) :
    ptp.find = find;

})();
