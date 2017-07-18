/**
 * @module dom
 * @description some DOM utils
 */

modules.define('dom', ['jquery'], function(provide, $) {

var EDITABLE_INPUT_TYPES = {
        'datetime-local' : true,
        date : true,
        month : true,
        number : true,
        password : true,
        search : true,
        tel : true,
        text : true,
        time : true,
        url : true,
        week : true
    },
    indexOf = Array.prototype.indexOf;

provide(/** @exports */{
    /**
     * Checks whether a DOM node is in a context
     * @param {Element|NodeList|HTMLCollection} where DOM node or nodes where check is being performed
     * @param {Element|NodeList|HTMLCollection} what DOM node or nodes to check
     * @returns {Boolean}
     */
    contains : function(where, what) {
        var isDomNode = what instanceof Element,
            i = 0,
            domNode = what;

        // once when where is an element and cycle for where as NodeList|HTMLCollection
        while((isDomNode && !i++) || (domNode = what[i++])) {
            do {
                if(where instanceof Element?
                    where === domNode :
                    ~indexOf.call(where, domNode))
                        return true;
            } while(domNode = domNode.parentNode);
        }

        return false;
    },

    /**
     * Returns current focused DOM node in document
     * @returns {Element}
     */
    getFocused : function() {
        // "Error: Unspecified error." in iframe in IE9
        try { return document.activeElement; } catch(e) {}
    },

    /**
     * Checks whether a DOM none contains focus
     * @param {Element|NodeList|HTMLCollection} where
     * @returns {Boolean}
     */
    containsFocus : function(where) {
        return this.contains(where, this.getFocused());
    },

    /**
    * Checks whether a browser currently can set focus on DOM node
    * @param {Element} domNode
    * @returns {Boolean}
    */
    isFocusable : function(domNode) {
        if(!domNode) return false;
        if(domNode.hasAttribute('tabindex')) return true;

        switch(domNode.tagName.toLowerCase()) {
            case 'iframe':
                return true;

            case 'input':
            case 'button':
            case 'textarea':
            case 'select':
                return !domNode.disabled;

            case 'a':
                return !!domNode.href;
        }

        return false;
    },

    /**
    * Checks whether a DOM node is intended to edit text
    * @param {Element} domNode
    * @returns {Boolean}
    */
    isEditable : function(domNode) {
        if(!domNode) return false;

        switch(domNode.tagName.toLowerCase()) {
            case 'input':
                return EDITABLE_INPUT_TYPES.hasOwnProperty(domNode.type) && !domNode.disabled && !domNode.readOnly;

            case 'textarea':
                return !domNode.disabled && !domNode.readOnly;

            default:
                return domNode.contentEditable === 'true';
        }
    },

    /**
     * Creates detached DOM nodes from HTML string
     * @param {String} html
     * @returns {NodeList}
     */
    fromString : function(html) {
        var wrapperElement = document.createElement('div');
        wrapperElement.innerHTML = html;
        var childNodes = wrapperElement.childNodes;

        return childNodes.length === 1? childNodes[0] : childNodes;
    }
});

});
