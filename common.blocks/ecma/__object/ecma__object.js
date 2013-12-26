/**
 * @module ecma__object
 */

/**
 * @exports ecma__object:Object.keys
 * @param {Object} obj
 * @returns {Array}
 */
Object.keys || (Object.keys = function(obj) {
    var res = [];

    for(var i in obj) obj.hasOwnProperty(i) &&
        res.push(i);

    return res;
});