modules.define(
    'test',
    ['jquery', 'sinon'],
    function(provide, $, sinon) {

describe('jquery__event_type_pointerdown', function() {
    it('should trigger "pointerdown" event on mousedown by left button', function() {
        var spy = sinon.spy(),
            elem = $('<div/>'),
            e = $.Event('mousedown', { button : 1 });

        elem.on('pointerdown', spy);
        elem.trigger(e);

        spy.should.not.have.been.called;

        e = $.Event('mousedown', { button : 0 });

        elem.trigger(e);

        spy.should.have.been.calledOnce;
    });
});

provide();

});