/** @requires BEM */
/** @requires BEM.INTERNAL */

modules.define(
    'i-bem',
    ['i-bem__internal', 'inherit'],
    function(provide, INTERNAL, inherit, BEM) {

var buildClass = INTERNAL.buildClass;

provide(inherit.self(BEM, {}, {

    /**
     * Declares elements and creates an elements class
     * @static
     * @protected
     * @param {Object} decl Element description
     * @param {String} decl.block Block name
     * @param {String} decl.elem Element name
     * @param {String} [decl.baseBlock] Name of the parent block
     * @param {Array} [decl.baseMix] Mixed block names
     * @param {String} [decl.modName] Modifier name
     * @param {String|Array} [decl.modVal] Modifier value
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
                    baseMix: decl.baseMix,
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
     * @param {Boolean} [shortName] return the short name of the current instance
     * @returns {String}
     */
    getName : function(shortName) {
        return shortName? (this._elemName || this._blockName) : this._name;
    }

}));

});
