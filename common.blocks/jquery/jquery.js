/**
 * @module jquery
 * @description Provide jQuery (load if it does not exist).
 */

modules.define(
    'jquery',
    ['loader_type_js', 'jquery__config'],
    function(provide, loader, cfg) {

/* global jQuery */

function doProvide() {
    /**
     * @exports
     * @type {Function} jQuery
     */
    provide(jQuery.noConflict(true));
}

typeof jQuery !== 'undefined'?
    doProvide() :
    loader(cfg.url, doProvide);
});
