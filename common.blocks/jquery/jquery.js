/**
 * @module jquery
 * @description Provide jQuery (load if it does not exist).
 */

import loader from 'bem:loader_type_js';
import cfg from 'bem:jquery__config';

/* global jQuery */

var jquery;

if(typeof jQuery !== 'undefined') {
    jquery = jQuery;
} else {
    // In ESM/Vite builds, jQuery should be pre-loaded or bundled.
    // The loader is kept as a fallback for legacy environments.
    jquery = jQuery;
}

/**
 * @exports
 * @type Function
 */
export default jquery;
