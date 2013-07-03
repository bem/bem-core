/** @requires BEM */
/** @requires BEM.INTERNAL */

modules.define(
    'i-bem',
    ['i-bem__internal'],
    function(provide, INTERNAL, BEM) {

var buildClass = INTERNAL.buildClass;

BEM.decl('i-bem', {}, {

    /**
     * Declares elements and creates an elements class
     * @static
     * @protected
     * @param {Object} decl Element description
     * @param {String} decl.block Block name
     * @param {String} decl.elem Element name
     * @param {String} [decl.baseBlock] Name of the parent block
     * @param {String} [decl.modName] Modifier name
     * @param {String} [decl.modVal] Modifier value
     * @param {Object} [props] Methods
     * @param {Object} [staticProps] Static methods
     */
    decl : function(decl, props, staticProps) {
        var block;
        if (decl.elem) {
            block = this.__base(
                {
                    block: buildClass(decl.block, decl.elem),
                    baseBlock: decl.baseBlock,
                    modName: decl.modName,
                    modVal: decl.modVal
                },
                props,
                staticProps);
            block._blockName = decl.block;
            block._elemName = decl.elem;
        } else {
            block = this.__base.apply(this, arguments);
            block._blockName = block._name;
        }
        return block;
    },

    /**
     * Returns the name of the current instance
     * @static
     * @protected
     * @param {Boolean} [shortName] return the short name for current instance
     * @returns {String}
     */
    getName : function(shortName) {
        return shortName? (this._elemName || this._blockName) : this._name;
    }

});

provide(BEM);

});
