/**
 * Collection of BEM.DOM blocks
 * Implementation of BEM.DOM methods for array of blocks
 * @implement BEM.DOM
 */
BEM.decl({ name : 'i-bem__collection_type_dom', baseBlock : 'i-bem__collection' }, null, {

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

});
