/**
 * leftClick event plugin
 *
 * Copyright (c) 2010 Filatov Dmitry (alpha@zforms.ru)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * @version 1.0.0
 */

modules.define('jquery', function(provide, $) {

var leftClick = $.event.special.leftclick = {
    setup : function() {
        $(this).on('click', leftClick.handler);
    },

    teardown : function() {
        $(this).off('click', leftClick.handler);
    },

    handler : function(e) {
        if(!e.button) {
            e.type = 'leftclick';
            $.event.dispatch.apply(this, arguments);
            e.type = 'click';
        }
    }
};

provide($);

});