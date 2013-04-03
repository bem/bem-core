/* дефолтная инициализация */
modules.require(
    ['i-bem__dom', 'jQuery', 'utils'],
    function(DOM, $, utils) {

utils.nextTick(function() {
    $(function() {
        DOM.init();
    });
});

});