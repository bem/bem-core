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
    }

});

});
