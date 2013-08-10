modules.define(
    'test',
    ['jquery', 'sinon'],
    function(provide, $, sinon) {

describe('jquery__pointer-events', function() {
    it('should trigger "pointerclick" event on click by left button', function() {
        var spy = sinon.spy(),
            elem = $('<div/>'),
            e = $.Event('click', { button : 1 });

        elem.on('pointerclick', spy);
        elem.trigger(e);

        spy.should.not.have.been.called;

        e = $.Event('click', { button : 0 });

        elem.trigger(e);

        spy.should.have.been.calledOnce;
    });

    it('should trigger "pointerdown" event on click by left button', function() {
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
    
    it('should trigger "pointerup" event on click by left button', function() {
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