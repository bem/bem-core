/**
 * @module jquery
 */

modules.define('jquery', ['ua'], function(provide, ua, $) {

// IE8 and below, https://msdn.microsoft.com/en-us/library/ie/ms536959%28v=vs.85%29.aspx
if(ua.msie && document.documentMode < 9) {
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
