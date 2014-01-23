/**
 * @module jquery
 */

modules.define('jquery', ['ua'], function(provide, ua, $) {

if(ua.ie) { // TODO: investigate for which version of IE we need this workaround
    var win = window,
        $win = $(window),
        winWidth = $win.width(),
        winHeight = $win.height();

    ($.event.special.resize || ($.event.special.resize = {})).preDispatch = function(e) {
        if(e.target === win) {
            var curWinWidth = $win.width(),
                curWinHeight = $win.height();

            if(curWinWidth === winWidth && curWinHeight === winHeight) {
                return false;
            } else {
                winWidth = curWinWidth;
                winHeight = curWinHeight;
            }
        }
    };
}

provide($);

});
