/**
 * @module querystring
 * @description A set of helpers to work with query strings
 */

modules.define('querystring', ['querystring__uri'], function(provide, uri) {

var hasOwnProperty = Object.prototype.hasOwnProperty;

function addParam(res, name, val) {
    /* jshint eqnull: true */
    res.push(encodeURIComponent(name) + '=' + (val == null? '' : encodeURIComponent(val)));
}

provide(/** @exports */{
    /**
     * Parse a query string to an object
     * @param {String} str
     * @returns {Object}
     */
    parse : function(str) {
        if(!str) {
            return {};
        }

        return str.split('&').reduce(
            function(res, pair) {
                if(!pair) {
                    return res;
                }

                var eq = pair.indexOf('='),
                    name, val;

                if(eq >= 0) {
                    name = pair.substr(0, eq);
                    val = pair.substr(eq + 1);
                } else {
                    name = pair;
                    val = '';
                }

                name = uri.decodeURIComponent(name);
                val = uri.decodeURIComponent(val);

                hasOwnProperty.call(res, name)?
                    Array.isArray(res[name])?
                        res[name].push(val) :
                        res[name] = [res[name], val] :
                    res[name] = val;

                return res;
            },
            {});
    },

    /**
     * Serialize an object to a query string
     * @param {Object} obj
     * @returns {String}
     */
    stringify : function(obj) {
        return Object.keys(obj)
            .reduce(
                function(res, name) {
                    var val = obj[name];
                    Array.isArray(val)?
                        val.forEach(function(val) {
                            addParam(res, name, val);
                        }) :
                        addParam(res, name, val);
                    return res;
                },
                [])
            .join('&');
    }
});

});
