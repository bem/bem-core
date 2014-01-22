/**
 * @module i-bem__dom
 * @description Auto initialization on DOM ready
 */

modules.require(['i-bem__dom', 'jquery'], function(DOM, $) {

$(function() {
    DOM.init();
});

});
