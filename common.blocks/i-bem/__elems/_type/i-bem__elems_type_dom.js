/** @requires BEM */
/** @requires BEM.INTERNAL */

modules.define(
    'i-bem__elems',
    ['i-bem', 'i-bem__internal'],
    function(provide, BEM, INTERNAL) {

var buildClass = INTERNAL.buildClass,
    NAME_PATTERN = INTERNAL.NAME_PATTERN,
    MOD_DELIM = INTERNAL.MOD_DELIM,
    ELEM_DELIM = INTERNAL.ELEM_DELIM;

BEM.decl('i-bem__dom', {

}, {

    /**
     * Builds a prefix for the CSS class of a DOM element or nested element of the block, based on modifier name
     * @static
     * @private
     * @param {String} modName Modifier name
     * @param {jQuery|String} [elem] Element
     * @returns {String}
     */
    _buildModClassPrefix : function(modName, elem) {
        return buildClass(elem? this._blockName : this._name) +
               (elem?
                   ELEM_DELIM + (typeof elem === 'string'? elem : this._extractElemNameFrom(elem)) :
                   '') +
               MOD_DELIM + modName + MOD_DELIM;
    },

    /**
     * Builds a regular expression for extracting names of elements nested in a block
     * @static
     * @private
     * @returns {RegExp}
     */
    _buildElemNameRE : function() {
        return new RegExp(this._blockName + ELEM_DELIM + '(' + NAME_PATTERN + ')(?:\\s|$)');
    }

});

});
