import $ from 'bem:jquery';

// eslint-disable-next-line no-var -- var needed for hoisting within the object's own methods
var event = $.event.special.pointerclick = {
        setup : function() {
            $(this).on('click', event.handler);
        },

        teardown : function() {
            $(this).off('click', event.handler);
        },

        handler : function(e) {
            if(!e.button) {
                const type = e.type;
                e.type = 'pointerclick';
                $.event.dispatch.apply(this, arguments);
                e.type = type;
            }
        }
    };

export default $;
