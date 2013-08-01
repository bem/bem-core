modules.define('dom', ['jquery'], function(provide, $) {

provide({
    /**
     * Checks whether a DOM element is in a context
     * @param {jQuery} ctx DOM elem where check is being performed
     * @param {jQuery} domElem DOM elem to check
     * @returns {Boolean}
     */
    contains : function(ctx, domElem) {
        var res = false;

        domElem.each(function() {
            var domNode = this;
            do {
                if(~ctx.index(domNode)) return !(res = true);
            } while(domNode = domNode.parentNode);

            return res;
        });

        return res;
    },

    /**
     * Returns current focused DOM elem in document
     * @returns {jQuery}
     */
    getFocused : function() {
        // "Error: Unspecified error." in iframe in IE9
        try { return $(document.activeElement) } catch (e) {}
    },

    /**
     * Checks whether a DOM element contains focus
     * @param domElem
     * @returns {boolean}
     */
    containsFocus : function(domElem) {
        return this.containsDomElem(domElem, this.getFocusedDomElem());
    },

    /**
    * Returns `true` if browser currently can set focus on DOM node
    * @param {jQuery} domElem
    * @returns {Boolean}
    */
    isFocusable : function(domElem) {
        var domNode = domElem[0];
        switch(domNode.tagName.toLowerCase()) {
            case 'iframe':
                return true;
            case 'input':
            case 'button':
            case 'textarea':
            case 'select':
                return !domNode.hasAttribute('disabled');
            case 'a':
                return domNode.hasAttribute('href');
            default:
                return domNode.hasAttribute('tabindex');
        }
    }
});

});