/**
 * @module identify
 */

modules.define('identify', function(provide) {

var counter = 0,
    expando = '__' + (+new Date),
    get = function() {
        return 'uniq' + (++counter);
    },
    identify = function(obj) {
        if((typeof obj === 'object' && obj !== null) || typeof obj === 'function') {
            var key = 'uniqueID' in obj && obj !== document ?
                'uniqueID' :
                expando; // Use when possible native uniqueID for elements in IE

            return key in obj?
                obj[key] :
                obj[key] = get();
        }

        return '';
    };

provide(
    /**
     * Makes unique ID
     * @exports
     * @param {?...Object} obj Object that needs to be identified
     * @returns {String} ID
     */
    function(obj) {
        if(arguments.length) {
            if(arguments.length === 1) {
                return identify(obj);
            }

            var res = [];
            for(var i = 0, len = arguments.length; i < len; i++) {
                res.push(identify(arguments[i]));
            }
            return res.sort().join('');
        }

        return get();
    }
);

});
