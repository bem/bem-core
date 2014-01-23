/**
 * @module i-bem__collection_type_dom
 */

modules.define(
    'i-bem__collection_type_dom',
    ['inherit', 'i-bem__collection'],
    function(provide, inherit, Collection) {

/**
 * @class BEMDOMCollection
 * @description Collection of BEM.DOM blocks. Implementation of BEM.DOM methods for array of blocks.
 * @augments i-bem__collection
 * @exports
 */

provide(inherit(Collection, null, /** @lends BEMDOMCollection */{
    /**
     * Get methods that will be implemented in BEMDOMCollection
     * @override
     * @returns {Array}
     */
    getMethods : function() {
        return this.__base().concat(['bindTo', 'bindToDoc', 'bindToDomElem', 'bindToWin',
            'unbindFrom', 'unbindFromDoc', 'unbindFromDomElem', 'unbindFromWin',
            'dropElemCache']);
    }
}));

});
