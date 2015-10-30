/**
 * @module i-bem-dom__init
 */
import bemDom from 'bem:i-bem-dom';

export default (
    /**
     * Initializes blocks on a fragment of the DOM tree
     * @exports
     * @param {jQuery} [ctx=scope] Root DOM node
     * @returns {jQuery} ctx Initialization context
     */
    function(ctx) {
        return bemDom.init(ctx);
    });
