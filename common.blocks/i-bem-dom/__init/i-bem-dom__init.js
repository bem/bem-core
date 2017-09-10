/**
 * @module i-bem-dom__init
 */

modules.define('i-bem-dom__init', ['i-bem-dom'], function(provide, bemDom) {

provide(
    /**
     * Initializes blocks on a fragment of the DOM tree
     * @exports
     * @param {Element|NodeList|HTMLCollection|String} [ctx=scope] Root DOM node or HTML string
     * @returns {Element|NodeList} ctx Initialization context
     */
    function(ctx) {
        return bemDom.init(ctx);
    });
});
