/**
 * @module events__observable
 */

import bemDom from 'bem:i-bem-dom';
import observable from 'bem:events__observable';

/**
 * Creates new observable
 * @param {i-bem-dom:Block|i-bem-dom:Elem|events:Emitter} bemEntity
 * @returns {Observable}
 */
export default function(bemEntity) {
    return observable(bemDom.isEntity(bemEntity)?
        bemEntity._events() :
        bemEntity);
};
