modules.define(
    'test',
    ['jquery', 'sinon'],
    function(provide, $, sinon) {

describe('jquery__event_type_pointerup', function() {
    it('should trigger "pointerup" event on mouseup by left button', function() {
        var spy = sinon.spy(),
            elem = $('<div/>'),
            e = $.Event('mouseup', { button : 1 });

        elem.on('pointerup', spy);
        elem.trigger(e);

        spy.should.not.have.been.called;

        e = $.Event('mouseup', { button : 0 });

        elem.trigger(e);

        spy.should.have.been.calledOnce;
    });
});

provide();

});