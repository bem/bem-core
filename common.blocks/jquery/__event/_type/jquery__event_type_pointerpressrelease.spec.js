modules.define(
    'spec',
    ['jquery', 'sinon'],
    function(provide, $, sinon) {

describe('jquery__event_type_pointerpressrelease', function() {
    it('should trigger "pointerpress" event on "mousedown"', function() {
        var spy = sinon.spy(),
            e = $.Event('mousedown', { which : 1 }),
            elem = $('<div/>').appendTo('body');

        elem.on('pointerpress', spy).trigger(e);

        spy.should.have.been.calledOnce;

        elem.remove();
    });

    it('should trigger "pointerrelease" event on "mouseup"', function() {
        var spy = sinon.spy(),
            e = $.Event('mouseup', { which : 1 }),
            elem = $('<div/>').appendTo('body');

        elem.on('pointerrelease', spy).trigger(e);

        spy.should.have.been.calledOnce;

        elem.remove();
    });
});

provide();

});
