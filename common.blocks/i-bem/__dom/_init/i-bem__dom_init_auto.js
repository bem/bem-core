/* дефолтная инициализация */
modules.require(
    ['i-bem__dom', 'jQuery', 'nextTick'],
    function(DOM, $, nextTick) {

nextTick(function() {
    $(function() {
        DOM.init();
    });
});

});