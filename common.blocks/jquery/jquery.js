modules.define(
    'jquery',
    ['loader', 'jquery__config'],
    function(provide, loader, cfg) {

function doProvide() {
    provide(jQuery.noConflict(true));
}

typeof jQuery !== 'undefined'?
    doProvide() :
    loader(cfg.url, doProvide);

});