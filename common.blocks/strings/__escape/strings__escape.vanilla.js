/**
 * @module strings__escape
 */

modules.define('strings__escape', function(provide) {

var symbols = {
        '"': '&quot;',
        '\'': '&apos;',
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;'
    },
    mapSymbol = function(s) {
        return symbols[s] || s;
    },
    buildEscape = function(regexp) {
        regexp = new RegExp(regexp, 'g');
        return function(s) {
            return ('' + s).replace(regexp, mapSymbol);
        };
    };

provide({
    xml: buildEscape('[&<>]'),
    html: buildEscape('[&<>]'),
    attr: buildEscape('["\'&<>]')
});

});