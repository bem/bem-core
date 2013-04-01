/**
 * Overrides BEM.DOM.findBlocks* methods
 *  that they return i-bem__collection_type_dom
 */
BEM.decl('i-bem__dom', (function() {

    var decl = {},
        wrapMethod = function() {
            return BEM.blocks['i-bem__collection_type_dom'].create(this.__base.apply(this, arguments));
        };

    ['findBlocksInside', 'findBlocksOutside', 'findBlocksOn']
        .forEach(function(method) {
            decl[method] = wrapMethod;
        });

    return decl;

}()));
