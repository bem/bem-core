/**
 * Collection of BEM.DOM blocks
 * Implementation of BEM.DOM methods for array of blocks
 * @implement BEM.DOM
 */

modules.define(
    'i-bem__collection_type_dom',
    ['inherit', 'i-bem__collection'],
    function(provide, inherit, Collection) {

provide(inherit(Collection, null, {
    /**
     * Get methods that will be implemented in bem__collection_type_dom
     * @override
     * @return {Array}
     */
    getMethods : function() {
        return this.__base().concat(['bindTo', 'bindToDoc', 'bindToDomElem', 'bindToWin',
            'unbindFrom', 'unbindFromDoc', 'unbindFromDomElem', 'unbindFromWin',
            'dropElemCache']);
    }
}));

});