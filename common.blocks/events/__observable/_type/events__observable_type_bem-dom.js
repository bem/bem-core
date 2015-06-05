/**
 * @module events__observable
 */

modules.define(
    'events__observable',
    ['i-bem-dom'],
    function(provide, BEMDOM, observable) {

provide(
    /**
     * Creates new observable
     * @exports
     * @param {i-bem-dom:Block|i-bem-dom:Elem|events:Emitter} bemEntity
     * @returns {Observable}
     */
    function(bemEntity) {
        return observable(BEMDOM.isEntity(bemEntity)?
            bemEntity._events() :
            bemEntity);
    }
);

});
