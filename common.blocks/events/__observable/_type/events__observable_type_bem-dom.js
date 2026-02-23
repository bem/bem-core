/**
 * @module events__observable_type_bem-dom
 */

import bemDom from 'bem:i-bem-dom';
import observable from 'bem:events__observable';

export default
    /**
     * Creates new observable with BEM DOM entity support
     * @exports
     * @param {i-bem-dom:Block|i-bem-dom:Elem|events:Emitter} bemEntity
     * @returns {Observable}
     */
    function(bemEntity) {
        return observable(bemDom.isEntity(bemEntity)?
            bemEntity._events() :
            bemEntity);
    };
