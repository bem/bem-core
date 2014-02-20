modules.define(
    'spec',
    ['jquery', 'sinon'],
    function(provide, $, sinon) {

describe('jquery__event_type_pointerclick', function() {
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
});

provide();

});
