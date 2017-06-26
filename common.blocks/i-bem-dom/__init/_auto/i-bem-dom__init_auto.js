/**
 * Auto initialization on DOM ready
 */

modules.require(
    ['i-bem-dom__init', 'next-tick'],
    function(init, nextTick) {

(function(onDomReady) {
    document.readyState === 'loading'?
        document.addEventListener('DOMContentLoaded', onDomReady) :
        onDomReady();
})(function() {
    nextTick(init);
});

});
