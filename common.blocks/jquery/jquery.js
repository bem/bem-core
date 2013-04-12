modules.define(
    'jQuery',
    ['loader', 'jQuery.config'],
    function(provide, loader, cfg) {

typeof jQuery !== 'undefined'?
    provide(jQuery) :
    loader(cfg.url, function() {
        provide(jQuery);
    });

});