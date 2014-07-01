modules.define('jquery', function(provide, $) {

$.each({
    pointerpress : 'pointerdown',
    pointerrelease : 'pointerup pointercancel'
}, function(spec, origEvent) {
    function eventHandler(e) {
        var res, origType = e.handleObj.origType;

        e.type = spec;
        res = $.event.dispatch.apply(this, arguments);
        e.type = origType;

        return res;
    }

    $.event.special[spec] = {
        setup : function() {
            $(this).on(origEvent, eventHandler);
            return false;
        },
        teardown : function() {
            $(this).off(origEvent, eventHandler);
            return false;
        }
    };
});

provide($);

});
