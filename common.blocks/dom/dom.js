/**
 * @module dom
 * @description some DOM utils
 */

import $ from 'bem:jquery'

const EDITABLE_INPUT_TYPES = new Set([
    'datetime-local',
    'date',
    'month',
    'number',
    'password',
    'search',
    'tel',
    'text',
    'time',
    'url',
    'week'
])

export default {
    /**
     * Checks whether a DOM elem is in a context
     * @param {jQuery} ctx DOM elem where check is being performed
     * @param {jQuery} domElem DOM elem to check
     * @returns {Boolean}
     */
    contains(ctx, domElem) {
        let res = false

        domElem.each(function() {
            let domNode = this
            do {
                if(~ctx.index(domNode)) return !(res = true)
            } while(domNode = domNode.parentNode)

            return res
        })

        return res
    },

    /**
     * Returns current focused DOM elem in document
     * @returns {jQuery}
     */
    getFocused() {
        // "Error: Unspecified error." in iframe in IE9
        try { return $(document.activeElement) } catch(e) {}
    },

    /**
     * Checks whether a DOM element contains focus
     * @param {jQuery} domElem
     * @returns {Boolean}
     */
    containsFocus(domElem) {
        return this.contains(domElem, this.getFocused())
    },

    /**
    * Checks whether a browser currently can set focus on DOM elem
    * @param {jQuery} domElem
    * @returns {Boolean}
    */
    isFocusable(domElem) {
        const domNode = domElem[0]

        if(!domNode) return false
        if(domNode.hasAttribute('tabindex')) return true

        switch(domNode.tagName.toLowerCase()) {
            case 'iframe':
                return true

            case 'input':
            case 'button':
            case 'textarea':
            case 'select':
                return !domNode.disabled

            case 'a':
                return !!domNode.href
        }

        return false
    },

    /**
    * Checks whether a domElem is intended to edit text
    * @param {jQuery} domElem
    * @returns {Boolean}
    */
    isEditable(domElem) {
        const domNode = domElem[0]

        if(!domNode) return false

        switch(domNode.tagName.toLowerCase()) {
            case 'input':
                return EDITABLE_INPUT_TYPES.has(domNode.type) && !domNode.disabled && !domNode.readOnly

            case 'textarea':
                return !domNode.disabled && !domNode.readOnly

            default:
                return domNode.contentEditable === 'true'
        }
    }
}
