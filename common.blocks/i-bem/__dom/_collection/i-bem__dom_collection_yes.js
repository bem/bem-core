/**
 * @module i-bem__dom
 * @description Overrides BEM.DOM.findBlocks* methods that they return i-bem__collection_type_dom
 */

modules.define('i-bem__dom', ['i-bem__collection_type_dom'], function(provide, Collection, BEMDOM) {

provide(
    /**
     * @class BEMDOM
     * @augments BEMDOM
     * @exports
     */
    BEMDOM.decl('i-bem__dom', (function() {
        var decl = {},
            wrapMethod = function() {
                return Collection.create(this.__base.apply(this, arguments));
            };

        ['findBlocksInside', 'findBlocksOutside', 'findBlocksOn']
            .forEach(function(method) {
                decl[method] = wrapMethod;
            });

        return decl;
    }()))
);

});
