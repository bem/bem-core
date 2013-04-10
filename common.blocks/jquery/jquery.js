modules.define(
    'jQuery',
    ['loader', 'jQuery.config'],
    function(provide, loader, config) {

loader(config.url, function() {
    provide(jQuery);
});

});