/**
 * @module ecma__string
 */

(function() {

/**
 * @exports ecma__string:String.prototype.trim
 * @returns {String}
 */
String.prototype.trim || (String.prototype.trim = function() {
    var str = this.replace(/^\s\s*/, ''),
        ws = /\s/,
        i = str.length;

    while(ws.test(str.charAt(--i)));

    return str.slice(0, i + 1);
});

})();