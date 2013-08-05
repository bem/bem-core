/**
 * @module jquery
 */

modules.define(
    'jquery',
    ['loader_type_js', 'jquery__config'],
    function(provide, loader, cfg) {

/* global jQuery */

function doProvide() {
    provide(jQuery.noConflict(true));
}

typeof jQuery !== 'undefined'?
    doProvide() :
    loader(cfg.url, doProvide);

});