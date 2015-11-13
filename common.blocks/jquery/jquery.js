/**
 * @module jquery
 * @description Provide jQuery (load if it does not exist).
 */

import provide from 'ym:provide'
import loader from 'bem:loader__js';
import cfg from 'bem:jquery__config';

/* global jQuery */

function doProvide(preserveGlobal) {
    /**
     * @exports
     * @type Function
     */
    provide(preserveGlobal? jQuery : jQuery.noConflict(true));
}

typeof jQuery !== 'undefined'?
    doProvide(true) :
    loader(cfg.url, doProvide);
