modules.define(
    'test',
    ['jquery', 'sinon'],
    function(provide, $, sinon) {

describe('jquery__pointerclick', function() {
    it('should trigger "pointerclick" event on click by left button', function() {
        var spy = sinon.spy(),
            elem = $('<div/>'),
            e = $.Event('click');

        e.button = 0;

        elem.on('pointerclick', spy);
        elem.trigger(e);

        spy.should.have.been.calledOnce;
    });

    it('shouldn\'t trigger "pointerclick" event on click by right button', function() {
        var spy = sinon.spy(),
            elem = $('<div/>'),
            e = $.Event('click');

        e.button = 1;

        elem.on('pointerclick', spy);
        elem.trigger(e);

        spy.should.not.have.been.called;
    });
});

provide();

});