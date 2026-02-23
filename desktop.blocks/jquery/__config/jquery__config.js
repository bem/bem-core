/**
 * @module jquery__config
 * @description Configuration for jQuery (desktop override)
 */

import ua from 'bem:ua';
import objects from 'bem:objects';

/**
 * Transformer: receives base jquery__config and returns modified config.
 * Downgrades jQuery URL for IE < 9.
 * @param {Object} base Base configuration from common level
 * @returns {Object} Modified configuration
 */
export default function(base) {
    return ua.msie && parseInt(ua.version, 10) < 9?
        objects.extend(
            base,
            {
                url : 'https://yastatic.net/jquery/1.12.4/jquery.min.js'
            }) :
        base;
};
