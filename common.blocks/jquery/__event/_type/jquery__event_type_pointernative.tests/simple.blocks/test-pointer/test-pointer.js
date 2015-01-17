modules.require(['jquery'], function($) {
    /* jshint devel:true */
    var domElem = $('.test-pointer')
        .on('pointerleave', makeHandler('P:'))
        .on('mouseleave', makeHandler('$:'))
        .on('pointerenter', makeHandler('P:'))
        .on('mouseenter', makeHandler('$:'));

    domElem.get(0).addEventListener('mouseenter', makeHandler('native:'));
    domElem.get(0).addEventListener('mouseleave', makeHandler('native:'));

    function makeHandler(name) {
        return function handler(e) {
            console.log(name, e.type, e.target);
        };
    }
});
