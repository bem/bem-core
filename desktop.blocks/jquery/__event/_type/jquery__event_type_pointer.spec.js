modules.define(
    'spec',
    ['jquery', 'sinon'],
    function(provide, $, sinon) {

describe('jquery__event_type_pointer', function() {
    it('should trigger "pointerenter" event on "mouseenter"', function() {
        var spy = sinon.spy(),
            elem = $('<div/>');

        elem.on('pointerenter', spy).mouseenter();

        spy.should.have.been.calledOnce;
    });

    it('should trigger "pointerover" event on "mouseover"', function() {
        var spy = sinon.spy(),
            elem = $('<div/>');

        elem.on('pointerover', spy).mouseover();

        spy.should.have.been.calledOnce;
    });

    it('should trigger "pointerdown" event on "mousedown"', function() {
        var spy = sinon.spy(),
            elem = $('<div/>'),
            e = $.Event('mousedown', {
                clientX : 100,
                clientY : 200,
                which : 1
            }),
            args;

        elem.on('pointerdown', spy).trigger(e);

        spy.should.have.been.calledOnce;

        args = spy.args[0][0];

        args.isPrimary.should.be.true;
        args.pointerId.should.be.equal(1);
        args.pointerType.should.be.equal('mouse');
        args.clientX.should.be.equal(e.clientX);
        args.clientY.should.be.equal(e.clientY);
        args.pressure.should.be.equal(0.5);
        args.width.should.be.equal(0);
        args.height.should.be.equal(0);
        args.tiltX.should.be.equal(0);
        args.tiltY.should.be.equal(0);
    });

    it('should trigger "pointermove" event on "mousemove"', function() {
        var spy = sinon.spy(),
            elem = $('<div/>');

        elem.on('pointermove', spy).mousemove();

        spy.should.have.been.calledOnce;
    });

    it('should trigger "pointerup" event on "mouseup"', function() {
        var spy = sinon.spy(),
            elem = $('<div/>');

        elem.on('pointerup', spy).mouseup();

        spy.should.have.been.calledOnce;
    });

    it('should trigger "pointerleave" event on "mouseleave"', function() {
        var spy = sinon.spy(),
            elem = $('<div/>');

        elem.on('pointerleave', spy).mouseleave();

        spy.should.have.been.calledOnce;
    });

    it('should trigger "pointerout" event on "mouseout"', function() {
        var spy = sinon.spy(),
            elem = $('<div/>');

        elem.on('pointerout', spy).mouseout();

        spy.should.have.been.calledOnce;
    });

    it('should successfully unbind from aliased events', function() {
        var spy = sinon.spy(),
            elem = $('<div/>');

        elem
            .on('pointerenter', spy).off('pointerenter').mouseenter()
            .on('pointerover', spy).off('pointerover').mouseover()
            .on('pointerdown', spy).off('pointerdown').mousedown()
            .on('pointermove', spy).off('pointermove').mousemove()
            .on('pointerup', spy).off('pointerup').mouseup()
            .on('pointerleave', spy).off('pointerleave').mouseleave()
            .on('pointerout', spy).off('pointerout').mouseout();

        spy.callCount.should.be.equal(0);
    });
});

provide();

});
