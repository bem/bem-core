modules.define(
    'jquery',
    ['loader', 'jquery__config'],
    function(provide, loader, cfg) {

typeof jQuery !== 'undefined'?
    provide(jQuery) :
    loader(cfg.url, function() {
        provide(jQuery);
    });

});